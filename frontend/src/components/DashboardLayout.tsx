'use client';

import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-gutter-desktop flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">database</span>
            </div>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">GrowEasy AI</span>
          </div>
          <button 
            className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg"
            onClick={closeMenu}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <nav className="flex-1 px-4 mt-unit space-y-1">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-surface-container-high hover:text-on-surface text-on-surface-variant">
            <span className="material-symbols-outlined">upload_file</span>
            <span className="font-label-md text-label-md">CSV Importer</span>
          </Link>
          <Link href="/leads" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all">
            <span className="material-symbols-outlined">group</span>
            <span className="font-label-md text-label-md">Lead Management</span>
          </Link>
          <Link href="/history" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all">
            <span className="material-symbols-outlined">history</span>
            <span className="font-label-md text-label-md">Import History</span>
          </Link>
        </nav>
        
        <div className="p-6 mx-4 mb-8 rounded-2xl bg-primary-container/10 border border-primary/10">
          <div className="flex items-center gap-2 text-primary mb-2">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            <span className="font-label-sm text-label-sm uppercase">AI Insights</span>
          </div>
          <p className="text-on-surface-variant text-[13px] leading-relaxed">Automated lead scoring is currently 94% accurate.</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 h-16 bg-surface/80 backdrop-blur-xl z-30 flex items-center justify-between px-4 lg:px-gutter-desktop shadow-[0_1px_8px_rgba(0,0,0,0.04)] dark:shadow-none">
          <div className="flex items-center gap-3 w-full">
            <button 
              className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex items-center gap-4 bg-surface-container-high px-4 py-1.5 rounded-full w-full max-w-sm hidden sm:flex">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Search leads or data..." 
                className="bg-transparent border-none outline-none text-body-sm w-full text-on-surface placeholder:text-on-surface-variant"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-shrink-0">
            <ThemeToggle />
            <button className="text-on-surface-variant hover:text-on-surface transition-colors hidden sm:block p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l border-outline-variant/30">
              <div className="text-right hidden sm:block">
                <div className="font-label-md text-label-md text-on-surface">CRM Admin</div>
                <div className="text-[11px] text-on-surface-variant">Team Lead</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 flex flex-col w-full relative overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
