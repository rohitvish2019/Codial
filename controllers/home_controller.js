module.exports.home =async function(req, res){
    let Posts = require('../models/post');
    let Comment = require('../models/comment');
    let Users = require('../models/user');
    try{
        let data = await Posts.find({})
        .populate('user','name email')
        .populate({
            path : 'comment',
            populate :{
                path: 'user',
            }
        })
        .sort({'createdAt':'desc'}).exec();

        let users = await Users.find({});
        return res.render('home',{title:"Home", 'posts':data, 'all_users':users});
            
    }catch(err){
        console.log("Error finding user's posts "+err);
        return res.render('home',{title:"Home"})
    }

}


