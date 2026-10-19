import { Router } from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';

// Uncomment the import below and add `protect` to routes that need auth:
// import { protect } from '../middleware/auth.js';

const router = Router();

router.route('/')
  .get(getItems)      // GET  /api/items
  .post(createItem);  // POST /api/items

router.route('/:id')
  .get(getItemById)       // GET    /api/items/:id
  .put(updateItem)        // PUT    /api/items/:id
  .delete(deleteItem);    // DELETE /api/items/:id

export default router;
