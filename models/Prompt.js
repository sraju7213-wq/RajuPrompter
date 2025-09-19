const mongoose = require('mongoose');

const { Schema, Types } = mongoose;

const ratingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const promptSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    ratings: {
      type: [ratingSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

promptSchema.methods.setRatingForUser = function setRatingForUser(userId, score) {
  const normalizedUserId = Types.ObjectId.isValid(userId)
    ? new Types.ObjectId(userId)
    : userId;
  const normalizedScore = Math.max(1, Math.min(5, Math.round(score)));
  const existingIndex = this.ratings.findIndex((entry) => entry.user.equals(normalizedUserId));

  if (existingIndex >= 0) {
    this.ratings[existingIndex].score = normalizedScore;
    this.ratings[existingIndex].createdAt = new Date();
  } else {
    this.ratings.push({ user: normalizedUserId, score: normalizedScore });
  }
};

promptSchema.methods.getRatingSummary = function getRatingSummary() {
  if (!this.ratings.length) {
    return { averageRating: 0, totalRatings: 0 };
  }

  const totalRatings = this.ratings.length;
  const sum = this.ratings.reduce((acc, rating) => acc + rating.score, 0);

  return {
    averageRating: Math.round((sum / totalRatings) * 10) / 10,
    totalRatings,
  };
};

module.exports = mongoose.models.Prompt || mongoose.model('Prompt', promptSchema);
