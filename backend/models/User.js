// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const UserSchema = new Schema({
//     firstName: { type: String },
//     lastName: { type: String },
//     headline: { type: String }, // Headline or job title
//     location: { type: String }, // Location
//     industry: { type: String }, // Industry
//     summary: { type: String }, // Profile summary
//     experience: [{
//         title: { type: String }, // Job title
//         company: { type: String }, // Company name
//         startDate: { type: String }, // Start date of employment
//         endDate: { type: String }, // End date of employment
//         description: { type: String }, // Job description
//         location: { type: String }, // Location of the experience
//         locationType: { type: String } // Type of location (e.g., City, Country)
//     }],
//     education: [{
//         institution: { type: String }, // School or institution name
//         degree: { type: String }, // Degree or qualification
//         fieldOfStudy: { type: String }, // Field of study
//         startDate: { type: String }, // Start date of education
//         endDate: { type: String }, // End date of education
//     }],
//     skills: [{ type: String }], // Array of skills
//     connections: { type: Number }, // Number of connections
//     profilePicture: { type: String }, // URL to profile picture
//     profileViews: { type: Number, default: 0 }, // Number of profile views
//     searches: { type: Number, default: 0 } // Number of times profile appeared in searches

// })

// const User = mongoose.model('users', UserSchema)

// module.exports = User