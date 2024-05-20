const mongoose = require('mongoose')
const PostSchema = new mongoose.Schema({
    Description:String,
    Date:String,
    Image:[String],
    Uid:String,
    likes: [{ type: mongoose.Schema.Types.ObjectId}],
  comments: [{
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
})
//haa
const PostModel = mongoose.model("posts",PostSchema)
module.exports = PostModel