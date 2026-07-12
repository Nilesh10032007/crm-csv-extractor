import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from './prompts';
import { BatchResultSchema, BatchResult } from '../types';
import { jobManager } from './jobManager';

let genAI: GoogleGenerativeAI | null = null;
function getGenAI() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables. Please check your .env file.");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

const BATCH_SIZE = 25; // Smaller batches for faster token generation
const MAX_CONCURRENCY = 10; // High concurrency to process small batches in parallel
const MAX_RETRIES = 2;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function repairAndParseJSON(rawText: string): BatchResult {
  // Strip markdown code fences if model includes them
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3).trim();
  }

  const parsed = JSON.parse(cleaned);
  // Validate against Zod schema
  return BatchResultSchema.parse(parsed);
}

async function processBatchWithRetry(batch: any[], retryCount = 0): Promise<BatchResult> {
  try {
    const model = getGenAI().getGenerativeModel({
      model: 'gemini-3.5-flash',
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      }
    });

    const prompt = `${SYSTEM_PROMPT}\n\nData to process:\n${JSON.stringify(batch)}`;
    const result = await model.generateContent(prompt);
    const content = result.response.text() || '{}';
    
    return repairAndParseJSON(content);
  } catch (error: any) {
    const isRateLimit = error.status === 429 || error.message?.includes('429') || error.message?.includes('quota');
    const isSyntaxError = error instanceof SyntaxError;
    
    if ((isRateLimit || isSyntaxError) && retryCount < MAX_RETRIES) {
      const retryAfterMs = isRateLimit ? 2000 * Math.pow(2, retryCount) : 500;
      console.warn(`${isRateLimit ? 'Rate limited' : 'JSON Parse Error'}. Retrying batch... (Attempt ${retryCount + 1})`);
      await delay(retryAfterMs);
      return processBatchWithRetry(batch, retryCount + 1);
    }
    throw error;
  }
}

export async function processCSVData(jobId: string, rawData: any[]) {
  const totalRows = rawData.length;
  await jobManager.updateJob(jobId, { status: 'processing', processedRows: 0 });

  const batches = [];
  for (let i = 0; i < totalRows; i += BATCH_SIZE) {
    batches.push(rawData.slice(i, i + BATCH_SIZE));
  }

  let processedRows = 0;

  // Process batches with concurrency limit
  for (let i = 0; i < batches.length; i += MAX_CONCURRENCY) {
    const currentBatches = batches.slice(i, i + MAX_CONCURRENCY);
    
    const results = await Promise.allSettled(
      currentBatches.map(batch => processBatchWithRetry(batch))
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const batchRows = currentBatches[j].length;
      processedRows += batchRows;

      if (result.status === 'fulfilled') {
        const { records, skipped } = result.value;
        await jobManager.updateJob(
          jobId,
          { processedRows },
          records,
          skipped.map(s => ({ row: s.row, reason: s.reason || 'Unknown reason' })),
          []
        );
      } else {
        await jobManager.updateJob(
          jobId,
          { processedRows },
          [],
          [],
          [`Batch failed: ${result.reason?.message || 'Unknown error'}`]
        );
      }
    }
    
    // Slight delay between concurrency bursts to avoid hitting rate limits too quickly
    await delay(200);
  }

  await jobManager.updateJob(jobId, { status: 'completed' });
}
