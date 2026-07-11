'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Toaster, toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { PreviewTable } from '@/components/PreviewTable';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { ResultsTable } from '@/components/ResultsTable';
import { JobProgress } from '@/types';

import { DashboardLayout } from '@/components/DashboardLayout';

type Step = 'upload' | 'preview' | 'processing' | 'results';

export default function Home() {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawData, setRawData] = useState<any[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobResult, setJobResult] = useState<JobProgress | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setRawData(results.data);
          setStep('preview');
        } else {
          toast.error('The CSV file appears to be empty or invalid.');
        }
      },
      error: (error) => {
        toast.error(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const handleConfirmImport = async () => {
    if (!file) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/import`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start import job');
      }

      const data = await response.json();
      setJobId(data.jobId);
      setStep('processing');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFlow = () => {
    setFile(null);
    setRawData([]);
    setJobId(null);
    setJobResult(null);
    setStep('upload');
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      
      <div className="flex flex-col w-full">
          
          {step === 'upload' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
              <Dropzone onFileSelect={handleFileSelect} />
            </div>
          )}

          {step === 'preview' && (
            <div className="flex flex-col w-full h-full animate-in fade-in duration-500">
              <PreviewTable 
                data={rawData} 
                onConfirm={handleConfirmImport} 
                onCancel={resetFlow} 
                isSubmitting={isSubmitting} 
                filename={file?.name || 'uploaded_file.csv'}
              />
            </div>
          )}

          {step === 'processing' && jobId && (
            <div className="flex justify-center py-12 animate-in fade-in duration-500">
              <div className="w-full max-w-2xl">
                <ProgressIndicator
                  jobId={jobId}
                  onComplete={(job) => {
                    setJobResult(job);
                    setStep('results');
                  }}
                  onError={(err) => {
                    toast.error(err);
                  }}
                />
              </div>
            </div>
          )}

          {step === 'results' && jobResult && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                    Import Summary
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Here is how the AI mapped your data.</p>
                </div>
                <button
                  onClick={resetFlow}
                  className="px-5 py-2 rounded-lg font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors border border-transparent dark:border-zinc-800"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Import Another
                </button>
              </div>
              
              <ResultsTable job={jobResult} />
            </div>
          )}

      </div>
    </DashboardLayout>
  );
}
