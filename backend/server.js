const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

app.use(cors())
app.use(express.json({limit: '25mb'}))

try {
    mongoose.connect("mongodb://localhost:27017/chat", {useNewUrlParser: true, useUnifiedTopology: true})
    console.log("Data connected")
} catch (error) {
    console.log(error)
}

const user = require('./controller/user.route')
const message = require('./controller/message.route')
app.use("/user", user)
app.use("/message", message)

app.listen(5000, () => {
    console.log("Server loaded")
})