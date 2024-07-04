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
    const totalAmount = shopping + transportation + food + accommodation + miscellaneous;
    const totalSpent = 0; // Initial spent amount is 0
    const newBudget = await Budget.create({ name, planId, shopping, transportation, food, accommodation, miscellaneous, totalAmount, totalSpent });
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
    const shopping = budgetEstimation.Shopping || 0;
    const transportation = budgetEstimation.Transportation || 0;
    const food = budgetEstimation.Food || 0;
    const accommodation = budgetEstimation.Accommodation || 0;
    const miscellaneous = budgetEstimation.Miscellaneous || 0;
    const totalAmount = shopping + transportation + food + accommodation + miscellaneous;
    const newBudget = await Budget.create({
      name: plan.tourName,
      planId,
      shopping,
      transportation,
      food,
      accommodation,
      miscellaneous,
      totalAmount,
      totalSpent: 0
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
    budget.totalSpent = budget.shoppingSpent + budget.transportationSpent + budget.foodSpent + budget.accommodationSpent + budget.miscellaneousSpent;

    // Check if any category exceeds the budget
    let alertMessage = '';
    if (budget.shoppingSpent > budget.shopping) alertMessage += 'Shopping budget exceeded. ';
    if (budget.transportationSpent > budget.transportation) alertMessage += 'Transportation budget exceeded. ';
    if (budget.foodSpent > budget.food) alertMessage += 'Food budget exceeded. ';
    if (budget.accommodationSpent > budget.accommodation) alertMessage += 'Accommodation budget exceeded. ';
    if (budget.miscellaneousSpent > budget.miscellaneous) alertMessage += 'Miscellaneous budget exceeded. ';

    await budget.save();
    res.json({ budget, alertMessage });
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
