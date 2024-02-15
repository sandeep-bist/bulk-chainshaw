const axios = require("axios");
const TokenEncryption = require("../encr");
const TokenDecryption = require("../dcr");
// const getAccessToken = require("./accessToken");
const BatchProcessForDeTokenizing=require("../utils/batchDetokenProcess");
const TokenizeConfigs=require("../utils/config");


class Detokenize {
  async detokenize(data,concurrentLimit,batchSize) {
    TokenizeConfigs.initializeVariable(data);

    // console.log("data---------------", data);
    try {

      let isPanList =Array.isArray(data.tokenizePan);
      if (!isPanList){
        throw new Error("tokenizePan Parameter takes List of token only");
      }
  
      if ((data.tokenizePan).length<1){
        throw new Error("tokenizePan List Should not be empty");

      }
      let tokenizePan = data?.tokenizePan;
      let serverPublicKey = TokenizeConfigs?.serverPublicKey;
      let internalPrivateKey = TokenizeConfigs?.internalPrivateKey;
      let accessTokenUrl = TokenizeConfigs?.accessTokenUrl;
      let accessTokenPayload = TokenizeConfigs?.accessTokenPayload;
      let accessTokenAuth = TokenizeConfigs?.accessTokenAuth;
      let decryptedDataUrl = TokenizeConfigs?.decryptedDataUrl;

      if (
        !tokenizePan ||
        tokenizePan === "" ||
        !serverPublicKey ||
        serverPublicKey === "" ||
        !internalPrivateKey ||
        internalPrivateKey === "" ||
        !accessTokenUrl ||
        accessTokenUrl === "" ||
        !accessTokenPayload ||
        accessTokenPayload === "" ||
        !accessTokenAuth ||
        accessTokenAuth === "" ||
        !decryptedDataUrl ||
        decryptedDataUrl === ""
      ) {
        // console.log("----------data");
        throw new Error("All field are required");
      }

      let api_version="v2.1";
      if (decryptedDataUrl=="https://tokenizer.uat.data.nye.money/detokenize/api/v2/bulk-detokenize"){
        api_version="v2";
      }
      else if (decryptedDataUrl=="https://tokenizer.uat.data.nye.money/detokenize/api/v1/bulk-detokenize"){
        api_version="v1";
      }
      else{
       api_version="v2.1";

      }
      // let encryptionFunction = TokenEncryption.encryption(serverPublicKey);

      // // Encrypt each string using map() and the encryption function with the parameter
      // let encryptionData = tokenizePan.map(encryptionFunction);
      // console.log("tokenizePanObj---encryptionData----------",encryptionData)
      
      // let encryptionData = TokenEncryption.encryption(
      //   tokenizePan,
      //   serverPublicKey
      // );
        console.log(concurrentLimit, "--------concurrentLimit");
      // let tokenizeData = await this.getEncryptedTokenData(
      //   decryptedDataUrl,
      //   encryptionData,
      //   accessTokenUrl,
      //   accessTokenPayload,
      //   accessTokenAuth
      // );
      let encryptionData ;
      let flippedObject;
      let tokenizeData;
      if (decryptedDataUrl=="https://tokenizer.uat.data.nye.money/detokenize/api/v2/bulk-detokenize"){
      console.log("-------------v2  API-----------")
         tokenizeData=await BatchProcessForDeTokenizing.runAllQueries(tokenizePan,concurrentLimit,batchSize,"DETOKENIZE")
         flippedObject=tokenizePan.reduce((obj, el, index) => (obj[el] = index, obj), {});
        }
        else if (decryptedDataUrl=="https://tokenizer.uat.data.nye.money/detokenize/api/v2.1/bulk-detokenize"){
          console.log("-------------v2.1  API-----------")
             tokenizeData=await BatchProcessForDeTokenizing.runAllQueries(tokenizePan,concurrentLimit,batchSize,"DETOKENIZE")
             flippedObject=tokenizePan.reduce((obj, el, index) => (obj[el] = index, obj), {});
            }
      else{
      console.log("-------------v1  API-----------")
      let encryptionFunction = TokenEncryption.encryption(serverPublicKey);

      // Encrypt each string using map() and the encryption function with the parameter
          encryptionData = tokenizePan.map(encryptionFunction);
          tokenizeData=await BatchProcessForDeTokenizing.runAllQueries(encryptionData,concurrentLimit,batchSize,"DETOKENIZE")
        //  console.log("tokenizeData-------------",tokenizeData)
          flippedObject= Object.assign(...tokenizePan.map((k, i) =>({  [encryptionData[i]] :k})))


      }

      console.log("flippedObject-------------")
      // let flippedObject = Object.fromEntries(
      //   Object.entries(tokenizePanObj).map(([pan, token]) => [token, pan])
      // );
        // console.log(tokenizeData, "--------tokenizeData");
      // let tok
      // let decryptionToken = TokenDecryption.decryption(
      //   tokenizeData.results.data,
      //   internalPrivateKey
      // );
      if (decryptedDataUrl=="https://tokenizer.uat.data.nye.money/detokenize/api/v2.1/bulk-detokenize"){
        // console.log("-------------v2.1 sdfds API--response---------",tokenizeData)
          //  tokenizeData=await BatchProcessForDeTokenizing.runAllQueries(tokenizePan,concurrentLimit,batchSize,"DETOKENIZE")
          //  flippedObject=tokenizePan.reduce((obj, el, index) => (obj[el] = index, obj), {});
          const tokenizedformattedData = tokenizeData.reduce((acc, obj) => {
            acc[obj.value] = obj.data;
            return acc;
          }, {});
          
          return tokenizedformattedData;
          return tokenizeData;
          }
          else if (decryptedDataUrl=="https://tokenizer.uat.data.nye.money/detokenize/api/v2/bulk-detokenize"){
            console.log("-------------v2sdfds API--response---------")
            let encrpypted_token=tokenizeData;//.results.data;
            let decryptionFunction = TokenDecryption.decryption(internalPrivateKey,flippedObject);
            // console.log(flippedObject, "--------decryptionFunction");
            // console.log(encrpypted_token, "--------encrpypted_token");
      
            let decryptionToken = encrpypted_token.reduce(decryptionFunction,{});
            // console.log(decryptionToken, "--------decryptsdsdsdsionFunction");
      
            return decryptionToken; //{ pan: decryptionToken };
              }
          else{
            console.log("-------------v1---dfds API--response---------")
            // console.log(tokenizeData, "--------decryptionFunction");

            let encrpypted_token=tokenizeData;//.results.data;
            let decryptionFunction = TokenDecryption.decryption(internalPrivateKey,flippedObject,api_version);
            // console.log(encrpypted_token, "--------encrpypted_token");
      
            let decryptionToken = encrpypted_token.reduce(decryptionFunction,{});
            // console.log(decryptionToken, "--------decryptsdsdsdsionFunction");
      
            return decryptionToken; //{ pan: decryptionToken };
          }

    
    } catch (e) {
      //   console.log("e", e.message);
      return { error: e.message };
    }
  }

//   async getEncryptedTokenData(
//     decryptedDataUrl,
//     encryptionData,
//     accessTokenUrl,
//     accessTokenPayload,
//     accessTokenAuth
//   ) {
//     let accessToken = await getAccessToken(
//       accessTokenUrl,
//       accessTokenPayload,
//       accessTokenAuth
//     );

//     let data = {
//       encryptedTokens: encryptionData,
//     };
//     let headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken.access_token}`,
//     };
// console.log("here--------dsd----")
//     let res = await axios.post(decryptedDataUrl, data, { headers: headers });
//     console.log("--------response-")

//     return res.data;
//   }
}

module.exports = new Detokenize();
