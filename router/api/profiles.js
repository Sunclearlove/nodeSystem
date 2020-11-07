const express = require('express')
const router = express.Router()
const passport = require('passport')
const profile = require('../../models/Profile')
const Profile = require('../../models/Profile')

// router.get('/test', (req, res) => {
//   res.json({ msg: 'okokokokok'})
// })


// 添加数据
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  const profileFields = {}
  if (req.body.type) profileFields.type = req.body.type
  if (req.body.describe) profileFields.describe = req.body.describe
  if (req.body.income) profileFields.income = req.body.income
  if (req.body.expend) profileFields.expend = req.body.expend
  if (req.body.cash) profileFields.cash = req.body.cash
  if (req.body.remark) profileFields.remark = req.body.remark

  new Profile(profileFields).save().then(profile => {
    res.json(profile)
  })
})


// 获取所有数据
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.find().then(profile => {
    if (!profile) {
      res.status(404).json('当前数据不存在')
    } else {
      res.json(profile)
    }
  }).catch(err => console.log(err))
})


// 获取单条数据
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({_id: req.params.id}).then(profile => {
    if (!profile) {
      res.status(404).json('当前数据不存在')
    } else {
      res.json(profile)
    }
  }).catch(err => console.log(err))
})

// 编辑信息单条数据
router.post('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const profileFields = {}
  if (req.body.type) profileFields.type = req.body.type
  if (req.body.describe) profileFields.describe = req.body.describe
  if (req.body.income) profileFields.income = req.body.income
  if (req.body.expend) profileFields.expend = req.body.expend
  if (req.body.cash) profileFields.cash = req.body.cash
  if (req.body.remark) profileFields.remark = req.body.remark

  Profile.findOneAndUpdate(
    { _id: req.params.id },
    { $set: profileFields },
    { new: true },
  ).then(profile => res.json(profile)).catch(err => res.json(err))
})

// 删除数据
// 编辑信息delete
router.delete( '/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOneAndRemove({ _id: req.params.id}).then( profile => 
    res.json(profile))
})


module.exports = router