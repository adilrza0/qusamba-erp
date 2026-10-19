import mongoose from 'mongoose';

const finishedGoodSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    sku: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    material: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    hsn: { type: String, default: '71179090' },
    dzPerBox: { type: Number, default: 4 },
    costPerDz: { type: Number, required: true, min: 0 },
    wholesaleRatePerDz: { type: Number, required: true, min: 0 },
    minStockAlertDz: { type: Number, default: 40 },
    sizesStockDz: {
      '2-2': { type: Number, default: 0 },
      '2-4': { type: Number, default: 0 },
      '2-6': { type: Number, default: 0 },
      '2-8': { type: Number, default: 0 },
      '2-10': { type: Number, default: 0 },
      '2-12': { type: Number, default: 0 },
    },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

finishedGoodSchema.index({ name: 'text', sku: 'text', category: 'text' });

const FinishedGood = mongoose.model('FinishedGood', finishedGoodSchema);
export default FinishedGood;
