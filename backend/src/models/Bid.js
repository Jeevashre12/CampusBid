import mongoose from 'mongoose';
const bidSchema = new mongoose.Schema({ listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }, bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, amount: { type: Number, required: true, min: 0 }, status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'WON', 'LOST'], default: 'PENDING' } }, { timestamps: true });
bidSchema.index({ listing: 1, amount: -1, createdAt: -1 });
export default mongoose.model('Bid', bidSchema);
