const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  shopping: { type: Number, required: true },
  transportation: { type: Number, required: true },
  food: { type: Number, required: true },
  accommodation: { type: Number, required: true },
  miscellaneous: { type: Number, required: true },
  shoppingSpent: { type: Number, default: 0 },
  transportationSpent: { type: Number, default: 0 },
  foodSpent: { type: Number, default: 0 },
  accommodationSpent: { type: Number, default: 0 },
  miscellaneousSpent: { type: Number, default: 0 }
});

budgetSchema.virtual('totalSpent').get(function() {
  return this.shoppingSpent + this.transportationSpent + this.foodSpent + this.accommodationSpent + this.miscellaneousSpent;
});

budgetSchema.virtual('totalRemaining').get(function() {
  return (this.shopping + this.transportation + this.food + this.accommodation + this.miscellaneous) - this.totalSpent;
});

budgetSchema.virtual('totalBudget').get(function() {
  return this.shopping + this.transportation + this.food + this.accommodation + this.miscellaneous;
});

module.exports = mongoose.model('Budget', budgetSchema);
