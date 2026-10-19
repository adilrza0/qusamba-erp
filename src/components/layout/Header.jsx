import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversalSearch } from './UniversalSearch';
import { 
  Bell, 
  Plus, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  FileText, 
  Hammer, 
  PackagePlus, 
  Building2, 
  Sparkles, 
  Moon, 
  Sun, 
  Palette, 
  Check 
} from 'lucide-react';

export const Header = () => {
  const { 
    companyProfile, 
    activeTab,
    searchTerm, 
    setSearchTerm, 
    setActiveModal, 
    buyers, 
    getLowStockFinishedCount, 
    getLowStockRawCount,
    setActiveTab,
    serverConnected,
    theme,
    setTheme,
    toggleTheme
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const lowStockFg = getLowStockFinishedCount();
  const lowStockRm = getLowStockRawCount();
  const overdueBuyers = buyers.filter((b) => (b.outstandingBalance || 0) > 0 && (b.overdueDays || 0) > 0);
  const totalAlerts = lowStockFg + lowStockRm + overdueBuyers.length;

  const pageTitles = {
    dashboard: 'Dashboard Overview',
    inventory: 'Inventory & Sizing Matrix',
    invoices: 'GST Wholesale Invoices',
    ledger: 'Buyer Ledger & Credit Tracker',
    karigar: 'Karigar Piece-Rate Tracker',
    reports: 'Analytics & Reports',
    settings: 'Settings & Business Profile'
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-page-title">
          <span>{pageTitles[activeTab] || 'Dashboard'}</span>
        </div>

        {/* Universal Search with Live Multi-Entity Results */}
        <UniversalSearch />
      </div>

      <div className="header-right">
        {/* Neumorphic UI & Theme Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            title="Switch UI Style (Neumorphism / Dark / Classic)"
            style={{
              gap: 7,
              borderColor: 'var(--border-gold)',
              color: 'var(--text-primary)'
            }}
          >
            {theme === 'neumorphic' && <Sparkles size={15} color="var(--gold-primary)" />}
            {theme === 'neumorphic-dark' && <Moon size={15} color="var(--gold-light)" />}
            {theme === 'classic' && <Sun size={15} color="var(--amber)" />}
            {/* <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>
              {theme === 'neumorphic' ? 'Neumorphic Light' : theme === 'neumorphic-dark' ? 'Dark Soft UI' : 'Classic White'}
            </span> */}
          </button>

          {showThemeMenu && (
            <div className="theme-dropdown">
              <div style={{ padding: '6px 8px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--gold-light)', letterSpacing: '0.06em' }}>
                  UI Styling Engine
                </div>
              </div>

              <button
                className={`theme-option-btn ${theme === 'neumorphic' ? 'active' : ''}`}
                onClick={() => { setTheme('neumorphic'); setShowThemeMenu(false); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sparkles size={16} color="var(--gold-primary)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Neumorphic Light</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Soft embossed tactile UI</span>
                  </div>
                </div>
                {theme === 'neumorphic' && <Check size={14} color="var(--gold-primary)" />}
              </button>

              <button
                className={`theme-option-btn ${theme === 'neumorphic-dark' ? 'active' : ''}`}
                onClick={() => { setTheme('neumorphic-dark'); setShowThemeMenu(false); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Moon size={16} color="var(--gold-light)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Neumorphic Dark</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Obsidian dark soft UI</span>
                  </div>
                </div>
                {theme === 'neumorphic-dark' && <Check size={14} color="var(--gold-light)" />}
              </button>

              <button
                className={`theme-option-btn ${theme === 'classic' ? 'active' : ''}`}
                onClick={() => { setTheme('classic'); setShowThemeMenu(false); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sun size={16} color="var(--amber)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Haute Joaillerie White</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Original clean flat light</span>
                  </div>
                </div>
                {theme === 'classic' && <Check size={14} color="var(--amber)" />}
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
          >
            <Plus size={16} />
            <span>Quick Action</span>
          </button>

          {showQuickMenu && (
            <div 
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: 230,
                backgroundColor: 'var(--bg-card)',
                border: 'var(--neu-bevel)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--neu-raised-lg)',
                padding: '8px',
                zIndex: 60,
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}
            >
              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', color: 'var(--text-primary)' }}
                onClick={() => {
                  setActiveModal('newInvoice');
                  setShowQuickMenu(false);
                }}
              >
                <FileText size={15} color="var(--gold-primary)" />
                <span>+ New GST Invoice</span>
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', color: 'var(--text-primary)' }}
                onClick={() => {
                  setActiveModal('recordPayment');
                  setShowQuickMenu(false);
                }}
              >
                <CreditCard size={15} color="var(--emerald)" />
                <span>+ Record Payment</span>
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', color: 'var(--text-primary)' }}
                onClick={() => {
                  setActiveModal('karigarLog');
                  setShowQuickMenu(false);
                }}
              >
                <Hammer size={15} color="var(--amber)" />
                <span>+ Karigar Production Log</span>
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', color: 'var(--text-primary)' }}
                onClick={() => {
                  setActiveModal('addFinishedGood');
                  setShowQuickMenu(false);
                }}
              >
                <PackagePlus size={15} color="var(--sapphire)" />
                <span>+ Add Bangle Design</span>
              </button>
            </div>
          )}
        </div>

        {/* Server & DB Status Chip */}
        <div 
          className="header-time-chip"
          style={{
            borderColor: serverConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            backgroundColor: serverConnected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          }}
          title={serverConnected ? 'Connected to Express Server & MongoDB Atlas' : 'Server offline — using local cache'}
        >
          <span 
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: serverConnected ? '#10b981' : '#ef4444',
              display: 'inline-block',
              boxShadow: serverConnected ? '0 0 8px #10b981' : 'none'
            }}
          />
          <span style={{ fontWeight: 600, color: serverConnected ? '#059669' : '#dc2626' }}>
            {serverConnected ? 'MongoDB Online' : 'Local Mode'}
          </span>
        </div>

        {/* Live Indian Time Chip */}
        <div className="header-time-chip">
          <Clock size={48} color="var(--gold-primary)" />
          <span>
            {currentTime.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}{' '}
            • {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* Alerts & Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="System Alerts & Warnings"
          >
            <Bell size={18} />
            {totalAlerts > 0 && <span className="notification-pill">{totalAlerts}</span>}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: 320,
                backgroundColor: 'var(--bg-card)',
                border: 'var(--neu-bevel)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--neu-raised-lg)',
                padding: '16px',
                zIndex: 60
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--gold-light)' }}>
                  Active Alerts ({totalAlerts})
                </span>
                <span className="badge badge-ruby">{totalAlerts} Attention</span>
              </div>

              <div style={{ display: 'flex', flexFlow: 'column', gap: 10, maxHeight: 280, overflowY: 'auto' }}>
                {lowStockFg > 0 && (
                  <div 
                    style={{ padding: '8px 10px', background: 'var(--ruby-bg)', borderRadius: 6, border: '1px solid var(--ruby-border)', cursor: 'pointer' }}
                    onClick={() => { setActiveTab('inventory'); setShowNotifications(false); }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ruby)', fontWeight: 700, fontSize: '0.8rem' }}>
                      <AlertTriangle size={14} />
                      <span>{lowStockFg} Finished Bangles Low in Stock</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      Immediate workshop assembly recommended.
                    </div>
                  </div>
                )}

                {lowStockRm > 0 && (
                  <div 
                    style={{ padding: '8px 10px', background: 'var(--amber-bg)', borderRadius: 6, border: '1px solid var(--amber-border)', cursor: 'pointer' }}
                    onClick={() => { setActiveTab('inventory'); setShowNotifications(false); }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--amber)', fontWeight: 700, fontSize: '0.8rem' }}>
                      <AlertTriangle size={14} />
                      <span>{lowStockRm} Raw Materials Below Safety Level</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      Lac resin / stones procurement required.
                    </div>
                  </div>
                )}

                {overdueBuyers.map((b) => (
                  <div 
                    key={b.id}
                    style={{ padding: '8px 10px', background: 'rgba(180,131,36,0.06)', borderRadius: 6, border: '1px solid var(--border-gold)', cursor: 'pointer' }}
                    onClick={() => { setActiveTab('ledger'); setShowNotifications(false); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.8rem' }}>
                      <span>{b.name}</span>
                      <span className="badge badge-amber">{b.overdueDays}d Overdue</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      ₹{b.outstandingBalance?.toLocaleString('en-IN')} outstanding credit
                    </div>
                  </div>
                ))}

                {totalAlerts === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    All stocks healthy & payments up to date!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Factory / Depot Pill */}
        {/* <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)',
            border: 'var(--neu-bevel)',
            boxShadow: 'var(--neu-raised-sm)'
          }}
        >
          <Building2 size={16} color="var(--gold-primary)" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {companyProfile.city} Depot
            </span>
            <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
              GSTIN: {companyProfile.gstin.slice(0, 7)}...
            </span>
          </div>
        </div> */}
      </div>
    </header>
  );
};
