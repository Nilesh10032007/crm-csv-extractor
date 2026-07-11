'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../lib/utils';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export function Dropzone({ onFileSelect, isUploading }: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections, open } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading,
    noClick: true, // We have a custom button for click
  });

  return (
    <div className="w-full">
      {/* Header Section with Typographic Texture */}
      <section className="px-4 lg:px-margin-desktop py-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-[1px] bg-primary"></span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Data Ingestion Engine v2.0</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">
            Import Your <span className="text-primary italic">Leads</span> in Seconds.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Our AI automatically maps your CSV columns to the optimal CRM schema. No manual mapping, no formatting headaches.
          </p>
        </div>
        
        <div className="flex flex-col items-end text-right hidden lg:block">
          <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">System Status</div>
          <div className="flex items-center gap-2 text-tertiary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <span className="font-label-md text-label-md font-bold">AI Models Online</span>
          </div>
        </div>
      </section>

      {/* Main Upload Core */}
      <section className="px-4 lg:px-margin-desktop pb-20">
        <div className="grid grid-cols-12 gap-gutter-desktop items-start">
          
          {/* Left Column: The Upload Zone */}
          <div className="col-span-12 lg:col-span-8">
            <div 
              {...getRootProps()}
              className={cn(
                "relative group bg-surface-container-lowest rounded-[32px] p-2 transition-all duration-500 shadow-sm hover:shadow-xl",
                isDragActive ? "ring-2 ring-primary ring-offset-4 dark:ring-offset-background" : "",
                isUploading && "opacity-50 pointer-events-none",
                fileRejections.length > 0 && "ring-2 ring-error"
              )}
            >
              <input {...getInputProps()} />
              
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-vibrant-cyan/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
              </div>
              
              <div className={cn(
                "relative border-2 border-dashed border-outline-variant group-hover:border-primary/50 rounded-[28px] p-12 lg:p-24 flex flex-col items-center text-center transition-colors",
                isDragActive ? "border-primary bg-primary/5" : ""
              )}>
                {/* Icon & Visuals */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <span className="material-symbols-outlined text-primary text-[48px]">upload_file</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-vibrant-cyan rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <span className="material-symbols-outlined text-on-secondary-fixed text-[18px]">auto_awesome</span>
                  </div>
                </div>
                
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                  {isDragActive ? 'Drop your CSV here' : 'Drag & drop your CSV here'}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-10 max-w-sm">
                  Our AI supports files up to <span className="font-bold text-on-surface">5MB</span>. For larger datasets, please use our API.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <button type="button" onClick={open} className="px-8 py-4 bg-action-indigo text-on-primary rounded-xl font-label-md flex items-center gap-3 shadow-lg hover:bg-primary transition-all active:scale-95 group/btn">
                    <span>Upload CSV</span>
                    <span className="material-symbols-outlined transition-transform group-hover/btn:translate-y-[-2px]">north_east</span>
                  </button>
                  <span className="text-on-surface-variant font-label-sm">or</span>
                  <button type="button" onClick={open} className="px-8 py-4 border border-outline-variant text-on-surface-variant rounded-xl font-label-md hover:bg-surface-container-high transition-all">
                    Select from Computer
                  </button>
                </div>
                
                {fileRejections.length > 0 && (
                  <p className="text-sm text-error font-medium mt-6">
                    {fileRejections[0].errors[0].message}
                  </p>
                )}
              </div>
            </div>

            {/* Support Badge Mosaic */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[#1877F2]">face_nod</span>
                </div>
                <span className="font-label-md text-on-surface-variant">Facebook Leads</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-brand-orange">ads_click</span>
                </div>
                <span className="font-label-md text-on-surface-variant">Google Ads</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-tertiary">home_work</span>
                </div>
                <span className="font-label-md text-on-surface-variant">Real Estate CRM</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-primary">hub</span>
                </div>
                <span className="font-label-md text-on-surface-variant">HubSpot / SFDC</span>
              </div>
            </div>
          </div>

          {/* Right Column: AI Insights & Instructions */}
          <div className="col-span-12 lg:col-span-4 space-y-gutter-desktop mt-8 lg:mt-0">
            {/* AI Card */}
            <div className="bg-primary text-on-primary p-8 rounded-[32px] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                <span className="material-symbols-outlined text-[120px]">psychology</span>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full mb-6">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Smart Mapping</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-4">How it works</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="font-mono text-white/50">01</span>
                    <p className="text-body-sm">AI identifies headers even if they are misspelled or in different languages.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-white/50">02</span>
                    <p className="text-body-sm">Data is cleaned: duplicates removed, phone numbers formatted, emails verified.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-white/50">03</span>
                    <p className="text-body-sm">Leads are scored based on your historical conversion patterns.</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Documentation Card */}
            <div className="bg-surface-container-high p-8 rounded-[32px]">
              <h4 className="font-label-md text-on-surface uppercase tracking-wider mb-6">Requirements</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">check_circle</span>
                  </div>
                  <div>
                    <div className="font-label-md text-on-surface">UTF-8 Encoding</div>
                    <div className="text-body-sm text-on-surface-variant">Ensure your file is saved in UTF-8 format for global character support.</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">table_rows</span>
                  </div>
                  <div>
                    <div className="font-label-md text-on-surface">Header Row</div>
                    <div className="text-body-sm text-on-surface-variant">The first row must contain column headers for the AI to begin mapping.</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-outline-variant/30">
                <a href="#" className="flex items-center justify-between group">
                  <span className="font-label-md text-primary">Download Sample CSV</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">download</span>
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
