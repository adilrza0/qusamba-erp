import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: 'Rajasthan' },
    stateCode: { type: String, default: '08' },
    address: { type: String, default: '' },
    gstin: { type: String, default: '' },
    creditLimit: { type: Number, default: 200000 },
    paymentTermsDays: { type: Number, default: 30 },
    totalPurchases: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    outstandingBalance: { type: Number, default: 0 },
    overdueDays: { type: Number, default: 0 },
  },
  { timestamps: true }
);

buyerSchema.index({ name: 'text', city: 'text', gstin: 'text' });

const Buyer = mongoose.model('Buyer', buyerSchema);
export default Buyer;
