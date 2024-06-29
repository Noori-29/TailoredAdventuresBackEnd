const express = require('express');
const {
  createTravelPlan,
  getAllTravelPlans,
  updateTravelPlan,
  deleteTravelPlan,
} = require('../controllers/travelPlanController');

const router = express.Router();

router.post('/generate', createTravelPlan);
router.get('/', getAllTravelPlans);
router.put('/:id', updateTravelPlan);
router.delete('/:id', deleteTravelPlan);

module.exports = router;
