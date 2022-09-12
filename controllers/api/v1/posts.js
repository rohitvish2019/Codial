let Users = require('../../../models/user');
let Posts = require('../../../models/post');
let Comment = require('../../../models/comment');
module.exports.getPosts = async function(req, res){
    console.log("here we go");

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
        return res.status(200).json({
            posts:data,
            message:"Success"
        });
            
    }catch(err){
        return res.status(500).json({
            posts: err,
            message:"Error finding data"
        });
    }

}

module.exports.deletePost = async function(req, res){
    
    try{
        let post = await Posts.findById(req.params.id);
        if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({ post: req.params.id});
            return res.status(200).json({
                message:"Post and associated comments are deleted successfully"
            });
        }
        else{
            return res.status(401).json({
                message:"You are not autorized to delete the post"
            })
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal server error",
            error: err
        })
    }
    
}