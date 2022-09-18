const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },

    comment:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }],

    like:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }]
},
{
    timestamps: true
});

const Post = mongoose.model('Posts', postSchema);
module.exports = Post;