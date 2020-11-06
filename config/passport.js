const mongoose = require('mongoose')
const keys = require('./keys')
const User = mongoose.model('users')
const JwtStrategy = require('passport-jwt').Strategy
ExtractJwt = require('passport-jwt').ExtractJwt
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretorKey

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id).then( user => {
      if (user) {
        return done(null, user)
      }
      return done(null, false)
    })
  }))
}