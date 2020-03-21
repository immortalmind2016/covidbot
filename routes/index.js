var express = require('express');
var router = express.Router();
const {access_token} =require("../config")
const {sendMessageToOne,getUserProfile,welcome_message,countries}=require('./helpers/bot')
const User=require("../model/User")
const Record=require("../model/Record")

const axios=require("axios")
require("./helpers/records")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/webhook",(req,res,err)=>{
  res.send(req.query["hub.challenge"])
})

router.get("/setup",async (req,res,err)=>{

  await axios.post(`https://graph.facebook.com/v6.0/me/messenger_profile?access_token=${access_token}`,{ 
  "get_started":{
    "payload":"<GET_STARTED_PAYLOAD>"
  }
})

await axios.post(`https://graph.facebook.com/v6.0/me/messenger_profile?access_token=${access_token}`,{
  "persistent_menu": [
      {
          "locale": "default",
          "composer_input_disabled": false,
          "call_to_actions": [
              {
                  "type": "postback",
                  "title": "الرئيسيه",
                  "payload": "<GET_STARTED_PAYLOAD>"
              }
            
          ]
      }
  ]
})
res.send(200)

})

router.get("/refresh",(req,res,err)=>{
   res.sendStatus(200)

})
router.post("/webhook",async(req,res,err)=>{
  let entry=req.body.entry[0]
  
  if(!entry.messaging){
    return res.sendStatus(200)
  }
  let messaging=entry.messaging[0]
  let senderid=messaging.sender.id
  let pageid=messaging.recipient.id
  let user=await User.findOne({messenger_id:senderid})
   
    if(user){
      if(messaging.postback){
        let payload=messaging.postback.payload
        if(payload=="REGISTER"){
          user.last_input_value="REGISTER"
         user.new=true;
          console.log(messaging)
          sendMessageToOne(user.messenger_id,{text:`
${countries}

=============
          اكتب اسم بلد يا ${user.first_name}
          باستخدام القائمه
          
          `},access_token).then(()=>{
         


            user.save()
            
          }).catch(()=>{
      
          })


        }else if(payload=="<GET_STARTED_PAYLOAD>"){
          sendMessageToOne(user.messenger_id,welcome_message(user.first_name),access_token).then(()=>{}).catch((e)=>{
          })
        }
       
      }else
      {
        if(user.last_input_value=="REGISTER"){
          user.last_input_value="GET_STARTED"
       
          let text=messaging.message.text.toLowerCase();
          console.log("MEESSA",text)
          
          sendMessageToOne(user.messenger_id,{text:`
                                          تم تسجيل بلدك ${text}
          يمكنك تعديل/تغير البلد بالذهاب للرئيسيه فى وقت لاحق
          
          `},access_token).then(()=>{
            user.country=text
            
           
            if(user.new){
              Record.findOne({name:text},(err,record)=>{
                if(record)
                sendMessageToOne(user.messenger_id,{text:`
                البلد : ${record.name} 
                جميع الحالات : ${record.totalCases}
                جميع الوفيات : ${record.totalDeaths}
                جميع حالات الشفاء : ${record.totalRecovered}
                الحالات النشطه : ${record.activeCases}
                الحالات الجديده : ${record.newCases}
                حالات الوفيات الجديده : ${record.newDeaths}
                حالات خطرة : ${record.seriousCritical}`},access_token)
  
              }).sort({_id:-1})
               user.new=false
            }
            
            
            else{
              sendMessageToOne(user.messenger_id,{text:`
              يرجى الالتزام باسم البلد من القائمة فقط`

            })
            }
         
           
            user.save()
          }).catch((e)=>{
          })
        }else if(user.last_input_value=="GET_STARTED"){
          sendMessageToOne(user.messenger_id,{
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": `لا استطيع فهمك الان `,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "الرئيسيه",
                            "payload": "<GET_STARTED_PAYLOAD>"
                        }
                    ]
                }
              }
            },access_token).then(()=>{

user.save()
}).catch((e)=>{
})
        }
      }
      
    }else{
      getUserProfile(senderid,access_token).then((response)=>{
        let data=response.data
        new User({
          messenger_id:senderid,
          page_id:pageid,
          last_input:"GET_STARTED",
          first_name:data.first_name
      
        }).save((err,user)=>{
          sendMessageToOne(user.messenger_id,welcome_message(user.first_name),access_token).then(()=>{}).catch((e)=>{
            console.log("ERROR ",e.response.data)
          })
        })
      })
    }
  res.sendStatus(200)
})








module.exports = router;
