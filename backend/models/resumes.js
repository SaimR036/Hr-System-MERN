const mongoose = require('mongoose');

const res = new mongoose.Schema({
    
    Uid:String,
    Pid:String,
    Userid:String,
    image:String

  
});

const Resume = mongoose.model("resumes",res)
module.exports = Resume