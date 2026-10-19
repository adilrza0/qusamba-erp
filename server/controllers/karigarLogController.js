import KarigarLog from '../models/KarigarLog.js';
import Karigar from '../models/Karigar.js';
import FinishedGood from '../models/FinishedGood.js';

export const getKarigarLogs = async (_req, res, next) => {
  try {
    const logs = await KarigarLog.find().sort({ createdAt: -1 });
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};

export const createKarigarLog = async (req, res, next) => {
  try {
    const { karigarId, itemId, dozens, ratePerDz, date, notes, autoAddStock = true } = req.body;

    const karigar = await Karigar.findOne({
      $or: [{ id: karigarId }, { _id: karigarId.match(/^[0-9a-fA-F]{24}$/) ? karigarId : null }]
    });

    const item = itemId ? await FinishedGood.findOne({
      $or: [{ id: itemId }, { _id: itemId.match(/^[0-9a-fA-F]{24}$/) ? itemId : null }]
    }) : null;

    const numDozens = Number(dozens) || 0;
    const rate = Number(ratePerDz) || (karigar ? karigar.ratePerDz : 20);
    const grossAmount = numDozens * rate;

    const newLog = await KarigarLog.create({
      id: req.body.id || `KGL-${Date.now().toString().slice(-4)}`,
      karigarId,
      karigarName: karigar ? karigar.name : (req.body.karigarName || 'Artisan'),
      craft: karigar ? karigar.craft : '',
      date: date || new Date().toISOString().split('T')[0],
      itemId: itemId || '',
      itemName: item ? item.name : 'General Craft Production',
      dozens: numDozens,
      ratePerDz: rate,
      grossAmount,
      notes: notes || ''
    });

    // Update Karigar aggregates
    if (karigar) {
      karigar.totalDozensProduced = (karigar.totalDozensProduced || 0) + numDozens;
      karigar.totalEarned = (karigar.totalEarned || 0) + grossAmount;
      karigar.netPayable = karigar.totalEarned - (karigar.totalAdvances || 0);
      await karigar.save();
    }

    // Auto add stock
    if (autoAddStock && item) {
      const halfDz = Math.floor(numDozens / 2);
      const otherHalf = numDozens - halfDz;
      if (!item.sizesStockDz) item.sizesStockDz = {};
      item.sizesStockDz['2-6'] = (item.sizesStockDz['2-6'] || 0) + halfDz;
      item.sizesStockDz['2-8'] = (item.sizesStockDz['2-8'] || 0) + otherHalf;
      item.markModified('sizesStockDz');
      await item.save();
    }

    res.status(201).json({ success: true, data: newLog });
  } catch (err) {
    next(err);
  }
};
