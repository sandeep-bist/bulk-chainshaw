const forge = require("node-forge");
const crypto = require("crypto");

class TokenDecry {
  decryption(privateKey,stringTokenObj=null) {

    return(emptyObj,encryptedData,)=>{
      // return(encryptedData)=>{
      let decodedToken;
      // console.log("---------------dcr----",stringTokenObj)
      if (encryptedData.hasOwnProperty("data")){
       decodedToken = Buffer.from(encryptedData.data, "base64");
      }
      else{
        decodedToken = Buffer.from(encryptedData.token, "base64");
        // delete stringTokenObj[encryptedData.value];
      }
      // console.log(`Encrypted Text: ${privateKey}`);
      
      const privateKeyOriginal = this.loadPrivateKey(privateKey);
  
      // console.log(`privateKeyOriginal : ${privateKeyOriginal}`);
      // const decryptCipher = crypto.createDecipheriv(
        //   "RSA-OAEP",
      //   privateKeyOriginal,
      //   Buffer.alloc(0)
      // );
  
      // const ciphertextByte = Buffer.concat([
        //   decryptCipher.update(decodedToken),
        //   decryptCipher.final(),
        // ]);
        // return ciphertextByte.toString("utf-8");
        const decryptedData = crypto.privateDecrypt(
          {
            key: privateKeyOriginal,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: MDNAME,
          },
          decodedToken
      );
  
      // stringTokenObj[]= decryptedData.toString("utf-8");
      // return stringTokenObj;
      // stringTokenObj["AACPG8957E"]="dfewf"
      if  (encryptedData.hasOwnProperty("data")){
        // console.log("encryptedData--------")
        stringTokenObj[stringTokenObj[encryptedData.value]]=decryptedData.toString("utf-8");
        delete stringTokenObj[encryptedData.value]; 
      }
      else{
        stringTokenObj[stringTokenObj[encryptedData.value]]=decryptedData.toString("utf-8");
        delete stringTokenObj[encryptedData.value]; 
      }
      // console.log("----------------valueeee",stringTokenObj);
      
      return stringTokenObj; //decryptedData.toString("utf-8");
    }
   
  }

  loadPrivateKey(privateKey) {
    // const privateKeyBytes = Buffer.from(privateKey, "base64");

    // const keySpec = forge.pki.privateKeyFromAsn1(
    //   forge.asn1.fromDer(privateKeyBytes.toString("binary"))
    // );
    // const keyBuffer = Buffer.from(
    //   forge.asn1.toDer(forge.pki.privateKeyToAsn1(keySpec)).getBytes(),
    //   "binary"
    // );

    // return keyBuffer;
    const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
    const privateKeyOriginal = crypto.createPrivateKey({
      key: privateKeyPem,
      format: "pem",
      type: "pkcs1",
    });

    return privateKeyOriginal;
  }
}

const INSTANCE_PADDING = "RSA-OAEP";
const MDNAME = "sha256";
const MFNAME = "MGF1";
const ALGO = "RSA";

const SHA256 = "sha256";

module.exports = new TokenDecry();
