import mongoose from 'mongoose';

/**
 * Sample ERP Item model.
 *
 * Represents a generic inventory/catalog item. Extend with fields
 * relevant to your ERP domain (e.g., warehouse, supplier, variants).
 */
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [200, 'Item name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,   // Allows multiple docs with no SKU (null)
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,  // Adds createdAt & updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for fast text search on name & category
itemSchema.index({ name: 'text', category: 'text' });

const Item = mongoose.model('Item', itemSchema);

export default Item;
