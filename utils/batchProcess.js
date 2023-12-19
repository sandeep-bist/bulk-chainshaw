const axios = require("axios");
const TokenEncryption = require("../encr");
const TokenDecryption = require("../dcr");
const Tokenize=require("../utils/tokenize");
const Detokenize=require("../utils/detokenize");
const Datatokenize=require("../utils/dataTokenize");
const DataDetokenize=require("../utils/dataDetokenize");

const getAccessToken = require("./accessToken");

const chunk = (arr, chunkSize = 1, cache = []) => {
    const tmp = [...arr]
    if (chunkSize <= 0) return cache
    while (tmp.length) cache.push(tmp.splice(0, chunkSize))
    return cache
  }

class BatchProcessForTokenizing{
    async runAllQueries(pan_data,concurrentLimit,batchSize,action) {

        
        const batches = chunk(pan_data, batchSize);
        console.log("total batch tokenizing size: ",batches.length);
        let results = [];
        let final_result=[];
        results= await  this.callTasks(batches,concurrentLimit,action);
        console.log(results.length,"result tokenizer length")
        // console.log("*****results===",results)
        for (let i=0;i<results.length;i++){
            for (let j=0;j<results[i].length;j++){
                    // for (let k=0;k<batchSize;k++){
                        final_result.push(...results[i][j].results.data)
                    // }
            }
        }
        return final_result;
    }


  async  callTasks(batches,concurrentLimit,action) {
    var currentTask = 0;
    var final_results=[]
    while (currentTask<batches.length){

    async function createTaskInstance() {
      while (currentTask < batches.length) {
        if (action==="TOKENIZE"){
            return await Datatokenize.getEncryptedTokenData(
                batches[currentTask++]
              );
        }
        else{
            return await DataDetokenize.getDecryptedTokenData(
                batches[currentTask++]
              );
        }
         
        
      }
    }

    var tasks = [];
    for (let i = 0; i < concurrentLimit && currentTask< batches.length; i++) {
      tasks.push(createTaskInstance());
    }
    let result=await Promise.all(tasks);
    console.log("internal result****",final_results.length)

    final_results.push(result);

    // return Promise.all([...Array(concurrentLimit)].map(createTaskInstance));
    }

    return final_results
  }

  

}

module.exports = new BatchProcessForTokenizing();
