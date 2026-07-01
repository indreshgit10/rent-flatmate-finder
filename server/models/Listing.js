const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true, trim: true },
    rent: { type: Number, required: true, min: 0 },
    availableFrom: { type: Date, required: true },
    roomType: { type: String, enum: ['single', 'shared', 'studio'], required: true },
    furnishing: { type: String, enum: ['furnished', 'unfurnished', 'semi'], required: true },
    photos: [{ type: String }],
    isFilled: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

listingSchema.index({ owner: 1 });
listingSchema.index({ location: 1 });

module.exports = mongoose.model('Listing', listingSchema);
