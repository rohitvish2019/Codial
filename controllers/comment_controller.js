const Comments = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
module.exports.createComment =async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        let comment = await Comments.create({
        content:req.body.content,
        post: req.body.post,
        user: req.user._id
    });
    post.comment.push(comment);
    await post.save();
    }catch(err){
        console.log("Error "+err);
    }
    /*
    if(req.xhr){
        let user = await User.findById(req.user._id);
        return res.status(200).json({
            data : {
                comment: req.body.content,
                user : user.name
            },
            message : "Comment added"
        });
    }
    else{*/
        return res.redirect("back");
  //  }
    
}


module.exports.deleteComment = async function(req, res){
    try{
        let comment = await Comments.findById(req.params.id);
        if(comment.user == req.user.id){
            let post = await Post.findByIdAndUpdate( comment.post, { $pull : {'comment':req.params.id}});
            comment.remove();
        }
    }catch(err){
        console.log("Error "+err);
    }
    return res.redirect('back');
}    