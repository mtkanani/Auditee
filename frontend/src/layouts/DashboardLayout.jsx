import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/shell/Sidebar';
import { TopBar } from '../components/shell/TopBar';
import { CommandPalette } from '../components/shell/CommandPalette';
import { cn } from '../lib/cn';

const AICopilotDrawer = lazy(() => import('../components/common/AICopilotDrawer').then(m => ({ default: m.AICopilotDrawer })));

const COLLAPSE_KEY = 'auditee-sidebar-collapsed';
const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return false;
  }
};

export const DashboardLayout = () => {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      } catch {
        // storage blocked: the choice still applies for this visit
      }
      return next;
    });
  };

  // Ctrl/Cmd+K opens the palette anywhere; Escape closes the mobile drawer.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      } else if (e.key === 'Escape') {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen bg-page text-fg font-sans antialiased overflow-x-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div className={cn('flex flex-col min-h-screen transition-[padding] duration-300 ease-out', collapsed ? 'lg:pl-[72px]' : 'lg:pl-64')}>
        <TopBar onMenuClick={() => setMobileNavOpen(true)} onSearchClick={() => setPaletteOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* "+ New" navigates with openCreate; re-key so the page re-mounts (and opens its form) even on the same route. */}
          <Outlet key={location.state?.openCreate || location.state?.openApplyModal ? location.key : undefined} />
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <Suspense fallback={null}>
        <AICopilotDrawer />
      </Suspense>
    </div>
  );
};
