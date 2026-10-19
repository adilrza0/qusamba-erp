import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Plus, 
  Trash2, 
  Printer, 
  Calculator, 
  CheckCircle, 
  AlertTriangle, 
  CreditCard, 
  Hammer, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { BANGLE_SIZES, BANGLE_MATERIALS, RAW_MATERIAL_UNITS } from '../../data/mockData';
import confetti from 'canvas-confetti';

// Helper to convert number to Indian words
function numberToWordsINR(num) {
  if (!num || isNaN(num)) return 'Zero Rupees Only';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if ((n = n.toString()).length > 9) return 'Overflow';
    let n_ = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n_) return '';
    let str = '';
    str += (Number(n_[1]) !== 0) ? (a[Number(n_[1])] || b[n_[1][0]] + ' ' + a[n_[1][1]]) + 'Crore ' : '';
    str += (Number(n_[2]) !== 0) ? (a[Number(n_[2])] || b[n_[2][0]] + ' ' + a[n_[2][1]]) + 'Lakh ' : '';
    str += (Number(n_[3]) !== 0) ? (a[Number(n_[3])] || b[n_[3][0]] + ' ' + a[n_[3][1]]) + 'Thousand ' : '';
    str += (Number(n_[4]) !== 0) ? (a[Number(n_[4])] || b[n_[4][0]] + ' ' + a[n_[4][1]]) + 'Hundred ' : '';
    str += (Number(n_[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n_[5])] || b[n_[5][0]] + ' ' + a[n_[5][1]]) : '';
    return str.trim();
  }

  const rounded = Math.round(num);
  return 'Rupees ' + inWords(rounded) + ' Only';
}

export const ModalsContainer = () => {
  const {
    activeModal,
    setActiveModal,
    modalData,
    companyProfile,
    finishedGoods,
    rawMaterials,
    buyers,
    karigars,
    invoices,
    createInvoice,
    generateDummyInvoice,
    recordPayment,
    addFinishedGood,
    updateFinishedGood,
    adjustFinishedStock,
    addRawMaterial,
    adjustRawStock,
    addBuyer,
    addKarigarLog,
    addKarigarAdvance,
    addKarigar,
    showToast
  } = useApp();

  if (!activeModal) return null;

  const closeModal = () => setActiveModal(null);

  return (
    <>
      {activeModal === 'newInvoice' && <NewInvoiceModal onClose={closeModal} />}
      {activeModal === 'viewInvoice' && <ViewInvoiceModal invoice={modalData} onClose={closeModal} />}
      {activeModal === 'recordPayment' && <RecordPaymentModal defaultData={modalData} onClose={closeModal} />}
      {activeModal === 'addFinishedGood' && <AddEditFinishedGoodModal isEdit={false} onClose={closeModal} />}
      {activeModal === 'editFinishedGood' && <AddEditFinishedGoodModal isEdit={true} initialData={modalData} onClose={closeModal} />}
      {activeModal === 'adjustStock' && <AdjustStockModal item={modalData} onClose={closeModal} />}
      {activeModal === 'addRawMaterial' && <AddRawMaterialModal onClose={closeModal} />}
      {activeModal === 'adjustRawStock' && <AdjustRawStockModal item={modalData} onClose={closeModal} />}
      {activeModal === 'addBuyer' && <AddBuyerModal onClose={closeModal} />}
      {activeModal === 'karigarLog' && <KarigarLogModal defaultData={modalData} onClose={closeModal} />}
      {activeModal === 'karigarAdvance' && <KarigarAdvanceModal defaultData={modalData} onClose={closeModal} />}
      {activeModal === 'addKarigar' && <AddKarigarModal onClose={closeModal} />}
      {activeModal === 'stockConverter' && <StockConverterModal onClose={closeModal} />}
      {activeModal === 'newDummyInvoice' && <DummyInvoiceModal onClose={closeModal} />}
    </>
  );
};

