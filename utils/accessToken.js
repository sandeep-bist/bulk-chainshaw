const axios = require("axios");

async function getAccessToken(
  accessTokenUrl,
  accessTokenPayload,
  accessTokenAuth
) {
  try {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: accessTokenUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: accessTokenAuth,
        // Cookie: "XSRF-TOKEN=e621d685-4e47-4567-9d93-4238f4fcecd3",
      },
      data: accessTokenPayload,
    };

    let res = await axios.request(config);

    return res.data;
  } catch (e) {}
}

module.exports = getAccessToken;
