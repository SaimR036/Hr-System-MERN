const mongoose = require('mongoose');

// Define the schema for LinkedIn posts
const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  image: { type: String }, // URL or path to the image file
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  comments: [{
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    createdAt: { type: Date, default: Date.now }
  }]
});

// Create the Post model
const Post = mongoose.model('nag', postSchema);

module.exports = Post;
