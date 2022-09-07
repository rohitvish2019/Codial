let Post = require('../models/post');
let Comment = require('../models/comment');
module.exports.addPost= async function(req, res){
    //let db = require('../config/mongoose');
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
    }catch(err){
        console.log("Error "+err)
    }
    return res.redirect('back');
}

module.exports.deletePost = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({ post: req.params.id});
        }
    }catch(err){
        console.log("Error "+err);
    }
    return res.redirect('back')
}