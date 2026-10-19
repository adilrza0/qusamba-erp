import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Calculator, 
  Edit, 
  Trash2, 
  Boxes,
  ArrowUpDown,
  SlidersHorizontal
} from 'lucide-react';
import { BANGLE_SIZES, BANGLE_MATERIALS } from '../../data/mockData';

export const InventoryView = () => {
  const { 
    finishedGoods, 
    rawMaterials, 
    getTotalDozens, 
    searchTerm,
    setSearchTerm,
    setActiveModal,
    setModalData,
    deleteFinishedGood,
    deleteRawMaterial
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('finished'); // 'finished' or 'raw'
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [stockFilter, setStockFilter] = useState('All'); // 'All', 'LowStock'

  // Dozen to Box Calculator local state
  const [calcDozens, setCalcDozens] = useState(120);
  const [calcDzPerBox, setCalcDzPerBox] = useState(4);

  const cleanTerm = (searchTerm || '').trim().toLowerCase();
  const cleanTermDash = cleanTerm.replace(/\./g, '-');

  // Filter finished goods
  const filteredFinished = finishedGoods.filter((item) => {
    const matchesSearch = !cleanTerm || (
      (item.name || '').toLowerCase().includes(cleanTerm) ||
      (item.sku || '').toLowerCase().includes(cleanTerm) ||
      (item.material || '').toLowerCase().includes(cleanTerm) ||
      (item.hsn || '').toString().includes(cleanTerm) ||
      Object.keys(item.sizesStockDz || {}).some((sz) => {
        const szLower = sz.toLowerCase();
        const szDot = sz.replace('-', '.');
        return (
          (szLower.includes(cleanTerm) || szLower.includes(cleanTermDash) || szDot.includes(cleanTerm)) &&
          (item.sizesStockDz[sz] > 0)
        );
      })
    );
    
    const matchesMaterial = selectedMaterial === 'All' || item.material === selectedMaterial;
    
    const totalDz = getTotalDozens(item.sizesStockDz);
    const isLow = totalDz <= (item.minStockAlertDz || 40);
    const matchesStock = stockFilter === 'All' || (stockFilter === 'LowStock' && isLow);

    return matchesSearch && matchesMaterial && matchesStock;
  });

  // Filter raw materials
  const filteredRaw = rawMaterials.filter((item) => {
    const matchesSearch = !cleanTerm || (
      (item.name || '').toLowerCase().includes(cleanTerm) ||
      (item.category || '').toLowerCase().includes(cleanTerm) ||
      (item.supplier || '').toLowerCase().includes(cleanTerm)
    );
    
    const isLow = item.stockQty <= (item.minStockAlert || 50);
    const matchesStock = stockFilter === 'All' || (stockFilter === 'LowStock' && isLow);

    return matchesSearch && matchesStock;
  });

  return (
    <div className="view-container">
      {/* Top Header & Quick Converter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Inventory & <span className="gold-gradient-text">Bangle Sizing Matrix</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Live stock counts across standard Indian sizes (2-2 to 2-12), boxes, and raw craft materials.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className="btn btn-outline"
            onClick={() => setActiveModal('stockConverter')}
          >
            <Calculator size={16} color="var(--gold-primary)" />
            <span>Dz ⇄ Box Calculator</span>
          </button>
          
          {activeSubTab === 'finished' ? (
            <button 
              className="btn btn-primary"
              onClick={() => setActiveModal('addFinishedGood')}
            >
              <Plus size={16} />
              <span>+ Add Finished Bangle</span>
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => setActiveModal('addRawMaterial')}
            >
              <Plus size={16} />
              <span>+ Add Raw Material</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs (Finished Goods vs Raw Materials) */}
      <div className="tab-nav" style={{ width: 'fit-content' }}>
        <button 
          className={`tab-btn ${activeSubTab === 'finished' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('finished')}
        >
          <Sparkles size={16} />
          <span>Finished Bangles ({finishedGoods.length})</span>
        </button>
        <button 
          className={`tab-btn ${activeSubTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('raw')}
        >
          <Layers size={16} />
          <span>Raw Materials & Packaging ({rawMaterials.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-bar-left">
          {activeSubTab === 'finished' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="form-label" style={{ margin: 0 }}>Material:</span>
              <select 
                className="form-select" 
                style={{ width: 'auto', padding: '6px 12px', height: 36 }}
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                <option value="All">All Materials</option>
                {BANGLE_MATERIALS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="form-label" style={{ margin: 0 }}>Stock Alert:</span>
            <select 
              className="form-select" 
              style={{ width: 'auto', padding: '6px 12px', height: 36 }}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="All">All Stock Levels</option>
              <option value="LowStock">⚠️ Low Stock Only</option>
            </select>
          </div>
        </div>

        <div className="filter-bar-right">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing {activeSubTab === 'finished' ? filteredFinished.length : filteredRaw.length} items
          </span>
        </div>
      </div>

      {/* TAB CONTENT 1: FINISHED BANGLES */}
      {activeSubTab === 'finished' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>SKU / Design</th>
                  <th>Material / HSN</th>
                  <th>Wholesale Rate</th>
                  {/* Sizing Matrix Column Headers */}
                  {BANGLE_SIZES.map((sz) => (
                    <th key={sz} style={{ textAlign: 'center', color: 'var(--gold-light)' }}>
                      Size {sz}
                    </th>
                  ))}
                  <th style={{ textAlign: 'center' }}>Total Dz</th>
                  <th style={{ textAlign: 'center' }}>Boxes</th>
                  <th className="sticky-action-col" style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFinished.map((item) => {
                  const totalDz = getTotalDozens(item.sizesStockDz);
                  const isLow = totalDz <= (item.minStockAlertDz || 40);
                  const boxesCount = (totalDz / (item.dzPerBox || 4)).toFixed(1);

                  return (
                    <tr key={item.id} style={{ background: isLow ? 'rgba(244, 63, 94, 0.04)' : undefined }}>
                      {/* SKU & Name */}
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--gold-primary)', fontFamily: 'monospace' }}>
                          {item.sku}
                        </div>
                      </td>

                      {/* Material & HSN */}
                      <td>
                        <span className="badge badge-gold" style={{ marginBottom: 4 }}>
                          {item.material}
                        </span>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          HSN: {item.hsn} • {item.dzPerBox} Dz/Box
                        </div>
                      </td>

                      {/* Wholesale Rate */}
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                          ₹{item.wholesaleRatePerDz} <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>/Dz</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          Cost: ₹{item.costPerDz}
                        </div>
                      </td>

                      {/* Size Matrix Stock Columns */}
                      {BANGLE_SIZES.map((sz) => {
                        const count = item.sizesStockDz?.[sz] || 0;
                        return (
                          <td key={sz} style={{ textAlign: 'center' }}>
                            <span className={`size-badge ${count > 0 ? 'has-stock' : 'zero-stock'}`}>
                              {count}
                            </span>
                          </td>
                        );
                      })}

                      {/* Total Dz */}
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${isLow ? 'badge-ruby' : 'badge-emerald'}`} style={{ fontSize: '0.8rem' }}>
                          {totalDz} Dz
                        </span>
                      </td>

                      {/* Boxes */}
                      <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {boxesCount}
                      </td>

                      {/* Actions */}
                      <td className="sticky-action-col" style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setModalData(item);
                              setActiveModal('adjustStock');
                            }}
                            title="Adjust Stock by Size"
                          >
                            <ArrowUpDown size={14} />
                            <span>Adjust</span>
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm btn-icon"
                            onClick={() => {
                              setModalData(item);
                              setActiveModal('editFinishedGood');
                            }}
                            title="Edit Bangle Details"
                          >
                            <Edit size={14} color="var(--gold-light)" />
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm btn-icon"
                            onClick={() => {
                              if (confirm(`Delete bangle "${item.name}"?`)) {
                                deleteFinishedGood(item.id);
                              }
                            }}
                            title="Delete"
                          >
                            <Trash2 size={14} color="var(--ruby)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredFinished.length === 0 && (
                  <tr>
                    <td colSpan={14} style={{ textAlign: 'center', padding: '36px 16px' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 8 }}>
                        No finished bangles matching filters {searchTerm ? `for "${searchTerm}"` : ''}
                      </div>
                      {(searchTerm || selectedMaterial !== 'All' || stockFilter !== 'All') && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedMaterial('All');
                            setStockFilter('All');
                          }}
                        >
                          Reset Filters & Search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: RAW MATERIALS & PACKAGING */}
      {activeSubTab === 'raw' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Material Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                  <th>Unit Cost</th>
                  <th>Supplier / Source</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRaw.map((item) => {
                  const isLow = item.stockQty <= (item.minStockAlert || 50);

                  return (
                    <tr key={item.id} style={{ background: isLow ? 'rgba(244, 63, 94, 0.04)' : undefined }}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--gold-primary)', fontFamily: 'monospace' }}>
                          {item.id}
                        </div>
                      </td>

                      <td>
                        <span className="badge badge-sapphire">{item.category}</span>
                      </td>

                      <td>
                        <span className={`badge ${isLow ? 'badge-ruby' : 'badge-emerald'}`} style={{ fontSize: '0.84rem' }}>
                          {item.stockQty} {item.unit}
                        </span>
                      </td>

                      <td style={{ color: 'var(--text-muted)' }}>
                        {item.minStockAlert} {item.unit}
                      </td>

                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        ₹{item.unitCost} <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>/{item.unit}</span>
                      </td>

                      <td style={{ color: 'var(--text-secondary)' }}>
                        {item.supplier}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setModalData(item);
                              setActiveModal('adjustRawStock');
                            }}
                            title="Receive / Consume Raw Stock"
                          >
                            <ArrowUpDown size={14} />
                            <span>Stock ±</span>
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm btn-icon"
                            onClick={() => {
                              if (confirm(`Remove raw material "${item.name}"?`)) {
                                deleteRawMaterial(item.id);
                              }
                            }}
                            title="Delete"
                          >
                            <Trash2 size={14} color="var(--ruby)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredRaw.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 8 }}>
                        No raw materials matching filters {searchTerm ? `for "${searchTerm}"` : ''}
                      </div>
                      {(searchTerm || stockFilter !== 'All') && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSearchTerm('');
                            setStockFilter('All');
                          }}
                        >
                          Reset Filters & Search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
