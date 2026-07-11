'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

interface PreviewTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  filename: string;
}

export function PreviewTable({ data, onConfirm, onCancel, isSubmitting, filename }: PreviewTableProps) {
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      header: key,
      accessorKey: key,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: (info: any) => {
        const val = info.getValue();
        return <span className="whitespace-nowrap font-body-sm text-on-surface-variant">{val ? String(val) : ''}</span>;
      },
    }));
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {/* Header Section: Context & Primary Actions */}
      <div className="px-4 lg:px-margin-desktop py-8 bg-surface-container-low/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <button onClick={onCancel} className="p-2 -ml-2 hover:bg-primary/10 rounded-full transition-colors group">
                <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
              </button>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Step 2 of 3: Data Validation</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Review Your Leads</h1>
            <p className="text-on-surface-variant font-body-md max-w-2xl">
              We&apos;ve detected <span className="font-bold text-on-surface">{data.length} potential leads</span> from <code className="bg-surface-container-high px-1.5 py-0.5 rounded text-primary">{filename}</code>. Please verify the data before finalizing.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onCancel}
              className="px-6 py-3 rounded-xl font-label-md text-label-md text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest transition-all"
            >
              Discard & Re-upload
            </button>
            <button 
              onClick={onConfirm}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl font-label-md text-label-md text-on-primary bg-action-indigo shadow-lg shadow-action-indigo/20 hover:shadow-action-indigo/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Starting...' : 'Confirm & Start AI Sync'}
              {!isSubmitting && <span className="material-symbols-outlined text-[18px]">bolt</span>}
            </button>
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="px-4 lg:px-margin-desktop mt-4">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary to-action-indigo rounded-2xl p-6 text-on-primary shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline-md text-headline-md">AI Enrichment Enabled</h3>
              <p className="text-on-primary/80 font-body-sm max-w-xl mt-1">
                Once confirmed, our neural engine will automatically scrub these leads for duplicates, verify email deliverability, and structure the schema.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-label-sm text-label-sm uppercase opacity-70">Estimated Completion</div>
                <div className="font-headline-md text-headline-md">~1 min</div>
              </div>
            </div>
          </div>
          
          {/* Decorative SVG circles */}
          <svg className="absolute top-0 right-0 h-full w-auto opacity-20 pointer-events-none" fill="none" viewBox="0 0 200 200">
            <circle cx="150" cy="50" fill="currentColor" r="80"></circle>
            <circle cx="180" cy="150" fill="currentColor" r="40"></circle>
          </svg>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="px-4 lg:px-margin-desktop py-8 flex-1 flex flex-col min-h-0">
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/30">
          
          {/* Table Controls */}
          <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
            <div className="flex items-center gap-4">
              <span className="font-label-md text-label-md text-on-surface-variant">Showing first {Math.min(50, data.length)} rows</span>
              <div className="h-4 w-px bg-outline-variant"></div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-vibrant-cyan animate-pulse"></span>
                <span className="text-body-sm text-on-surface-variant italic">Live parsing active</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[20px]">view_column</span>
              </button>
            </div>
          </div>

          {/* Scrollable Table Area */}
          <div className="overflow-auto max-h-[600px] relative scrollbar-hide">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-20">
                <tr className="bg-surface-container-low">
                  <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap border-b border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      Row <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                    </div>
                  </th>
                  {table.getHeaderGroups().map((headerGroup) => (
                    headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap border-b border-outline-variant/30">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {table.getRowModel().rows.slice(0, 50).map((row, i) => (
                  <tr
                    key={row.id}
                    className="hover:bg-surface-container-low/40 transition-colors group"
                  >
                    <td className="px-6 py-4 font-label-md text-label-md text-on-surface-variant/50">
                      {String(i + 1).padStart(3, '0')}
                    </td>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-on-surface">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
