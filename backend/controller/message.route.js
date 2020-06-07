const router = require("express").Router()
const Message = require("../models/message.model")
const MessageRel = require("../models/message.rel.model")
const UserRel = require("../models/user.model")

router.route("/send").post((req, rep) => {
    let messageID = ""
    const content = req.body.content
    const date = new Date()
    const userIDSend = req.body.userIDSend
    const userIDReceive = req.body.userIDReceive
    let value = 0
    Message.find({}, (err, message) => {
        if (err) throw err
        message.forEach(msg => {
            value = msg.refID
        })
        const refID = (value+1)
        const newMessage = new Message({
            refID,
            content,
            date,
            isRead: false
        })
    
        newMessage.save()
        .then(() => {
            Message.find({}, (err, messages) => {
                messages.forEach(msg => {
                    if (msg.refID === refID) {
                        messageID = msg._id
                        const newMessageRel = new MessageRel({
                            messageID,
                            userIDSend,
                            userIDReceive
                        })
                        newMessageRel.save()
                    }
                })
            })  
            rep.json("Send")
        })
        .catch(err => rep.json(err))
    })
    .catch(() => rep.json("Error"))
})

router.route("/getMessage/:idUser").get((req, rep) => {
    let data = []
    let newData = []
    let userData = []
    let save = []
    let messageValue = []
    let messageDate = []
    let messageRead = []
    MessageRel.find({} ,(err, messages) => {
        if (err) throw err
        messages.forEach(message => {
            if (message.userIDSend == req.params.idUser || message.userIDReceive == req.params.idUser) {
                data.push(message.userIDSend)
                data.push(message.userIDReceive)
            }
        })
        if (data.length === 0){
            rep.json([])
        } else {
        for(let value of data){
            if(!newData.includes(value) && value!=req.params.idUser){
                newData.push(value)
            }
        }
        UserRel.find({}, (err, users) => {
            if (err) throw err
            users.forEach(user => {
                for(let value of newData)
                if (user._id == value) {
                    userData.push(user)
                }
            })
            Message.find({}, (err, responses) => {
                if (err) throw err
                responses.forEach(response => {
                    messageValue[response._id] = response.content
                    messageDate[response._id] = response.date
                    messageRead[response._id] = response.isRead
                })
                userData.forEach(user => {
                    let dataSave = []
                    messages.forEach(message => {
                        if(message.userIDReceive == req.params.idUser && message.userIDSend == user._id){
                            dataSave.push({
                                "messageId": message.messageID,
                                "uid": message.userIDSend,
                                "Recept":messageValue[message.messageID]
                            })
                        }
                        if(message.userIDSend == req.params.idUser && message.userIDReceive == user._id){
                            dataSave.push({
                                "messageId": message.messageID,
                                "uid": message.userIDSend,
                                "Send":messageValue[message.messageID]
                            })
                        }
                        
                    })
                    save.push({
                        "partner": user.pseudo,
                        "partnerID": user._id,
                        "message": dataSave,
                        "lastMessage": "",
                        "lastMessageId": "",
                        "lastMessageIdU": "",
                        "lastDate": "",
                        "isRead": "",
                        "avatar": user.avatar
                    })
                })
                save.forEach(el => {
                    let a,b,c
                    el.message.map(element => {
                        if (element.Send != undefined) {
                            a = element.Send
                            b = element.messageId
                            c = element.uid
                        } else if (element.Recept != undefined){
                            a = element.Recept
                            b = element.messageId
                            c = element.uid
                        }
                    })
                    el.lastMessage = a
                    el.lastMessageId = b
                    el.lastMessageIdU = c
                    el.lastDate = messageDate[b]
                    el.isRead = messageRead[b]
                })
                let a,b
                save.map(e => {
                    for (let i=0;i<(save.length-1);i++){
                        if (save[i].lastDate < save[i+1].lastDate) {
                            a = save[i]
                            b = save[i+1]
                            save[i] = b
                            save[i+1] = a
                        }
                    }
                })
                let returnValue = []
                save.map(el => {
                    returnValue.push({
                        "partner": el.partner,
                        "partnerID": el.partnerID,
                        "lastMessage": el.lastMessage,
                        "lastMessageId": el.lastMessageId,
                        "lastMessageIdU": el.lastMessageIdU,
                        "isRead": el.isRead,
                        "avatar": el.avatar
                    })
                })
                rep.json(returnValue)
            })
        })}
    })
    .catch(() => rep.json("Error"))
})

router.route("/readMessage/:id").post((req, rep) => {
    Message.findById(req.params.id)
        .then(msg => {
            msg.isRead = true
            msg.save()
            rep.json("read")
        })
        .catch(() => rep.json("Crashed"))
})

router.route("/view/:user/:partner").get((req, rep) => {
    const user = req.params.user
    const partner = req.params.partner
    const messageValue = []
    const data = []
    MessageRel.find({}, (err, messages) => {
        if (err) throw err
        Message.find({}, (err, msg) => {
            if (err) throw err
            let read = []
            let date = []
            let isRead = ""
            msg.forEach(item => {
                messageValue[item._id] = item.content
                read[item._id] = item.isRead
                date[item._id] = item.date
            })
            messages.forEach(message => {
                if (message.userIDSend == user && message.userIDReceive == partner){
                    data.push({"Send":messageValue[message.messageID],"date":date[message.messageID]})
                    isRead = read[message.messageID]
                }
                if (message.userIDSend == partner && message.userIDReceive == user){
                    data.push({"Receive":messageValue[message.messageID],"date":date[message.messageID]})
                    isRead = read[message.messageID]
                }
            })
            data.push({"isRead":isRead})
            rep.json(data)
        })
    })
})

module.exports = router
