const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    authorType: { type: String, enum: ['iqrausers', 'companies'], required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
    Description: String,
    createdAt: { type: Date, default: Date.now },
    Image: [String],
    Uid: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId }],
    comments: { type: [CommentSchema], default: [] } // Embed CommentSchema directly
});

const PostModel = mongoose.model("posts", PostSchema);

module.exports = PostModel;
