import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Gem, 
  TrendingUp, 
  CreditCard, 
  Hammer, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Boxes,
  PlusCircle,
  Eye
} from 'lucide-react';
import { BANGLE_SIZES } from '../../data/mockData';

export const Dashboard = () => {
  const { 
    finishedGoods, 
    rawMaterials, 
    buyers, 
    invoices, 
    payments, 
    karigars, 
    getTotalDozens,
    setActiveTab,
    setActiveModal,
    setModalData
  } = useApp();

  // 1. Inventory Valuation
  const totalFinishedDozens = finishedGoods.reduce((acc, fg) => acc + getTotalDozens(fg.sizesStockDz), 0);
  const totalInventoryValue = finishedGoods.reduce((acc, fg) => {
    const dz = getTotalDozens(fg.sizesStockDz);
    return acc + dz * (fg.wholesaleRatePerDz || 0);
  }, 0);

  // 2. Total Invoiced Sales & Month Sales
  const totalSalesValue = invoices.reduce((acc, inv) => acc + (inv.grandTotal || 0), 0);
  const totalCollected = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  // 3. Outstanding Credit
  const totalOutstandingCredit = buyers.reduce((acc, b) => acc + (b.outstandingBalance || 0), 0);
  const overdueCount = buyers.filter((b) => (b.outstandingBalance || 0) > 0 && (b.overdueDays || 0) > 0).length;

  // 4. Karigar Dues
  const totalKarigarDues = karigars.reduce((acc, k) => acc + (k.netPayable || 0), 0);

  // Size distribution analysis across finished goods
  const sizeTotals = BANGLE_SIZES.reduce((acc, sz) => {
    acc[sz] = finishedGoods.reduce((sum, fg) => sum + (fg.sizesStockDz?.[sz] || 0), 0);
    return acc;
  }, {});

  const maxSizeVal = Math.max(...Object.values(sizeTotals), 1);

  // Low stock items (Finished & Raw)
  const lowStockFinished = finishedGoods.filter((fg) => getTotalDozens(fg.sizesStockDz) <= (fg.minStockAlertDz || 40));
  const lowStockRaw = rawMaterials.filter((rm) => (rm.stockQty || 0) <= (rm.minStockAlert || 50));

  // Monthly breakdown for Sales vs Collections chart
  const monthsData = [
    { month: 'Jun', sales: 180000, recovery: 145000 },
    { month: 'Jul', sales: 240000, recovery: 210000 },
    { month: 'Aug', sales: 310000, recovery: 280000 },
    { month: 'Sep', sales: 420000, recovery: 365000 },
    { month: 'Oct', sales: 485000, recovery: 410000 }
  ];
  const maxMonthlyVal = 550000;

  return (
    <div className="view-container">
      {/* Top Banner / Welcome */}
      <div 
        style={{
          background: 'var(--hero-gradient)',
          border: 'var(--neu-bevel)',
          borderTop: '3px solid var(--gold-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          boxShadow: 'var(--neu-raised)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-gold">Factory & Wholesale Dispatch Hub</span>
            <span className="badge badge-emerald">Live Status: Operations Active</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', marginTop: 8, color: 'var(--text-primary)' }}>
            Welcome to <span className="gold-gradient-text">Qusamba Creations</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: 650 }}>
            Manage handcrafted glass, lac, velvet & silk thread bangle inventory, generate GST invoices, track distributor khata credit, and calculate karigar piece-rate payouts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveModal('newInvoice')}
          >
            <FileText size={16} />
            <span>+ Create GST Invoice</span>
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => setActiveModal('recordPayment')}
          >
            <CreditCard size={16} />
            <span>+ Receive Payment</span>
          </button>
        </div>
      </div>

      {/* 4 Hero KPI Cards */}
      <div className="kpi-grid">
        {/* KPI 1: Inventory Valuation */}
        <div className="kpi-card" onClick={() => setActiveTab('inventory')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-label">Stock Valuation (Finished)</span>
            <div className="kpi-icon-wrap">
              <Gem size={20} />
            </div>
          </div>
          <div className="kpi-value">₹{totalInventoryValue.toLocaleString('en-IN')}</div>
          <div className="kpi-meta">
            <span className="badge badge-gold">{totalFinishedDozens.toLocaleString('en-IN')} Dz</span>
            <span>across {finishedGoods.length} active designs</span>
          </div>
        </div>

        {/* KPI 2: Sales & Invoicing */}
        <div className="kpi-card" onClick={() => setActiveTab('invoices')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-label">Wholesale Invoiced Sales</span>
            <div className="kpi-icon-wrap" style={{ color: 'var(--emerald)', borderColor: 'var(--emerald-border)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--emerald)' }}>
            ₹{totalSalesValue.toLocaleString('en-IN')}
          </div>
          <div className="kpi-meta">
            <span className="badge badge-emerald">{invoices.length} Invoices</span>
            <span>₹{totalCollected.toLocaleString('en-IN')} collected</span>
          </div>
        </div>

        {/* KPI 3: Outstanding Credit */}
        <div className="kpi-card" onClick={() => setActiveTab('ledger')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-label">Outstanding Credit (Khata)</span>
            <div className="kpi-icon-wrap" style={{ color: 'var(--amber)', borderColor: 'var(--amber-border)' }}>
              <CreditCard size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--amber)' }}>
            ₹{totalOutstandingCredit.toLocaleString('en-IN')}
          </div>
          <div className="kpi-meta">
            {overdueCount > 0 ? (
              <span className="badge badge-ruby">{overdueCount} Overdue Buyers</span>
            ) : (
              <span className="badge badge-emerald">Within Credit Limit</span>
            )}
            <span>across {buyers.length} wholesale buyers</span>
          </div>
        </div>

        {/* KPI 4: Karigar Piece-Rate Dues */}
        <div className="kpi-card" onClick={() => setActiveTab('karigar')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-label">Karigar Piece-Rate Dues</span>
            <div className="kpi-icon-wrap" style={{ color: 'var(--sapphire)', borderColor: 'rgba(56,189,248,0.3)' }}>
              <Hammer size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--sapphire)' }}>
            ₹{totalKarigarDues.toLocaleString('en-IN')}
          </div>
          <div className="kpi-meta">
            <span className="badge badge-sapphire">{karigars.length} Artisans</span>
            <span>Weekly settlement pending</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="charts-row">
        {/* Chart 1: Monthly Sales vs Recovery */}
        <div className="card chart-card card-gold-accent">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <TrendingUp size={18} color="var(--gold-primary)" />
                <span>Monthly Sales vs. Recovery (Collections)</span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Credit sales dispatched vs actual cash/bank collections in ₹
              </p>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--gold-primary)' }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>Sales</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--emerald)' }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>Recovery</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '10px 0' }}>
            {monthsData.map((d) => {
              const salesPct = Math.round((d.sales / maxMonthlyVal) * 100);
              const recPct = Math.round((d.recovery / maxMonthlyVal) * 100);
              return (
                <div key={d.month} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 36, fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    {d.month}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {/* Sales Bar */}
                    <div style={{ height: 10, background: 'var(--bg-input)', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <div 
                        style={{ 
                          width: `${salesPct}%`, 
                          height: '100%', 
                          background: 'var(--gold-gradient)', 
                          borderRadius: 6 
                        }} 
                      />
                    </div>
                    {/* Recovery Bar */}
                    <div style={{ height: 10, background: 'var(--bg-input)', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <div 
                        style={{ 
                          width: `${recPct}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', 
                          borderRadius: 6 
                        }} 
                      />
                    </div>
                  </div>
                  <div style={{ width: 140, textAlign: 'right', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    <div style={{ color: 'var(--gold-light)', fontWeight: 700 }}>₹{(d.sales / 1000).toFixed(0)}k Sales</div>
                    <div style={{ color: 'var(--emerald)' }}>₹{(d.recovery / 1000).toFixed(0)}k Recv</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Fast-Selling Sizes Breakdown */}
        <div className="card chart-card card-gold-accent">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Boxes size={18} color="var(--gold-primary)" />
                <span>Fast-Selling Sizing Breakdown</span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Current stock & wholesale demand by standard bangle size (Dz)
              </p>
            </div>
            <span className="badge badge-gold">2-6 & 2-8 Most Popular</span>
          </div>

          <div className="size-bars-container">
            {BANGLE_SIZES.map((sz) => {
              const qty = sizeTotals[sz] || 0;
              const pct = Math.round((qty / maxSizeVal) * 100);
              const isPopular = sz === '2-6' || sz === '2-8';
              return (
                <div key={sz} className="size-bar-row">
                  <div className="size-bar-tag" style={{ borderColor: isPopular ? 'var(--gold-primary)' : 'var(--border-subtle)' }}>
                    {sz}
                  </div>
                  <div className="size-bar-track">
                    <div 
                      className="size-bar-fill" 
                      style={{ 
                        width: `${pct}%`,
                        background: isPopular 
                          ? 'var(--gold-gradient)' 
                          : 'linear-gradient(90deg, rgba(226,187,98,0.3) 0%, var(--gold-primary) 100%)'
                      }} 
                    />
                  </div>
                  <div className="size-bar-val">
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{qty}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>Dz</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Sizes: 2-2 (Smallest) to 2-12 (Extra Large)</span>
            <span style={{ color: 'var(--gold-light)' }}>Standard: 1 Dz = 12 Bangles</span>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts & Quick Dispatch Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Critical Low Stock Alert Card */}
        <div className="card" style={{ borderColor: 'var(--ruby-border)' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ color: 'var(--ruby)' }}>
              <AlertTriangle size={18} />
              <span>Low Stock Alerts ({lowStockFinished.length + lowStockRaw.length})</span>
            </h3>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('inventory')}>
              Manage Stock
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lowStockFinished.map((fg) => {
              const dz = getTotalDozens(fg.sizesStockDz);
              return (
                <div 
                  key={fg.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'var(--ruby-bg)',
                    borderRadius: 8,
                    border: '1px solid var(--ruby-border)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                      {fg.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      Material: {fg.material} • HSN: {fg.hsn}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-ruby">{dz} Dz left</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--ruby)', marginTop: 2 }}>
                      Alert below {fg.minStockAlertDz} Dz
                    </div>
                  </div>
                </div>
              );
            })}

            {lowStockRaw.map((rm) => (
              <div 
                key={rm.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'var(--amber-bg)',
                  borderRadius: 8,
                  border: '1px solid var(--amber-border)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                    {rm.name} (Raw)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    Supplier: {rm.supplier}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-amber">{rm.stockQty} {rm.unit}</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--amber)', marginTop: 2 }}>
                    Reorder level: {rm.minStockAlert}
                  </div>
                </div>
              </div>
            ))}

            {lowStockFinished.length === 0 && lowStockRaw.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--emerald)' }}>
                <CheckCircle2 size={32} style={{ margin: '0 auto 8px' }} />
                <p>All finished bangles and raw materials are above threshold.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Invoices Mini Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FileText size={18} color="var(--gold-primary)" />
              <span>Recent GST Wholesale Invoices</span>
            </h3>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('invoices')}>
              View All ({invoices.length})
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Buyer</th>
                  <th>Total (₹)</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 4).map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 700, color: 'var(--gold-light)' }}>
                      {inv.invoiceNumber}
                    </td>
                    <td>{inv.buyerName}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{inv.grandTotal?.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={`badge badge-${inv.status === 'Paid' ? 'emerald' : inv.status === 'Partial' ? 'amber' : 'ruby'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-ghost btn-sm btn-icon"
                        onClick={() => {
                          setModalData(inv);
                          setActiveModal('viewInvoice');
                        }}
                        title="View / Print Tax Invoice"
                      >
                        <Eye size={15} color="var(--gold-light)" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
