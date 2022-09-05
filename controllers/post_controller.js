module.exports.addPost= function(req, res){
    console.log(req.body);
    let db = require('../config/mongoose');
    let Post = require('../models/post');
    Post.create({
        content: req.body.content,
        user: req.body.user
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