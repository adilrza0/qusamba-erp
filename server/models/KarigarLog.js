import mongoose from 'mongoose';

const karigarLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    karigarId: { type: String, required: true },
    karigarName: { type: String, required: true },
    craft: { type: String, default: '' },
    date: { type: String, required: true },
    itemId: { type: String, default: '' },
    itemName: { type: String, default: 'General Craft Production' },
    dozens: { type: Number, required: true, min: 0 },
    ratePerDz: { type: Number, required: true, min: 0 },
    grossAmount: { type: Number, required: true, min: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

karigarLogSchema.index({ karigarName: 'text', itemName: 'text' });

const KarigarLog = mongoose.model('KarigarLog', karigarLogSchema);
export default KarigarLog;
