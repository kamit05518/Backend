const {model,Schema} =require("mongoose");
const LoginSchema=new Schema({
    email:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true,

    }
})
module.exports=model("Login",LoginSchema);