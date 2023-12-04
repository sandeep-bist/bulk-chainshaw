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

        // Encrypt each string using map() and the encryption function with the parameter
        let encryptionData = pan.map(encryptionFunction);

      // console.log("encryptionData---------------",encryptionData);

      // let encryptionData = TokenEncryption.encryption(pan, serverPublicKey);
      let tokenizeData = await this.getEncryptedTokenData(
        encryptedDataUrl,
        encryptionData,
        accessTokenUrl,
        accessTokenPayload,
        accessTokenAuth
      );
      // let tok
        let encrpypted_token=tokenizeData.results.data
      let decryptionFunction = TokenDecryption.decryption(internalPrivateKey);
      let decryptionToken = encrpypted_token.map(decryptionFunction);

      // let decryptionToken = TokenDecryption.decryption(
      //   tokenizeData.results.encryptedToken,
      //   internalPrivateKey
      // );
      return { tokenizePanList: decryptionToken };
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
