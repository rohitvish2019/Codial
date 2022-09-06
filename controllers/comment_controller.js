const Comments = require('../models/comment');
const Post = require('../models/post');
module.exports.createComment = function(req, res){
    console.log(req.body);
    Post.findById(req.body.post, function(err, post){
        if(err){
            console.log("Invalid post to comment");
        }
        else{
            Comments.create({
                content:req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){
                if(err){
                    console.log("Error creating comments "+err);
                }
                else{
                    console.log("Adding comment to post DB");
                    post.comment.push(comment);
                    post.save();
                }
            });

            
        }
    })
    
    return res.redirect("back");
}


module.exports.deleteComment = function(req, res){
    Comments.findById(req.params.id, function(err, comment){
        if(comment.user == req.user.id){
            Post.findByIdAndUpdate( comment.post, { $pull : {'comment':req.params.id}}, function(err, post){
                console.log("Error delete comments reference");
            });
            comment.remove();
        }

        return res.redirect('back');
    })
}