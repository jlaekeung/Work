const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;