const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Record=new Schema({
    name:{type:String,default:"0"},
    totalCases:{type:String,default:"0"},
    newCases:{type:String,default:"0"},
    totalDeaths:{type:String,default:"0"},
    newDeaths:{type:String,default:"0"},
    totalRecovered:{type:String,default:"0"},
    activeCases:{type:String,default:"0"},
    seriousCritical:{type:String,default:"0"},
    created_date:{
        type:Date,
        default:Date.now()
    },
})
Record.index({ 
    name:1,
    totalCases:1,
    newCases:1,
    totalDeaths:1,
    newDeaths:1,
    totalRecovered:1,
    activeCases:1,
    seriousCritical:1
}, { unique: true });

module.exports=mongoose.model("Record",Record)