const axios = require("axios");
const TokenEncryption = require("../encr");
const TokenDecryption = require("../dcr");
const getAccessToken = require("./accessToken");

class Tokenize {
  async tokenize(data) {
    // console.log("data---------------", data);
    try {
      let isPanList =Array.isArray(data.pan);
      if (!isPanList){
        throw new Error("Pan Parameter takes List of PAN only");
      }
      if ((data.pan).length<1){
        throw new Error("Pan List Should not be empty");

      }
      let pan = data?.pan;
      let serverPublicKey = data?.serverPublicKey;
      let internalPrivateKey = data?.internalPrivateKey;
      let accessTokenUrl = data?.accessTokenUrl;
      let accessTokenPayload = data?.accessTokenPayload;
      let accessTokenAuth = data?.accessTokenAuth;
      let encryptedDataUrl = data?.encryptedDataUrl;
      let panTokenObj={};
      //   console.log("pan-----", !pan || pan === "");
      if (
        !pan ||
        pan === "" ||
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
        !encryptedDataUrl ||
        encryptedDataUrl === ""
      ) {
        // console.log("data");
        throw new Error("All field are required");
      }
      
      let encryptionFunction = TokenEncryption.encryption(serverPublicKey);
      // console.log("encryptionFunction---------------",encryptionFunction);

        // Encrypt each string using map() and the encryption function with the parameter
        let encryptionData = pan.map(encryptionFunction);
        let panTokenizeObj= Object.assign(...pan.map((k, i) =>({ [k]: encryptionData[i] })))
          let flippedObject = Object.fromEntries(
            Object.entries(panTokenizeObj).map(([pan, token]) => [token, pan])
          );
          // console.log("encryptionDatflippedObjecta---------------",flippedObject);

      // let encryptionData = TokenEncryption.encryption(pan, serverPublicKey);
      let tokenizeData = await this.getEncryptedTokenData(
        encryptedDataUrl,
        encryptionData,
        accessTokenUrl,
        accessTokenPayload,
        accessTokenAuth
      );
      // let stringTokenObj={};
        let encrpypted_token=tokenizeData.results.data
        // console.log("encrpypted_token---------------",encrpypted_token);
        
        let decryptionFunction = TokenDecryption.decryption(internalPrivateKey,flippedObject);
        // console.log("decryptionFunction---------------",decryptionFunction);
      // let decryptionToken = encrpypted_token.map(decryptionFunction);

      var decryptionToken = encrpypted_token.reduce(decryptionFunction, {});
        // console.log("decryptionToken---------------",panTokenizeObj);

      // let decryptionToken = TokenDecryption.decryption(
      //   tokenizeData.results.encryptedToken,
      //   internalPrivateKey
      // );
      return decryptionToken;//{ tokenizePanList: decryptionToken };
    } catch (e) {
      //   console.log("e--------------", e.message);
      return { error: e.message };
    }
  }

  async getEncryptedTokenData(
    encryptedDataUrl,
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
      encryptedDataList: encryptionData,
    };
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken.access_token}`,
    };
    let res = await axios.post(encryptedDataUrl, data, { headers });
    return res.data;
  }
}

module.exports = new Tokenize();
