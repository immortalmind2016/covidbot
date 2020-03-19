const {getCovData,sendMessageToMany,sendMessageToOne} =require("./bot")
const {access_token}=require("../../config")
const Record=require("../../model/Record")
const User=require("../../model/User")
const axios=require("axios")
setInterval(async()=>{

    axios.get("/refresh").then(()=>{}).catch(()=>{})
    let analysis=await getCovData()
    analysis.forEach(element => {
        if(element.name=="egypt"){
        }
        new Record({...element}).save((err,record)=>{

            
            if(!err){
                
                User.find({country:record.name},(err,users)=>{
                    if(users.length>0)
                    sendMessageToMany(users,{text:`
                     البلد : ${record.name} 
                     جميع الحالات : ${record.totalCases}
                     جميع الوفيات : ${record.totalDeaths}
                     جميع حالات الشفاء : ${record.totalRecovered}
                     الحالات النشطه : ${record.activeCases}
                     الحالات الجديده : ${record.newCases}
                     حالات الوفيات الجديده : ${record.newDeaths}
                     حالات خطرة : ${record.seriousCritical}`},access_token).then(()=>{
                        
                    })
                })
            }
        })
       
    });
    
    
},10*1000)


