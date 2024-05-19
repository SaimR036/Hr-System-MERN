const mongoose = require('mongoose')
const iqraFriendsSchema = new mongoose.Schema({
    Fid1:String,
    Fid2:String
})
const iqraFModel = mongoose.model("iqrafriends",iqraFriendsSchema)
module.exports = iqraFModel