const mongoose = require('mongoose')
const PostSchema = new mongoose.Schema({
    Description:String,
    Date:String,
    Image:[String],
    Uid:String
})
//haa
const PostModel = mongoose.model("posts",PostSchema)
module.exports = PostModel