import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Download, 
  Boxes, 
  Gem, 
  Users, 
  Hammer,
  FileSpreadsheet
} from 'lucide-react';
import { BANGLE_SIZES, BANGLE_MATERIALS } from '../../data/mockData';

export const ReportsView = () => {
  const { 
    finishedGoods, 
    invoices, 
    payments, 
    buyers, 
    karigars, 
    getTotalDozens,
    showToast
  } = useApp();

  // 1. Size distribution calculation
  const sizeStats = BANGLE_SIZES.map((sz) => {
    const totalDz = finishedGoods.reduce((sum, fg) => sum + (fg.sizesStockDz?.[sz] || 0), 0);
    return { size: sz, dozens: totalDz };
  });
  const grandTotalDzSizes = sizeStats.reduce((sum, s) => sum + s.dozens, 0) || 1;

  // 2. Material Revenue and Stock Mix
  const materialStats = BANGLE_MATERIALS.map((mat) => {
    const items = finishedGoods.filter((fg) => fg.material === mat);
    const dozens = items.reduce((sum, fg) => sum + getTotalDozens(fg.sizesStockDz), 0);
    const valuation = items.reduce((sum, fg) => sum + getTotalDozens(fg.sizesStockDz) * (fg.wholesaleRatePerDz || 0), 0);
    return { material: mat, count: items.length, dozens, valuation };
  });
  const maxMatValuation = Math.max(...materialStats.map((m) => m.valuation), 1);

  // 3. Monthly Sales vs Collections
  const monthlyData = [
    { month: 'Jun 2026', sales: 180000, recovery: 145000, rate: '80%' },
    { month: 'Jul 2026', sales: 240000, recovery: 210000, rate: '87%' },
    { month: 'Aug 2026', sales: 310000, recovery: 280000, rate: '90%' },
    { month: 'Sep 2026', sales: 420000, recovery: 365000, rate: '86%' },
    { month: 'Oct 2026', sales: 485000, recovery: 410000, rate: '84%' }
  ];

  // 4. Export CSV Helper
  const exportStockCSV = () => {
    let csv = 'SKU,Bangle Name,Material,HSN,Wholesale Rate/Dz,Total Dozens,Valuation (INR)\n';
    finishedGoods.forEach((fg) => {
      const dz = getTotalDozens(fg.sizesStockDz);
      const val = dz * (fg.wholesaleRatePerDz || 0);
      csv += `"${fg.sku}","${fg.name}","${fg.material}","${fg.hsn}",${fg.wholesaleRatePerDz},${dz},${val}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Qusamba_Inventory_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Inventory Report CSV downloaded!', 'success');
  };

  return (
    <div className="view-container">
      {/* Top Title & Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Analytics & <span className="gold-gradient-text">Wholesale Intelligence</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Comprehensive analysis of sales trends, recovery rates, fast-moving bangle sizes, and material performance.
          </p>
        </div>

        <button className="btn btn-outline" onClick={exportStockCSV}>
          <Download size={16} color="var(--gold-primary)" />
          <span>Export Stock CSV</span>
        </button>
      </div>

      {/* Row 1: Fast-Selling Sizes & Material Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Fast Selling Sizes Analysis */}
        <div className="card card-gold-accent">
          <div className="card-header">
            <h3 className="card-title">
              <Boxes size={18} color="var(--gold-primary)" />
              <span>Fast-Selling Bangle Sizes (2-2 to 2-12)</span>
            </h3>
            <span className="badge badge-gold">Indian Standard Sizes</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sizeStats.map((item) => {
              const pct = Math.round((item.dozens / grandTotalDzSizes) * 100);
              const isDominant = item.size === '2-6' || item.size === '2-8';

              return (
                <div key={item.size} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div 
                    style={{ 
                      width: 50, 
                      fontWeight: 800, 
                      fontSize: '0.85rem', 
                      color: isDominant ? 'var(--gold-light)' : 'var(--text-secondary)',
                      padding: '4px 6px',
                      background: 'var(--bg-input)',
                      border: isDominant ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                      borderRadius: 6,
                      textAlign: 'center'
                    }}
                  >
                    {item.size}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {isDominant ? '⭐ Peak Bridal & Festive Demand' : 'Standard Demand'}
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--gold-light)' }}>
                        {item.dozens} Dz ({pct}%)
                      </span>
                    </div>

                    <div style={{ height: 12, background: 'var(--bg-input)', borderRadius: 9999, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <div 
                        style={{ 
                          width: `${pct * 2}%`, 
                          height: '100%', 
                          background: isDominant ? 'var(--gold-gradient)' : 'linear-gradient(90deg, rgba(226,187,98,0.2) 0%, var(--gold-primary) 100%)', 
                          borderRadius: 9999 
                        }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            * Sizing Insight: Over 60% of all Indian wholesale bangle orders comprise sizes <strong>2-6</strong> and <strong>2-8</strong>. Maintain higher safety inventory on these two sizes.
          </div>
        </div>

        {/* Material & Craft Revenue Analysis */}
        <div className="card card-gold-accent">
          <div className="card-header">
            <h3 className="card-title">
              <Gem size={18} color="var(--gold-primary)" />
              <span>Material Revenue & Stock Mix</span>
            </h3>
            <span className="badge badge-emerald">5 Craft Categories</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {materialStats.map((mat) => {
              const barPct = Math.round((mat.valuation / maxMatValuation) * 100);

              return (
                <div key={mat.material} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {mat.material}
                    </span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className="badge badge-gold">{mat.dozens} Dz</span>
                      <span style={{ fontWeight: 800, color: 'var(--gold-light)', fontSize: '0.9rem' }}>
                        ₹{mat.valuation.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div style={{ height: 10, background: 'var(--bg-input)', borderRadius: 9999, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <div 
                      style={{ 
                        width: `${barPct}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, rgba(226,187,98,0.25) 0%, var(--gold-primary) 100%)', 
                        borderRadius: 9999 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, padding: 14, background: 'rgba(212,175,55,0.06)', borderRadius: 8, border: '1px solid rgba(212,175,55,0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            💡 <strong>High-Margin Notice:</strong> Kundan Glass Kada & Rajasthani Lac yield the highest gross margin (~48%), while Plain Glass Bangles provide the fastest volume turnaround.
          </div>
        </div>
      </div>

      {/* Row 2: Monthly Sales vs Collections Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={18} color="var(--emerald)" />
            <span>Monthly Wholesale Sales vs. Cash Recovery Performance</span>
          </h3>
          <span className="badge badge-emerald">High Liquidity</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Gross Invoiced (₹)</th>
                <th>Collected Payments (₹)</th>
                <th>Uncollected Credit (₹)</th>
                <th>Recovery %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m) => (
                <tr key={m.month}>
                  <td style={{ fontWeight: 700, color: 'var(--gold-light)' }}>{m.month}</td>
                  <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₹{m.sales.toLocaleString('en-IN')}</td>
                  <td style={{ fontWeight: 800, color: 'var(--emerald)' }}>₹{m.recovery.toLocaleString('en-IN')}</td>
                  <td style={{ color: 'var(--ruby)' }}>₹{(m.sales - m.recovery).toLocaleString('en-IN')}</td>
                  <td>
                    <span className="badge badge-emerald" style={{ fontSize: '0.82rem' }}>
                      {m.rate}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-gold">Healthy Cycle</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
