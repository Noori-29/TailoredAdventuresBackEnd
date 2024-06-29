const mongoose = require('mongoose');

const TravelPlanSchema = new mongoose.Schema({
  tourName: { type: String, required: true, unique: true },
  from: String,
  to: String,
  startDate: Date,
  endDate: Date,
  budget: Number,
  persons: Number,
  placesToVisit: Array,
  suggestedHotels: Array,
  budgetEstimation: Object,
  route: String,
}, { timestamps: true });

module.exports = mongoose.model('TravelPlan', TravelPlanSchema);
