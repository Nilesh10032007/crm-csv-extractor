'use client';

import React, { useEffect, useState } from 'react';
import { JobProgress } from '../types';
import { cn } from '../lib/utils';

interface ProgressIndicatorProps {
  jobId: string;
  onComplete: (job: JobProgress) => void;
  onError: (error: string) => void;
}

export function ProgressIndicator({ jobId, onComplete, onError }: ProgressIndicatorProps) {
  const [progress, setProgress] = useState<JobProgress | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const sse = new EventSource(`${backendUrl}/api/import/${jobId}/progress`);

    sse.onmessage = (event) => {
      try {
        const data: JobProgress = JSON.parse(event.data);
        setProgress(data);

        if (data.status === 'completed' || data.status === 'failed') {
          sse.close();
          // Adding a slight delay before showing results to let animation finish
          setTimeout(() => {
            onComplete(data);
          }, 800);
        }
      } catch (err) {
        console.error('Failed to parse SSE data', err);
      }
    };

    sse.onerror = (err) => {
      console.error('SSE Error:', err);
      sse.close();
      onError('Connection to server lost. The job might still be running.');
    };

    return () => {
      sse.close();
    };
  }, [jobId, onComplete, onError]);

  const percent = progress && progress.totalRows > 0 ? Math.round((progress.processedRows / progress.totalRows) * 100) : 0;

  let statusText = "Connecting to Engine...";
  if (percent > 0) statusText = "Parsing CSV Header Structure...";
  if (percent > 30) statusText = "Applying AI Field Mapping...";
  if (percent > 60) statusText = "Enriching Lead Intelligence...";
  if (percent > 85) statusText = "Finalizing Import...";

  return (
    <section className="relative overflow-hidden flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 lg:px-margin-desktop w-full">
      {/* Ambient Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none dark:opacity-50"></div>
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-vibrant-cyan/10 rounded-full blur-[80px] pointer-events-none dark:opacity-50"></div>
      
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full text-center">
        {/* Animated AI Scanner */}
        <div className="relative mb-12">
          <div className="w-32 h-32 rounded-3xl bg-surface-container-high flex items-center justify-center relative overflow-hidden shadow-xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[48px] animate-pulse">database</span>
            {/* Scanning Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-vibrant-cyan/30 to-transparent h-1/2 w-full -translate-y-full animate-scan"></div>
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="material-symbols-outlined text-on-secondary-container text-[20px]">auto_awesome</span>
          </div>
        </div>
        
        <h2 className="font-headline-xl text-headline-xl text-on-surface mb-4">Optimizing Your Data</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md">
          {progress ? `Our AI is currently mapping headers, sanitizing contact info, and calculating lead scores for ${progress.totalRows} rows.` : 'Initializing AI processing engine...'}
        </p>
        
        {/* Progress Container */}
        <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden mb-4 relative">
          <div 
            className={cn(
                "absolute top-0 left-0 h-full transition-all duration-700 ease-out",
                progress?.status === 'failed' ? "bg-error" : "bg-gradient-to-r from-primary to-vibrant-cyan"
            )}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className={cn("font-label-md text-label-md uppercase tracking-widest", progress?.status === 'failed' ? "text-error" : "text-primary")}>
            {progress?.status === 'failed' ? "Processing Error" : statusText}
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant">{percent}%</span>
        </div>
        
        {/* Dynamic Task List */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl text-left border border-outline-variant/20 shadow-sm">
            <span className={cn("material-symbols-outlined", percent > 30 ? "text-primary" : "text-on-surface-variant animate-spin")}>
              {percent > 30 ? "check_circle" : "sync"}
            </span>
            <span className="font-label-md text-label-md text-on-surface">Validating Email Formats</span>
          </div>
          <div className={cn("flex items-center gap-3 p-4 bg-surface-container-low rounded-xl text-left border border-outline-variant/20 shadow-sm transition-opacity duration-500", percent > 50 ? "opacity-100" : "opacity-50")}>
            <span className={cn("material-symbols-outlined", percent > 80 ? "text-primary" : "text-on-surface-variant animate-spin")}>
              {percent > 80 ? "check_circle" : "sync"}
            </span>
            <span className="font-label-md text-label-md text-on-surface">Deduplicating Contacts</span>
          </div>
        </div>

        {progress?.errors && progress.errors.length > 0 && (
          <div className="mt-8 p-4 rounded-xl bg-error-container text-on-error-container border border-error/30 text-left w-full text-sm">
            <h4 className="font-bold mb-2 flex items-center gap-2">
               <span className="material-symbols-outlined text-[18px]">error</span> Errors
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {progress.errors.slice(0, 3).map((err, i) => <li key={i}>{err}</li>)}
              {progress.errors.length > 3 && <li>...and {progress.errors.length - 3} more errors</li>}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
