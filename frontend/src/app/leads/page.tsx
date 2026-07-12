'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { CrmRecord } from '@/types';
import { toast } from 'sonner';

export default function LeadsPage() {
  const [leads, setLeads] = useState<CrmRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchLeads() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const res = await fetch(`${backendUrl}/api/leads`);
        if (!res.ok) throw new Error('Failed to fetch leads');
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not load leads');
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeads();
  }, []);

  // Filter based on search
  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(search.toLowerCase()) || 
    lead.email?.toLowerCase().includes(search.toLowerCase()) ||
    lead.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col w-full px-4 lg:px-margin-desktop py-8 max-w-container-max mx-auto gap-gutter-desktop animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-headline-xl tracking-tight text-on-surface">Lead Management</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              View and manage your imported, AI-enriched leads.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
              <input 
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-body-sm w-48 text-on-surface placeholder:text-on-surface-variant"
              />
            </div>
            <button className="px-4 py-2 bg-primary text-on-primary rounded-full font-label-md text-label-md flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant/20 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-4">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-on-surface-variant font-body-md text-body-md">Loading leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-[32px]">group_off</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">No leads found</h3>
              <p className="text-on-surface-variant max-w-md">
                {search ? "No leads match your search criteria." : "You haven't imported any successful leads yet. Go to the CSV Importer to add some."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/30">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Name</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Contact</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Company</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Status</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredLeads.map((lead, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-label-lg text-label-lg text-on-surface group-hover:text-primary transition-colors">
                          {lead.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-body-sm text-body-sm text-on-surface">
                          {lead.email || 'No email'}
                        </div>
                        <div className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                          {lead.country_code ? `+${lead.country_code}` : ''} {lead.mobile_without_country_code || 'No phone'}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface">
                        {lead.company || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-tertiary-container text-on-tertiary-container">
                          {lead.crm_status?.replace(/_/g, ' ') || 'NEW'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-body-xs text-body-xs text-on-surface-variant uppercase tracking-wider">
                          {lead.data_source?.replace(/_/g, ' ') || 'IMPORT'}
                        </span>
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
