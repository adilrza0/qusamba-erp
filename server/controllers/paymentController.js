import Payment from '../models/Payment.js';
import Buyer from '../models/Buyer.js';
import Invoice from '../models/Invoice.js';

export const getPayments = async (_req, res, next) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, count: payments.length, data: payments });
  } catch (err) {
    next(err);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const { buyerId, amount, mode, refNumber, invoiceNumber, notes, date } = req.body;
    const parsedAmount = Number(amount) || 0;

    const buyer = await Buyer.findOne({
      $or: [{ id: buyerId }, { _id: buyerId.match(/^[0-9a-fA-F]{24}$/) ? buyerId : null }]
    });

    const paymentCount = await Payment.countDocuments();
    const newPayment = await Payment.create({
      id: req.body.id || `PAY-${Date.now().toString().slice(-4)}`,
      receiptNumber: req.body.receiptNumber || `REC-26/${String(paymentCount + 101)}`,
      date: date || new Date().toISOString().split('T')[0],
      buyerId,
      buyerName: buyer ? buyer.name : (req.body.buyerName || 'Buyer'),
      amount: parsedAmount,
      mode: mode || 'UPI',
      refNumber: refNumber || `REF-${Date.now().toString().slice(-6)}`,
      invoiceNumber: invoiceNumber || 'On Account',
      notes: notes || 'Wholesale credit settlement'
    });

    // Update Buyer Balance
    if (buyer) {
      buyer.totalPaid = (buyer.totalPaid || 0) + parsedAmount;
      buyer.outstandingBalance = Math.max(0, (buyer.outstandingBalance || 0) - parsedAmount);
      if (buyer.outstandingBalance === 0) buyer.overdueDays = 0;
      await buyer.save();
    }

    // If payment was for a specific invoice, update it
    if (invoiceNumber && invoiceNumber !== 'On Account') {
      const inv = await Invoice.findOne({ invoiceNumber });
      if (inv) {
        const newPaid = (inv.amountPaid || 0) + parsedAmount;
        const newBal = Math.max(0, inv.grandTotal - newPaid);
        inv.amountPaid = newPaid;
        inv.balanceDue = newBal;
        inv.status = newBal === 0 ? 'Paid' : 'Partial';
        await inv.save();
      }
    }

    res.status(201).json({ success: true, data: newPayment });
  } catch (err) {
    next(err);
  }
};
