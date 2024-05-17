const mongoose = require('mongoose')
const JobSchema = new mongoose.Schema({
    Description:String,
    Date:String,
    Image:[String],
    Uid:String,
    features:[Number]
})
//haa
const JobModel = mongoose.model("jobs",JobSchema)
module.exports = JobModel