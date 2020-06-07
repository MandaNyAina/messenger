const router = require('express').Router()
const User = require('../models/user.model')

router.route("/").get((req, rep) => {
    User.find()
        .then(response => rep.json(response))
        .catch(() => rep.json("Erreur"))
})

router.route("/:id").get((req, rep) => {
    User.findById(req.params.id)
        .then(response => rep.json(response))
        .catch(() => rep.json("InvalidID"))
})

router.route("/getId/:pseudo").get((req, rep) => {
    let response = "InvalidPseudo"
    User.find({}, (err,users) => {
        users.forEach(user => {
            if (user.pseudo === req.params.pseudo) {
                response = user._id
            }
        })
        rep.json(response)
    })
    .catch(() => rep.json("InvalidPseudo"))
})

router.route("/getIdU/:username").get((req, rep) => {
    let response = "InvalidUsername"
    User.find({}, (err,users) => {
        users.forEach(user => {
            if (user.username === req.params.username) {
                response = user._id
            }
        })
        rep.json(response)
    })
    .catch(() => rep.json("InvalidUsername"))
})

router.route("/add").post((req, rep) => {
    const avatar = req.body.avatar
    const pseudo = req.body.pseudo
    const username = req.body.username
    const password = req.body.password

    const newUser = new User({
        avatar,
        pseudo,
        username,
        password
    })

    newUser.save()
    .then(rep.json("Saved"))
    .catch(err => rep.json(err))
})

router.route("/set/:id").post((req, rep) => {
    User.findById(req.params.id)
        .then(user => {
            user.avatar = req.body.avatar
            user.pseudo = req.body.pseudo
            user.username = req.body.username
            user.password = req.body.password
            user.save()
            rep.json("Updated")
        })
        .catch(() => rep.json("Rejected"))
})

router.route("/setPassword/:id").post((req, rep) => {
    User.findById(req.params.id)
        .then(user => {
            user.password = req.body.password
            user.save()
            rep.json("Updated")
        })
        .catch(() => rep.json("Rejected"))
})

router.route("/connect/:username/:password").get((req, rep) => {
    let listUser= []
    let passUser = []
    let i = 0
    const username = req.params.username
    const password = req.params.password

    User.find({}, (err, users) => {
        if (err) throw err
        users.forEach(user => {
            listUser.push(user.username)
            passUser[user.username] = user.password
        })
        for(let item of listUser){
            if (username === item) {
                i = 1
                if (password === passUser[item]) {
                    i = 2
                }
            }
        }
        if (i === 1) {
            rep.json("InvalidPassword")
        } else if (i === 2) {
            rep.json("Connected")
        } else {
            rep.json("InvalidAccount")
        }
    })
    .catch(() => rep.json("Error"))
})

module.exports = router
