const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    email:{
        type:String,
        required : true,
        trim : true
    },
    password:{
        type:String,
        required : true,
        trim : true
    },
    name:{
        type:String,
        required : true,
        trim : true
    },
    publicKey:{
        type:String,
        required : true,
    }
},{timestamps: true});

const User = mongoose.model("User",userSchema)

module.exports = User;