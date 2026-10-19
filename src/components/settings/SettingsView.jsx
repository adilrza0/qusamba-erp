import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Building2, 
  Landmark, 
  Receipt, 
  Database, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Moon,
  Sun,
  Layers,
  Palette
} from 'lucide-react';

export const SettingsView = () => {
  const { 
    companyProfile, 
    setCompanyProfile, 
    updateCompanyProfile,
    resetToDemoData, 
    initCleanProductionData,
    clearAllTransactions,
    exportBackupJSON, 
    importBackupJSON,
    showToast,
    theme,
    setTheme,
    serverConnected
  } = useApp();

  const [formData, setFormData] = useState({ ...companyProfile });
  const [importText, setImportText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [demoClicks, setDemoClicks] = useState(0);
  const [demoToggle, setDemoToggle] = useState(true);
  const [demoInput, setDemoInput] = useState('Handcrafted Lac Royal Kada');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (updateCompanyProfile) {
      updateCompanyProfile(formData);
    } else {
      setCompanyProfile(formData);
      showToast('Company profile & GST settings updated!', 'success');
    }
  };

  const handleImport = () => {
    if (!importText.trim()) {
      showToast('Please paste a valid JSON backup', 'danger');
      return;
    }
    importBackupJSON(importText);
    setImportText('');
    setShowImportBox(false);
  };

  return (
    <div className="view-container">
      {/* Top Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
          Settings & <span className="gold-gradient-text">Business Configuration</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Configure company GSTIN, bank details, default tax rates, thermal/A4 print options, and ERP backups.
        </p>
      </div>

      {/* UI Styling & Neumorphism Studio Card */}
      <div className="card card-gold-accent">
        <div className="card-header">
          <h3 className="card-title">
            <Sparkles size={18} color="var(--gold-primary)" />
            <span>Neumorphic UI Engine & Appearance Studio</span>
          </h3>
          <span className="badge badge-gold">
            Active: {theme === 'neumorphic' ? 'Soft Neumorphism' : theme === 'neumorphic-dark' ? 'Obsidian Dark' : 'Classic White'}
          </span>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
          Select the UI styling paradigm for your enterprise workshop. The Neumorphic engine delivers soft tactile surfaces, extruded cards, sunken inputs, and physical button depression feedback.
        </p>

        {/* 3 Theme Selection Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
          {/* Tile 1: Neumorphic Light */}
          <div
            onClick={() => setTheme('neumorphic')}
            style={{
              padding: '18px 20px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#e6ebf2',
              boxShadow: theme === 'neumorphic' ? 'inset 3px 3px 6px #b6bfcb, inset -3px -3px 6px #ffffff, 0 0 0 2px var(--gold-primary)' : '5px 5px 12px #b6bfcb, -5px -5px 12px #ffffff',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1e293b', fontWeight: 800, fontSize: '0.96rem' }}>
                <Sparkles size={18} color="#b48324" />
                <span>Neumorphic Light</span>
              </div>
              {theme === 'neumorphic' && (
                <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>Active</span>
              )}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
              Soft embossed alabaster surfaces, carved sunken input wells, convex antique gold buttons, and dual ambient directional shadows.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <span className="badge badge-emerald">Emerald</span>
              <span className="badge badge-gold">Gold</span>
              <span className="badge badge-ruby">Ruby</span>
            </div>
          </div>

          {/* Tile 2: Neumorphic Dark */}
          <div
            onClick={() => setTheme('neumorphic-dark')}
            style={{
              padding: '18px 20px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#181b21',
              boxShadow: theme === 'neumorphic-dark' ? 'inset 3px 3px 6px #0e1014, inset -3px -3px 6px #242832, 0 0 0 2px var(--gold-primary)' : '5px 5px 14px #0e1014, -5px -5px 14px #242832',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f8fafc', fontWeight: 800, fontSize: '0.96rem' }}>
                <Moon size={18} color="#fbbf24" />
                <span>Neumorphic Dark</span>
              </div>
              {theme === 'neumorphic-dark' && (
                <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>Active</span>
              )}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
              Obsidian slate extruded panels with subtle illuminated light-rims, carved dark wells, and radiant gold accent lighting.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <span className="badge badge-emerald">Emerald</span>
              <span className="badge badge-gold">Gold</span>
              <span className="badge badge-ruby">Ruby</span>
            </div>
          </div>

          {/* Tile 3: Classic White */}
          <div
            onClick={() => setTheme('classic')}
            style={{
              padding: '18px 20px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#ffffff',
              boxShadow: theme === 'classic' ? 'inset 0 0 0 2px var(--gold-primary), 0 2px 8px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.05), 0 6px 16px rgba(0,0,0,0.03)',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a', fontWeight: 800, fontSize: '0.96rem' }}>
                <Sun size={18} color="#d97706" />
                <span>Classic Light</span>
              </div>
              {theme === 'classic' && (
                <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>Active</span>
              )}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
              Original crisp white Haute Joaillerie layout with clean border lines and high-contrast typography.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <span className="badge badge-emerald">Emerald</span>
              <span className="badge badge-gold">Gold</span>
              <span className="badge badge-ruby">Ruby</span>
            </div>
          </div>
        </div>

        {/* Live Tactile Playground Demonstration */}
        <div 
          style={{ 
            padding: '20px', 
            borderRadius: 'var(--radius-lg)', 
            backgroundColor: 'var(--bg-input)', 
            boxShadow: 'var(--neu-inset)', 
            border: 'var(--neu-bevel)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-light)', letterSpacing: '0.06em' }}>
              Live Tactile Component Playground
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Interact to experience real-time depression & elevation feedback
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'center' }}>
            {/* Interactive Tactile Push Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Push Button (Depresses on Click)
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDemoClicks(prev => prev + 1)}
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Click Me to Depress</span>
                <span className="badge badge-gold">{demoClicks} clicks</span>
              </button>
            </div>

            {/* Interactive Carved Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Carved Sunken Input Field
              </span>
              <input
                type="text"
                className="form-control"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                placeholder="Type here..."
              />
            </div>

            {/* Interactive Tactile Toggle Switch */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Tactile Slide Switch
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div 
                  className={`neu-switch-track ${demoToggle ? 'active' : ''}`}
                  onClick={() => setDemoToggle(!demoToggle)}
                  title="Click to toggle"
                >
                  <div className="neu-switch-thumb" />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {demoToggle ? 'Ambient Bevel Enabled' : 'Ambient Bevel Off'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Card 1: Company Profile & GST Details */}
        <div className="card card-gold-accent">
          <div className="card-header">
            <h3 className="card-title">
              <Building2 size={18} color="var(--gold-primary)" />
              <span>Company Information & GST Master</span>
            </h3>
            <span className="badge badge-gold">Used in Tax Invoices</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Company Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Trade / Brand Name</label>
              <input
                type="text"
                className="form-control"
                name="tradeName"
                value={formData.tradeName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GSTIN (15 Digits) <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State & State Code <span className="required">*</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Rajasthan"
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  style={{ fontFamily: 'monospace', textAlign: 'center' }}
                  name="stateCode"
                  value={formData.stateCode}
                  onChange={handleChange}
                  placeholder="08"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Factory / Wholesale Dispatch Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City & Pincode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 8 }}>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Wholesale Support Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default GST Rate (%)</label>
              <select
                className="form-select"
                name="defaultGstRate"
                value={formData.defaultGstRate}
                onChange={handleChange}
              >
                <option value={3}>3% (Imitation Jewellery & Bangle Standard)</option>
                <option value={5}>5% (Artisan Handicraft Slabs)</option>
                <option value={12}>12% (Processed Base Metal)</option>
                <option value={18}>18% (General Standard)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Banking & QR Payments */}
        <div className="card card-gold-accent">
          <div className="card-header">
            <h3 className="card-title">
              <Landmark size={18} color="var(--gold-primary)" />
              <span>Bank Account & UPI Details</span>
            </h3>
            <span className="badge badge-emerald">Printed on Wholesale Invoices</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input
                type="text"
                className="form-control"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Branch Name</label>
              <input
                type="text"
                className="form-control"
                name="bankBranch"
                value={formData.bankBranch}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Account Number</label>
              <input
                type="text"
                className="form-control"
                style={{ fontFamily: 'monospace' }}
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input
                type="text"
                className="form-control"
                style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                name="ifsc"
                value={formData.ifsc}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">UPI ID (for Mobile QR Code)</label>
              <input
                type="text"
                className="form-control"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Save Business Settings</span>
            </button>
          </div>
        </div>
      </form>

      {/* Card 3: Data Management & Backup */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Database size={18} color="var(--sapphire)" />
            <span>Database & Production Environment Controls</span>
          </h3>
          <span className={`badge ${serverConnected ? 'badge-emerald' : 'badge-amber'}`}>
            {serverConnected ? 'MongoDB Atlas Connected' : 'Browser Cache (Offline)'}
          </span>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 18 }}>
          Manage your database state for live production or testing. In production mode, dummy customer khata accounts, sample invoices, and fake logs are removed so your factory starts with a clean financial ledger.
        </p>

        {/* Production vs Demo Mode Action Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 20 }}>
          {/* Action 1: Clean Production Mode */}
          <div style={{ padding: 16, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} color="var(--emerald)" />
              <span>Clean Production Mode</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              Resets database for live factory operations: 0 fake invoices, 0 dummy buyers, 0 mock logs, clean sizing master.
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ borderColor: 'var(--emerald)', color: 'var(--emerald)' }}
              onClick={() => {
                if (confirm('Initialize clean production database? All sample transactions and demo buyers will be cleared.')) {
                  initCleanProductionData();
                }
              }}
            >
              Initialize Clean Slate
            </button>
          </div>

          {/* Action 2: Purge Transactions Only */}
          <div style={{ padding: 16, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RotateCcw size={16} color="var(--amber)" />
              <span>Purge Demo Transactions</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              Wipes all demo invoices and payments, resets khata to ₹0, but preserves your bangle designs and catalog.
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}
              onClick={() => {
                if (confirm('Purge all demo invoices, payments, and work logs? Bangle designs and company profile will be kept.')) {
                  clearAllTransactions();
                }
              }}
            >
              Clear Transactions Only
            </button>
          </div>

          {/* Action 3: Load Demo Sample Data */}
          <div style={{ padding: 16, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} color="var(--gold-primary)" />
              <span>Load Sample / Demo Data</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              Loads complete sample dataset (Kundan sets, Rajasthan buyers, Jaipur invoices) for training or testing.
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (confirm('Load sample demonstration data into database?')) {
                  resetToDemoData();
                }
              }}
            >
              Load Demo Dataset
            </button>
          </div>
        </div>

        {/* Backup & Restore Buttons */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <button type="button" className="btn btn-outline" onClick={exportBackupJSON}>
            <Download size={16} color="var(--gold-primary)" />
            <span>Export Full ERP Backup (JSON)</span>
          </button>

          <button 
            type="button"
            className="btn btn-outline"
            onClick={() => setShowImportBox(!showImportBox)}
          >
            <Upload size={16} color="var(--sapphire)" />
            <span>Restore from Backup File</span>
          </button>
        </div>

        {/* Import JSON Box */}
        {showImportBox && (
          <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-input)', borderRadius: 8, border: '1px solid var(--border-gold)' }}>
            <label className="form-label">Paste Backup JSON Content:</label>
            <textarea
              className="form-control"
              rows={4}
              style={{ fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: 12 }}
              placeholder='{"companyProfile": ...}'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary btn-sm" onClick={handleImport}>
                Import and Restore
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowImportBox(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
