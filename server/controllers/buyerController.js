import Buyer from '../models/Buyer.js';

export const getBuyers = async (_req, res, next) => {
  try {
    const buyers = await Buyer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: buyers.length, data: buyers });
  } catch (err) {
    next(err);
  }
};

export const createBuyer = async (req, res, next) => {
  try {
    const buyerData = {
      ...req.body,
      id: req.body.id || `BY-${Date.now().toString().slice(-4)}`,
      totalPurchases: Number(req.body.totalPurchases) || 0,
      totalPaid: Number(req.body.totalPaid) || 0,
      outstandingBalance: Number(req.body.outstandingBalance) || 0,
      overdueDays: Number(req.body.overdueDays) || 0
    };
    const buyer = await Buyer.create(buyerData);
    res.status(201).json({ success: true, data: buyer });
  } catch (err) {
    next(err);
  }
};

export const updateBuyer = async (req, res, next) => {
  try {
    const buyer = await Buyer.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }] },
      req.body,
      { new: true, runValidators: true }
    );
    if (!buyer) {
      res.status(404);
      throw new Error('Buyer not found');
    }
    res.json({ success: true, data: buyer });
  } catch (err) {
    next(err);
  }
};

export const deleteBuyer = async (req, res, next) => {
  try {
    const buyer = await Buyer.findOneAndDelete({
      $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
    });
    if (!buyer) {
      res.status(404);
      throw new Error('Buyer not found');
    }
    res.json({ success: true, message: 'Buyer removed', data: buyer });
  } catch (err) {
    next(err);
  }
};
