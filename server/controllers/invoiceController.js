import Invoice from '../models/Invoice.js';
import FinishedGood from '../models/FinishedGood.js';
import Buyer from '../models/Buyer.js';

export const getInvoices = async (_req, res, next) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (err) {
    next(err);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const totalInvoices = await Invoice.countDocuments();
    const invoiceData = {
      ...req.body,
      id: req.body.id || `INV-2026-${String(totalInvoices + 1).padStart(3, '0')}`,
      invoiceNumber: req.body.invoiceNumber || `QS/26-27/${String(totalInvoices + 1).padStart(3, '0')}`,
      status: req.body.amountPaid >= req.body.grandTotal ? 'Paid' : (req.body.amountPaid > 0 ? 'Partial' : 'Unpaid'),
      balanceDue: Math.max(0, req.body.grandTotal - (Number(req.body.amountPaid) || 0))
    };

    const newInvoice = await Invoice.create(invoiceData);

    // 1. Decrement Finished Goods Stock if sizes are provided
    if (newInvoice.items && newInvoice.items.length > 0) {
      for (const lineItem of newInvoice.items) {
        if (lineItem.itemId && lineItem.sizes) {
          const item = await FinishedGood.findOne({
            $or: [{ id: lineItem.itemId }, { _id: lineItem.itemId.match(/^[0-9a-fA-F]{24}$/) ? lineItem.itemId : null }]
          });
          if (item) {
            const sizesStock = { ...(item.sizesStockDz || {}) };
            const lineSizes = lineItem.sizes instanceof Map ? Object.fromEntries(lineItem.sizes) : lineItem.sizes;
            for (const [sz, qty] of Object.entries(lineSizes)) {
              sizesStock[sz] = Math.max(0, (sizesStock[sz] || 0) - (Number(qty) || 0));
            }
            item.sizesStockDz = sizesStock;
            item.markModified('sizesStockDz');
            await item.save();
          }
        }
      }
    }

    // 2. Update Buyer Ledger
    if (newInvoice.buyerId) {
      const buyer = await Buyer.findOne({
        $or: [{ id: newInvoice.buyerId }, { _id: newInvoice.buyerId.match(/^[0-9a-fA-F]{24}$/) ? newInvoice.buyerId : null }]
      });
      if (buyer) {
        buyer.totalPurchases = (buyer.totalPurchases || 0) + newInvoice.grandTotal;
        buyer.totalPaid = (buyer.totalPaid || 0) + (newInvoice.amountPaid || 0);
        buyer.outstandingBalance = buyer.totalPurchases - buyer.totalPaid;
        await buyer.save();
      }
    }

    res.status(201).json({ success: true, data: newInvoice });
  } catch (err) {
    next(err);
  }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
    });

    if (!invoice) {
      res.status(404);
      throw new Error('Invoice not found');
    }

    // Adjust buyer totals
    if (invoice.buyerId) {
      const buyer = await Buyer.findOne({
        $or: [{ id: invoice.buyerId }, { _id: invoice.buyerId.match(/^[0-9a-fA-F]{24}$/) ? invoice.buyerId : null }]
      });
      if (buyer) {
        buyer.totalPurchases = Math.max(0, (buyer.totalPurchases || 0) - invoice.grandTotal);
        buyer.outstandingBalance = Math.max(0, (buyer.outstandingBalance || 0) - invoice.balanceDue);
        await buyer.save();
      }
    }

    res.json({ success: true, message: 'Invoice removed', data: invoice });
  } catch (err) {
    next(err);
  }
};
