const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatisticsSchema = new Schema({
  id: { unqie: true, type: Number, isRequire: true },
  origin: { type: String },
  date: { type: Date, default: Date.now }
});

const Statistics = mongoose.model('Statistics', StatisticsSchema);

module.exports = Statistics;