const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        unique: true
    },
    contact: {
        type: Number,
        required:true
    },
    dob: {
        type: String
        
    }  ,
    address: {
        type:String,
        required: true
    },
    country: {
        type:String,
        required: true
    },
    state: {
        type:String,
        required: true
    },
    city: {
        type:String,
        required: true
    },
    profile: {
        type:String,
        required: false
    },
    password: {
        type: String,
        required: true
    }

})

module.exports = User = mongoose.model('user',UserSchema)