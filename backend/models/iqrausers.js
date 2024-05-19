const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    Headline: { type: String, required: true, trim: true },
    Photo: {type:String,required:true,trim:true},
    Name:{type:String,required:true,trim:true},
    weights:[Number],
    b:Number,
    ban:Number,
    prem:Number,
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        unique: true, 
        match: [/.+\@.+\..+/, 'Please fill a valid email address'] 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
    headline: { type: String, trim: true }, // Headline or job title
    location: { type: String, trim: true }, // Location
    industry: { type: String, trim: true }, // Industry
    summary: { type: String, trim: true }, // Profile summary
    experience: [{
        title: { type: String, trim: true }, // Job title
        company: { type: String, trim: true }, // Company name
        startDate: { type: Date, required: true }, // Start date of employment
        endDate: { type: Date }, // End date of employment
        description: { type: String, trim: true }, // Job description
        location: { type: String, trim: true }, // Location of the experience
        locationType: { type: String, trim: true } // Type of location (e.g., City, Country)
    }],
    education: [{
        institution: { type: String, trim: true }, // School or institution name
        degree: { type: String, trim: true }, // Degree or qualification
        fieldOfStudy: { type: String, trim: true }, // Field of study
        startDate: { type: Date, required: true }, // Start date of education
        endDate: { type: Date }, // End date of education
    }],
    skills: [{ type: String, trim: true }], // Array of skills
    connections: { type: Number, default: 0 }, // Number of connections
    profilePicture: { type: String, trim: true }, // URL to profile picture
    profileViews: { type: Number, default: 0 }, // Number of profile views
    searches: { type: Number, default: 0 } // Number of times profile appeared in searches
}, {
    timestamps: true
});

const User = mongoose.model('iqrausers', UserSchema);

module.exports = User;
