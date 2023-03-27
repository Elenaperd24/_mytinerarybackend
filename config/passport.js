const passport = require("passport")
const jwtStrategy = require("passport-jwt").Strategy
const extractJwt = require("passport-jwt").ExtractJwt

const User = require("../models/user")

module.exports=passport.use(new jwtStrategy({
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:process.env.SECRETKEY
}, (jwt_pyload, done)=>{
    User.findOne({_id:jwt_pyload.id})
    .then(user=>{
        if (user) {
            return done(null,user)
        }
        else if(error){
            return done(error, false)
        }
        else{
            return done(null, false)
        }
    })
    .catch(error=>{
        return done(error, false)
    })
}))

