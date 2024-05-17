const mongoose = require('mongoose')
const RatSchema = new mongoose.Schema({
    Uid:String,
    Pid:String,
    Val:Number
})
//haas
const RatModel = mongoose.model("ratings",RatSchema)
module.exports = RatModel