import React from 'react';
import Header from '../common/Header';

interface MainLayoutProps {
  activePage: 'Dashboard' | 'Inventory' | 'Alerts' | 'Suppliers';
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ activePage, children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Global Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <Header activePage={activePage} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;