const mongoose = require('mongoose');

const tenantProfileSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    preferredLocation: { type: String, required: true, trim: true },
    budgetMin: { type: Number, required: true, min: 0 },
    budgetMax: { type: Number, required: true, min: 0 },
    moveInDate: { type: Date, required: true },
  },
  { timestamps: true }
);

tenantProfileSchema.pre('save', function (next) {
  if (this.budgetMin >= this.budgetMax) {
    return next(new Error('budgetMin must be less than budgetMax'));
  }
  next();
});

module.exports = mongoose.model('TenantProfile', tenantProfileSchema);
