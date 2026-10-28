import { Router } from 'express';
import { createListing, getListing, listListings, placeBid } from '../controllers/listingController.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.get('/', listListings);
router.get('/:id', getListing);
router.post('/', requireAuth, createListing);
router.post('/:id/bids', requireAuth, placeBid);
export default router;

