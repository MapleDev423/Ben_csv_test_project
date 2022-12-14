import promptSync from 'prompt-sync';
const prompt = promptSync();
import fetch from 'node-fetch'
import cc from 'cryptocompare';
global.fetch = fetch;
cc.setApiKey('a47d7319cc2b1820d78c5b41d0c2f068ae00100bd6b0f5729c7179b01762ec10');
/*
let csvToJson = require('convert-csv-to-json');
let json = csvToJson.fieldDelimiter(',').getJsonFromCsv("real.csv");
*/
import csv from 'csvtojson';
let json = []
csv()
.fromFile('transactions.csv')
.then( async (jsonObj)=>{
  // console.log(jsonObj)
   json = jsonObj
   let groupBy = []
   
   for(let item of json){
      if(!groupBy[`${item.token}`])
      {
         groupBy[`${item.token}`] = []
      }
      groupBy[`${item.token}`] = [...groupBy[`${item.token}`],item]

   }

   const getPortfolioValueByDate = async (date = -1)=>{
      let result = []
      for(let tokenName in groupBy){
         if(groupBy[tokenName].length){
            result[`${tokenName}`] = 0;
            let price = await cc.price(tokenName, 'USD')
            for(let item of groupBy[tokenName]){
               if(date == -1 || (date != -1 && date >= parseInt(item.timestamp))){
                  if(item.transaction_type == 'DEPOSIT'){
                     result[`${tokenName}`] += parseFloat(item.amount)*price['USD']
                  }else{
                     result[`${tokenName}`] -= parseFloat(item.amount)*price['USD']
                  }
               }
            }
         }
      }
      return result
   }
   //
   let totalValue = await getPortfolioValueByDate()

   console.log(totalValue)

   let inputTkName = prompt('Please input token Name: ');
   console.log(totalValue[`${inputTkName}`])

   let inputDateInput = prompt('Please input Date: ');
   let portfoliobyDate = await getPortfolioValueByDate(inputDateInput)
   console.log(portfoliobyDate)

   let input_date = prompt('please input Date: ');
   let res_data = await getPortfolioValueByDate(input_date);
   let input_token = prompt('please input token Name: ');
   console.log(`${input_date} ${input_token}: ${res_data[`${input_token}`]}`);
})




