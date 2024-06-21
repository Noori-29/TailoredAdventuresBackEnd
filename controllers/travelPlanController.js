const TravelPlan = require('../models/travelPlan');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with the provided API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create a new travel plan
const createTravelPlan = async (req, res) => {
  const { from, to, days, budget, persons } = req.body;

  let travelPlan;
  try {
    travelPlan = new TravelPlan({
      from,
      to,
      days,
      budget,
      persons,
      plans: []
    });

    await travelPlan.save();
  } catch (error) {
    console.error('Error saving initial travel plan data:', error);
    return res.status(500).json({ error: 'Failed to save initial travel plan data' });
  }

  const prompt = `Generate 2-3 plans from ${from} to ${to} for ${days} days having a budget of ${budget} Rupees for ${persons} persons.`;

  try {
    const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log('Response from Google Gemini API:', text);

    const plans = text.trim().split('\n\n');

    travelPlan.plans = plans;
    await travelPlan.save();

    res.status(201).json(travelPlan);
  } catch (error) {
    console.error('Error generating travel plans:', error);
    res.status(500).json({
      error: 'Failed to generate travel plans',
      details: error.message || error.response.data,
    });
  }
};

// Get all travel plans
const getAllTravelPlans = async (req, res) => {
  try {
    const travelPlans = await TravelPlan.find();
    res.status(200).json(travelPlans);
  } catch (error) {
    console.error('Error fetching travel plans:', error);
    res.status(500).json({ error: 'Failed to fetch travel plans' });
  }
};

// Get a travel plan by ID
const getTravelPlanById = async (req, res) => {
  try {
    const travelPlan = await TravelPlan.findById(req.params.id);
    if (!travelPlan) {
      return res.status(404).json({ error: 'Travel plan not found' });
    }
    res.status(200).json(travelPlan);
  } catch (error) {
    console.error('Error fetching travel plan:', error);
    res.status(500).json({ error: 'Failed to fetch travel plan' });
  }
};

// Update a travel plan
const updateTravelPlan = async (req, res) => {
  try {
    const travelPlan = await TravelPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!travelPlan) {
      return res.status(404).json({ error: 'Travel plan not found' });
    }
    res.status(200).json(travelPlan);
  } catch (error) {
    console.error('Error updating travel plan:', error);
    res.status(500).json({ error: 'Failed to update travel plan' });
  }
};

// Delete a travel plan
const deleteTravelPlan = async (req, res) => {
  try {
    const travelPlan = await TravelPlan.findByIdAndDelete(req.params.id);
    if (!travelPlan) {
      return res.status(404).json({ error: 'Travel plan not found' });
    }
    res.status(200).json({ message: 'Travel plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting travel plan:', error);
    res.status(500).json({ error: 'Failed to delete travel plan' });
  }
};

module.exports = {
  createTravelPlan,
  getAllTravelPlans,
  getTravelPlanById,
  updateTravelPlan,
  deleteTravelPlan
};
