let Post = require('../models/post');
let Comment = require('../models/comment');
let User = require('../models/user');
const Like = require('../models/like');
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
            post.remove();
            await Comment.deleteMany({ post: thisID});
            await Like.deleteMany({likable: thisID});
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

module.exports.addLikeToPost = async function(req, res){
    console.log("Reached to like post")
    let count = 0;
    let post = await Post.findById(req.params.id).populate('like').populate('user');
    let likesCount = post.like.length;
    try{
        for(let i=0;i<likesCount;i++){
            if(post.like[i].user == req.user.id){
                let idToDelete = post.like[i]._id;
                await Post.findByIdAndUpdate( post._id, { $pull : {'like':idToDelete}});
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
                likable: post._id,
                onModel:'Post'
            });
            post.like.push(like._id);
            await post.save();
        }
    }catch(err){
        console.log("Error adding a like "+err)
    }
    return res.redirect('back')
    
}