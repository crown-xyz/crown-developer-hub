const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuid } = require('uuid');
const axios = require('axios');
require('dotenv').config();

function generateJWT(uri, bodyString) {
  const apiKey = process.env.API_KEY;
  let privateKey = process.env.PRIVATE_KEY;

  const claims = {
    uri: uri,
    nonce: uuid(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 55,
    sub: apiKey,
    // Make sure that you use an empty string when the request does not have a body (For example, GET requests)
    bodyHash: crypto.createHash("sha256").update(bodyString || "").digest().toString("hex")
  };

  const token = jwt.sign(claims, privateKey, { algorithm: "RS256" });

  return token;
}


async function makeApiRequest() {
  const apiKey = process.env.API_KEY;
  const uri = "/api/v0/wallets";

  // GET requests have no body, so pass empty string
  const token = generateJWT(uri, "");

  try {
    const response = await axios.get(`https://app.brl.xyz${uri}`, {
      headers: {
        'X-API-Key': apiKey,
        'Authorization': `Bearer ${token}`,
      }
    });

    console.log('API Response:');
    console.log('=============');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
  } catch (error) {
    console.error('Error making API request:', error.response?.data || error.message);
  }
}

async function main() {
  try {
    const args = process.argv.slice(2);
    const tokenOnly = args.includes('--token-only') || args.includes('-t');

    if (tokenOnly) {
      const uri = "/api/v0/wallets";
      // GET requests have no body, so pass empty string
      const token = generateJWT(uri, "");
      console.log('Generated JWT Token:');
      console.log('===================');
      console.log(token);
    } else {
      await makeApiRequest();
    }
  } catch (error) {
    console.error('Error in main:', error.message);
  }
}

main();

