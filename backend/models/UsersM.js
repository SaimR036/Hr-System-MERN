const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    Name:String,
    Headline:String,
    Email:String,
    weights:[Number],
    Photo:String
})
//haa
const UserModel = mongoose.model("users",UserSchema)
module.exports = UserModel