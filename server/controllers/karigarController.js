import Karigar from '../models/Karigar.js';

export const getKarigars = async (_req, res, next) => {
  try {
    const karigars = await Karigar.find().sort({ createdAt: -1 });
    res.json({ success: true, count: karigars.length, data: karigars });
  } catch (err) {
    next(err);
  }
};

export const createKarigar = async (req, res, next) => {
  try {
    const karigarData = {
      ...req.body,
      id: req.body.id || `KG-${Date.now().toString().slice(-4)}`,
      totalDozensProduced: 0,
      totalEarned: 0,
      totalAdvances: 0,
      netPayable: 0,
    };
    const karigar = await Karigar.create(karigarData);
    res.status(201).json({ success: true, data: karigar });
  } catch (err) {
    next(err);
  }
};

export const updateKarigar = async (req, res, next) => {
  try {
    const karigar = await Karigar.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }] },
      req.body,
      { new: true, runValidators: true }
    );
    if (!karigar) {
      res.status(404);
      throw new Error('Karigar not found');
    }
    res.json({ success: true, data: karigar });
  } catch (err) {
    next(err);
  }
};

export const deleteKarigar = async (req, res, next) => {
  try {
    const karigar = await Karigar.findOneAndDelete({
      $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
    });
    if (!karigar) {
      res.status(404);
      throw new Error('Karigar not found');
    }
    res.json({ success: true, message: 'Karigar removed', data: karigar });
  } catch (err) {
    next(err);
  }
};

export const settleKarigar = async (req, res, next) => {
  try {
    const karigar = await Karigar.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
    });
    if (!karigar) {
      res.status(404);
      throw new Error('Karigar not found');
    }

    karigar.totalEarned = 0;
    karigar.totalAdvances = 0;
    karigar.totalDozensProduced = 0;
    karigar.netPayable = 0;
    await karigar.save();

    res.json({ success: true, message: 'Karigar settled', data: karigar });
  } catch (err) {
    next(err);
  }
};
