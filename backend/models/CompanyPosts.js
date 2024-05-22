const mongoose = require('mongoose');

// Define the schema for LinkedIn posts
const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  image: { type: String }, // URL or path to the image file
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'companies', required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId}],
  comments: [{
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true }, // Store the ObjectId of the author
    authorType: { type: String, enum: ['iqrausers', 'companies'], required: true }, // Indicate the type of author
    createdAt: { type: Date, default: Date.now }
  }]
});

// Create the Post model
const Post = mongoose.model('companyposts', postSchema);

module.exports = Post;
