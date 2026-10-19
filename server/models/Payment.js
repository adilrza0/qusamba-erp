import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    receiptNumber: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    buyerId: { type: String, required: true },
    buyerName: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    mode: { type: String, default: 'UPI' },
    refNumber: { type: String, default: '' },
    invoiceNumber: { type: String, default: 'On Account' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

paymentSchema.index({ receiptNumber: 'text', buyerName: 'text', refNumber: 'text' });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
