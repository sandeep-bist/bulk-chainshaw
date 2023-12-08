const axios = require("axios");
const TokenEncryption = require("../encr");
const TokenDecryption = require("../dcr");
const getAccessToken = require("./accessToken");

class Detokenize {
  async detokenize(data) {
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
      let serverPublicKey = data?.serverPublicKey;
      let internalPrivateKey = data?.internalPrivateKey;
      let accessTokenUrl = data?.accessTokenUrl;
      let accessTokenPayload = data?.accessTokenPayload;
      let accessTokenAuth = data?.accessTokenAuth;
      let decryptedDataUrl = data?.decryptedDataUrl;

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
      let encryptionFunction = TokenEncryption.encryption(serverPublicKey);

      // Encrypt each string using map() and the encryption function with the parameter
      let encryptionData = tokenizePan.map(encryptionFunction);
      // console.log("tokenizePanObj---encryptionData----------",encryptionData)
      
      let tokenizePanObj= Object.assign(...tokenizePan.map((k, i) =>({ [k]: encryptionData[i] })))
      // console.log("tokenizePanObj-------------",tokenizePanObj)
      let flippedObject = Object.fromEntries(
        Object.entries(tokenizePanObj).map(([pan, token]) => [token, pan])
      );
      // let encryptionData = TokenEncryption.encryption(
      //   tokenizePan,
      //   serverPublicKey
      // );
        // console.log(encryptionData, "--------encryptionData");
      let tokenizeData = await this.getEncryptedTokenData(
        decryptedDataUrl,
        encryptionData,
        accessTokenUrl,
        accessTokenPayload,
        accessTokenAuth
      );
        // console.log(tokenizeData, "--------tokenizeData");
      // let tok
      // let decryptionToken = TokenDecryption.decryption(
      //   tokenizeData.results.data,
      //   internalPrivateKey
      // );
      let encrpypted_token=tokenizeData.results.data;
      // console.log(tokenizePanObj, "--------decryptionFunction");
      let decryptionFunction = TokenDecryption.decryption(internalPrivateKey,flippedObject);

      let decryptionToken = encrpypted_token.reduce(decryptionFunction,{});

      return decryptionToken; //{ pan: decryptionToken };
    } catch (e) {
      //   console.log("e", e.message);
      return { error: e.message };
    }
  }

  async getEncryptedTokenData(
    decryptedDataUrl,
    encryptionData,
    accessTokenUrl,
    accessTokenPayload,
    accessTokenAuth
  ) {
    let accessToken = await getAccessToken(
      accessTokenUrl,
      accessTokenPayload,
      accessTokenAuth
    );

    let data = {
      encryptedTokens: encryptionData,
    };
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken.access_token}`,
    };
console.log("here--------dsd----")
    let res = await axios.post(decryptedDataUrl, data, { headers: headers });
    console.log("--------response-")

    return res.data;
  }
}

module.exports = new Detokenize();
