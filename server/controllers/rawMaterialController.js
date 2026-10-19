import RawMaterial from '../models/RawMaterial.js';

export const getRawMaterials = async (_req, res, next) => {
  try {
    const materials = await RawMaterial.find().sort({ createdAt: -1 });
    res.json({ success: true, count: materials.length, data: materials });
  } catch (err) {
    next(err);
  }
};

export const createRawMaterial = async (req, res, next) => {
  try {
    const materialData = {
      ...req.body,
      id: req.body.id || `RM-${Date.now().toString().slice(-4)}`
    };
    const material = await RawMaterial.create(materialData);
    res.status(201).json({ success: true, data: material });
  } catch (err) {
    next(err);
  }
};

export const updateRawMaterial = async (req, res, next) => {
  try {
    const material = await RawMaterial.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }] },
      req.body,
      { new: true, runValidators: true }
    );
    if (!material) {
      res.status(404);
      throw new Error('Raw material not found');
    }
    res.json({ success: true, data: material });
  } catch (err) {
    next(err);
  }
};

export const deleteRawMaterial = async (req, res, next) => {
  try {
    const material = await RawMaterial.findOneAndDelete({
      $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
    });
    if (!material) {
      res.status(404);
      throw new Error('Raw material not found');
    }
    res.json({ success: true, message: 'Raw material removed', data: material });
  } catch (err) {
    next(err);
  }
};

export const adjustRawStock = async (req, res, next) => {
  try {
    const { deltaQty } = req.body;
    const material = await RawMaterial.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
    });

    if (!material) {
      res.status(404);
      throw new Error('Raw material not found');
    }

    material.stockQty = Math.max(0, (material.stockQty || 0) + (Number(deltaQty) || 0));
    await material.save();

    res.json({ success: true, data: material });
  } catch (err) {
    next(err);
  }
};
