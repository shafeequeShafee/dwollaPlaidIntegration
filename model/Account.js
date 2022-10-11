


const mongoose = require("mongoose")
const accountSchema = new mongoose.Schema({
    mobileNumber:{
        type:String
    },
    
    accounts:[{
        type:Object
    }]

})

const Account=mongoose.model('Account',accountSchema)
module.exports ={Account}


