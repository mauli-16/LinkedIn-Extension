const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    },
    bio:{
        type:String,
        
    },
    location:{
        type:String,
        
    },
    connectionCount:{
        type:Number,
        
    },
    
})


const User= mongoose.model('User',userSchema)
module.exports=User

