/**
 * Qusamba ERP API Service
 * Handles communication with the Express + MongoDB backend
 */

const envUrl = import.meta.env?.VITE_API_URL;
const API_BASE = envUrl ? `${envUrl.replace(/\/$/, '')}/api` : '/api';

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  // Company Profile
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/profile`);
    const data = await handleResponse(res);
    return data.data;
  },

  updateProfile: async (profile) => {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  // Finished Goods
  getFinishedGoods: async () => {
    const res = await fetch(`${API_BASE}/finished-goods`);
    const data = await handleResponse(res);
    return data.data;
  },

  createFinishedGood: async (item) => {
    const res = await fetch(`${API_BASE}/finished-goods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  updateFinishedGood: async (id, item) => {
    const res = await fetch(`${API_BASE}/finished-goods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  deleteFinishedGood: async (id) => {
    const res = await fetch(`${API_BASE}/finished-goods/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  adjustFinishedStock: async (id, sizeKey, deltaQty) => {
    const res = await fetch(`${API_BASE}/finished-goods/${id}/adjust-stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sizeKey, deltaQty }),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  // Raw Materials
  getRawMaterials: async () => {
    const res = await fetch(`${API_BASE}/raw-materials`);
    const data = await handleResponse(res);
    return data.data;
  },

  createRawMaterial: async (material) => {
    const res = await fetch(`${API_BASE}/raw-materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(material),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  updateRawMaterial: async (id, material) => {
    const res = await fetch(`${API_BASE}/raw-materials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(material),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  deleteRawMaterial: async (id) => {
    const res = await fetch(`${API_BASE}/raw-materials/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  adjustRawStock: async (id, deltaQty) => {
    const res = await fetch(`${API_BASE}/raw-materials/${id}/adjust-stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deltaQty }),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  // Buyers
  getBuyers: async () => {
    const res = await fetch(`${API_BASE}/buyers`);
    const data = await handleResponse(res);
    return data.data;
  },

  createBuyer: async (buyer) => {
    const res = await fetch(`${API_BASE}/buyers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buyer),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  updateBuyer: async (id, buyer) => {
    const res = await fetch(`${API_BASE}/buyers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buyer),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  deleteBuyer: async (id) => {
    const res = await fetch(`${API_BASE}/buyers/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Karigars
  getKarigars: async () => {
    const res = await fetch(`${API_BASE}/karigars`);
    const data = await handleResponse(res);
    return data.data;
  },

  createKarigar: async (karigar) => {
    const res = await fetch(`${API_BASE}/karigars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(karigar),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  updateKarigar: async (id, karigar) => {
    const res = await fetch(`${API_BASE}/karigars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(karigar),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  deleteKarigar: async (id) => {
    const res = await fetch(`${API_BASE}/karigars/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  settleKarigar: async (id, settlementAmount, mode) => {
    const res = await fetch(`${API_BASE}/karigars/${id}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settlementAmount, mode }),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  // Invoices
  getInvoices: async () => {
    const res = await fetch(`${API_BASE}/invoices`);
    const data = await handleResponse(res);
    return data.data;
  },

  createInvoice: async (invoice) => {
    const res = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  deleteInvoice: async (id) => {
    const res = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Payments
  getPayments: async () => {
    const res = await fetch(`${API_BASE}/payments`);
    const data = await handleResponse(res);
    return data.data;
  },

  createPayment: async (payment) => {
    const res = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  // Karigar Logs
  getKarigarLogs: async () => {
    const res = await fetch(`${API_BASE}/karigar-logs`);
    const data = await handleResponse(res);
    return data.data;
  },

  createKarigarLog: async (log) => {
    const res = await fetch(`${API_BASE}/karigar-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  // Karigar Advances
  getKarigarAdvances: async () => {
    const res = await fetch(`${API_BASE}/karigar-advances`);
    const data = await handleResponse(res);
    return data.data;
  },

  createKarigarAdvance: async (advance) => {
    const res = await fetch(`${API_BASE}/karigar-advances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(advance),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  // System
  resetDatabase: async () => {
    const res = await fetch(`${API_BASE}/system/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force: true }),
    });
    return handleResponse(res);
  },

  cleanSlateDatabase: async () => {
    const res = await fetch(`${API_BASE}/system/clean-slate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
  },

  clearTransactions: async () => {
    const res = await fetch(`${API_BASE}/system/clear-transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
  },

  exportBackup: async () => {
    const res = await fetch(`${API_BASE}/system/export`);
    return handleResponse(res);
  },

  importBackup: async (backupData) => {
    const res = await fetch(`${API_BASE}/system/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backupData),
    });
    return handleResponse(res);
  },
};
