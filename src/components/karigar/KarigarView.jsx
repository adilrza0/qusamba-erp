import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Hammer, 
  Plus, 
  HandCoins, 
  CheckCircle2, 
  Clock, 
  Coins, 
  FileSpreadsheet, 
  UserCheck, 
  ArrowUpRight,
  Sparkles,
  Search,
  IndianRupee
} from 'lucide-react';

export const KarigarView = () => {
  const { 
    karigars, 
    karigarLogs, 
    karigarAdvances, 
    searchTerm, 
    setSearchTerm,
    setActiveModal, 
    setModalData,
    settleKarigar
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState('artisans'); // 'artisans', 'logs', 'advances'

  const cleanTerm = (searchTerm || '').trim().toLowerCase();

  const filteredKarigars = karigars.filter((k) =>
    !cleanTerm || (
      (k.name || '').toLowerCase().includes(cleanTerm) ||
      (k.craft || '').toLowerCase().includes(cleanTerm) ||
      (k.village || '').toLowerCase().includes(cleanTerm) ||
      String(k.phone || '').includes(cleanTerm)
    )
  );

  const filteredLogs = karigarLogs.filter((log) =>
    !cleanTerm || (
      (log.karigarName || '').toLowerCase().includes(cleanTerm) ||
      (log.craft || '').toLowerCase().includes(cleanTerm) ||
      (log.itemName || '').toLowerCase().includes(cleanTerm) ||
      (log.notes || '').toLowerCase().includes(cleanTerm)
    )
  );

  const filteredAdvances = karigarAdvances.filter((adv) =>
    !cleanTerm || (
      (adv.karigarName || '').toLowerCase().includes(cleanTerm) ||
      (adv.reason || '').toLowerCase().includes(cleanTerm) ||
      (adv.mode || '').toLowerCase().includes(cleanTerm)
    )
  );

  const totalDozensCompleted = karigars.reduce((sum, k) => sum + (k.totalDozensProduced || 0), 0);
  const totalGrossEarned = karigars.reduce((sum, k) => sum + (k.totalEarned || 0), 0);
  const totalAdvancesIssued = karigars.reduce((sum, k) => sum + (k.totalAdvances || 0), 0);
  const totalNetPayable = karigars.reduce((sum, k) => sum + (k.netPayable || 0), 0);

  return (
    <div className="view-container">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Karigar & Artisan <span className="gold-gradient-text">Piece-Rate Tracker</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Daily dozens production logs, rate per dozen calculation, advance cash ledger & net settlement payouts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveModal('karigarLog')}
          >
            <Hammer size={16} />
            <span>+ Log Production (Dz)</span>
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setActiveModal('karigarAdvance')}
          >
            <HandCoins size={16} />
            <span>+ Issue Cash Advance</span>
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => setActiveModal('addKarigar')}
          >
            <Plus size={16} />
            <span>+ New Artisan</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="stats-strip">
        <div className="stat-pill">
          <span className="stat-pill-label">Total Dozens Crafted</span>
          <span className="stat-pill-value" style={{ color: 'var(--gold-light)' }}>
            {totalDozensCompleted.toLocaleString('en-IN')} Dz
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-label">Gross Piece-Rate Earned</span>
          <span className="stat-pill-value">
            ₹{totalGrossEarned.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-label">Total Cash Advances Given</span>
          <span className="stat-pill-value" style={{ color: 'var(--ruby)' }}>
            ₹{totalAdvancesIssued.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-label">Net Payable Payout Due</span>
          <span className="stat-pill-value" style={{ color: 'var(--emerald)' }}>
            ₹{totalNetPayable.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="tab-nav" style={{ width: 'fit-content' }}>
        <button 
          className={`tab-btn ${activeTabSub === 'artisans' ? 'active' : ''}`}
          onClick={() => setActiveTabSub('artisans')}
        >
          <UserCheck size={16} />
          <span>Artisan Balances ({karigars.length})</span>
        </button>
        <button 
          className={`tab-btn ${activeTabSub === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTabSub('logs')}
        >
          <FileSpreadsheet size={16} />
          <span>Daily Production Logs ({karigarLogs.length})</span>
        </button>
        <button 
          className={`tab-btn ${activeTabSub === 'advances' ? 'active' : ''}`}
          onClick={() => setActiveTabSub('advances')}
        >
          <Coins size={16} />
          <span>Advance Cash Ledger ({karigarAdvances.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: ARTISAN BALANCES */}
      {activeTabSub === 'artisans' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Karigar / Artisan</th>
                  <th>Craft Speciality</th>
                  <th>Workshop / Guild</th>
                  <th>Piece Rate (₹/Dz)</th>
                  <th>Total Dz Done</th>
                  <th>Gross Earned (₹)</th>
                  <th>Advances Deducted (₹)</th>
                  <th>Net Payout Due (₹)</th>
                  <th style={{ textAlign: 'right' }}>Settlement Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredKarigars.map((k) => (
                  <tr key={k.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.94rem' }}>
                        {k.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--gold-primary)' }}>
                        {k.phone}
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-gold">{k.craft}</span>
                      {k.activeOrder && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          Active: {k.activeOrder}
                        </div>
                      )}
                    </td>

                    <td style={{ color: 'var(--text-secondary)' }}>
                      {k.village}
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--gold-light)' }}>
                        ₹{k.ratePerDz} <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>/Dz</span>
                      </div>
                    </td>

                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {k.totalDozensProduced?.toLocaleString('en-IN')} Dz
                    </td>

                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{k.totalEarned?.toLocaleString('en-IN')}
                    </td>

                    <td style={{ fontWeight: 700, color: 'var(--ruby)' }}>
                      ₹{k.totalAdvances?.toLocaleString('en-IN')}
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: k.netPayable > 0 ? 'var(--emerald)' : 'var(--text-muted)' }}>
                        ₹{k.netPayable?.toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setModalData({ defaultKarigarId: k.id });
                            setActiveModal('karigarLog');
                          }}
                          title="Log New Dozens Completed"
                        >
                          <Hammer size={14} color="var(--gold-primary)" />
                          <span>+ Dz</span>
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setModalData({ defaultKarigarId: k.id });
                            setActiveModal('karigarAdvance');
                          }}
                          title="Issue Cash Advance"
                        >
                          <HandCoins size={14} />
                          <span>Adv</span>
                        </button>
                        {k.netPayable > 0 && (
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              if (confirm(`Clear net payout settlement of ₹${k.netPayable.toLocaleString('en-IN')} to ${k.name}?`)) {
                                settleKarigar(k.id, k.netPayable, 'Cash');
                              }
                            }}
                            title="Settle & Pay Net Balance"
                          >
                            <CheckCircle2 size={14} />
                            <span>Settle</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredKarigars.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 8 }}>
                        No karigars or artisans found {searchTerm ? `matching "${searchTerm}"` : ''}
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
      )}

      {/* SUB-TAB 2: DAILY PRODUCTION WORK LOGS */}
      {activeTabSub === 'logs' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Karigar</th>
                  <th>Craft Stage</th>
                  <th>Bangle Design</th>
                  <th>Dozens Crafted</th>
                  <th>Rate / Dz</th>
                  <th>Gross Amount (₹)</th>
                  <th>Inspection Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{log.date}</td>
                    <td style={{ fontWeight: 700, color: 'var(--gold-light)' }}>{log.karigarName}</td>
                    <td><span className="badge badge-gold">{log.craft}</span></td>
                    <td style={{ color: 'var(--text-primary)' }}>{log.itemName}</td>
                    <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{log.dozens} Dz</td>
                    <td>₹{log.ratePerDz}</td>
                    <td style={{ fontWeight: 800, color: 'var(--emerald)' }}>₹{log.grossAmount?.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{log.notes || '-'}</td>
                  </tr>
                ))}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 8 }}>
                        No work logs found {searchTerm ? `matching "${searchTerm}"` : ''}
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
      )}

      {/* SUB-TAB 3: ADVANCE PAYMENTS LEDGER */}
      {activeTabSub === 'advances' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Karigar</th>
                  <th>Advance Amount (₹)</th>
                  <th>Payment Mode</th>
                  <th>Purpose / Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdvances.map((adv) => (
                  <tr key={adv.id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{adv.date}</td>
                    <td style={{ fontWeight: 700, color: 'var(--gold-light)' }}>{adv.karigarName}</td>
                    <td style={{ fontWeight: 800, color: 'var(--ruby)', fontSize: '0.94rem' }}>
                      ₹{adv.amount?.toLocaleString('en-IN')}
                    </td>
                    <td><span className="badge badge-sapphire">{adv.mode}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{adv.reason}</td>
                  </tr>
                ))}

                {filteredAdvances.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '36px 16px' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 8 }}>
                        No advance records found {searchTerm ? `matching "${searchTerm}"` : ''}
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
      )}
    </div>
  );
};
