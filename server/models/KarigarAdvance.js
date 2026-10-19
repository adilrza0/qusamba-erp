import mongoose from 'mongoose';

const karigarAdvanceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    karigarId: { type: String, required: true },
    karigarName: { type: String, required: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    mode: { type: String, default: 'Cash' },
    reason: { type: String, default: 'Cash advance' },
  },
  { timestamps: true }
);

karigarAdvanceSchema.index({ karigarName: 'text' });

const KarigarAdvance = mongoose.model('KarigarAdvance', karigarAdvanceSchema);
export default KarigarAdvance;
