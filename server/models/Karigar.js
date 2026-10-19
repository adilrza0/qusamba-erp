import mongoose from 'mongoose';

const karigarSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    craft: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    village: { type: String, default: '' },
    ratePerDz: { type: Number, required: true, min: 0 },
    totalDozensProduced: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    totalAdvances: { type: Number, default: 0 },
    netPayable: { type: Number, default: 0 },
    activeOrder: { type: String, default: '' },
  },
  { timestamps: true }
);

karigarSchema.index({ name: 'text', craft: 'text' });

const Karigar = mongoose.model('Karigar', karigarSchema);
export default Karigar;
