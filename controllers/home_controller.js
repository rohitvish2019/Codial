module.exports.home = function(req, res){
    let Posts = require('../models/post');
    let Comment = require('../models/comment');
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

    
    Posts.find({})
    .populate('user','name email')
    .populate({
        path : 'comment',
        populate :{
            path: 'user',
        }
    })
    .exec(function(err, data){
        if(err){
            console.log("Error finding user's posts "+err);
            return res.render('home',{title:"Home"})
        }
        else{
            console.log(data);
            return res.render('home',{title:"Home", 'posts':data});
        }
    });

}


