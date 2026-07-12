import { JobProgress, CrmRecord } from '../types';
import { Response } from 'express';
import Job from '../models/Job';
import Lead from '../models/Lead';

class JobManager {
  private sseClients = new Map<string, Response[]>();

  async createJob(jobId: string, totalRows: number) {
    const job = new Job({
      jobId,
      status: 'processing',
      totalRows,
      processedRows: 0,
      skippedRecords: [],
      errors: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await job.save();
    return job;
  }

  async getJob(jobId: string): Promise<JobProgress | null> {
    const jobDoc = await Job.findOne({ jobId }).lean();
    if (!jobDoc) return null;
    
    // Fetch leads for this job
    const leads = await Lead.find({ jobId }).lean();
    
    return {
      jobId: jobDoc.jobId,
      status: jobDoc.status as any,
      totalRows: jobDoc.totalRows,
      processedRows: jobDoc.processedRows,
      successfulRecords: leads as any,
      skippedRecords: jobDoc.skippedRecords,
      errors: jobDoc.errors,
      createdAt: jobDoc.createdAt,
      updatedAt: jobDoc.updatedAt,
    };
  }

  async getAllJobs(): Promise<JobProgress[]> {
    // Only return job summaries for getAllJobs (without successfulRecords to save bandwidth)
    const jobs = await Job.find().sort({ createdAt: -1 }).lean();
    return jobs.map(j => ({
      jobId: j.jobId,
      status: j.status as any,
      totalRows: j.totalRows,
      processedRows: j.processedRows,
      successfulRecords: [], // Omitted for summary
      skippedRecords: j.skippedRecords,
      errors: j.errors,
      createdAt: j.createdAt,
      updatedAt: j.updatedAt,
    }));
  }

  async updateJob(
    jobId: string,
    updates: Partial<Pick<JobProgress, 'processedRows' | 'status'>>,
    newRecords: CrmRecord[] = [],
    newSkipped: Array<{ row: any; reason: string }> = [],
    newErrors: string[] = []
  ) {
    const updatePayload: any = { updatedAt: Date.now() };
    if (updates.processedRows !== undefined) updatePayload.processedRows = updates.processedRows;
    if (updates.status !== undefined) updatePayload.status = updates.status;

    await Job.updateOne(
      { jobId },
      {
        $set: updatePayload,
        $push: {
          skippedRecords: { $each: newSkipped },
          errors: { $each: newErrors }
        }
      }
    );

    if (newRecords.length > 0) {
      const leadsToInsert = newRecords.map(record => ({
        ...record,
        jobId
      }));
      await Lead.insertMany(leadsToInsert);
    }

    this.broadcastUpdate(jobId);
  }

  addSSEClient(jobId: string, res: Response) {
    if (!this.sseClients.has(jobId)) {
      this.sseClients.set(jobId, []);
    }
    this.sseClients.get(jobId)!.push(res);
    // Send immediate current state
    this.getJob(jobId).then(job => {
      if (job) {
        res.write(`data: ${JSON.stringify(job)}\n\n`);
      }
    }).catch(console.error);
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

  private async broadcastUpdate(jobId: string) {
    const clients = this.sseClients.get(jobId);
    if (clients && clients.length > 0) {
      const job = await this.getJob(jobId);
      if (job) {
        const payload = `data: ${JSON.stringify(job)}\n\n`;
        clients.forEach(res => res.write(payload));
      }
    }
  }
}

export const jobManager = new JobManager();
