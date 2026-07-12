'use client';

import React from 'react';
import { JobProgress } from '../types';
import Link from 'next/link';

interface ResultsTableProps {
  job: JobProgress;
}

export function ResultsTable({ job }: ResultsTableProps) {
  const successCount = job.successfulRecords.length;
  const skippedCount = job.skippedRecords.length;
  const total = successCount + skippedCount;
  const efficiencyScore = total > 0 ? ((successCount / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="flex flex-col w-full px-4 lg:px-margin-desktop py-8 max-w-container-max mx-auto gap-gutter-desktop animate-in fade-in duration-1000">
      
      {/* Success Hero Card */}
      <div className="relative overflow-hidden rounded-[32px] bg-primary p-12 text-on-primary flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full fill-current" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,77.4,-44.8C85.7,-31.5,91,-15.7,90.1,-0.5C89.2,14.7,82.1,29.4,72.7,42.4C63.3,55.4,51.6,66.7,37.8,73.9C24,81.1,8.1,84.2,-8.1,82.8C-24.3,81.4,-40.8,75.4,-54.4,65.2C-68,55,-78.6,40.5,-83.4,24.4C-88.3,8.3,-87.3,-9.4,-81.1,-25.1C-74.9,-40.8,-63.5,-54.6,-49.8,-61.6C-36.1,-68.6,-20.1,-68.8,-3.7,-62.4C12.7,-56,26.4,-83.6,44.7,-76.4Z" transform="translate(100 100)"></path>
          </svg>
        </div>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="w-16 h-16 bg-surface-container-lowest/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[40px] text-vibrant-cyan">task_alt</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl tracking-tight">Import Complete</h1>
          <p className="font-body-lg text-body-lg text-on-primary-container/80 max-w-md">
            Your leads have been processed and intelligence-enriched. {successCount} high-intent profiles are ready for outreach.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-4">
          <Link href="/leads" className="px-8 py-4 bg-vibrant-cyan text-on-secondary-fixed rounded-full font-label-md text-label-md flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all">
            <span className="material-symbols-outlined">group</span>
            Go to Lead Management
          </Link>
          <button 
            className="px-8 py-4 bg-primary-container text-on-primary-container rounded-full font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-highest transition-all"
            onClick={() => window.location.reload()}
          >
            <span className="material-symbols-outlined">upload_file</span>
            Import Another File
          </button>
        </div>
      </div>

      {/* Stats Mosaic */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter-desktop">
        
        {/* Main Stat */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-[24px] shadow-sm border border-outline-variant/10 flex flex-col justify-between">
          <div>
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-[0.2em]">Efficiency Score</span>
            <div className="flex items-end gap-2 mt-2">
              <span className="font-headline-xl text-headline-xl text-primary">{efficiencyScore}%</span>
              <span className="font-label-md text-label-md text-tertiary mb-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                +2.1%
              </span>
            </div>
          </div>
          {/* Inline SVG Sparkline */}
          <div className="mt-8 h-24 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
              <path className="text-vibrant-cyan" d="M0,80 Q50,70 100,85 T200,60 T300,75 T400,20" fill="none" stroke="currentColor" strokeWidth="4"></path>
              <path className="text-vibrant-cyan/10" d="M0,80 Q50,70 100,85 T200,60 T300,75 T400,20 L400,100 L0,100 Z" fill="currentColor"></path>
              <circle className="text-primary" cx="400" cy="20" fill="currentColor" r="6"></circle>
            </svg>
          </div>
        </div>

        {/* Total Imported */}
        <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-sm border border-outline-variant/10 group hover:bg-primary transition-colors duration-500">
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant group-hover:text-on-primary/60 tracking-[0.2em] transition-colors">Total Imported</span>
          <div className="mt-6 font-headline-xl text-headline-xl text-on-surface group-hover:text-on-primary transition-colors">{successCount}</div>
          <div className="mt-2 text-on-surface-variant group-hover:text-on-primary/80 font-body-sm text-body-sm transition-colors">Successful Records</div>
        </div>

        {/* Total Skipped */}
        <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-[0.2em]">Skipped</span>
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
          <div className="mt-6 font-headline-xl text-headline-xl text-on-surface">{skippedCount}</div>
          <div className="mt-2 text-on-surface-variant font-body-sm text-body-sm">Invalid or Duplicates</div>
        </div>

      </div>

      {/* Detail Breakdown & Visualization */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter-desktop">
        
        {/* Quality Distribution Donut */}
        <div className="xl:col-span-1 bg-surface-container-lowest p-8 rounded-[24px] shadow-sm border border-outline-variant/10 flex flex-col items-center">
          <h3 className="font-headline-md text-headline-md text-on-surface self-start mb-8">Lead Quality</h3>
          <div className="relative w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
              <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${efficiencyScore}, 100`} strokeWidth="3"></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-md text-headline-md text-on-surface">High</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{efficiencyScore}% Matches</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 w-full">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="font-label-md text-label-md text-on-surface-variant">Qualified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-surface-container-highest"></div>
              <span className="font-label-md text-label-md text-on-surface-variant">Skipped</span>
            </div>
          </div>
        </div>

        {/* Import History Mini-Table */}
        <div className="xl:col-span-2 bg-surface-container-lowest p-8 rounded-[24px] shadow-sm border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline-md text-headline-md text-on-surface">Post-Processing Logs</h3>
            <button className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
              Download Report <span className="material-symbols-outlined text-[18px]">download</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-bright rounded-xl group hover:bg-surface-container-low transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">check</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md text-on-surface">{successCount} Records Merged</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Successfully parsed by AI and matched to schema</div>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full whitespace-nowrap">Success</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-bright rounded-xl group hover:bg-surface-container-low transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-brand-orange text-[20px]">warning</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md text-on-surface">{skippedCount} Records Skipped</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                    {skippedCount > 0 ? job.skippedRecords[0]?.reason : "No errors detected"}
                  </div>
                </div>
              </div>
              {skippedCount > 0 && <button className="text-primary font-label-md text-label-md hover:underline whitespace-nowrap">Review Errors</button>}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-bright rounded-xl group hover:bg-surface-container-low transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[20px]">auto_fix_high</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md text-on-surface">Intelligence Enrichment</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">AI formatted names, emails, and data structures</div>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary whitespace-nowrap">Enhanced</span>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
}
