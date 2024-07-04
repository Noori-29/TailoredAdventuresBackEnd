const TravelPlan = require('../models/travelPlan');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const createTravelPlan = async (req, res) => {
  const { tourName, from, to, startDate, endDate, budget, persons } = req.body;

  try {
    console.log('Received request to create travel plan:', req.body);

    // Check if a travel plan with the same tourName already exists
    const existingPlan = await TravelPlan.findOne({ tourName });
    if (existingPlan) {
      console.log('Duplicate travel plan detected:', existingPlan);
      return res.status(400).json({ error: `A travel plan with the name "${tourName}" already exists. Please choose a different name or update the existing plan.` });
    }

    const travelPlan = new TravelPlan({
      tourName,
      from,
      to,
      startDate,
      endDate,
      budget,
      persons,
      placesToVisit: [],
      suggestedHotels: [],
      budgetEstimation: {},
      route: ""
    });

    await travelPlan.save();

    const prompt = `
      Please provide a detailed tour plan named "${tourName}" from ${from} to ${to} for ${persons} people, from ${startDate} to ${endDate} with a budget of ${budget} rupees. The response should be structured exactly as follows:

      **1. Tour Name:** <tour_name>
      **2. From:** <from>
      **3. To:** <to>
      **4. Start Date:** <start_date>
      **5. End Date:** <end_date>
      **6. Budget:** <budget>
      **7. Persons:** <persons>
      **8. Places to Visit:**
      - <place_1>
      - <place_2>
      - <place_3>
      **9. Suggested Hotels:**
      - <hotel_1>
      - <hotel_2>
      - <hotel_3>
      **10. Budget Estimation:**
      Transportation: <cost>
      Accommodation: <cost>
      Food: <cost>
      Activities: <cost>
      Miscellaneous: <cost>
      **Total:** <total_cost>
    `;

    const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);

    console.log('Full API Response:', result);

    let text = '';
    if (typeof result.response.text === 'function') {
      text = await result.response.text();
    } else if (typeof result.response.text === 'string') {
      text = result.response.text;
    } else {
      console.error('Unexpected API response format:', result);
      return res.status(500).json({ error: 'Failed to generate travel plans due to unexpected API response format' });
    }

    console.log('Response from Google Gemini API:', text);

    const placesToVisit = extractPlacesToVisit(text);
    const suggestedHotels = extractSuggestedHotels(text);
    const budgetEstimation = extractBudgetEstimation(text);

    travelPlan.placesToVisit = placesToVisit;
    travelPlan.suggestedHotels = suggestedHotels;
    travelPlan.budgetEstimation = budgetEstimation;

    await travelPlan.save();

    res.status(201).json(travelPlan);
  } catch (error) {
    console.error('Error generating travel plans:', error);
    res.status(500).json({
      error: 'Failed to generate travel plans',
      details: error.message || error.response?.data,
    });
  }
};

const extractPlacesToVisit = (text) => {
  const placesToVisit = [];
  const placesMatch = text.match(/\*\*8. Places to Visit:\*\*([\s\S]*?)\*\*9. Suggested Hotels:\*\*/);
  if (placesMatch) {
    const placesText = placesMatch[1];
    const places = placesText.split('\n')
                             .map(place => place.replace(/^\s*-\s*/, '').trim())
                             .filter(place => place);
    placesToVisit.push(...places);
  }

  console.log('Extracted Places to Visit:', placesToVisit);
  return placesToVisit;
};

const extractSuggestedHotels = (text) => {
  const suggestedHotels = [];
  const hotelsMatch = text.match(/\*\*9. Suggested Hotels:\*\*([\s\S]*?)\*\*10. Budget Estimation:\*\*/);
  if (hotelsMatch) {
    const hotelsText = hotelsMatch[1];
    const hotels = hotelsText.split('\n')
                             .map(hotel => hotel.replace(/^\s*-\s*/, '').trim())
                             .filter(hotel => hotel);
    suggestedHotels.push(...hotels);
  }

  console.log('Extracted Suggested Hotels:', suggestedHotels);
  return suggestedHotels;
};

