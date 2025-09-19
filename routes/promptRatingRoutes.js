const express = require('express');
const mongoose = require('mongoose');
const Prompt = require('../models/Prompt');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:promptId/rate', authMiddleware, async (req, res) => {
  const { promptId } = req.params;
  const { score } = req.body ?? {};
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(promptId)) {
    return res.status(400).json({ message: 'Invalid prompt id' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const numericScore = Number(score);

  if (!Number.isInteger(numericScore) || numericScore < 1 || numericScore > 5) {
    return res.status(400).json({ message: 'Score must be an integer between 1 and 5' });
  }

  try {
    const prompt = await Prompt.findById(promptId);

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    prompt.setRatingForUser(userId, numericScore);
    await prompt.save();

    const { averageRating, totalRatings } = prompt.getRatingSummary();

    return res.status(200).json({
      message: 'Rating submitted successfully',
      averageRating,
      totalRatings,
    });
  } catch (error) {
    console.error('Failed to submit rating:', error);
    return res.status(500).json({ message: 'Unable to submit rating', error: error.message });
  }
});

module.exports = router;
