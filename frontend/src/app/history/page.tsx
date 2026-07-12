'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { JobProgress } from '@/types';
import { toast } from 'sonner';

export default function HistoryPage() {
  const [jobs, setJobs] = useState<JobProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const res = await fetch(`${backendUrl}/api/jobs`);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data);
      } catch (err: any) {
        toast.error(err.message || 'Could not load import history');
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col w-full px-4 lg:px-margin-desktop py-8 max-w-container-max mx-auto gap-gutter-desktop animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-headline-xl tracking-tight text-on-surface">Import History</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              View your previous CSV imports and their processing status.
            </p>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant/20 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-4">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-on-surface-variant font-body-md text-body-md">Loading history...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-[32px]">history</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">No imports found</h3>
              <p className="text-on-surface-variant max-w-md">
                You haven't run any imports yet. Head over to the CSV Importer to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/30">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Date</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Job ID</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Status</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Rows Processed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {jobs.map((job) => (
                    <tr key={job.jobId} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-label-lg text-label-lg text-on-surface">
                          {new Date(job.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant truncate max-w-[150px]">
                        {job.jobId}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide ${
                          job.status === 'completed' ? 'bg-primary/20 text-primary' : 
                          job.status === 'failed' ? 'bg-error/20 text-error' : 
                          'bg-vibrant-cyan/20 text-vibrant-cyan'
                        }`}>
                          {job.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-body-md text-body-md text-on-surface">
                        {job.processedRows} / {job.totalRows}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
