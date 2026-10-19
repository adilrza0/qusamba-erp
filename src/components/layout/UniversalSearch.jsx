import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  X, 
  Sparkles, 
  Gem, 
  Users, 
  FileText, 
  Hammer, 
  Boxes, 
  ArrowRight, 
  CornerDownLeft,
  ExternalLink,
  SlidersHorizontal,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const UniversalSearch = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    finishedGoods, 
    buyers, 
    invoices, 
    karigars, 
    rawMaterials, 
    getTotalDozens,
    setActiveTab,
    setActiveModal,
    setModalData
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'bangles', 'buyers', 'invoices', 'karigars', 'raw'
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut: Ctrl+K or '/' to focus search, Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const query = (searchTerm || '').trim().toLowerCase();
  const queryNormalized = query.replace(/\./g, '-');

  // 1. Bangles / Finished Goods Matching
  const matchedBangles = !query ? [] : finishedGoods.filter((item) => {
    const nameMatch = (item.name || '').toLowerCase().includes(query);
    const skuMatch = (item.sku || '').toLowerCase().includes(query);
    const matMatch = (item.material || '').toLowerCase().includes(query);
    const hsnMatch = (item.hsn || '').toString().includes(query);
    const sizeMatch = Object.keys(item.sizesStockDz || {}).some((sz) => {
      const szNormalized = sz.toLowerCase();
      const szDot = sz.replace('-', '.');
      return (
        (szNormalized.includes(query) || szNormalized.includes(queryNormalized) || szDot.includes(query)) &&
        (item.sizesStockDz[sz] > 0)
      );
    });
    return nameMatch || skuMatch || matMatch || hsnMatch || sizeMatch;
  });

  // 2. Buyers Matching
  const matchedBuyers = !query ? [] : buyers.filter((b) => {
    return (
      (b.name || '').toLowerCase().includes(query) ||
      (b.city || '').toLowerCase().includes(query) ||
      (b.state || '').toLowerCase().includes(query) ||
      (b.contactPerson || '').toLowerCase().includes(query) ||
      (b.gstin || '').toLowerCase().includes(query) ||
      (b.phone || '').toString().includes(query)
    );
  });

  // 3. GST Invoices Matching
  const matchedInvoices = !query ? [] : invoices.filter((inv) => {
    return (
      (inv.invoiceNumber || '').toLowerCase().includes(query) ||
      (inv.buyerName || '').toLowerCase().includes(query) ||
      (inv.buyerGstin || '').toLowerCase().includes(query) ||
      (inv.status || '').toLowerCase().includes(query) ||
      String(inv.grandTotal || '').includes(query)
    );
  });

  // 4. Karigars Matching
  const matchedKarigars = !query ? [] : karigars.filter((k) => {
    return (
      (k.name || '').toLowerCase().includes(query) ||
      (k.craft || '').toLowerCase().includes(query) ||
      (k.village || '').toLowerCase().includes(query) ||
      (k.phone || '').toString().includes(query)
    );
  });

  // 5. Raw Materials Matching
  const matchedRaw = !query ? [] : rawMaterials.filter((rm) => {
    return (
      (rm.name || '').toLowerCase().includes(query) ||
      (rm.category || '').toLowerCase().includes(query) ||
      (rm.supplier || '').toLowerCase().includes(query)
    );
  });

  const totalMatches = 
    matchedBangles.length + 
    matchedBuyers.length + 
    matchedInvoices.length + 
    matchedKarigars.length + 
    matchedRaw.length;

  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSelectBangle = (item) => {
    setActiveTab('inventory');
    setIsOpen(false);
  };

  const handleSelectBuyer = (buyer) => {
    setActiveTab('ledger');
    setIsOpen(false);
  };

  const handleSelectInvoice = (inv) => {
    setModalData(inv);
    setActiveModal('viewInvoice');
    setIsOpen(false);
  };

  const handleSelectKarigar = (k) => {
    setActiveTab('karigar');
    setIsOpen(false);
  };

  const handleSelectRaw = (rm) => {
    setActiveTab('inventory');
    setIsOpen(false);
  };

  return (
    <div className="header-search universal-search-wrapper" ref={searchContainerRef}>
      <Search size={16} className="search-icon" />
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder="Search bangles, sizes (2-6), buyers, invoices..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (searchTerm) setIsOpen(true);
        }}
      />

      {/* Right controls inside input: Clear button and/or shortcut pill */}
      <div className="search-input-right">
        {searchTerm ? (
          <button 
            type="button" 
            className="search-clear-btn" 
            onClick={handleClear} 
            title="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="search-shortcut-kbd">Ctrl+K</kbd>
        )}
      </div>

      {/* Instant Universal Search Dropdown Overlay */}
      {isOpen && query.length > 0 && (
        <div className="universal-search-dropdown">
          {/* Header Bar */}
          <div className="search-dropdown-header">
            <div className="search-result-count-label">
              <Sparkles size={14} color="var(--gold-primary)" />
              <span>
                Found <strong>{totalMatches}</strong> match{totalMatches === 1 ? '' : 'es'} across ERP
              </span>
            </div>

            {/* Quick Category Tabs */}
            <div className="search-category-tabs">
              <button
                type="button"
                className={`search-cat-tab ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All ({totalMatches})
              </button>
              {matchedBangles.length > 0 && (
                <button
                  type="button"
                  className={`search-cat-tab ${activeCategory === 'bangles' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('bangles')}
                >
                  Bangles ({matchedBangles.length})
                </button>
              )}
              {matchedBuyers.length > 0 && (
                <button
                  type="button"
                  className={`search-cat-tab ${activeCategory === 'buyers' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('buyers')}
                >
                  Buyers ({matchedBuyers.length})
                </button>
              )}
              {matchedInvoices.length > 0 && (
                <button
                  type="button"
                  className={`search-cat-tab ${activeCategory === 'invoices' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('invoices')}
                >
                  Invoices ({matchedInvoices.length})
                </button>
              )}
              {matchedKarigars.length > 0 && (
                <button
                  type="button"
                  className={`search-cat-tab ${activeCategory === 'karigars' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('karigars')}
                >
                  Artisans ({matchedKarigars.length})
                </button>
              )}
              {matchedRaw.length > 0 && (
                <button
                  type="button"
                  className={`search-cat-tab ${activeCategory === 'raw' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('raw')}
                >
                  Raw ({matchedRaw.length})
                </button>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="search-dropdown-body">
            {totalMatches === 0 ? (
              <div className="search-no-results">
                <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>🔍</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  No records found for "{searchTerm}"
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto 12px' }}>
                  Search by bangle name, bangle size (e.g. 2-6 or 2.4), buyer city, invoice number (QS/26-27), or artisan name.
                </div>
                <div className="search-sample-tags">
                  <span onClick={() => setSearchTerm('Royal')}>Royal</span>
                  <span onClick={() => setSearchTerm('Bridal')}>Bridal</span>
                  <span onClick={() => setSearchTerm('2-6')}>Size 2-6</span>
                  <span onClick={() => setSearchTerm('Jaipur')}>Jaipur</span>
                  <span onClick={() => setSearchTerm('KGL')}>Karigar Log</span>
                </div>
              </div>
            ) : (
              <>
                {/* 1. BANGLES / DESIGNS */}
                {(activeCategory === 'all' || activeCategory === 'bangles') && matchedBangles.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-title">
                      <Gem size={14} color="var(--gold-primary)" />
                      <span>Bangles & Sizing Inventory ({matchedBangles.length})</span>
                    </div>
                    <div className="search-items-list">
                      {matchedBangles.map((item) => {
                        const totalDz = getTotalDozens(item.sizesStockDz);
                        return (
                          <div
                            key={item.id}
                            className="search-item-card"
                            onClick={() => handleSelectBangle(item)}
                          >
                            <div className="search-item-left">
                              <div className="search-item-icon bg-gold-tint">
                                <Gem size={16} color="var(--gold-primary)" />
                              </div>
                              <div>
                                <div className="search-item-primary">
                                  <span>{item.name}</span>
                                  <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                                    {item.material}
                                  </span>
                                </div>
                                <div className="search-item-secondary">
                                  <span>SKU: {item.sku}</span>
                                  <span>•</span>
                                  <span>HSN: {item.hsn}</span>
                                  <span>•</span>
                                  <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>
                                    {totalDz} Dozens in Stock
                                  </span>
                                </div>
                                {/* Size badges */}
                                <div className="search-item-sizes">
                                  {Object.entries(item.sizesStockDz || {}).map(([sz, qty]) => (
                                    qty > 0 ? (
                                      <span key={sz} className="search-size-chip">
                                        {sz}: <strong>{qty}dz</strong>
                                      </span>
                                    ) : null
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="search-item-right">
                              <div className="search-item-price">
                                ₹{item.wholesaleRatePerDz}/dz
                              </div>
                              <span className="search-jump-hint">
                                Jump to Inventory <ArrowRight size={12} />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. BUYERS & KHATA */}
                {(activeCategory === 'all' || activeCategory === 'buyers') && matchedBuyers.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-title">
                      <Users size={14} color="var(--sapphire)" />
                      <span>Wholesale Buyers & Khata ({matchedBuyers.length})</span>
                    </div>
                    <div className="search-items-list">
                      {matchedBuyers.map((b) => (
                        <div
                          key={b.id}
                          className="search-item-card"
                          onClick={() => handleSelectBuyer(b)}
                        >
                          <div className="search-item-left">
                            <div className="search-item-icon bg-sapphire-tint">
                              <Users size={16} color="var(--sapphire)" />
                            </div>
                            <div>
                              <div className="search-item-primary">
                                <span>{b.name}</span>
                                <span className="badge badge-sapphire" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                                  {b.city}, {b.state}
                                </span>
                              </div>
                              <div className="search-item-secondary">
                                <span>Contact: {b.contactPerson}</span>
                                <span>•</span>
                                <span>Phone: {b.phone}</span>
                                <span>•</span>
                                <span style={{ fontFamily: 'monospace' }}>GSTIN: {b.gstin}</span>
                              </div>
                            </div>
                          </div>
                          <div className="search-item-right">
                            <div className="search-item-price" style={{ color: (b.outstandingBalance || 0) > 0 ? 'var(--ruby)' : 'var(--emerald)' }}>
                              ₹{(b.outstandingBalance || 0).toLocaleString('en-IN')} Due
                            </div>
                            <span className="search-jump-hint">
                              Open Ledger <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. GST INVOICES */}
                {(activeCategory === 'all' || activeCategory === 'invoices') && matchedInvoices.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-title">
                      <FileText size={14} color="var(--emerald)" />
                      <span>GST Tax Invoices ({matchedInvoices.length})</span>
                    </div>
                    <div className="search-items-list">
                      {matchedInvoices.map((inv) => (
                        <div
                          key={inv.id}
                          className="search-item-card"
                          onClick={() => handleSelectInvoice(inv)}
                        >
                          <div className="search-item-left">
                            <div className="search-item-icon bg-emerald-tint">
                              <FileText size={16} color="var(--emerald)" />
                            </div>
                            <div>
                              <div className="search-item-primary">
                                <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>{inv.invoiceNumber}</span>
                                <span 
                                  className={`badge ${inv.status === 'Paid' ? 'badge-emerald' : inv.status === 'Partial' ? 'badge-amber' : 'badge-ruby'}`} 
                                  style={{ fontSize: '0.68rem', padding: '2px 6px' }}
                                >
                                  {inv.status}
                                </span>
                              </div>
                              <div className="search-item-secondary">
                                <span>Buyer: {inv.buyerName}</span>
                                <span>•</span>
                                <span>Date: {inv.date}</span>
                                {inv.balanceDue > 0 && (
                                  <>
                                    <span>•</span>
                                    <span style={{ color: 'var(--ruby)' }}>Bal: ₹{inv.balanceDue?.toLocaleString('en-IN')}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="search-item-right">
                            <div className="search-item-price" style={{ color: 'var(--text-primary)' }}>
                              ₹{(inv.grandTotal || 0).toLocaleString('en-IN')}
                            </div>
                            <span className="search-jump-hint" style={{ color: 'var(--gold-primary)' }}>
                              View & Print Bill <ExternalLink size={12} />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. KARIGARS & ARTISANS */}
                {(activeCategory === 'all' || activeCategory === 'karigars') && matchedKarigars.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-title">
                      <Hammer size={14} color="var(--amber)" />
                      <span>Karigars & Piece-Rate Artisans ({matchedKarigars.length})</span>
                    </div>
                    <div className="search-items-list">
                      {matchedKarigars.map((k) => (
                        <div
                          key={k.id}
                          className="search-item-card"
                          onClick={() => handleSelectKarigar(k)}
                        >
                          <div className="search-item-left">
                            <div className="search-item-icon bg-amber-tint">
                              <Hammer size={16} color="var(--amber)" />
                            </div>
                            <div>
                              <div className="search-item-primary">
                                <span>{k.name}</span>
                                <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                                  {k.craft}
                                </span>
                              </div>
                              <div className="search-item-secondary">
                                <span>Village: {k.village}</span>
                                <span>•</span>
                                <span>Rate: ₹{k.ratePerDz}/dz</span>
                                <span>•</span>
                                <span>Phone: {k.phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="search-item-right">
                            <div className="search-item-price" style={{ color: (k.netPayable || 0) > 0 ? 'var(--emerald)' : 'var(--text-muted)' }}>
                              ₹{(k.netPayable || 0).toLocaleString('en-IN')} Payable
                            </div>
                            <span className="search-jump-hint">
                              Open Karigar Tab <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. RAW MATERIALS */}
                {(activeCategory === 'all' || activeCategory === 'raw') && matchedRaw.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-title">
                      <Boxes size={14} color="var(--gold-light)" />
                      <span>Raw Materials & Packaging ({matchedRaw.length})</span>
                    </div>
                    <div className="search-items-list">
                      {matchedRaw.map((rm) => (
                        <div
                          key={rm.id}
                          className="search-item-card"
                          onClick={() => handleSelectRaw(rm)}
                        >
                          <div className="search-item-left">
                            <div className="search-item-icon bg-gold-tint">
                              <Boxes size={16} color="var(--gold-light)" />
                            </div>
                            <div>
                              <div className="search-item-primary">
                                <span>{rm.name}</span>
                                <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                                  {rm.category}
                                </span>
                              </div>
                              <div className="search-item-secondary">
                                <span>Supplier: {rm.supplier}</span>
                                <span>•</span>
                                <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>
                                  {rm.stockQty} {rm.unit} Available
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="search-item-right">
                            <div className="search-item-price">
                              ₹{rm.ratePerUnit}/{rm.unit}
                            </div>
                            <span className="search-jump-hint">
                              View Stock <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Bar */}
          <div className="search-dropdown-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span>Press <kbd>Esc</kbd> to close</span>
              <span>•</span>
              <span>Click any record to navigate or view invoice</span>
            </div>
            {searchTerm && (
              <button 
                type="button" 
                className="btn btn-ghost btn-sm"
                onClick={handleClear}
                style={{ padding: '2px 8px', fontSize: '0.72rem' }}
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
