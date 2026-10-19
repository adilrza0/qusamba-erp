import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_COMPANY_PROFILE,
  INITIAL_FINISHED_GOODS,
  INITIAL_RAW_MATERIALS,
  INITIAL_BUYERS,
  INITIAL_KARIGARS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_KARIGAR_LOGS,
  INITIAL_KARIGAR_ADVANCES,
  BANGLE_SIZES
} from '../data/mockData';
import { api } from '../services/api';

const STORAGE_KEY = 'QUSAMBA_ERP_STATE_V1';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Load state from localStorage or initial defaults
  const [companyProfile, setCompanyProfile] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_PROFILE`);
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_PROFILE;
  });

  const [finishedGoods, setFinishedGoods] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_FINISHED`);
    return saved ? JSON.parse(saved) : INITIAL_FINISHED_GOODS;
  });

  const [rawMaterials, setRawMaterials] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_RAW`);
    return saved ? JSON.parse(saved) : INITIAL_RAW_MATERIALS;
  });

  const [buyers, setBuyers] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_BUYERS`);
    return saved ? JSON.parse(saved) : INITIAL_BUYERS;
  });

  const [karigars, setKarigars] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_KARIGARS`);
    return saved ? JSON.parse(saved) : INITIAL_KARIGARS;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_INVOICES`);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_PAYMENTS`);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [karigarLogs, setKarigarLogs] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_KARIGAR_LOGS`);
    return saved ? JSON.parse(saved) : INITIAL_KARIGAR_LOGS;
  });

  const [karigarAdvances, setKarigarAdvances] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_KARIGAR_ADVANCES`);
    return saved ? JSON.parse(saved) : INITIAL_KARIGAR_ADVANCES;
  });

  // UI Theme & Neumorphism state: 'neumorphic' | 'neumorphic-dark' | 'classic'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(`${STORAGE_KEY}_THEME`) || 'neumorphic';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(`${STORAGE_KEY}_THEME`, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      if (prev === 'neumorphic') return 'neumorphic-dark';
      if (prev === 'neumorphic-dark') return 'classic';
      return 'neumorphic';
    });
  }, []);

  // Server connection status
  const [serverConnected, setServerConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Active view navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Active Modal States
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  // Toast Helper
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Fetch all data from Express + MongoDB backend
  const loadDataFromServer = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        healthRes,
        profileData,
        fgData,
        rmData,
        buyersData,
        karigarsData,
        invoicesData,
        paymentsData,
        logsData,
        advancesData
      ] = await Promise.all([
        api.checkHealth().catch(() => null),
        api.getProfile().catch(() => null),
        api.getFinishedGoods().catch(() => null),
        api.getRawMaterials().catch(() => null),
        api.getBuyers().catch(() => null),
        api.getKarigars().catch(() => null),
        api.getInvoices().catch(() => null),
        api.getPayments().catch(() => null),
        api.getKarigarLogs().catch(() => null),
        api.getKarigarAdvances().catch(() => null),
      ]);

      if (healthRes && healthRes.success) {
        setServerConnected(true);
        if (profileData) setCompanyProfile(profileData);
        if (Array.isArray(fgData)) setFinishedGoods(fgData);
        if (Array.isArray(rmData)) setRawMaterials(rmData);
        if (Array.isArray(buyersData)) setBuyers(buyersData);
        if (Array.isArray(karigarsData)) setKarigars(karigarsData);
        if (Array.isArray(invoicesData)) setInvoices(invoicesData);
        if (Array.isArray(paymentsData)) setPayments(paymentsData);
        if (Array.isArray(logsData)) setKarigarLogs(logsData);
        if (Array.isArray(advancesData)) setKarigarAdvances(advancesData);
      } else {
        setServerConnected(false);
      }
    } catch (err) {
      console.warn('Backend sync failed, running in cached mode:', err.message);
      setServerConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load from backend on mount
  useEffect(() => {
    loadDataFromServer();
  }, [loadDataFromServer]);

  // Auto-save to localStorage as backup cache
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_PROFILE`, JSON.stringify(companyProfile));
      localStorage.setItem(`${STORAGE_KEY}_FINISHED`, JSON.stringify(finishedGoods));
      localStorage.setItem(`${STORAGE_KEY}_RAW`, JSON.stringify(rawMaterials));
      localStorage.setItem(`${STORAGE_KEY}_BUYERS`, JSON.stringify(buyers));
      localStorage.setItem(`${STORAGE_KEY}_KARIGARS`, JSON.stringify(karigars));
      localStorage.setItem(`${STORAGE_KEY}_INVOICES`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY}_PAYMENTS`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY}_KARIGAR_LOGS`, JSON.stringify(karigarLogs));
      localStorage.setItem(`${STORAGE_KEY}_KARIGAR_ADVANCES`, JSON.stringify(karigarAdvances));
    } catch (err) {
      console.warn('Could not cache to localStorage:', err);
    }
  }, [
    companyProfile,
    finishedGoods,
    rawMaterials,
    buyers,
    karigars,
    invoices,
    payments,
    karigarLogs,
    karigarAdvances
  ]);

  // -------------------------------------------------------------
  // PROFILE OPERATIONS
  // -------------------------------------------------------------
  const updateCompanyProfile = async (updatedFields) => {
    const updated = { ...companyProfile, ...updatedFields };
    setCompanyProfile(updated);
    try {
      if (serverConnected) {
        await api.updateProfile(updated);
      }
      showToast('Company profile saved to MongoDB', 'success');
    } catch (err) {
      console.error(err);
      showToast('Profile saved locally (server sync failed)', 'info');
    }
  };

  // -------------------------------------------------------------
  // INVENTORY OPERATIONS
  // -------------------------------------------------------------
  const addFinishedGood = async (item) => {
    const newItem = {
      ...item,
      id: item.id || `FG-${Date.now().toString().slice(-4)}`
    };
    setFinishedGoods((prev) => [newItem, ...prev]);
    showToast(`Added bangle: ${item.name}`, 'success');

    try {
      if (serverConnected) {
        const saved = await api.createFinishedGood(newItem);
        if (saved) {
          setFinishedGoods((prev) => prev.map((fg) => (fg.id === newItem.id ? saved : fg)));
        }
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  const updateFinishedGood = async (id, updatedFields) => {
    setFinishedGoods((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast('Bangle details updated', 'success');

    try {
      if (serverConnected) {
        await api.updateFinishedGood(id, updatedFields);
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  const deleteFinishedGood = async (id) => {
    setFinishedGoods((prev) => prev.filter((item) => item.id !== id));
    showToast('Bangle removed from inventory', 'info');

    try {
      if (serverConnected) {
        await api.deleteFinishedGood(id);
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  const adjustFinishedStock = async (id, sizeKey, deltaQty, reason = '') => {
    setFinishedGoods((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const currentQty = item.sizesStockDz?.[sizeKey] || 0;
        const newQty = Math.max(0, currentQty + deltaQty);
        return {
          ...item,
          sizesStockDz: {
            ...item.sizesStockDz,
            [sizeKey]: newQty
          }
        };
      })
    );
    showToast(`Stock adjusted for size ${sizeKey} (${deltaQty > 0 ? '+' : ''}${deltaQty} Dz)`, 'success');

    try {
      if (serverConnected) {
        await api.adjustFinishedStock(id, sizeKey, deltaQty);
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  // Raw Materials Operations
  const addRawMaterial = async (material) => {
    const newMaterial = {
      ...material,
      id: material.id || `RM-${Date.now().toString().slice(-4)}`
    };
    setRawMaterials((prev) => [newMaterial, ...prev]);
    showToast(`Added raw material: ${material.name}`, 'success');

    try {
      if (serverConnected) {
        const saved = await api.createRawMaterial(newMaterial);
        if (saved) {
          setRawMaterials((prev) => prev.map((rm) => (rm.id === newMaterial.id ? saved : rm)));
        }
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  const updateRawMaterial = async (id, updatedFields) => {
    setRawMaterials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast('Raw material updated', 'success');

    try {
      if (serverConnected) {
        await api.updateRawMaterial(id, updatedFields);
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  const deleteRawMaterial = async (id) => {
    setRawMaterials((prev) => prev.filter((item) => item.id !== id));
    showToast('Raw material removed', 'info');

    try {
      if (serverConnected) {
        await api.deleteRawMaterial(id);
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  const adjustRawStock = async (id, deltaQty) => {
    setRawMaterials((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          stockQty: Math.max(0, (item.stockQty || 0) + deltaQty)
        };
      })
    );
    showToast(`Raw stock updated (${deltaQty > 0 ? '+' : ''}${deltaQty})`, 'success');

    try {
      if (serverConnected) {
        await api.adjustRawStock(id, deltaQty);
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  // -------------------------------------------------------------
  // GST INVOICE OPERATIONS
  // -------------------------------------------------------------
  const createInvoice = async (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      invoiceNumber: `QS/26-27/${String(invoices.length + 1).padStart(3, '0')}`,
      status: invoiceData.amountPaid >= invoiceData.grandTotal ? 'Paid' : invoiceData.amountPaid > 0 ? 'Partial' : 'Unpaid',
      balanceDue: Math.max(0, invoiceData.grandTotal - (invoiceData.amountPaid || 0))
    };

    // 1. Add invoice
    setInvoices((prev) => [newInvoice, ...prev]);

    // 2. Decrement Finished Goods Stock accordingly
    if (invoiceData.items && invoiceData.items.length > 0) {
      setFinishedGoods((prev) => {
        const updated = [...prev];
        invoiceData.items.forEach((lineItem) => {
          const itemIdx = updated.findIndex((fg) => fg.id === lineItem.itemId);
          if (itemIdx >= 0 && lineItem.sizes) {
            const currentItem = { ...updated[itemIdx] };
            const updatedSizes = { ...currentItem.sizesStockDz };
            Object.keys(lineItem.sizes).forEach((sz) => {
              const qtyToDeduct = Number(lineItem.sizes[sz]) || 0;
              updatedSizes[sz] = Math.max(0, (updatedSizes[sz] || 0) - qtyToDeduct);
            });
            currentItem.sizesStockDz = updatedSizes;
            updated[itemIdx] = currentItem;
          }
        });
        return updated;
      });
    }

    // 3. Update Buyer Ledger
    setBuyers((prev) =>
      prev.map((buyer) => {
        if (buyer.id === invoiceData.buyerId) {
          const newPurchases = (buyer.totalPurchases || 0) + newInvoice.grandTotal;
          const newPaid = (buyer.totalPaid || 0) + (newInvoice.amountPaid || 0);
          const newBalance = newPurchases - newPaid;
          return {
            ...buyer,
            totalPurchases: newPurchases,
            totalPaid: newPaid,
            outstandingBalance: newBalance
          };
        }
        return buyer;
      })
    );

    showToast(`Invoice ${newInvoice.invoiceNumber} created & inventory updated!`, 'success');

    try {
      if (serverConnected) {
        const saved = await api.createInvoice(newInvoice);
        if (saved) {
          setInvoices((prev) => prev.map((inv) => (inv.id === newInvoice.id ? saved : inv)));
        }
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }

    return newInvoice;
  };

  // Generate a Dummy / Proforma / Estimate Invoice (No DB or inventory changes)
  const generateDummyInvoice = (invoiceData) => {
    const dummyNumber = invoiceData.invoiceNumber || `QS/EST-${new Date().getFullYear()}/${String(Math.floor(100 + Math.random() * 900))}`;
    const dummyInvoice = {
      ...invoiceData,
      id: `DUMMY-${Date.now()}`,
      invoiceNumber: dummyNumber,
      isDummy: true,
      docType: 'Estimate / Quotation',
      status: 'Estimate Draft',
      amountPaid: 0,
      balanceDue: invoiceData.grandTotal || 0,
      createdAt: new Date().toISOString()
    };

    showToast(`Dummy invoice ${dummyInvoice.invoiceNumber} generated! (Excluded from sales)`, 'info');

    setModalData(dummyInvoice);
    setActiveModal('viewInvoice');

    return dummyInvoice;
  };

  const deleteInvoice = async (invoiceId) => {
    const target = invoices.find((inv) => inv.id === invoiceId);
    if (!target) return;

    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
    
    // Adjust buyer totals
    setBuyers((prev) =>
      prev.map((buyer) => {
        if (buyer.id === target.buyerId) {
          return {
            ...buyer,
            totalPurchases: Math.max(0, buyer.totalPurchases - target.grandTotal),
            outstandingBalance: Math.max(0, buyer.outstandingBalance - target.balanceDue)
          };
        }
        return buyer;
      })
    );
    showToast(`Invoice ${target.invoiceNumber} deleted`, 'info');

    try {
      if (serverConnected) {
        await api.deleteInvoice(invoiceId);
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  // -------------------------------------------------------------
  // PAYMENT / BUYER LEDGER OPERATIONS
  // -------------------------------------------------------------
  const recordPayment = async ({ buyerId, amount, mode, refNumber, invoiceNumber, notes, date }) => {
    const buyer = buyers.find((b) => b.id === buyerId);
    if (!buyer) return;

    const parsedAmount = Number(amount) || 0;
    const newPayment = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      receiptNumber: `REC-26/${String(payments.length + 101)}`,
      date: date || new Date().toISOString().split('T')[0],
      buyerId,
      buyerName: buyer.name,
      amount: parsedAmount,
      mode: mode || 'UPI',
      refNumber: refNumber || `REF-${Date.now().toString().slice(-6)}`,
      invoiceNumber: invoiceNumber || 'On Account',
      notes: notes || 'Wholesale credit settlement'
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update Buyer Balance
    setBuyers((prev) =>
      prev.map((b) => {
        if (b.id === buyerId) {
          const newPaid = (b.totalPaid || 0) + parsedAmount;
          const newBalance = Math.max(0, (b.outstandingBalance || 0) - parsedAmount);
          return {
            ...b,
            totalPaid: newPaid,
            outstandingBalance: newBalance,
            overdueDays: newBalance === 0 ? 0 : b.overdueDays
          };
        }
        return b;
      })
    );

    // If payment was for a specific invoice, update it
    if (invoiceNumber && invoiceNumber !== 'On Account') {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.invoiceNumber === invoiceNumber) {
            const newPaid = (inv.amountPaid || 0) + parsedAmount;
            const newBal = Math.max(0, inv.grandTotal - newPaid);
            return {
              ...inv,
              amountPaid: newPaid,
              balanceDue: newBal,
              status: newBal === 0 ? 'Paid' : 'Partial'
            };
          }
          return inv;
        })
      );
    }

    showToast(`Payment of ₹${parsedAmount.toLocaleString('en-IN')} recorded for ${buyer.name}`, 'success');

    try {
      if (serverConnected) {
        await api.createPayment(newPayment);
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  const addBuyer = async (buyerData) => {
    const newBuyer = {
      ...buyerData,
      id: buyerData.id || `BY-${Date.now().toString().slice(-4)}`,
      totalPurchases: Number(buyerData.totalPurchases) || 0,
      totalPaid: Number(buyerData.totalPaid) || 0,
      outstandingBalance: Number(buyerData.outstandingBalance) || 0,
      overdueDays: Number(buyerData.overdueDays) || 0
    };
    setBuyers((prev) => [...prev, newBuyer]);
    showToast(`Added wholesale buyer: ${buyerData.name}`, 'success');

    try {
      if (serverConnected) {
        const saved = await api.createBuyer(newBuyer);
        if (saved) {
          setBuyers((prev) => prev.map((b) => (b.id === newBuyer.id ? saved : b)));
        }
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  const updateBuyer = async (id, buyerData) => {
    setBuyers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...buyerData } : b))
    );
    showToast('Buyer updated', 'success');

    try {
      if (serverConnected) {
        await api.updateBuyer(id, buyerData);
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  // -------------------------------------------------------------
  // KARIGAR / ARTISAN TRACKER OPERATIONS
  // -------------------------------------------------------------
  const addKarigarLog = async ({ karigarId, itemId, dozens, ratePerDz, date, notes, autoAddStock = true }) => {
    const karigar = karigars.find((k) => k.id === karigarId);
    const item = finishedGoods.find((fg) => fg.id === itemId);
    if (!karigar) return;

    const numDozens = Number(dozens) || 0;
    const rate = Number(ratePerDz) || karigar.ratePerDz || 20;
    const grossAmount = numDozens * rate;

    const newLog = {
      id: `KGL-${Date.now().toString().slice(-4)}`,
      karigarId,
      karigarName: karigar.name,
      craft: karigar.craft,
      date: date || new Date().toISOString().split('T')[0],
      itemId: itemId || '',
      itemName: item ? item.name : 'General Craft Production',
      dozens: numDozens,
      ratePerDz: rate,
      grossAmount,
      notes: notes || ''
    };

    setKarigarLogs((prev) => [newLog, ...prev]);

    // Update Karigar aggregates
    setKarigars((prev) =>
      prev.map((k) => {
        if (k.id === karigarId) {
          const totalDozens = (k.totalDozensProduced || 0) + numDozens;
          const totalEarned = (k.totalEarned || 0) + grossAmount;
          const netPayable = totalEarned - (k.totalAdvances || 0);
          return {
            ...k,
            totalDozensProduced: totalDozens,
            totalEarned,
            netPayable
          };
        }
        return k;
      })
    );

    // Increment finished goods stock
    if (autoAddStock && item) {
      setFinishedGoods((prev) =>
        prev.map((fg) => {
          if (fg.id === item.id) {
            const halfDz = Math.floor(numDozens / 2);
            const otherHalf = numDozens - halfDz;
            return {
              ...fg,
              sizesStockDz: {
                ...fg.sizesStockDz,
                '2-6': (fg.sizesStockDz?.['2-6'] || 0) + halfDz,
                '2-8': (fg.sizesStockDz?.['2-8'] || 0) + otherHalf
              }
            };
          }
          return fg;
        })
      );
    }

    showToast(`Logged ${numDozens} Dz for ${karigar.name} (Gross: ₹${grossAmount.toLocaleString('en-IN')})`, 'success');

    try {
      if (serverConnected) {
        await api.createKarigarLog({
          karigarId,
          itemId,
          dozens: numDozens,
          ratePerDz: rate,
          date,
          notes,
          autoAddStock
        });
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  const addKarigarAdvance = async ({ karigarId, amount, mode = 'Cash', reason, date }) => {
    const karigar = karigars.find((k) => k.id === karigarId);
    if (!karigar) return;

    const parsedAmount = Number(amount) || 0;
    const newAdvance = {
      id: `KGA-${Date.now().toString().slice(-4)}`,
      karigarId,
      karigarName: karigar.name,
      date: date || new Date().toISOString().split('T')[0],
      amount: parsedAmount,
      mode,
      reason: reason || 'Cash advance'
    };

    setKarigarAdvances((prev) => [newAdvance, ...prev]);

    // Update Karigar record
    setKarigars((prev) =>
      prev.map((k) => {
        if (k.id === karigarId) {
          const totalAdvances = (k.totalAdvances || 0) + parsedAmount;
          const netPayable = (k.totalEarned || 0) - totalAdvances;
          return {
            ...k,
            totalAdvances,
            netPayable
          };
        }
        return k;
      })
    );

    showToast(`Advance ₹${parsedAmount.toLocaleString('en-IN')} issued to ${karigar.name}`, 'info');

    try {
      if (serverConnected) {
        await api.createKarigarAdvance({ karigarId, amount: parsedAmount, mode, reason, date });
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  const settleKarigar = async (karigarId, settlementAmount, mode = 'Cash') => {
    const karigar = karigars.find((k) => k.id === karigarId);
    if (!karigar) return;

    setKarigars((prev) =>
      prev.map((k) => {
        if (k.id === karigarId) {
          return {
            ...k,
            totalEarned: 0,
            totalAdvances: 0,
            totalDozensProduced: 0,
            netPayable: 0
          };
        }
        return k;
      })
    );

    showToast(`Settlement of ₹${Number(settlementAmount).toLocaleString('en-IN')} cleared for ${karigar.name}`, 'success');

    try {
      if (serverConnected) {
        await api.settleKarigar(karigarId, settlementAmount, mode);
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  const addKarigar = async (data) => {
    const newK = {
      ...data,
      id: data.id || `KG-${Date.now().toString().slice(-4)}`,
      totalDozensProduced: 0,
      totalEarned: 0,
      totalAdvances: 0,
      netPayable: 0
    };
    setKarigars((prev) => [...prev, newK]);
    showToast(`Added artisan: ${data.name}`, 'success');

    try {
      if (serverConnected) {
        const saved = await api.createKarigar(newK);
        if (saved) {
          setKarigars((prev) => prev.map((k) => (k.id === newK.id ? saved : k)));
        }
      }
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  // -------------------------------------------------------------
  // SYSTEM / BACKUP & RESET
  // -------------------------------------------------------------
  const resetToDemoData = async () => {
    try {
      if (serverConnected) {
        await api.resetDatabase();
        await loadDataFromServer();
      } else {
        localStorage.removeItem(`${STORAGE_KEY}_PROFILE`);
        localStorage.removeItem(`${STORAGE_KEY}_FINISHED`);
        localStorage.removeItem(`${STORAGE_KEY}_RAW`);
        localStorage.removeItem(`${STORAGE_KEY}_BUYERS`);
        localStorage.removeItem(`${STORAGE_KEY}_KARIGARS`);
        localStorage.removeItem(`${STORAGE_KEY}_INVOICES`);
        localStorage.removeItem(`${STORAGE_KEY}_PAYMENTS`);
        localStorage.removeItem(`${STORAGE_KEY}_KARIGAR_LOGS`);
        localStorage.removeItem(`${STORAGE_KEY}_KARIGAR_ADVANCES`);

        setCompanyProfile(INITIAL_COMPANY_PROFILE);
        setFinishedGoods(INITIAL_FINISHED_GOODS);
        setRawMaterials(INITIAL_RAW_MATERIALS);
        setBuyers(INITIAL_BUYERS);
        setKarigars(INITIAL_KARIGARS);
        setInvoices(INITIAL_INVOICES);
        setPayments(INITIAL_PAYMENTS);
        setKarigarLogs(INITIAL_KARIGAR_LOGS);
        setKarigarAdvances(INITIAL_KARIGAR_ADVANCES);
      }
      showToast('System reset to realistic demo data in MongoDB & Local!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error resetting data: ' + err.message, 'danger');
    }
  };

  const initCleanProductionData = async () => {
    try {
      if (serverConnected) {
        await api.cleanSlateDatabase();
        await loadDataFromServer();
      } else {
        setBuyers([]);
        setInvoices([]);
        setPayments([]);
        setKarigarLogs([]);
        setKarigarAdvances([]);
        setFinishedGoods((prev) =>
          prev.map((item) => ({
            ...item,
            sizesStockDz: { '2-2': 0, '2-4': 0, '2-6': 0, '2-8': 0, '2-10': 0, '2-12': 0 }
          }))
        );
        setRawMaterials((prev) => prev.map((rm) => ({ ...rm, stockQty: 0 })));
      }
      showToast('Clean Production Mode initialized! 0 mock transactions.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error setting clean production state: ' + err.message, 'danger');
    }
  };

  const clearAllTransactions = async () => {
    try {
      if (serverConnected) {
        await api.clearTransactions();
        await loadDataFromServer();
      } else {
        setInvoices([]);
        setPayments([]);
        setKarigarLogs([]);
        setKarigarAdvances([]);
        setBuyers((prev) =>
          prev.map((b) => ({
            ...b,
            totalPurchases: 0,
            totalPaid: 0,
            outstandingBalance: 0,
            overdueDays: 0
          }))
        );
        setKarigars((prev) =>
          prev.map((k) => ({
            ...k,
            totalDozensProduced: 0,
            totalEarned: 0,
            totalAdvances: 0,
            netPayable: 0
          }))
        );
      }
      showToast('Purged all demo invoices, payments & logs. Catalog preserved!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error clearing transactions: ' + err.message, 'danger');
    }
  };

  const exportBackupJSON = async () => {
    try {
      let payload;
      if (serverConnected) {
        payload = await api.exportBackup();
      } else {
        payload = {
          timestamp: new Date().toISOString(),
          companyProfile,
          finishedGoods,
          rawMaterials,
          buyers,
          karigars,
          invoices,
          payments,
          karigarLogs,
          karigarAdvances
        };
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Qusamba_ERP_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('ERP backup JSON downloaded successfully from MongoDB!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export backup', 'danger');
    }
  };

  const importBackupJSON = async (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (serverConnected) {
        await api.importBackup(data);
        await loadDataFromServer();
      } else {
        if (data.companyProfile) setCompanyProfile(data.companyProfile);
        if (data.finishedGoods) setFinishedGoods(data.finishedGoods);
        if (data.rawMaterials) setRawMaterials(data.rawMaterials);
        if (data.buyers) setBuyers(data.buyers);
        if (data.karigars) setKarigars(data.karigars);
        if (data.invoices) setInvoices(data.invoices);
        if (data.payments) setPayments(data.payments);
        if (data.karigarLogs) setKarigarLogs(data.karigarLogs);
        if (data.karigarAdvances) setKarigarAdvances(data.karigarAdvances);
      }
      showToast('Backup restored successfully into MongoDB!', 'success');
    } catch (err) {
      showToast('Invalid backup file format or import error', 'danger');
    }
  };

  // Aggregated Stock Helpers
  const getTotalDozens = (sizesStockDz) => {
    if (!sizesStockDz) return 0;
    const sizes = sizesStockDz instanceof Map ? Object.fromEntries(sizesStockDz) : sizesStockDz;
    return Object.values(sizes).reduce((acc, val) => acc + (Number(val) || 0), 0);
  };

  const getLowStockFinishedCount = () => {
    return finishedGoods.filter((fg) => {
      const totalDz = getTotalDozens(fg.sizesStockDz);
      return totalDz <= (fg.minStockAlertDz || 40);
    }).length;
  };

  const getLowStockRawCount = () => {
    return rawMaterials.filter((rm) => (rm.stockQty || 0) <= (rm.minStockAlert || 50)).length;
  };

  return (
    <AppContext.Provider
      value={{
        // State
        companyProfile,
        setCompanyProfile,
        updateCompanyProfile,
        finishedGoods,
        rawMaterials,
        buyers,
        karigars,
        invoices,
        payments,
        karigarLogs,
        karigarAdvances,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        toasts,
        showToast,
        activeModal,
        setActiveModal,
        modalData,
        setModalData,
        serverConnected,
        isLoading,
        loadDataFromServer,
        theme,
        setTheme,
        toggleTheme,

        // Finished Goods methods
        addFinishedGood,
        updateFinishedGood,
        deleteFinishedGood,
        adjustFinishedStock,

        // Raw Materials methods
        addRawMaterial,
        updateRawMaterial,
        deleteRawMaterial,
        adjustRawStock,

        // Invoices
        createInvoice,
        generateDummyInvoice,
        deleteInvoice,

        // Payments & Buyers
        recordPayment,
        addBuyer,
        updateBuyer,

        // Karigars
        addKarigarLog,
        addKarigarAdvance,
        settleKarigar,
        addKarigar,

        // System
        resetToDemoData,
        initCleanProductionData,
        clearAllTransactions,
        exportBackupJSON,
        importBackupJSON,

        // Helpers
        getTotalDozens,
        getLowStockFinishedCount,
        getLowStockRawCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
