import { JobProgress, CrmRecord } from '../types';
import { Response } from 'express';

const TTL_MS = 30 * 60 * 1000; // 30 minutes

class JobManager {
  private jobs = new Map<string, JobProgress>();
  private sseClients = new Map<string, Response[]>();
  private timers = new Map<string, NodeJS.Timeout>();

  createJob(jobId: string, totalRows: number) {
    const job: JobProgress = {
      jobId,
      status: 'processing',
      totalRows,
      processedRows: 0,
      successfulRecords: [],
      skippedRecords: [],
      errors: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.jobs.set(jobId, job);
    this.resetTimer(jobId);
    return job;
  }

  getJob(jobId: string): JobProgress | undefined {
    return this.jobs.get(jobId);
  }

  updateJob(
    jobId: string,
    updates: Partial<Pick<JobProgress, 'processedRows' | 'status'>>,
    newRecords: CrmRecord[] = [],
    newSkipped: Array<{ row: any; reason: string }> = [],
    newErrors: string[] = []
  ) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.processedRows = updates.processedRows ?? job.processedRows;
    job.status = updates.status ?? job.status;
    job.successfulRecords.push(...newRecords);
    job.skippedRecords.push(...newSkipped);
    job.errors.push(...newErrors);
    job.updatedAt = Date.now();

    this.broadcastUpdate(jobId);
    this.resetTimer(jobId);
  }

  addSSEClient(jobId: string, res: Response) {
    if (!this.sseClients.has(jobId)) {
      this.sseClients.set(jobId, []);
    }
    this.sseClients.get(jobId)!.push(res);
    // Send immediate current state
    const job = this.getJob(jobId);
    if (job) {
      res.write(`data: ${JSON.stringify(job)}\n\n`);
    }
  }

  removeSSEClient(jobId: string, res: Response) {
    const clients = this.sseClients.get(jobId);
    if (clients) {
      const filtered = clients.filter(c => c !== res);
      if (filtered.length === 0) {
        this.sseClients.delete(jobId);
      } else {
        this.sseClients.set(jobId, filtered);
      }
    }
  }

  private broadcastUpdate(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    const clients = this.sseClients.get(jobId);
    if (clients) {
      const payload = `data: ${JSON.stringify(job)}\n\n`;
      clients.forEach(res => res.write(payload));
    }
  }

  private resetTimer(jobId: string) {
    if (this.timers.has(jobId)) {
      clearTimeout(this.timers.get(jobId)!);
    }
    const timer = setTimeout(() => {
      this.cleanupJob(jobId);
    }, TTL_MS);
    this.timers.set(jobId, timer);
  }

  private cleanupJob(jobId: string) {
    this.jobs.delete(jobId);
    this.sseClients.delete(jobId);
    this.timers.delete(jobId);
    console.log(`Cleaned up job ${jobId} after TTL`);
  }
}

export const jobManager = new JobManager();
