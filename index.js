const express = require("express");
const Tokenize = require("./utils/tokenize");
const Detokenize = require("./utils/detokenize");

module.exports = {
  Tokenize,
  Detokenize,
};

// const app = express();

// app.use(express.json());

// app.post("/api/bulk-tokenize", async (req, res) => {
//   let dataa = {
//     pan: req.body?.pan,
//     serverPublicKey: req.body?.serverPublicKey,
//     internalPrivateKey: req.body?.internalPrivateKey,
//     accessTokenUrl: req.body?.accessTokenUrl,
//     accessTokenPayload: req.body?.accessTokenPayload,
//     accessTokenAuth: req.body?.accessTokenAuth,
//     encryptedDataUrl: req.body?.encryptedDataUrl,
//   };
//   let resp = await Tokenize.tokenize(dataa);
//   return res.json(resp);
// });
// app.post("/api/bulk-detokenize", async (req, res) => {
//   let dataa = {
//     tokenizePan: req.body?.tokenizePan,
//     serverPublicKey: req.body?.serverPublicKey,
//     internalPrivateKey: req.body?.internalPrivateKey,
//     accessTokenUrl: req.body?.accessTokenUrl,
//     accessTokenPayload: req.body?.accessTokenPayload,
//     accessTokenAuth: req.body?.accessTokenAuth,
//     decryptedDataUrl: req.body?.decryptedDataUrl,
  };
  let resp = await Detokenize.detokenize(dataa);
  return res.json(resp);
});

app.listen("4000", () => {
  console.log("server listening on 4000 port");
});
