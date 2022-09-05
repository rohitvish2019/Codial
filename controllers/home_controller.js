module.exports.home = function(req, res){
    let Posts = require('../models/post');
    /*
    Posts.find({user:req.user._id}, function(err, data){
        if(err){
            console.log("Error finding user's posts");
            return res.render('home',{title:"Home"})
        }
        else{
            console.log("Found some data "+ data[0].content)
            return res.render('home',{title:"Home", 'posts':data});
        }
    }); 
    */

    Posts.find({user:req.user._id}).populate('user').exec(function(err, data){
        if(err){
            console.log("Error finding user's posts");
            return res.render('home',{title:"Home"})
        }
        else{
            return res.render('home',{title:"Home", 'posts':data});
        }
    });
    
}


