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

tenantProfileSchema.pre('save', function () {
  if (this.budgetMin >= this.budgetMax) {
    throw new Error('budgetMin must be less than budgetMax');
  }
});

module.exports = mongoose.model('TenantProfile', tenantProfileSchema);
