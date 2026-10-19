import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    itemName: { type: String, required: true },
    hsn: { type: String, default: '71179090' },
    sizes: { type: Map, of: Number, default: {} },
    totalDozens: { type: Number, required: true, min: 0 },
    boxes: { type: Number, default: 0 },
    ratePerDz: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    invoiceNumber: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    dueDate: { type: String, default: '' },
    buyerId: { type: String, required: true },
    buyerName: { type: String, required: true },
    buyerGstin: { type: String, default: '' },
    buyerAddress: { type: String, default: '' },
    buyerState: { type: String, default: '' },
    buyerStateCode: { type: String, default: '' },
    isInterstate: { type: Boolean, default: false },
    gstRate: { type: Number, default: 3 },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxableAmount: { type: Number, required: true, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['Paid', 'Partial', 'Unpaid'],
      default: 'Unpaid',
    },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    paymentTerms: { type: String, default: 'Credit 30 Days' },
  },
  { timestamps: true }
);

invoiceSchema.index({ invoiceNumber: 'text', buyerName: 'text' });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
