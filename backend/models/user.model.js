const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    'pseudo' : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    'username' : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    'password' : {
        type: String,
        required: true
    },
    'avatar': {
        type: String,
        required: false
    }
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User
