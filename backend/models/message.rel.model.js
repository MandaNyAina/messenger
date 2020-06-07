const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MessageRelSchema = new Schema({
    'messageID': {
        type: String,
        required: true
    },
    'userIDSend': {
        type:String,
        required: true
    },
    'userIDReceive': {
        type: String,
        required: true
    }
})

const MessageRel = mongoose.model("MessageRel", MessageRelSchema)

module.exports = MessageRel