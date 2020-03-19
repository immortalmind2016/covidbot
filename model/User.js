const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const User=new Schema({

 
    messenger_id:{
        type:String,
        unique:true, 
        index:true
    },
    
    created_date:{
        type:Date,
        default:Date.now()
    },
    last_input_value:{
        type:String,
        default:null
    },
    first_name:{
        type:String,
        default:""
    },
    new:{type:Boolean,default:true},

    last_name:{
        type:String,
        default:""
    },
    
    country:{
        type:String,
        default:"egypt"
    }
   
    

})





module.exports=mongoose.model("User",User)