const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema(
  {
    instituteId: { type: String, required: true },
    instituteName: { type: String, required: true },
    profile: { type: String }, // Assume this is a URL or base64 string
    tagline: { type: String },
    location: { type: String },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    totalStudents: { type: Number },
    aboutInstitue: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("institute", instituteSchema);
