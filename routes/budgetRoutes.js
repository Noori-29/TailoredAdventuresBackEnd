const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// Route to fetch all budgets
router.get('/', budgetController.fetchBudgets);

// Route to create a new budget
router.post('/', budgetController.createBudget);

// Route to create a budget from a plan
router.post('/from-plan/:planId', budgetController.createBudgetFromPlan);

// Route to update a specific budget
router.put('/:id', budgetController.updateBudget);

// Route to delete a specific budget
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
