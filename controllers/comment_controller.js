const Comments = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const commentsMailer = require('../mailers/comment_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
module.exports.createComment =async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comments.create({
                content:req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comment.push(comment._id);
            await post.save();
            let commentedPostUser = await User.findById(post.user, 'name email');
            if(req.xhr){
                console.log("This is a xhr request");
            }else{
                let thisComment = await Comments.findById(comment._id).populate('user');
                console.log("normal request");
                let job = queue.createJob('email', thisComment).save(function(err){
                    if(err){console.log("Error creating job "+err); return;}
                    console.log("job enqueued "+job.id);
                })
                return res.redirect('back')
            }
        }
    }catch(err){
        console.log("Error creating new comment "+err);
    }
    
    
    
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