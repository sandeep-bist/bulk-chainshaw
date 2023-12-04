const forge = require("node-forge");
const crypto = require("crypto");

const INSTANCE_PADDING = "RSA-OAEP";
const MD_NAME = "sha256";
const MF_NAME = "MGF1";
const ALGO = "RSA";

class Encryptor {
  encryption( tokenizationServerPublicKey) {
    return (plaintext)=>{
      try {
        if (!plaintext) {
          throw new Error("Plaintext must not be null.");
        }
  
        const dataBuffer = Buffer.from(plaintext, "utf-8");
        //   console.log("dataBuffer ", dataBuffer);
          // console.log("dataBuffer------------ ",plaintext);
        const tokenPublicKey = this.loadPublicKey(tokenizationServerPublicKey);
        //   console.log("tokenPublicKey ", tokenPublicKey);
        // const encryptCipher = crypto.createCipheriv(
        //   "RSA-OAEP",
        //   tokenPublicKey,
        //   Buffer.alloc(0)
        // );
        // console.log("encryptCipher ", encryptCipher);
        // const encryptedData = Buffer.concat([
        //   encryptCipher.update(dataBuffer),
        //   encryptCipher.final(),
        // ]);
        const encryptCipher = crypto.createPublicKey({
          key: tokenPublicKey,
          format: "der",
          type: "spki",
        });
  
        const encryptedData = crypto.publicEncrypt(
          {
            key: encryptCipher,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: MD_NAME,
            mgf1Hash: { name: MF_NAME },
          },
          dataBuffer
        );
  
        return encryptedData.toString("base64");
      } catch (e) {
        // console.log("loggggg eeeror--------------", e);
        throw new Error("encryption data error");
      }
    }
 
  }

  loadPublicKey(publicKey) {
    // console.log("get public key-------------")
    const publicKeyBytes = Buffer.from(publicKey, "base64");
    const keySpec = forge.pki.publicKeyFromAsn1(
      forge.asn1.fromDer(publicKeyBytes.toString("binary"))
    );
    const keyBuffer = Buffer.from(
      forge.asn1.toDer(forge.pki.publicKeyToAsn1(keySpec)).getBytes(),
      "binary"
    );
    // const privateKeyPem = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
    // const publicKeyOriginal = crypto.createPublicKey({
    //   key: privateKeyPem,
    //   format: "pem",
    //   type: "pkcs1",
    // });

    return keyBuffer;
    // return publicKeyOriginal;
  }
}

// const plaintext = "DDUPP5888N";
// const plaintext = "70b924674c4e402ea69c452a1e8cc307";

// const encryptedText = encryption(plaintext, publicKey);
// console.log("Encrypted Text:", encryptedText);

module.exports = new Encryptor();
