import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileSpreadsheet, 
  Plus, 
  Printer, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  IndianRupee,
  Share2,
  Calculator
} from 'lucide-react';

export const InvoicesView = () => {
  const { 
    invoices, 
    searchTerm, 
    setSearchTerm,
    setActiveModal, 
    setModalData, 
    deleteInvoice 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('All');

  const cleanTerm = (searchTerm || '').trim().toLowerCase();

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = !cleanTerm || (
      (inv.invoiceNumber || '').toLowerCase().includes(cleanTerm) ||
      (inv.buyerName || '').toLowerCase().includes(cleanTerm) ||
      (inv.buyerGstin || '').toLowerCase().includes(cleanTerm) ||
      (inv.status || '').toLowerCase().includes(cleanTerm) ||
      String(inv.grandTotal || '').includes(cleanTerm)
    );

    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = filteredInvoices.reduce((acc, inv) => acc + (inv.grandTotal || 0), 0);
  const totalDue = filteredInvoices.reduce((acc, inv) => acc + (inv.balanceDue || 0), 0);
  const totalTaxCollected = filteredInvoices.reduce((acc, inv) => acc + (inv.totalTax || 0), 0);

  return (
    <div className="view-container">
      {/* Top Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            GST Wholesale <span className="gold-gradient-text">Tax Invoices</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Generate, print, and track B2B wholesale tax invoices with 3% GST calculation & size breakdown.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className="btn btn-outline"
            onClick={() => setActiveModal('newDummyInvoice')}
          >
            <Calculator size={16} />
            <span>Dummy Invoice</span>
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveModal('newInvoice')}
          >
            <Plus size={16} />
            <span>+ Create Wholesale Invoice</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="stats-strip">
        <div className="stat-pill">
          <span className="stat-pill-label">Total Invoiced (₹)</span>
          <span className="stat-pill-value" style={{ color: 'var(--gold-light)' }}>
            ₹{totalInvoiced.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-label">Outstanding Balance (₹)</span>
          <span className="stat-pill-value" style={{ color: 'var(--ruby)' }}>
            ₹{totalDue.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-label">Total 3% GST Levied (₹)</span>
          <span className="stat-pill-value" style={{ color: 'var(--emerald)' }}>
            ₹{Math.round(totalTaxCollected).toLocaleString('en-IN')}
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-label">Total Invoices</span>
          <span className="stat-pill-value">
            {filteredInvoices.length} Bills
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-bar-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="form-label" style={{ margin: 0 }}>Payment Status:</span>
            <select 
              className="form-select" 
              style={{ width: 'auto', padding: '6px 12px', height: 36 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Invoices</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        <div className="filter-bar-right">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing {filteredInvoices.length} wholesale bills
          </span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date / Due</th>
                <th>Customer / GSTIN</th>
                <th>Supply Type</th>
                <th>Total Dz</th>
                <th>Taxable (₹)</th>
                <th>GST (3%)</th>
                <th>Grand Total (₹)</th>
                <th>Status</th>
                <th className="sticky-action-col" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => {
                const totalDz = inv.items?.reduce((sum, it) => sum + (it.totalDozens || 0), 0) || 0;
                const statusBadge = 
                  inv.status === 'Paid' ? 'badge-emerald' :
                  inv.status === 'Partial' ? 'badge-amber' : 'badge-ruby';

                return (
                  <tr key={inv.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--gold-light)' }}>
                        {inv.invoiceNumber}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {inv.paymentTerms || 'Net 30'}
                      </div>
                    </td>

                    <td>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {inv.date}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: inv.balanceDue > 0 ? 'var(--ruby)' : 'var(--text-muted)' }}>
                        Due: {inv.dueDate}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {inv.buyerName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        {inv.buyerGstin || 'Unregistered B2B'}
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${inv.isInterstate ? 'badge-sapphire' : 'badge-gold'}`}>
                        {inv.isInterstate ? 'IGST (Interstate)' : 'CGST+SGST'}
                      </span>
                    </td>

                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {totalDz} Dz
                    </td>

                    <td>
                      ₹{Math.round(inv.taxableAmount || 0).toLocaleString('en-IN')}
                    </td>

                    <td style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
                      ₹{Math.round(inv.totalTax || 0).toLocaleString('en-IN')}
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)' }}>
                        ₹{inv.grandTotal?.toLocaleString('en-IN')}
                      </div>
                      {inv.balanceDue > 0 && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--ruby)' }}>
                          Bal: ₹{inv.balanceDue?.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    <td>
                      <span className={`badge ${statusBadge}`}>
                        {inv.status}
                      </span>
                    </td>

                    <td className="sticky-action-col" style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setModalData(inv);
                            setActiveModal('viewInvoice');
                          }}
                          title="View & Print GST Invoice"
                        >
                          <Printer size={14} color="var(--gold-primary)" />
                          <span>Print Bill</span>
                        </button>
                        <button 
                          className="btn btn-ghost btn-sm btn-icon"
                          onClick={() => {
                            if (confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                              deleteInvoice(inv.id);
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

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '36px 16px' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 8 }}>
                      No invoices matching filters {searchTerm ? `for "${searchTerm}"` : ''}
                    </div>
                    {(searchTerm || statusFilter !== 'All') && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('All');
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
    </div>
  );
};
