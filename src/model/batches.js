const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  instituteId: { type: String, required: true },
  batchName: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  daysOfClasses: { type: [String] },
  timeSlot: { startTime: String, endTime: String },
  seatsAvailable: { type: Number }, 
  facultyAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'faculty', default: null }
}, {timestamps: true});

module.exports = mongoose.model('batches', batchSchema);
