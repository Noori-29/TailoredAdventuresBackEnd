const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// Route to fetch all budgets
router.get('/', budgetController.fetchBudgets);

// Route to create a new budget
router.post('/', budgetController.createBudget);

// Route to update a specific budget
router.put('/:id', budgetController.updateBudget);

module.exports = router;
