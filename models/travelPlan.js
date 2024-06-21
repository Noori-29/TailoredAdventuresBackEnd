const mongoose = require('mongoose');

const TravelPlanSchema = new mongoose.Schema({
  from: String,
  to: String,
  days: Number,
  budget: Number,
  persons: Number,
  plans: Array,
}, { timestamps: true });

module.exports = mongoose.model('TravelPlan', TravelPlanSchema);
