const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    'refID': {
        type: Number,
        required: true
    },
    'content': {
        type: String,
        required: true
    },
    'date': {
        type: Date,
        required: true
    },
    "isRead": {
        type: Boolean,
        required: true
    }
})

const Message = mongoose.model("Message", MessageSchema)

module.exports = Message