import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  CreditCard, 
  Plus, 
  Search, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle, 
  FileText, 
  Receipt,
  ArrowDownLeft,
  Calendar
} from 'lucide-react';

export const LedgerView = () => {
  const { 
    buyers, 
    invoices, 
    payments, 
    searchTerm, 
    setSearchTerm,
    setActiveModal, 
    setModalData 
  } = useApp();

  const [selectedBuyerForStatement, setSelectedBuyerForStatement] = useState(null);

  const cleanTerm = (searchTerm || '').trim().toLowerCase();

  const filteredBuyers = buyers.filter((b) => {
    return !cleanTerm || (
      (b.name || '').toLowerCase().includes(cleanTerm) ||
      (b.city || '').toLowerCase().includes(cleanTerm) ||
      (b.state || '').toLowerCase().includes(cleanTerm) ||
      (b.contactPerson || '').toLowerCase().includes(cleanTerm) ||
      (b.gstin || '').toLowerCase().includes(cleanTerm) ||
      String(b.phone || '').includes(cleanTerm)
    );
  });

  const totalOutstanding = buyers.reduce((sum, b) => sum + (b.outstandingBalance || 0), 0);
  const totalSales = buyers.reduce((sum, b) => sum + (b.totalPurchases || 0), 0);
  const totalCollected = buyers.reduce((sum, b) => sum + (b.totalPaid || 0), 0);

  // If viewing a single buyer's detailed statement
  const getBuyerStatement = (buyerId) => {
    const buyerInvoices = invoices
      .filter((inv) => inv.buyerId === buyerId)
      .map((inv) => ({
        date: inv.date,
        type: 'Invoice (Debit)',
        ref: inv.invoiceNumber,
        debit: inv.grandTotal,
        credit: 0,
        notes: `Tax invoice with 3% GST`
      }));

    const buyerPayments = payments
      .filter((p) => p.buyerId === buyerId)
      .map((p) => ({
        date: p.date,
        type: `Payment (Credit) - ${p.mode}`,
        ref: p.refNumber,
        debit: 0,
        credit: p.amount,
        notes: p.notes
      }));

    // Combine and sort by date
    const combined = [...buyerInvoices, ...buyerPayments].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Calculate running balance
    let running = 0;
    return combined.map((entry) => {
      running += entry.debit - entry.credit;
      return {
        ...entry,
        balance: running
      };
    });
  };

  return (
    <div className="view-container">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Buyer Ledger & <span className="gold-gradient-text">Credit Payment Tracker</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Khata credit accounts for wholesale buyers, distributors, payment receipts & aging status.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveModal('recordPayment')}
          >
            <CreditCard size={16} />
            <span>+ Record Payment</span>
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => setActiveModal('addBuyer')}
          >
            <Plus size={16} />
            <span>+ Add Wholesale Buyer</span>
          </button>
        </div>
      </div>

      {/* Credit Summary Strip */}
      <div className="stats-strip">
        <div className="stat-pill">
          <span className="stat-pill-label">Total Wholesale Sales</span>
          <span className="stat-pill-value" style={{ color: 'var(--gold-light)' }}>
            ₹{totalSales.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-label">Total Cash/UPI Recovered</span>
          <span className="stat-pill-value" style={{ color: 'var(--emerald)' }}>
            ₹{totalCollected.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-label">Total Outstanding Credit</span>
          <span className="stat-pill-value" style={{ color: 'var(--amber)' }}>
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-label">Credit Recovery Rate</span>
          <span className="stat-pill-value">
            {totalSales > 0 ? Math.round((totalCollected / totalSales) * 100) : 100}%
          </span>
        </div>
      </div>

      {/* Statement Modal if open */}
      {selectedBuyerForStatement && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-lg">
            <div className="modal-header">
              <div className="modal-title">
                <BookOpen size={20} color="var(--gold-primary)" />
                <span>Khata Statement: {selectedBuyerForStatement.name}</span>
              </div>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setSelectedBuyerForStatement(null)}
              >
                ✕ Close
              </button>
            </div>

            <div className="modal-body">
              {/* Buyer info block */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 12,
                  padding: 14,
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 18,
                  fontSize: '0.84rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>City & State:</span>{' '}
                  <strong>{selectedBuyerForStatement.city}, {selectedBuyerForStatement.state}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>GSTIN:</span>{' '}
                  <strong style={{ fontFamily: 'monospace' }}>{selectedBuyerForStatement.gstin}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Credit Terms:</span>{' '}
                  <strong>{selectedBuyerForStatement.paymentTermsDays} Days Limit</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Credit Limit:</span>{' '}
                  <strong>₹{selectedBuyerForStatement.creditLimit?.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Total Purchases:</span>{' '}
                  <strong style={{ color: 'var(--gold-light)' }}>₹{selectedBuyerForStatement.totalPurchases?.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Net Balance Due:</span>{' '}
                  <strong style={{ color: 'var(--ruby)' }}>₹{selectedBuyerForStatement.outstandingBalance?.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type / Particulars</th>
                      <th>Ref / Voucher</th>
                      <th style={{ textAlign: 'right' }}>Debit (₹)</th>
                      <th style={{ textAlign: 'right' }}>Credit (₹)</th>
                      <th style={{ textAlign: 'right' }}>Closing Bal (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getBuyerStatement(selectedBuyerForStatement.id).map((entry, idx) => (
                      <tr key={idx}>
                        <td style={{ color: 'var(--text-primary)' }}>{entry.date}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: entry.debit > 0 ? 'var(--gold-light)' : 'var(--emerald)' }}>
                            {entry.type}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{entry.notes}</div>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{entry.ref}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: entry.debit > 0 ? 'var(--gold-light)' : 'var(--text-muted)' }}>
                          {entry.debit > 0 ? `₹${entry.debit.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: entry.credit > 0 ? 'var(--emerald)' : 'var(--text-muted)' }}>
                          {entry.credit > 0 ? `₹${entry.credit.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)' }}>
                          ₹{entry.balance.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setModalData({ defaultBuyerId: selectedBuyerForStatement.id });
                  setActiveModal('recordPayment');
                }}
              >
                <CreditCard size={15} />
                <span>+ Collect Payment for this Buyer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buyers Accounts Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Buyer Name / Firm</th>
                <th>Location</th>
                <th>Contact Info</th>
                <th>GSTIN</th>
                <th>Credit Limit</th>
                <th>Total Purchases (₹)</th>
                <th>Total Paid (₹)</th>
                <th>Balance Due (₹)</th>
                <th>Aging Status</th>
                <th className="sticky-action-col" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuyers.map((buyer) => {
                const usedPct = buyer.creditLimit > 0 
                  ? Math.round((buyer.outstandingBalance / buyer.creditLimit) * 100) 
                  : 0;
                
                const isOverdue = (buyer.outstandingBalance > 0) && (buyer.overdueDays > 0);

                return (
                  <tr key={buyer.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.94rem' }}>
                        {buyer.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--gold-primary)' }}>
                        Contact: {buyer.contactPerson}
                      </div>
                    </td>

                    <td>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        {buyer.city}, {buyer.state}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        State Code: {buyer.stateCode}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                        {buyer.phone}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {buyer.email}
                      </div>
                    </td>

                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {buyer.gstin}
                    </td>

                    <td>
                      <div>₹{buyer.creditLimit?.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '0.7rem', color: usedPct > 80 ? 'var(--ruby)' : 'var(--text-muted)' }}>
                        {usedPct}% limit used
                      </div>
                    </td>

                    <td style={{ fontWeight: 700, color: 'var(--gold-light)' }}>
                      ₹{buyer.totalPurchases?.toLocaleString('en-IN')}
                    </td>

                    <td style={{ fontWeight: 700, color: 'var(--emerald)' }}>
                      ₹{buyer.totalPaid?.toLocaleString('en-IN')}
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: buyer.outstandingBalance > 0 ? 'var(--ruby)' : 'var(--emerald)' }}>
                        ₹{buyer.outstandingBalance?.toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td>
                      {buyer.outstandingBalance === 0 ? (
                        <span className="badge badge-emerald">Cleared</span>
                      ) : isOverdue ? (
                        <span className="badge badge-ruby">{buyer.overdueDays}d Overdue</span>
                      ) : (
                        <span className="badge badge-gold">Active Credit</span>
                      )}
                    </td>

                    <td className="sticky-action-col" style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => setSelectedBuyerForStatement(buyer)}
                          title="View Statement & Khata Ledger"
                        >
                          <BookOpen size={14} color="var(--gold-primary)" />
                          <span>Khata</span>
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setModalData({ defaultBuyerId: buyer.id });
                            setActiveModal('recordPayment');
                          }}
                          title="Receive Payment"
                        >
                          <Receipt size={14} />
                          <span>Pay</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredBuyers.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '36px 16px' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 8 }}>
                      No buyers or ledger accounts found {searchTerm ? `matching "${searchTerm}"` : ''}
                    </div>
                    {searchTerm && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSearchTerm('')}
                      >
                        Reset Search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
