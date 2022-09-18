const Comments = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comment_mailer');
//const commentEmailWorker = require('../workers/comment_email_worker');
//const queue = require('../config/kue');
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
                /*let job = queue.createJob('email', thisComment).save(function(err){
                    if(err){console.log("Error creating job "+err); return;}
                    console.log("job enqueued "+job.id);
                })*/
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
            await Like.deleteMany({likable: comment._id});
            comment.remove();
            
        }
    }catch(err){
        console.log("Error "+err);
    }
    return res.redirect('back');
}


module.exports.addLikeToComment = async function(req, res){
    let count =0;
    let comment = await Comments.findById(req.params.id).populate('like').populate('user');
    let likesCount = comment.like.length
    try{
        for(let i=0;i<likesCount;i++){
            if(comment.like[i].user == req.user.id){
                let idToDelete = comment.like[i]._id;
                await Comments.findByIdAndUpdate( comment._id, { $pull : {'like':idToDelete}});
                await Like.findByIdAndDelete(idToDelete);
                return res.redirect('back');
            }else{
                count++;
            }
        }
    }catch(err){
        console.log("Error removing like "+err);
    }
    
    try{
        if(count == likesCount){
            let like = await Like.create({
                user:req.user.id,
                likable: comment._id,
                onModel:'Comment'
            });
            comment.like.push(like._id);
            await comment.save();
        }
    }catch(err){
        console.log("Error adding a like "+err)
    }
    return res.redirect('back')
}