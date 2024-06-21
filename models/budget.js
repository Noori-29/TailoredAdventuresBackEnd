// models/Budget.js

const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    planId: { type: String, required: true },
    shopping: { type: Number, required: true },
    transportation: { type: Number, required: true },
    food: { type: Number, required: true },
    accommodation: { type: Number, required: true },
    shoppingSpent: { type: Number, default: 0 },
    transportationSpent: { type: Number, default: 0 },
    foodSpent: { type: Number, default: 0 },
    accommodationSpent: { type: Number, default: 0 }
});

module.exports = mongoose.model('Budget', budgetSchema);
