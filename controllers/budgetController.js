const Budget = require('../models/budget');
const TravelPlan = require('../models/travelPlan');

async function fetchBudgets(req, res) {
  try {
    const budgets = await Budget.find({});
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createBudget(req, res) {
  const { name, planId, shopping, transportation, food, accommodation, miscellaneous } = req.body;
  try {
    const newBudget = await Budget.create({ name, planId, shopping, transportation, food, accommodation, miscellaneous });
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function createBudgetFromPlan(req, res) {
  const { planId } = req.params;
  try {
    const plan = await TravelPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Travel plan not found' });
    }
    const budgetEstimation = plan.budgetEstimation || {};
    const newBudget = await Budget.create({
      name: plan.tourName,
      planId,
      shopping: budgetEstimation.Shopping || 0,
      transportation: budgetEstimation.Transportation || 0,
      food: budgetEstimation.Food || 0,
      accommodation: budgetEstimation.Accommodation || 0,
      miscellaneous: budgetEstimation.Miscellaneous || 0,
    });
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateBudget(req, res) {
  const { id } = req.params;
  const { shoppingSpent, transportationSpent, foodSpent, accommodationSpent, miscellaneousSpent } = req.body;
  try {
    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    budget.shoppingSpent += shoppingSpent;
    budget.transportationSpent += transportationSpent;
    budget.foodSpent += foodSpent;
    budget.accommodationSpent += accommodationSpent;
    budget.miscellaneousSpent += miscellaneousSpent;
    await budget.save();
    res.json({ message: 'Budget updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteBudget(req, res) {
  const { id } = req.params;
  try {
    const budget = await Budget.findByIdAndDelete(id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  fetchBudgets,
  createBudget,
  createBudgetFromPlan,
  updateBudget,
  deleteBudget
};
