import mongoose from 'mongoose';

const rawMaterialSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'General' },
    stockQty: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: 'Kg' },
    unitCost: { type: Number, required: true, min: 0 },
    minStockAlert: { type: Number, default: 50 },
    supplier: { type: String, default: '' },
  },
  { timestamps: true }
);

rawMaterialSchema.index({ name: 'text', category: 'text', supplier: 'text' });

const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);
export default RawMaterial;
