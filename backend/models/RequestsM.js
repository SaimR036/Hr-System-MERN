const mongoose = require('mongoose')
const ReqSchema = new mongoose.Schema({
    Sid:String,
    Rid:String
})
//haa
const ReqModel = mongoose.model("requests",ReqSchema)
module.exports = ReqModel