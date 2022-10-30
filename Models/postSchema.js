const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    comments: [{
        user_id: {
            type: String,
        },
        name: {
            type: String,
        },
        comment: {
            type: String,
        }
    }],
    likes: [{
        people: {
            type: String
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);