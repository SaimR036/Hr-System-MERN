const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the company profile
const CompanySchema = new Schema({
  name: { type: String, required: true }, // Marked as required
  email: { type: String, required: true },
  password: { 
    type: String, 
    required: true
},
  logo: { type: String },
  coverImage: { type: String },
  tagline: { type: String },
  overview: { type: String },
  websiteURL: { type: String },
  industry: { type: String }, // Made optional
  companySize: { type: String },
  headquarters: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
  },
  type: { type: String, required: true },
  founded: { type: Number },
  specialties: { type: [String] },
  locations: [{
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
  }],
  companyUpdates: [{
    updateId: { type: Schema.Types.ObjectId, auto: true },
    date: { type: Date, default: Date.now },
    content: { type: String }
  }],
  jobs: [{
    jobId: { type: Schema.Types.ObjectId, auto: true },
    title: { type: String },
    location: { type: String },
    description: { type: String }
  }],
  life: {
    culture: { type: String },
    photos: { type: [String] },
    videos: { type: [String] }
  },
  affiliatedPages: [{
    name: { type: String },
    url: { type: String }
  }],
  employeeInsights: {
    totalEmployees: { type: Number },
    skills: { type: [String] },
    jobTitles: { type: [String] },
    education: { type: [String] }
  }
});

// Create the model from the schema and export it
const Company = mongoose.model('companies', CompanySchema);
module.exports = Company;
