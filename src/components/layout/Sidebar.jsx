import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  FileSpreadsheet, 
  BookOpen, 
  Hammer, 
  BarChart3, 
  Settings,
  CircleDot
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    getLowStockFinishedCount, 
    getLowStockRawCount,
    buyers,
    invoices,
    karigars
  } = useApp();

  const totalLowStock = getLowStockFinishedCount() + getLowStockRawCount();
  const unpaidInvoicesCount = invoices.filter((i) => i.status !== 'Paid').length;
  const overdueBuyersCount = buyers.filter((b) => (b.outstandingBalance || 0) > 0 && (b.overdueDays || 0) > 0).length;

  const totalKarigarDues = karigars.reduce((acc, k) => acc + (k.netPayable || 0), 0);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inventory',
      label: 'Inventory & Sizing',
      icon: Sparkles,
      badge: totalLowStock > 0 ? { count: totalLowStock, type: 'ruby' } : null
    },
    {
      id: 'invoices',
      label: 'GST Invoices',
      icon: FileSpreadsheet,
      badge: unpaidInvoicesCount > 0 ? { count: unpaidInvoicesCount, type: 'gold' } : null
    },
    {
      id: 'ledger',
      label: 'Buyer Ledger & Credit',
      icon: BookOpen,
      badge: overdueBuyersCount > 0 ? { count: overdueBuyersCount, type: 'amber' } : null
    },
    {
      id: 'karigar',
      label: 'Karigar Tracker',
      icon: Hammer,
      badge: null
    },
    {
      id: 'reports',
      label: 'Analytics & Reports',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings & Business',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header - Sole place where Qusamba brand appears */}
      <div className="sidebar-header">
        <div className="brand-text-block">
          <div className="brand-name">QUSAMBA</div>
          <div className="brand-subtitle">Creations & Bangles</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-item-left">
                <Icon size={18} color={isActive ? 'var(--gold-light)' : 'currentColor'} />
                <span className="nav-item-text">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`badge badge-${item.badge.type} nav-badge`}>
                  {item.badge.count}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer with Artisan Payouts summary */}
      <div className="sidebar-footer">
        <div className="karigar-mini-stat">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Karigar Payout Due
            </span>
            <span style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              ₹{totalKarigarDues.toLocaleString('en-IN')}
            </span>
          </div>
          <CircleDot size={15} color="var(--amber)" className="pulse-live" />
        </div>
      </div>
    </aside>
  );
};
