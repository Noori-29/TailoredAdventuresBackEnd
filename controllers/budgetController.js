const Budget = require('../models/budget');

// Controller method to fetch all budgets
async function fetchBudgets(req, res) {
    try {
        const budgets = await Budget.find({});
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controller method to create a new budget
async function createBudget(req, res) {
    const { planId, shopping, transportation, food, accommodation } = req.body;
    try {
        const newBudget = await Budget.create({ planId, shopping, transportation, food, accommodation });
        res.status(201).json(newBudget);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Controller method to update a specific budget
async function updateBudget(req, res) {
    const { id } = req.params;
    const { shoppingSpent, transportationSpent, foodSpent, accommodationSpent } = req.body;
    try {
        const budget = await Budget.findById(id);
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }
        budget.shoppingSpent += shoppingSpent;
        budget.transportationSpent += transportationSpent;
        budget.foodSpent += foodSpent;
        budget.accommodationSpent += accommodationSpent;
        await budget.save();
        res.json({ message: 'Budget updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    fetchBudgets,
    createBudget,
    updateBudget
};
