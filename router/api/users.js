const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

router.get('/test', (req, res) => {
  res.json({ msg: 'okokokokok'})
})

// 注册
router.post('/register', (req, res) => {
  // res.json({ msg: 'success'})
  // console.log(req.body)
  User.findOne({email: req.body.email}).then( user => {
    if (user) {
      return res.status(400).json({msg: '当前用户已存在'})
    } else {
      var url = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'})
      const newUser = new User ({
        name: req.body.name,
        email: req.body.email,
        avatar: url,
        password: req.body.password,
        identity: req.body.identity
      })
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser.save().then( user => res.json(user)).catch( err => res.json(err))
        })
    })
    }
  })
})

// 登录
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({email}).then( user => {
    if(!user) {
      return res.status(404).json({msg: '当前用户不存在'})
    } else {
      // 密码匹配
      bcrypt.compare(password, user.password).then( (result) => {
        if (result) {
          // jwt.sign("规则","加密名字", "过期时间", "箭头函数")
          const rules = {id: user.id, name: user.id, avatar: user.avatar,identity: user.identity}
          jwt.sign(rules, keys.secretorKey,{expiresIn: 7200}, (err, token) => {
            if (err) throw err
            res.json({
              success: true,
              token:"Bearer " + token
            })
          })
          // res.json({msg: 'success'})
        } else {
          return res.status(400).json({msg: '密码错误'})
        }
      }).catch( err => res.json(err))
    }
  })
})

// 当前页面
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    identity: req.user.identity
  })
})

module.exports = router