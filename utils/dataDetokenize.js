
const TokenizeConfigs=require("../utils/config");
const getAccessToken = require("./accessToken");
const axios = require("axios");

 exports.getDecryptedTokenData=async(
    encryptionData
  )=> {
  let accessToken = await getAccessToken(
    TokenizeConfigs.accessTokenUrl,
    TokenizeConfigs.accessTokenPayload,
    TokenizeConfigs.accessTokenAuth
  );

  let data = {
    encryptedTokens: encryptionData,
  };
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken.access_token}`,
  };
// console.log("here--------dsd----")
  let res = await axios.post(TokenizeConfigs.decryptedDataUrl, data, { headers: headers });
  // console.log("--------response-",res.data)

  return res.data;
}