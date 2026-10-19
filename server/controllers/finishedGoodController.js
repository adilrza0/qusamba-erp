import FinishedGood from '../models/FinishedGood.js';

export const getFinishedGoods = async (_req, res, next) => {
  try {
    const items = await FinishedGood.find().sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

export const getFinishedGoodById = async (req, res, next) => {
  try {
    const item = await FinishedGood.findOne({ id: req.params.id }) || await FinishedGood.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Finished good not found');
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const createFinishedGood = async (req, res, next) => {
  try {
    const itemData = {
      ...req.body,
      id: req.body.id || `FG-${Date.now().toString().slice(-4)}`
    };
    const item = await FinishedGood.create(itemData);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    if (err.name === 'ValidationError') res.status(400);
    next(err);
  }
};

export const updateFinishedGood = async (req, res, next) => {
  try {
    const item = await FinishedGood.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }] },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404);
      throw new Error('Finished good not found');
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const deleteFinishedGood = async (req, res, next) => {
  try {
    const item = await FinishedGood.findOneAndDelete({
      $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
    });
    if (!item) {
      res.status(404);
      throw new Error('Finished good not found');
    }
    res.json({ success: true, message: 'Finished good removed', data: item });
  } catch (err) {
    next(err);
  }
};

export const adjustFinishedStock = async (req, res, next) => {
  try {
    const { sizeKey, deltaQty } = req.body;
    const item = await FinishedGood.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
    });

    if (!item) {
      res.status(404);
      throw new Error('Finished good not found');
    }

    const currentQty = (item.sizesStockDz && item.sizesStockDz[sizeKey]) || 0;
    const newQty = Math.max(0, currentQty + (Number(deltaQty) || 0));

    if (!item.sizesStockDz) item.sizesStockDz = {};
    item.sizesStockDz[sizeKey] = newQty;
    item.markModified('sizesStockDz');
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};
