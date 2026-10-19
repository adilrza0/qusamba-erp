import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { InventoryView } from './components/inventory/InventoryView';
import { InvoicesView } from './components/invoices/InvoicesView';
import { LedgerView } from './components/ledger/LedgerView';
import { KarigarView } from './components/karigar/KarigarView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { ModalsContainer } from './components/modals/ModalsContainer';
import { ToastContainer } from './components/common/ToastContainer';
import './App.css';

const AppContent = () => {
  const { activeTab } = useApp();

  return (
    <div className="app-container">
      <Sidebar />
      <main className="app-main">
        <Header />
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'invoices' && <InvoicesView />}
        {activeTab === 'ledger' && <LedgerView />}
        {activeTab === 'karigar' && <KarigarView />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
      <ModalsContainer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
