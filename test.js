

const translate = require('translate'); // Old school
 /*const x=async ()=>{
    translate('こんにちは世界', { from: 'ja', to: 'es' }).then(text => {
        console.log(text);  // Hola mundo
      });
}
x()
*/
var lookup = require('country-data').lookup;

var countries = require("i18n-iso-countries");
var france = lookup.countries({name: 'Egypt'})[0];

console.log("EGYPT ",france)
//console.log("US (Alpha-2) => " + countries.getName("s", "")); // United States of America


