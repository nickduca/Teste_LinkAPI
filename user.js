const mongoose = require ('mongoose')

const UserSchema = new mongoose.Scherma({
    name:{
        type : String,
        require : true,
    },
    email : {
        Type : String,
        unique : true,
        required : true,
        lowercase : true,
    },
    passaword:{
        type: String,
        required : true,
        select : false,
    },
    createdAT: {
        type: Date,
        default : Date.now
    }

})

const User = mongoose.model('User', UserSchema)

module.exports = User