const extractBudgetEstimation = (text) => {
  const budgetEstimation = {};
  const budgetMatch = text.match(/\*\*10. Budget Estimation:\*\*([\s\S]*?)\*\*Total:\*\*/);
  if (budgetMatch) {
    const budgetText = budgetMatch[1];
    const budgetLines = budgetText.split('\n').filter(line => line.includes(':'));
    budgetLines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        budgetEstimation[key.trim()] = parseFloat(value.replace('rupees', '').replace('Rupees', '').replace(',', '').trim());
      }
    });
  }

  console.log('Extracted Budget Estimation:', budgetEstimation);
  return budgetEstimation;
};

const getAllTravelPlans = async (req, res) => {
  try {
    const travelPlans = await TravelPlan.find();
    res.status(200).json(travelPlans);
  } catch (error) {
    console.error('Error fetching travel plans:', error);
    res.status(500).json({ error: 'Failed to fetch travel plans' });
  }
};

const updateTravelPlan = async (req, res) => {
  const { id } = req.params;
  const { tourName, from, to, startDate, endDate, budget, persons } = req.body;

  try {
    const travelPlan = await TravelPlan.findById(id);

    if (!travelPlan) {
      return res.status(404).json({ error: 'Travel plan not found' });
    }

    travelPlan.tourName = tourName || travelPlan.tourName;
    travelPlan.from = from || travelPlan.from;
    travelPlan.to = to || travelPlan.to;
    travelPlan.startDate = startDate || travelPlan.startDate;
    travelPlan.endDate = endDate || travelPlan.endDate;
    travelPlan.budget = budget || travelPlan.budget;
    travelPlan.persons = persons || travelPlan.persons;

    const prompt = `
      Please provide a detailed tour plan named "${tourName}" from ${from} to ${to} for ${persons} people, from ${startDate} to ${endDate} with a budget of ${budget} rupees. The response should be structured exactly as follows:

      **1. Tour Name:** <tour_name>
      **2. From:** <from>
      **3. To:** <to>
      **4. Start Date:** <start_date>
      **5. End Date:** <end_date>
      **6. Budget:** <budget>
      **7. Persons:** <persons>
      **8. Places to Visit:**
      - <place_1>
      - <place_2>
      - <place_3>
      **9. Suggested Hotels:**
      - <hotel_1>
      - <hotel_2>
      - <hotel_3>
      **10. Budget Estimation:**
      Transportation: <cost>
      Accommodation: <cost>
      Food: <cost>
      Activities: <cost>
      Miscellaneous: <cost>
      **Total:** <total_cost>
    `;

    const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);

    let text = '';
    if (typeof result.response.text === 'function') {
      text = await result.response.text();
    } else if (typeof result.response.text === 'string') {
      text = result.response.text;
    } else {
      console.error('Unexpected API response format:', result);
      return res.status(500).json({ error: 'Failed to update travel plans due to unexpected API response format' });
    }

    const placesToVisit = extractPlacesToVisit(text);
    const suggestedHotels = extractSuggestedHotels(text);
    const budgetEstimation = extractBudgetEstimation(text);

    travelPlan.placesToVisit = placesToVisit;
    travelPlan.suggestedHotels = suggestedHotels;
    travelPlan.budgetEstimation = budgetEstimation;

    await travelPlan.save();

    res.status(200).json(travelPlan);
  } catch (error) {
    console.error('Error updating travel plans:', error);
    res.status(500).json({
      error: 'Failed to update travel plans',
      details: error.message || error.response?.data,
    });
  }
};

const deleteTravelPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const travelPlan = await TravelPlan.findByIdAndDelete(id);

    if (!travelPlan) {
      return res.status(404).json({ error: 'Travel plan not found' });
    }

    res.status(200).json({ message: 'Travel plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting travel plans:', error);
    res.status(500).json({ error: 'Failed to delete travel plans', details: error.message });
  }
};

module.exports = {
  createTravelPlan,
  getAllTravelPlans,
  updateTravelPlan,
  deleteTravelPlan,
};