// =========================================================================
// 1. NEW GST INVOICE MODAL
// =========================================================================
const NewInvoiceModal = ({ onClose }) => {
  const { buyers, finishedGoods, companyProfile, createInvoice } = useApp();

  const [selectedBuyerId, setSelectedBuyerId] = useState(buyers[0]?.id || '');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [gstRate, setGstRate] = useState(companyProfile.defaultGstRate || 3);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [amountPaidNow, setAmountPaidNow] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState('Credit 30 Days');

  const selectedBuyer = buyers.find((b) => b.id === selectedBuyerId) || buyers[0];
  // Determine if interstate (seller state code !== buyer state code)
  const isInterstate = selectedBuyer ? selectedBuyer.stateCode !== companyProfile.stateCode : true;

  // Invoice line items
  const [items, setItems] = useState([
    {
      itemId: finishedGoods[0]?.id || '',
      itemName: finishedGoods[0]?.name || '',
      hsn: finishedGoods[0]?.hsn || '71179090',
      dzPerBox: finishedGoods[0]?.dzPerBox || 4,
      ratePerDz: finishedGoods[0]?.wholesaleRatePerDz || 300,
      sizes: { '2-4': 20, '2-6': 30, '2-8': 30 }
    }
  ]);

  const handleAddItem = () => {
    const firstFg = finishedGoods[0];
    setItems((prev) => [
      ...prev,
      {
        itemId: firstFg?.id || '',
        itemName: firstFg?.name || '',
        hsn: firstFg?.hsn || '71179090',
        dzPerBox: firstFg?.dzPerBox || 4,
        ratePerDz: firstFg?.wholesaleRatePerDz || 300,
        sizes: { '2-6': 20, '2-8': 20 }
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      if (field === 'itemId') {
        const fg = finishedGoods.find((f) => f.id === value);
        if (fg) {
          updated[index] = {
            ...updated[index],
            itemId: fg.id,
            itemName: fg.name,
            hsn: fg.hsn,
            dzPerBox: fg.dzPerBox || 4,
            ratePerDz: fg.wholesaleRatePerDz
          };
        }
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleSizeQtyChange = (itemIdx, sizeKey, qty) => {
    setItems((prev) => {
      const updated = [...prev];
      const currentSizes = { ...updated[itemIdx].sizes };
      const parsed = Number(qty) || 0;
      if (parsed > 0) {
        currentSizes[sizeKey] = parsed;
      } else {
        delete currentSizes[sizeKey];
      }
      updated[itemIdx].sizes = currentSizes;
      return updated;
    });
  };

  // Calculations
  const calculatedItems = items.map((row) => {
    const totalDozens = Object.values(row.sizes || {}).reduce((sum, q) => sum + (Number(q) || 0), 0);
    const boxes = row.dzPerBox > 0 ? (totalDozens / row.dzPerBox).toFixed(1) : 0;
    const amount = totalDozens * (Number(row.ratePerDz) || 0);
    return {
      ...row,
      totalDozens,
      boxes: Number(boxes),
      amount
    };
  });

  const subtotal = calculatedItems.reduce((sum, it) => sum + it.amount, 0);
  const discountAmount = Math.round((subtotal * (Number(discountPercent) || 0)) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  // GST Calculation (default 3% imitation jewellery/bangles)
  const totalTax = (taxableAmount * Number(gstRate)) / 100;
  const cgstAmount = isInterstate ? 0 : totalTax / 2;
  const sgstAmount = isInterstate ? 0 : totalTax / 2;
  const igstAmount = isInterstate ? totalTax : 0;
  const grandTotal = Math.round(taxableAmount + totalTax);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBuyer) {
      alert('Please select a wholesale buyer');
      return;
    }
    if (calculatedItems.length === 0 || subtotal === 0) {
      alert('Please add at least one bangle item with quantity');
      return;
    }

    const newInvoice = createInvoice({
      date: invoiceDate,
      dueDate,
      buyerId: selectedBuyer.id,
      buyerName: selectedBuyer.name,
      buyerGstin: selectedBuyer.gstin,
      buyerAddress: `${selectedBuyer.address}, ${selectedBuyer.city}, ${selectedBuyer.state}`,
      buyerState: selectedBuyer.state,
      buyerStateCode: selectedBuyer.stateCode,
      isInterstate,
      gstRate: Number(gstRate),
      items: calculatedItems,
      subtotal,
      discountPercent: Number(discountPercent),
      discountAmount,
      taxableAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalTax,
      grandTotal,
      amountPaid: Number(amountPaidNow) || 0,
      paymentTerms
    });

    confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-xl">
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={20} color="var(--gold-primary)" />
            <span>Create Wholesale GST Tax Invoice (कर चालान)</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            {/* Header Buyer & Billing Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Wholesale Buyer <span className="required">*</span></label>
                <select
                  className="form-select"
                  value={selectedBuyerId}
                  onChange={(e) => setSelectedBuyerId(e.target.value)}
                >
                  {buyers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city}, {b.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN / Place of Supply</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontFamily: 'monospace' }}
                  value={`${selectedBuyer?.gstin || ''} (${isInterstate ? 'Inter-state IGST' : 'Intra-state CGST+SGST'})`}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Invoice Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Line Items Table with Sizing Inputs */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--gold-light)' }}>
                  Bangle Items & Size Breakdown (Dozens)
                </span>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleAddItem}>
                  <Plus size={14} />
                  <span>+ Add Item</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {items.map((row, idx) => {
                  const fgMatch = finishedGoods.find((f) => f.id === row.itemId);
                  const totalDz = Object.values(row.sizes || {}).reduce((s, q) => s + (Number(q) || 0), 0);
                  const boxes = row.dzPerBox > 0 ? (totalDz / row.dzPerBox).toFixed(1) : 0;
                  const rowAmount = totalDz * (Number(row.ratePerDz) || 0);

                  return (
                    <div 
                      key={idx}
                      style={{
                        background: 'var(--bg-input)',
                        padding: 16,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {/* Item Top: Select design, HSN, rate */}
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.72rem' }}>Design / SKU</label>
                          <select
                            className="form-select"
                            value={row.itemId}
                            onChange={(e) => handleItemChange(idx, 'itemId', e.target.value)}
                          >
                            {finishedGoods.map((fg) => (
                              <option key={fg.id} value={fg.id}>
                                {fg.name} ({fg.material})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="form-label" style={{ fontSize: '0.72rem' }}>HSN Code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={row.hsn}
                            onChange={(e) => handleItemChange(idx, 'hsn', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontSize: '0.72rem' }}>Rate / Dz (₹)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={row.ratePerDz}
                            onChange={(e) => handleItemChange(idx, 'ratePerDz', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontSize: '0.72rem' }}>Total Row (₹)</label>
                          <div style={{ fontWeight: 800, color: 'var(--gold-light)', padding: '10px 0' }}>
                            ₹{rowAmount.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div>
                          <label className="form-label" style={{ fontSize: '0.72rem', visibility: 'hidden' }}>Del</label>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon"
                            onClick={() => handleRemoveItem(idx)}
                            disabled={items.length === 1}
                          >
                            <Trash2 size={16} color="var(--ruby)" />
                          </button>
                        </div>
                      </div>

                      {/* Sizing Breakdown Grid for this Item */}
                      <div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 700 }}>
                          ENTER QUANTITIES PER BANGLE SIZE (DOZENS):
                        </div>
                        <div className="sizing-matrix-grid">
                          {BANGLE_SIZES.map((sz) => {
                            const val = row.sizes?.[sz] || '';
                            const available = fgMatch?.sizesStockDz?.[sz] || 0;
                            return (
                              <div key={sz} className="sizing-matrix-col">
                                <label>Size {sz}</label>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  className="form-control"
                                  value={val}
                                  onChange={(e) => handleSizeQtyChange(idx, sz, e.target.value)}
                                />
                                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                                  Stock: {available}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, marginTop: 8, fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>
                            Sum Dozens: <strong>{totalDz} Dz</strong>
                          </span>
                          <span style={{ color: 'var(--gold-light)' }}>
                            Equivalent Boxes: <strong>{boxes} Boxes</strong> ({row.dzPerBox} Dz/box)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tax & Discount Summary Calculation */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: 20,
                padding: 16,
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-gold)'
              }}
            >
              <div>
                <div className="form-group">
                  <label className="form-label">Payment Terms & Notes</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="e.g. Credit 30 Days, 50% Advance via RTGS"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Immediate Payment Collected (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={amountPaidNow}
                    onChange={(e) => setAmountPaidNow(e.target.value)}
                    placeholder="0"
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Enter if partial/full payment received at dispatch.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Gross Subtotal:</span>
                  <span style={{ fontWeight: 700 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Trade Discount (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    style={{ width: 80, textAlign: 'right' }}
                    className="form-control"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Taxable Value:</span>
                  <span style={{ fontWeight: 700 }}>₹{taxableAmount.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>GST Rate:</span>
                  <select
                    className="form-select"
                    style={{ width: 140, padding: '4px 8px', height: 32 }}
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                  >
                    <option value={3}>3% (Bangles/Jewel)</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                  </select>
                </div>

                {isInterstate ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sapphire)' }}>
                    <span>IGST ({gstRate}%):</span>
                    <span style={{ fontWeight: 700 }}>₹{Math.round(igstAmount).toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold-light)' }}>
                      <span>CGST ({gstRate / 2}%):</span>
                      <span style={{ fontWeight: 700 }}>₹{Math.round(cgstAmount).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold-light)' }}>
                      <span>SGST ({gstRate / 2}%):</span>
                      <span style={{ fontWeight: 700 }}>₹{Math.round(sgstAmount).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}

                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-gold)',
                    paddingTop: 8,
                    marginTop: 4,
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: 'var(--gold-light)'
                  }}
                >
                  <span>Grand Total:</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Sparkles size={16} />
              <span>Generate & Save GST Tax Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 2. VIEW & PRINT GST TAX INVOICE MODAL (A4 Authentic Layout)
// =========================================================================
const ViewInvoiceModal = ({ invoice, onClose }) => {
  const { companyProfile } = useApp();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const isDummy = invoice.isDummy;

  return (
    <div className="modal-overlay print-active-modal">
      <div className="modal-content modal-content-xl" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
        {/* Modal Controls (Hidden in Print) */}
        <div className="modal-header no-print" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div className="modal-title" style={{ color: '#0f172a' }}>
            <Printer size={20} color="var(--gold-primary)" />
            <span>{isDummy ? 'Estimate Preview' : 'Tax Invoice Preview'}: {invoice.invoiceNumber}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <button className="btn btn-ghost btn-sm" style={{ color: '#475569' }} onClick={onClose}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* Printable A4 Sheet — Minimalist Editorial */}
        <div className="modal-body print-invoice-sheet" style={{ padding: '40px 48px', background: '#ffffff', color: '#111827' }}>

          {/* Minimalist Letterhead — No Logo */}
          <div className="invoice-header-grid">
            <div>
              <div className="invoice-brand-title">{companyProfile.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, marginTop: 2 }}>{companyProfile.tradeName}</div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: 4 }}>{companyProfile.address}, {companyProfile.city} - {companyProfile.pincode}, {companyProfile.state}</div>
              <div style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 600, marginTop: 2, fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                GSTIN {companyProfile.gstin} · PAN {companyProfile.pan} · State {companyProfile.stateCode}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              {isDummy ? (
                <div className="invoice-meta-badge dummy-badge">Estimate / Quotation</div>
              ) : (
                <div className="invoice-meta-badge">Original for Recipient</div>
              )}
              <div style={{ marginTop: 10, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                {invoice.invoiceNumber}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4, lineHeight: 1.6 }}>
                Date: {invoice.date}<br />
                Due: {invoice.dueDate}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Supply: {invoice.buyerState} ({invoice.buyerStateCode})</div>
            </div>
          </div>

          {/* Document Type Label */}
          <div style={{ textAlign: 'center', margin: '4px 0 18px', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#94a3b8', fontWeight: 600 }}>
            {isDummy ? 'Estimate / Quotation — Not a Tax Document' : 'Tax Invoice · Section 31, CGST Act 2017'}
          </div>

          {/* Buyer Details */}
          <div className="invoice-parties-grid">
            <div className="party-box">
              <h4>Billed To</h4>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{invoice.buyerName}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>{invoice.buyerAddress}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: 4, color: '#334155', fontFamily: 'monospace' }}>
                GSTIN {invoice.buyerGstin || 'Unregistered'}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{invoice.buyerState} ({invoice.buyerStateCode})</div>
            </div>

            <div className="party-box">
              <h4>Shipped To</h4>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{invoice.buyerName}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>{invoice.buyerAddress}</div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: 4 }}>Terms: {invoice.paymentTerms}</div>
            </div>
          </div>

          {/* Goods Table */}
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}>#</th>
                <th>Description</th>
                <th>HSN</th>
                <th>Size Breakdown</th>
                <th style={{ textAlign: 'center' }}>Qty (Dz)</th>
                <th style={{ textAlign: 'center' }}>Boxes</th>
                <th style={{ textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((it, idx) => {
                const sizeStr = Object.entries(it.sizes || {})
                  .map(([s, q]) => `${s}: ${q}`)
                  .join(' · ');

                return (
                  <tr key={idx}>
                    <td style={{ color: '#94a3b8' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{it.itemName}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>{it.hsn}</td>
                    <td style={{ fontSize: '0.76rem', color: '#64748b' }}>{sizeStr}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{it.totalDozens}</td>
                    <td style={{ textAlign: 'center', color: '#64748b' }}>{it.boxes}</td>
                    <td style={{ textAlign: 'right', color: '#475569' }}>₹{it.ratePerDz}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{it.amount?.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals Box */}
          <div className="invoice-totals-box">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>₹{invoice.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="totals-row" style={{ color: '#ef4444' }}>
                <span>Discount ({invoice.discountPercent}%)</span>
                <span>−₹{invoice.discountAmount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="totals-row">
              <span>Taxable Value</span>
              <span style={{ fontWeight: 600 }}>₹{Math.round(invoice.taxableAmount || 0).toLocaleString('en-IN')}</span>
            </div>

            {invoice.isInterstate ? (
              <div className="totals-row">
                <span>IGST @ {invoice.gstRate}%</span>
                <span>₹{Math.round(invoice.igstAmount || 0).toLocaleString('en-IN')}</span>
              </div>
            ) : (
              <>
                <div className="totals-row">
                  <span>CGST @ {invoice.gstRate / 2}%</span>
                  <span>₹{Math.round(invoice.cgstAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="totals-row">
                  <span>SGST @ {invoice.gstRate / 2}%</span>
                  <span>₹{Math.round(invoice.sgstAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </>
            )}

            <div className="totals-row grand-total">
              <span>Total</span>
              <span>₹{invoice.grandTotal?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Total in words */}
          <div style={{ padding: '8px 0', marginBottom: 20, fontSize: '0.8rem', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
            <strong style={{ color: '#334155' }}>{numberToWordsINR(invoice.grandTotal)}</strong>
          </div>

          {/* Footer — Banking & Signature */}
          <div className="invoice-footer-grid">
            <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.8 }}>
              <div style={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 6 }}>
                Payment Details
              </div>
              <div>{companyProfile.bankName} — {companyProfile.bankBranch}</div>
              <div>A/C <span style={{ fontFamily: 'monospace' }}>{companyProfile.accountNumber}</span></div>
              <div>IFSC <span style={{ fontFamily: 'monospace' }}>{companyProfile.ifsc}</span></div>
              <div>UPI {companyProfile.upiId}</div>

              {companyProfile.terms?.length > 0 && (
                <div style={{ marginTop: 12, fontSize: '0.72rem', color: '#94a3b8' }}>
                  <div style={{ fontWeight: 600, color: '#64748b', marginBottom: 2 }}>Terms</div>
                  {companyProfile.terms.map((t, i) => (
                    <div key={i}>{t}</div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', textAlign: 'right' }}>
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#334155' }}>
                  For {companyProfile.name}
                </div>
                <div style={{ height: 44 }}></div>
                <div style={{ fontSize: '0.7rem', borderTop: '1px solid #cbd5e1', paddingTop: 4, color: '#94a3b8' }}>
                  Authorized Signatory
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Hidden in Print) */}
        <div className="modal-footer no-print" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <button className="btn btn-outline" onClick={onClose}>
            Back to Invoices
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Invoice (A4)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2b. DUMMY / ESTIMATE INVOICE MODAL (No DB Changes)
// =========================================================================
const DummyInvoiceModal = ({ onClose }) => {
  const { buyers, finishedGoods, companyProfile, generateDummyInvoice } = useApp();

  const [selectedBuyerId, setSelectedBuyerId] = useState(buyers[0]?.id || '');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [gstRate, setGstRate] = useState(companyProfile.defaultGstRate || 3);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState('Estimate Only');

  const selectedBuyer = buyers.find((b) => b.id === selectedBuyerId) || buyers[0];
  const isInterstate = selectedBuyer ? selectedBuyer.stateCode !== companyProfile.stateCode : true;

  const [items, setItems] = useState([
    {
      itemId: finishedGoods[0]?.id || '',
      itemName: finishedGoods[0]?.name || '',
      hsn: finishedGoods[0]?.hsn || '71179090',
      dzPerBox: finishedGoods[0]?.dzPerBox || 4,
      ratePerDz: finishedGoods[0]?.wholesaleRatePerDz || 300,
      sizes: { '2-4': 10, '2-6': 15, '2-8': 15 }
    }
  ]);

  const handleAddItem = () => {
    const firstFg = finishedGoods[0];
    setItems((prev) => [
      ...prev,
      {
        itemId: firstFg?.id || '',
        itemName: firstFg?.name || '',
        hsn: firstFg?.hsn || '71179090',
        dzPerBox: firstFg?.dzPerBox || 4,
        ratePerDz: firstFg?.wholesaleRatePerDz || 300,
        sizes: { '2-6': 10 }
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      if (field === 'itemId') {
        const fg = finishedGoods.find((f) => f.id === value);
        if (fg) {
          updated[index] = {
            ...updated[index],
            itemId: fg.id,
            itemName: fg.name,
            hsn: fg.hsn,
            dzPerBox: fg.dzPerBox || 4,
            ratePerDz: fg.wholesaleRatePerDz
          };
        }
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleSizeQtyChange = (itemIdx, sizeKey, qty) => {
    setItems((prev) => {
      const updated = [...prev];
      const currentSizes = { ...updated[itemIdx].sizes };
      const parsed = Number(qty) || 0;
      if (parsed > 0) {
        currentSizes[sizeKey] = parsed;
      } else {
        delete currentSizes[sizeKey];
      }
      updated[itemIdx].sizes = currentSizes;
      return updated;
    });
  };

  // Calculations
  const calculatedItems = items.map((row) => {
    const totalDozens = Object.values(row.sizes || {}).reduce((sum, q) => sum + (Number(q) || 0), 0);
    const boxes = row.dzPerBox > 0 ? (totalDozens / row.dzPerBox).toFixed(1) : 0;
    const amount = totalDozens * (Number(row.ratePerDz) || 0);
    return {
      ...row,
      totalDozens,
      boxes: Number(boxes),
      amount
    };
  });

  const subtotal = calculatedItems.reduce((sum, it) => sum + it.amount, 0);
  const discountAmount = Math.round((subtotal * (Number(discountPercent) || 0)) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  const totalTax = (taxableAmount * Number(gstRate)) / 100;
  const cgstAmount = isInterstate ? 0 : totalTax / 2;
  const sgstAmount = isInterstate ? 0 : totalTax / 2;
  const igstAmount = isInterstate ? totalTax : 0;
  const grandTotal = Math.round(taxableAmount + totalTax);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBuyer) {
      alert('Please select a buyer');
      return;
    }
    if (calculatedItems.length === 0 || subtotal === 0) {
      alert('Add at least one item with quantity');
      return;
    }

    generateDummyInvoice({
      date: invoiceDate,
      dueDate,
      buyerId: selectedBuyer.id,
      buyerName: selectedBuyer.name,
      buyerGstin: selectedBuyer.gstin,
      buyerAddress: `${selectedBuyer.address}, ${selectedBuyer.city}, ${selectedBuyer.state}`,
      buyerState: selectedBuyer.state,
      buyerStateCode: selectedBuyer.stateCode,
      isInterstate,
      gstRate: Number(gstRate),
      items: calculatedItems,
      subtotal,
      discountPercent: Number(discountPercent),
      discountAmount,
      taxableAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalTax,
      grandTotal,
      amountPaid: 0,
      paymentTerms
    });
    // generateDummyInvoice already opens the viewInvoice modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-xl">
        <div className="modal-header">
          <div className="modal-title">
            <Calculator size={20} color="var(--amber)" />
            <span>Generate Dummy Invoice / Estimate (No Sales Impact)</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Amber notice strip */}
        <div style={{
          background: 'var(--amber-bg)',
          border: '1px solid var(--amber-border)',
          color: 'var(--amber)',
          padding: '8px 16px',
          fontSize: '0.78rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <AlertTriangle size={14} />
          <span>This is a dummy/estimate invoice. It will NOT be saved to sales records, inventory, or ledger.</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            {/* Header Buyer & Billing Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Buyer <span className="required">*</span></label>
                <select
                  className="form-select"
                  value={selectedBuyerId}
                  onChange={(e) => setSelectedBuyerId(e.target.value)}
                >
                  {buyers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city}, {b.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN / Supply Type</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontFamily: 'monospace' }}
                  value={`${selectedBuyer?.gstin || ''} (${isInterstate ? 'IGST' : 'CGST+SGST'})`}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valid Until</label>
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Line Items */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  Items & Size Breakdown
                </span>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleAddItem}>
                  <Plus size={14} />
                  <span>+ Add Item</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {items.map((row, idx) => {
                  const totalDz = Object.values(row.sizes || {}).reduce((s, q) => s + (Number(q) || 0), 0);
                  const boxes = row.dzPerBox > 0 ? (totalDz / row.dzPerBox).toFixed(1) : 0;
                  const rowAmount = totalDz * (Number(row.ratePerDz) || 0);

                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-input)',
                        padding: 16,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.72rem' }}>Design / SKU</label>
                          <select
                            className="form-select"
                            value={row.itemId}
                            onChange={(e) => handleItemChange(idx, 'itemId', e.target.value)}
                          >
                            {finishedGoods.map((fg) => (
                              <option key={fg.id} value={fg.id}>
                                {fg.name} ({fg.material})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="form-label" style={{ fontSize: '0.72rem' }}>HSN Code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={row.hsn}
                            onChange={(e) => handleItemChange(idx, 'hsn', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontSize: '0.72rem' }}>Rate / Dz (₹)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={row.ratePerDz}
                            onChange={(e) => handleItemChange(idx, 'ratePerDz', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontSize: '0.72rem' }}>Row Total (₹)</label>
                          <div style={{ fontWeight: 800, color: 'var(--amber)', padding: '10px 0' }}>
                            ₹{rowAmount.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div>
                          <label className="form-label" style={{ fontSize: '0.72rem', visibility: 'hidden' }}>Del</label>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon"
                            onClick={() => handleRemoveItem(idx)}
                            disabled={items.length === 1}
                          >
                            <Trash2 size={16} color="var(--ruby)" />
                          </button>
                        </div>
                      </div>

                      {/* Size Grid */}
                      <div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 700 }}>
                          QUANTITIES PER SIZE (DOZENS):
                        </div>
                        <div className="sizing-matrix-grid">
                          {BANGLE_SIZES.map((sz) => {
                            const val = row.sizes?.[sz] || '';
                            return (
                              <div key={sz} className="sizing-matrix-col">
                                <label>Size {sz}</label>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  className="form-control"
                                  value={val}
                                  onChange={(e) => handleSizeQtyChange(idx, sz, e.target.value)}
                                />
                              </div>
                            );
                          })}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, marginTop: 8, fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>
                            Dozens: <strong>{totalDz} Dz</strong>
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            Boxes: <strong>{boxes}</strong> ({row.dzPerBox} Dz/box)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tax & Discount Summary */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: 20,
                padding: 16,
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--amber-border)'
              }}
            >
              <div>
                <div className="form-group">
                  <label className="form-label">Notes / Terms</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="Estimate Only / Quotation Valid 15 Days"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: 700 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Discount (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    style={{ width: 80, textAlign: 'right' }}
                    className="form-control"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Taxable:</span>
                  <span style={{ fontWeight: 700 }}>₹{taxableAmount.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>GST Rate:</span>
                  <select
                    className="form-select"
                    style={{ width: 140, padding: '4px 8px', height: 32 }}
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                  >
                    <option value={3}>3% (Bangles)</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                  </select>
                </div>

                {isInterstate ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sapphire)' }}>
                    <span>IGST ({gstRate}%):</span>
                    <span style={{ fontWeight: 700 }}>₹{Math.round(igstAmount).toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>CGST ({gstRate / 2}%):</span>
                      <span style={{ fontWeight: 700 }}>₹{Math.round(cgstAmount).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>SGST ({gstRate / 2}%):</span>
                      <span style={{ fontWeight: 700 }}>₹{Math.round(sgstAmount).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--amber-border)',
                    paddingTop: 8,
                    marginTop: 4,
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: 'var(--amber)'
                  }}
                >
                  <span>Estimate Total:</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-secondary" style={{ borderColor: 'var(--amber-border)', color: 'var(--amber)' }}>
              <Calculator size={16} />
              <span>Generate Dummy Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 3. RECORD PAYMENT MODAL
// =========================================================================
const RecordPaymentModal = ({ defaultData, onClose }) => {
  const { buyers, invoices, recordPayment } = useApp();

  const [buyerId, setBuyerId] = useState(defaultData?.defaultBuyerId || buyers[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('UPI');
  const [refNumber, setRefNumber] = useState('');
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState('On Account');
  const [notes, setNotes] = useState('Wholesale credit recovery');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const targetBuyer = buyers.find((b) => b.id === buyerId);
  const buyerInvoices = invoices.filter((inv) => inv.buyerId === buyerId && inv.balanceDue > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    recordPayment({
      buyerId,
      amount: num,
      mode,
      refNumber,
      invoiceNumber: selectedInvoiceNumber,
      notes,
      date: paymentDate
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <CreditCard size={20} color="var(--emerald)" />
            <span>Record Wholesale Credit Collection</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Wholesale Buyer <span className="required">*</span></label>
              <select
                className="form-select"
                value={buyerId}
                onChange={(e) => setBuyerId(e.target.value)}
                required
              >
                {buyers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (Due: ₹{b.outstandingBalance?.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {targetBuyer && (
              <div style={{ padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 6, marginBottom: 14, fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Outstanding Balance:</span>
                <span style={{ fontWeight: 800, color: 'var(--ruby)' }}>₹{targetBuyer.outstandingBalance?.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Amount Collected (₹) <span className="required">*</span></label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  style={{ fontSize: '1.1rem', fontWeight: 800 }}
                  placeholder="e.g. 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-select"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="NEFT / RTGS">Bank Transfer (NEFT / RTGS)</option>
                  <option value="Cash">Cash Counter Receipt</option>
                  <option value="Cheque">Bank Cheque</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">UTR / Reference / Cheque No.</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. UTR88992211"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Apply Against Specific Invoice</label>
              <select
                className="form-select"
                value={selectedInvoiceNumber}
                onChange={(e) => setSelectedInvoiceNumber(e.target.value)}
              >
                <option value="On Account">On Account / General Credit Balance</option>
                {buyerInvoices.map((inv) => (
                  <option key={inv.id} value={inv.invoiceNumber}>
                    {inv.invoiceNumber} (Bal: ₹{inv.balanceDue?.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Remarks</label>
              <input
                type="text"
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CreditCard size={16} />
              <span>Record & Credit Buyer Ledger</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 4. ADD / EDIT FINISHED BANGLE DESIGN MODAL
// =========================================================================
const AddEditFinishedGoodModal = ({ isEdit, initialData, onClose }) => {
  const { addFinishedGood, updateFinishedGood } = useApp();

  const [formData, setFormData] = useState(() => {
    if (isEdit && initialData) {
      return { ...initialData };
    }
    return {
      sku: `QS-${Date.now().toString().slice(-4)}`,
      name: '',
      material: 'Glass',
      category: 'Bridal Set',
      hsn: '70181010',
      dzPerBox: 4,
      costPerDz: 150,
      wholesaleRatePerDz: 280,
      minStockAlertDz: 40,
      sizesStockDz: {
        '2-2': 10,
        '2-4': 30,
        '2-6': 50,
        '2-8': 50,
        '2-10': 20,
        '2-12': 5
      },
      description: ''
    };
  });

  const handleSizeChange = (sz, val) => {
    setFormData((prev) => ({
      ...prev,
      sizesStockDz: {
        ...prev.sizesStockDz,
        [sz]: Number(val) || 0
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter bangle name');
      return;
    }

    if (isEdit) {
      updateFinishedGood(initialData.id, formData);
    } else {
      addFinishedGood(formData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-lg">
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={20} color="var(--gold-primary)" />
            <span>{isEdit ? 'Edit Bangle Details' : 'Add New Finished Bangle Design'}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">SKU / Code <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontFamily: 'monospace' }}
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bangle Design Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Royal Kundan Velvet Chuda Set"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Material / Craft</label>
                <select
                  className="form-select"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                >
                  {BANGLE_MATERIALS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">HSN Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.hsn}
                  onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dozens Per Box</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.dzPerBox}
                  onChange={(e) => setFormData({ ...formData, dzPerBox: Number(e.target.value) || 4 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Wholesale Rate (₹/Dz) <span className="required">*</span></label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.wholesaleRatePerDz}
                  onChange={(e) => setFormData({ ...formData, wholesaleRatePerDz: Number(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Manufacturing Cost (₹/Dz)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={formData.costPerDz}
                  onChange={(e) => setFormData({ ...formData, costPerDz: Number(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Low Stock Alert (Dz)</label>
                <input
                  type="number"
                  min="5"
                  className="form-control"
                  value={formData.minStockAlertDz}
                  onChange={(e) => setFormData({ ...formData, minStockAlertDz: Number(e.target.value) || 40 })}
                />
              </div>
            </div>

            {/* Sizing Initial Stock Matrix */}
            <div style={{ marginTop: 10 }}>
              <label className="form-label">Opening Stock Per Size (Dozens)</label>
              <div className="sizing-matrix-grid">
                {BANGLE_SIZES.map((sz) => (
                  <div key={sz} className="sizing-matrix-col">
                    <label>Size {sz}</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={formData.sizesStockDz?.[sz] || 0}
                      onChange={(e) => handleSizeChange(sz, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Craft Details / Description</label>
              <textarea
                className="form-control"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details on stones, core material, plating..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Sparkles size={16} />
              <span>{isEdit ? 'Save Changes' : 'Add to Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 5. ADJUST FINISHED STOCK MODAL
// =========================================================================
const AdjustStockModal = ({ item, onClose }) => {
  const { adjustFinishedStock } = useApp();

  const [sizeKey, setSizeKey] = useState('2-6');
  const [deltaQty, setDeltaQty] = useState('');
  const [operation, setOperation] = useState('add'); // 'add' or 'subtract'
  const [reason, setReason] = useState('Workshop Production Batch Inflow');

  if (!item) return null;

  const currentStock = item.sizesStockDz?.[sizeKey] || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(deltaQty);
    if (!qty || qty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    const signedQty = operation === 'add' ? qty : -qty;
    adjustFinishedStock(item.id, sizeKey, signedQty, reason);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <Calculator size={20} color="var(--gold-primary)" />
            <span>Stock Adjustment: {item.name}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Select Bangle Size</label>
                <select
                  className="form-select"
                  value={sizeKey}
                  onChange={(e) => setSizeKey(e.target.value)}
                >
                  {BANGLE_SIZES.map((sz) => (
                    <option key={sz} value={sz}>
                      Size {sz} (Current: {item.sizesStockDz?.[sz] || 0} Dz)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Action</label>
                <select
                  className="form-select"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                >
                  <option value="add">+ Add Stock (Inflow / Workshop Batch)</option>
                  <option value="subtract">- Deduct Stock (Sample / Breakage / Loss)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity in Dozens (Dz) <span className="required">*</span></label>
              <input
                type="number"
                min="1"
                className="form-control"
                style={{ fontSize: '1.1rem', fontWeight: 700 }}
                value={deltaQty}
                onChange={(e) => setDeltaQty(e.target.value)}
                placeholder="e.g. 20"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Adjustment Reason</label>
              <select
                className="form-select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Workshop Production Batch Inflow">Workshop Production Batch Inflow</option>
                <option value="Wholesale Sample Kit Dispatch">Wholesale Sample Kit Dispatch</option>
                <option value="Factory Breakage / Annealing Defect">Factory Breakage / Annealing Defect</option>
                <option value="Physical Stock Audit Correction">Physical Stock Audit Correction</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Stock Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 6. ADD RAW MATERIAL MODAL
// =========================================================================
const AddRawMaterialModal = ({ onClose }) => {
  const { addRawMaterial } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Glass Base',
    stockQty: 100,
    unit: 'Kg',
    unitCost: 50,
    minStockAlert: 30,
    supplier: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter raw material name');
      return;
    }
    addRawMaterial({
      ...formData,
      stockQty: Number(formData.stockQty) || 0,
      unitCost: Number(formData.unitCost) || 0,
      minStockAlert: Number(formData.minStockAlert) || 0
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={20} color="var(--sapphire)" />
            <span>Add Raw Craft Material / Packaging</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Material Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Pure Rajasthani Lac Slabs"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Resin / Packaging / Stones"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Measurement Unit</label>
                <select
                  className="form-select"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  {RAW_MATERIAL_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Opening Stock</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={formData.stockQty}
                  onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cost per Unit (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reorder Alert</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={formData.minStockAlert}
                  onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Supplier / Source Mill</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Firozabad Silica Furnaces Ltd"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Raw Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 7. ADJUST RAW STOCK MODAL
// =========================================================================
const AdjustRawStockModal = ({ item, onClose }) => {
  const { adjustRawStock } = useApp();

  const [qty, setQty] = useState('');
  const [isDeduct, setIsDeduct] = useState(false);

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(qty);
    if (!num || num <= 0) return;

    adjustRawStock(item.id, isDeduct ? -num : num);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <span>Stock Adjustment: {item.name}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 6, marginBottom: 14 }}>
              Current Stock: <strong>{item.stockQty} {item.unit}</strong>
            </div>

            <div className="form-group">
              <label className="form-label">Operation</label>
              <select
                className="form-select"
                value={isDeduct ? 'deduct' : 'add'}
                onChange={(e) => setIsDeduct(e.target.value === 'deduct')}
              >
                <option value="add">+ Receive Inflow / Supplier Delivery</option>
                <option value="deduct">- Issue to Workshop / Karigar Consumption</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity ({item.unit}) <span className="required">*</span></label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="e.g. 50"
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Update Stock</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 8. ADD BUYER MODAL
// =========================================================================
const AddBuyerModal = ({ onClose }) => {
  const { addBuyer } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    state: 'Rajasthan',
    stateCode: '08',
    address: '',
    gstin: '',
    creditLimit: 500000,
    paymentTermsDays: 30
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter buyer firm name');
      return;
    }
    addBuyer({
      ...formData,
      creditLimit: Number(formData.creditLimit) || 0,
      paymentTermsDays: Number(formData.paymentTermsDays) || 30
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-lg">
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={20} color="var(--gold-primary)" />
            <span>Add Wholesale Buyer / Distributor</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Firm / Business Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Hyderabad Lad Bazaar Bangles"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Phone / WhatsApp <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN (15 Digits)</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                  placeholder="24AAACS1122D1Z9"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Surat"
                />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Gujarat"
                />
              </div>

              <div className="form-group">
                <label className="form-label">State Code</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontFamily: 'monospace', textAlign: 'center' }}
                  value={formData.stateCode}
                  onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
                  placeholder="24"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Shop / Wholesale Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Credit Limit (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Terms (Days)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={formData.paymentTermsDays}
                  onChange={(e) => setFormData({ ...formData, paymentTermsDays: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Wholesale Buyer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 9. KARIGAR PRODUCTION LOG ENTRY MODAL
// =========================================================================
const KarigarLogModal = ({ defaultData, onClose }) => {
  const { karigars, finishedGoods, addKarigarLog } = useApp();

  const [karigarId, setKarigarId] = useState(defaultData?.defaultKarigarId || karigars[0]?.id || '');
  const [itemId, setItemId] = useState(finishedGoods[0]?.id || '');
  const [dozens, setDozens] = useState(50);
  const [ratePerDz, setRatePerDz] = useState(() => {
    const k = karigars.find((kar) => kar.id === (defaultData?.defaultKarigarId || karigars[0]?.id));
    return k?.ratePerDz || 20;
  });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('Clean jointing and packaging done');
  const [autoAddStock, setAutoAddStock] = useState(true);

  const selectedKarigar = karigars.find((k) => k.id === karigarId);

  useEffect(() => {
    if (selectedKarigar) {
      setRatePerDz(selectedKarigar.ratePerDz || 20);
    }
  }, [karigarId]);

  const grossAmount = (Number(dozens) || 0) * (Number(ratePerDz) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!karigarId || !dozens) return;

    addKarigarLog({
      karigarId,
      itemId,
      dozens: Number(dozens),
      ratePerDz: Number(ratePerDz),
      date,
      notes,
      autoAddStock
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <Hammer size={20} color="var(--amber)" />
            <span>Log Karigar Daily Production (Piece-Rate)</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Karigar / Artisan <span className="required">*</span></label>
              <select
                className="form-select"
                value={karigarId}
                onChange={(e) => setKarigarId(e.target.value)}
              >
                {karigars.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name} - {k.craft} (Base: ₹{k.ratePerDz}/Dz)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bangle Design Worked On</label>
              <select
                className="form-select"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
              >
                {finishedGoods.map((fg) => (
                  <option key={fg.id} value={fg.id}>
                    {fg.name} ({fg.material})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Dozens Completed (Dz) <span className="required">*</span></label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  style={{ fontSize: '1.1rem', fontWeight: 700 }}
                  value={dozens}
                  onChange={(e) => setDozens(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Piece Rate (₹/Dz) <span className="required">*</span></label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={ratePerDz}
                  onChange={(e) => setRatePerDz(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Calculated Gross Payout:</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald)' }}>
                ₹{grossAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={autoAddStock}
                  onChange={(e) => setAutoAddStock(e.target.checked)}
                />
                <span>Automatically add completed dozens to Finished Goods Inventory</span>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Work Log Remarks</label>
              <input
                type="text"
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Production Log</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 10. KARIGAR CASH ADVANCE MODAL
// =========================================================================
const KarigarAdvanceModal = ({ defaultData, onClose }) => {
  const { karigars, addKarigarAdvance } = useApp();

  const [karigarId, setKarigarId] = useState(defaultData?.defaultKarigarId || karigars[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('Cash');
  const [reason, setReason] = useState('Festival / Weekly Grocery advance');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) return;

    addKarigarAdvance({
      karigarId,
      amount: num,
      mode,
      reason,
      date
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <span>Issue Cash Advance to Artisan</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Karigar / Artisan</label>
              <select
                className="form-select"
                value={karigarId}
                onChange={(e) => setKarigarId(e.target.value)}
              >
                {karigars.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name} (Net Due: ₹{k.netPayable?.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Advance Amount (₹) <span className="required">*</span></label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  style={{ fontSize: '1.1rem', fontWeight: 700 }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-select"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="Cash">Cash Counter</option>
                  <option value="UPI">UPI (PhonePe/GPay)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Advance Voucher</label>
              <input
                type="text"
                className="form-control"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Deduct & Issue Advance</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 11. ADD KARIGAR ARTISAN MODAL
// =========================================================================
const AddKarigarModal = ({ onClose }) => {
  const { addKarigar } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    craft: 'Velvet Winding & Base Bonding',
    phone: '',
    village: 'Jaipur Workshop',
    ratePerDz: 20
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addKarigar({
      ...formData,
      ratePerDz: Number(formData.ratePerDz) || 20
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <span>Register New Artisan / Karigar Unit</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Artisan Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Ramesh Chandra"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Craft Speciality</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Kundan Stone Setting / Glass Jointing"
                value={formData.craft}
                onChange={(e) => setFormData({ ...formData, craft: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Base Piece-Rate (₹/Dz) <span className="required">*</span></label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.ratePerDz}
                  onChange={(e) => setFormData({ ...formData, ratePerDz: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Workshop / Cluster Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Amer Craft Cluster"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Register Karigar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 12. DOZEN ⇄ BOXES CONVERTER TOOL MODAL
// =========================================================================
const StockConverterModal = ({ onClose }) => {
  const [dzInput, setDzInput] = useState(120);
  const [dzPerBox, setDzPerBox] = useState(4);

  const boxes = dzPerBox > 0 ? (dzInput / dzPerBox).toFixed(2) : 0;
  const totalBangles = dzInput * 12;
  const totalGross = (dzInput / 12).toFixed(2); // 1 Gross = 12 Dozens

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <Calculator size={20} color="var(--gold-primary)" />
            <span>Wholesale Packaging Unit Calculator</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            Instantly convert wholesale quantities between Dozens (Dz), Boxes, Gross (144 pcs), and individual Bangles.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Dozens Quantity (Dz)</label>
              <input
                type="number"
                min="1"
                className="form-control"
                style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-light)' }}
                value={dzInput}
                onChange={(e) => setDzInput(Number(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dozens Per Inner Box</label>
              <select
                className="form-select"
                value={dzPerBox}
                onChange={(e) => setDzPerBox(Number(e.target.value) || 4)}
              >
                <option value={2}>2 Dz / Box (Heavy Kadas)</option>
                <option value={4}>4 Dz / Box (Standard Bridal Set)</option>
                <option value={6}>6 Dz / Box (Velvet Chuda)</option>
                <option value={12}>12 Dz / Box (Plain Glass Gross Box)</option>
              </select>
            </div>
          </div>

          {/* Results Display */}
          <div 
            style={{
              marginTop: 18,
              padding: 18,
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-gold)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 14,
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Wholesale Boxes
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                {boxes}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Inner Cartons</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Gross (Gr)
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)' }}>
                {totalGross}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>12 Dz / Gross</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Single Bangles
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--sapphire)' }}>
                {totalBangles.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Pieces (1 Dz = 12 Pcs)</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
