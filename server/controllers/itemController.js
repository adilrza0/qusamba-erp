import Item from '../models/Item.js';

/**
 * @desc    Get all items (with basic pagination & filtering)
 * @route   GET /api/items
 * @access  Public (add `protect` middleware to lock down)
 */
export const getItems = async (req, res, next) => {
  try {
    const page  = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Cap at 100
    const skip  = (page - 1) * limit;

    // Optional category filter
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.active !== undefined) filter.isActive = req.query.active === 'true';

    const [items, total] = await Promise.all([
      Item.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Item.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: items.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single item by ID
 * @route   GET /api/items/:id
 */
export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new item
 * @route   POST /api/items
 */
export const createItem = async (req, res, next) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    // Mongoose validation errors → 400
    if (err.name === 'ValidationError') res.status(400);
    // Duplicate key (e.g., SKU) → 409 Conflict
    if (err.code === 11000) {
      res.status(409);
      err.message = `Duplicate value: ${JSON.stringify(err.keyValue)}`;
    }
    next(err);
  }
};

/**
 * @desc    Update an item
 * @route   PUT /api/items/:id
 */
export const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,           // Return the updated document
      runValidators: true,  // Re-run schema validators on update
    });

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    res.json({ success: true, data: item });
  } catch (err) {
    if (err.name === 'ValidationError') res.status(400);
    next(err);
  }
};

/**
 * @desc    Delete an item
 * @route   DELETE /api/items/:id
 */
export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    res.json({ success: true, message: 'Item removed', data: item });
  } catch (err) {
    next(err);
  }
};
