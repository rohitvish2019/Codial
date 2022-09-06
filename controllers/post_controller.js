let Post = require('../models/post');
let Comment = require('../models/comment');
module.exports.addPost= function(req, res){
    console.log(req.body);
    let db = require('../config/mongoose');
    
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err){
        if(err){
            console.log("Error creating post");
        }
        else{
            console.log("Post created successfully")
        }
    })
    return res.redirect('back');
}

module.exports.deletePost = function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(post.user == req.user.id){
            post.remove();
            
            Comment.deleteMany({ post: req.params.id}, function(err){
                if(err){
                    console.log("Error deleteing comments");
                }
            });
        }

        return res.redirect('back')
    })
}