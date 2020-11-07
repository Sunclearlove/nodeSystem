const express = require('express')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
const passport = require('passport')
const app = express()
mongoose.set('useFindAndModify', false)

// 引入mongoDB数据库地址
const db = require('./config/keys').mongUrl
// 链接数据库
mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true }).then( () => console.log('MongoDB Connect Success')).catch( (err) => console.log(err))

// bodyParser中间件 使用post请求
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// 引入路由地址
const users = require('./router/api/users')
const profiles = require('./router/api/profiles')
// 使用路由中间件
app.use('/api/user', users)
app.use('/api/profiles', profiles)

// passport 初始化
app.use(passport.initialize())

require('./config/passport')(passport)
// app.get('/', (req, res) => {
//   res.send('hellow ord')
// }

const port = process.env.PORT || 3000

app.listen( port, () => {
  console.log( `Server running open port ${port}`)
})