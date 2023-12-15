const TokenizeConfigs=require("../utils/config");
const getAccessToken = require("./accessToken");
const axios = require("axios");

 exports.getEncryptedTokenData=async(
    encryptionData
  )=> {
    let accessToken = await getAccessToken(
        TokenizeConfigs.accessTokenUrl,
        TokenizeConfigs.accessTokenPayload,
        TokenizeConfigs.accessTokenAuth
    );

    let data = {
      encryptedDataList: encryptionData,
    };
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken.access_token}`,
    };
    let res = await axios.post(TokenizeConfigs.encryptedDataUrl, data, { headers });
    return res.data;
  }