import React from 'react';
import Header from '../common/Header';
import '../../styles/layout/mainlayout.css';

interface MainLayoutProps {
  activePage: 'Dashboard' | 'Inventory' | 'Alerts' | 'Suppliers';
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ activePage, children }) => {
  return (
    <div className="main-layout-container">
      <Header activePage={activePage} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;