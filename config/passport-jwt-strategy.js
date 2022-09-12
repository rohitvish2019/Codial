const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const Users = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'Myname'
};

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
    
    Users.findById(jwtPayLoad._id, function(err, user){
        if(err){console.log("Error finding user from DB"); return};
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }

    });
}))

module.exports = passport;