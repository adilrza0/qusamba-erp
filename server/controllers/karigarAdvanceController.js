import KarigarAdvance from '../models/KarigarAdvance.js';
import Karigar from '../models/Karigar.js';

export const getKarigarAdvances = async (_req, res, next) => {
  try {
    const advances = await KarigarAdvance.find().sort({ createdAt: -1 });
    res.json({ success: true, count: advances.length, data: advances });
  } catch (err) {
    next(err);
  }
};

export const createKarigarAdvance = async (req, res, next) => {
  try {
    const { karigarId, amount, mode = 'Cash', reason, date } = req.body;
    const parsedAmount = Number(amount) || 0;

    const karigar = await Karigar.findOne({
      $or: [{ id: karigarId }, { _id: karigarId.match(/^[0-9a-fA-F]{24}$/) ? karigarId : null }]
    });

    const newAdvance = await KarigarAdvance.create({
      id: req.body.id || `KGA-${Date.now().toString().slice(-4)}`,
      karigarId,
      karigarName: karigar ? karigar.name : (req.body.karigarName || 'Artisan'),
      date: date || new Date().toISOString().split('T')[0],
      amount: parsedAmount,
      mode,
      reason: reason || 'Cash advance'
    });

    // Update Karigar record
    if (karigar) {
      karigar.totalAdvances = (karigar.totalAdvances || 0) + parsedAmount;
      karigar.netPayable = (karigar.totalEarned || 0) - karigar.totalAdvances;
      await karigar.save();
    }

    res.status(201).json({ success: true, data: newAdvance });
  } catch (err) {
    next(err);
  }
};
