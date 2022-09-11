const User = require('../models/user');

module.exports.profile = async function(req, res){
    try{
        let user = await User.findById(req.params.id);
        return res.render('user_profile', {
            title: 'User Profile',
            user_details:user

        });
    }catch(err){
        console.log('Error '+err );
    }
    
}

    
    



// render the sign up page
module.exports.signUp = function(req, res){
    try{
        if(req.isAuthenticated()){
            return res.redirect('/');
        }
        return res.render('user_sign_up', {
            title: "Codeial | Sign Up"
        })
    }
    catch(err){
        console.log('Error '+err);
        return res.render('user_sign_up', {
            title: "Codeial | Sign Up"
        })
    }
    
}


// render the sign in page
module.exports.signIn = function(req, res){
    try{
        if(req.isAuthenticated()){
            return res.redirect('/users/profile');
        }
        return res.render('user_sign_in', {
            title: "Codeial | Sign In"
        });
    }catch(err){
        console.log('Error '+err);
    }
    
}

// get the sign up data
module.exports.create = async function(req, res){
    try{
        if (req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }

        let user = await User.findOne({email: req.body.email});
        if (!user){
            let user = await User.create(req.body);
            return res.redirect('/users/sign-in');
        }else{
            return res.redirect('back');
        }

    }catch(err){
        console.log('Error '+err)
        return res.redirect('back');
    }     
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    return res.redirect('/');
}


module.exports.destroySession = function(request, response){
    try{
        request.logout(function(err){
            if(err){
                console.log("Error logging out");
                return response.redirect('back');
            }
        });
    }catch(err){
        console.log('Error '+err);
    }
    return response.redirect('/users/sign-in');
}

module.exports.update = async function(req, res){
    let fs = require('fs');
    let path = require('path');
    try{
        if(req.user._id == req.params.id){
            //let user = await User.findByIdAndUpdate(req.user._id, {name: req.body.name, email: req.body.email});
            let user = await User.findById(req.user._id);
            console.log(user.name);
            console.log(user.email);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log("********-MULTER ERROR-*********"+err); return;}
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    if(user.avatar != null){
                        try{
                            fs.unlinkSync(path.join(__dirname,'..' ,user.avatar));
                        }catch(err){
                            console.log('Unable to delete from FileSystem');
                        }
                        
                    }
                    user.avatar = User.avatarPath + req.file.filename;
                }

                user.save();
            });
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error '+err);
    }
    
}
