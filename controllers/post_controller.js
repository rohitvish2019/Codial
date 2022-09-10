let Post = require('../models/post');
let Comment = require('../models/comment');
let User = require('../models/user');
module.exports.addPost= async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        let user = await User.findById(req.user._id);
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post:post,
                    username: user.name
                },
                message:"Post created successfully in DB",
            });
        }
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

module.exports.deletePostViaAjax =async function(req, res){
    let thisID = req.body.id.slice(7)
    console.log(thisID);
    try{
        let post = await Post.findById(thisID);
        if(post.user == req.user.id){
            console.log("removing post")
            post.remove();
            await Comment.deleteMany({ post: thisID});
            return res.status(200).json({
                data: {
                    id:req.body.id,
                },
                message:"Post Deleted successfully from DB",
            })
        }
    }catch(err){
        console.log("Error "+err);
        return res.redirect('back');
    }
}