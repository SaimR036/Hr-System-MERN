const mongoose = require('mongoose')
const JobSchema = new mongoose.Schema({
    Description:String,
    Date:String,
    Image:[String],
    Uid:String,
    likes: [{ type: mongoose.Schema.Types.ObjectId }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId}],
    features:[Number],
    resumes:[String],
    company:String
})
//haa
const JobModel = mongoose.model("jobs",JobSchema)
module.exports = JobModel