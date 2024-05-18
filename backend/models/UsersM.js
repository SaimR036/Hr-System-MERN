const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    Name:String,
    Headline:String,
    Email:String,
    weights:[Number],
    Photo:String,
    b:Number,
    ban:Number,
    prem:Number
})
//haa
const UserModel = mongoose.model("users",UserSchema)
module.exports = UserModel