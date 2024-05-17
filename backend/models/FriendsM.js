const mongoose = require('mongoose')
const FriendsSchema = new mongoose.Schema({
    Fid1:String,
    Fid2:String
})
const FModel = mongoose.model("friends",FriendsSchema)
module.exports = FModel