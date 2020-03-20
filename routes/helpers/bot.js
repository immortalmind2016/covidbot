const axios = require("axios")
const cheerio = require("cheerio")
delayarr = require('delay-for-array')

const sendMessageToMany = (users, message, accessToken) => {

    return new Promise((resolve, reject) => {
        console.log("USERRRRRRRRS ",users)
        delayarr.each(users, { time: 100 }, function (user, k) {

            axios.post(`https://graph.facebook.com/v6.0/me/messages?access_token=${accessToken}`,
                {
                    recipient: { 'id': user.messenger_id }, message,
                    "messaging_type": "MESSAGE_TAG",
                    "tag": "ACCOUNT_UPDATE"
                }

            ).then(() => {
                if (k == users.length - 1)
                    resolve()
            }).catch((e) => {
                if (k == users.length - 1)
                    resolve()
            })

        }, function (num) {



        });



    })
}

const sendMessageToOne = (messenger_id, message, accessToken) =>

   { 
    console.log("MESS",message)

    return axios.post(`https://graph.facebook.com/v6.0/me/messages?access_token=${accessToken}`,
        {
            recipient: { 'id': messenger_id }, message,
            "messaging_type": "MESSAGE_TAG",
            "tag": "ACCOUNT_UPDATE"
        }

    )


}



const welcome_message = name => {
    return {

        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": `اهلا بك فى كرونا بوت يا ${name} سأقوم بارسال اخر احصائيات فيروس كرونا لك`,
                "buttons": [
                    {
                        "type": "postback",
                        "title": "تسجيل البلد",
                        "payload": "REGISTER"
                    }
                ]
            }
        }

    }

}
const getUserProfile = (PSID, page_token) =>
    axios.get(`https://graph.facebook.com/${PSID}?fields=first_name&access_token=${page_token}`)



let countries=`
 China 
 Italy 
 Iran 
 Spain 
 Germany 
 S. Korea 
 France 
 USA 
 Switzerland 
 UK 
 Netherlands 
 Norway 
 Austria 
 Belgium 
 Sweden 
 Denmark 
 Japan 
 Diamond Princess 
 Malaysia 
 Canada 
 Australia 
 Portugal 
 Qatar 
 Czechia 
 Greece 
 Brazil 
 Israel 
 Finland 
 Ireland 
 Slovenia 
 Singapore 
 Iceland 
 Pakistan 
 Bahrain 
 Poland 
 Estonia 
 Romania 
 Chile 
 Egypt 
 Philippines 
 Thailand 
 Indonesia 
 Saudi Arabia 
 Hong Kong 
 Iraq 
 India 
 Luxembourg 
 Kuwait 
 Lebanon 
 San Marino 
 Peru 
 Russia 
 UAE 
 Ecuador 
 Turkey 
 Slovakia 
 South Africa 
 Mexico 
 Bulgaria 
 Argentina 
 Armenia 
 Taiwan 
 Serbia 
 Panama 
 Croatia 
 Vietnam 
 Colombia 
 Algeria 
 Latvia 
 Brunei 
 Albania 
 Hungary 
 Costa Rica 
 Uruguay 
 Cyprus 
 Jordan 
 Faeroe Islands 
 Morocco 
 Sri Lanka 
 Palestine 
 Andorra 
 Malta 
 Belarus 
 Azerbaijan 
 Georgia 
 Bosnia and Herzegovina 
 Cambodia 
 Oman 
 Kazakhstan 
 Venezuela 
 North Macedonia 
 Moldova 
 Senegal 
 Lithuania 
 Tunisia 
 Afghanistan 
 Dominican Republic 
 New Zealand 
 Liechtenstein 
 Guadeloupe 
 Martinique 
 Burkina Faso 
 Ukraine 
 Macao 
 Jamaica 
 Maldives 
 Bolivia 
 French Guiana 
 Uzbekistan 
 Bangladesh 
 Cameroon 
 Monaco 
 Paraguay 
 Réunion 
 Guatemala 
 Honduras 
 Guyana 
 Cuba 
 Ghana 
 Rwanda 
 Channel Islands 
 Ethiopia 
 Guam 
 Mongolia 
 Puerto Rico 
 Trinidad and Tobago 
 Ivory Coast 
 Kenya 
 Seychelles 
 Nigeria 
 Aruba 
 Curaçao 
 DRC 
 French Polynesia 
 Gibraltar 
 Mayotte 
 St. Barth 
 Barbados 
 Liberia 
 Montenegro 
 Namibia 
 Saint Lucia 
 Saint Martin 
 U.S. Virgin Islands 
 Cayman Islands 
 Sudan 
 Nepal 
 Antigua and Barbuda 
 Bahamas 
 Benin 
 Bhutan 
 CAR 
 Congo 
 Equatorial Guinea 
 Gabon 
 Gambia 
 Greenland 
 Guinea 
 Vatican City 
 Mauritania 
 St. Vincent Grenadines 
 Somalia 
 Suriname 
 Eswatini 
 Tanzania 
 Togo 
`
countries=countries.split("\n").sort().join("\n")

//Scraping


async function getHTML(url) {
  const { data } = await axios.get(url)
  return cheerio.load(data)
}

 function getCovData(){
    return new Promise(async(resolve,reject)=>{
        console.log("ASYNC")
        const $ = await getHTML("https://www.worldometers.info/coronavirus/")
      
        // Print the full HTML
        let countries=[]
        
        $('#main_table_countries_today tr').each(function(row,index){
          if(index!=0&index!=1&index!=$('#main_table_countries_today tr').length-1&&!$($(this).children()[0]).text().toLowerCase().includes("other")){
            if($($(this).children()[0]).text().toLowerCase()=="egypt"){
            

            }
            countries.push({
              name:$($(this).children()[0]).text().toLowerCase(),
              totalCases:$($(this).children()[1]).text(),
              newCases:$($(this).children()[2]).text(),
              totalDeaths:$($(this).children()[3]).text(),
              newDeaths:$($(this).children()[4]).text(),
              totalRecovered:$($(this).children()[5]).text(),
              activeCases:$($(this).children()[6]).text(),
              seriousCritical:$($(this).children()[7]).text()
            })
          }
        })
        console.log(countries.length)
        
        resolve(countries.filter((c)=>(c.newDeaths!=""||c.newCases!=""||c.totalRecovered!="")))
    })
    
  }
module.exports = {
    sendMessageToMany,
    welcome_message,
    sendMessageToOne,
    getUserProfile,
    countries,
    getCovData

}