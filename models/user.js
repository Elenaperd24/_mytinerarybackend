const { string } = require('joi');
const mongoose = require('mongoose') //va a almacenar los datos

const userSchema = new mongoose.Schema({
    img:{type:String,require:true},
    name: { type: String, require: true },
    lastName: { type: String, require: false },
    email: { type: String, require: true },
    password: { type: String, require: true },
    uniqueString:{type:String,require:true},
    emailVerified:{type:Boolean,require:true},
    connected: {type:Boolean, require:true},
    from:{type:String, require:true},
    
})
const User = mongoose.model("user", userSchema)

module.exports = User;  