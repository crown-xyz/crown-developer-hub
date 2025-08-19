const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuid } = require('uuid');
const axios = require('axios');
require('dotenv').config();

function generateJWT(uri, bodyJson) {
  const apiKey = process.env.API_KEY;
  let privateKey = process.env.PRIVATE_KEY;

  const claims = {
    uri: uri,
    nonce: uuid(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 55,
    sub: apiKey,
    // Make sure that you use an empty string when the request does not have a body (For example, GET requests)
    bodyHash: crypto.createHash("sha256").update(JSON.stringify(bodyJson || "")).digest().toString("hex")
  };

  const token = jwt.sign(claims, privateKey, { algorithm: "RS256" });

  return token;
}

async function makeApiRequest() {
  const apiKey = process.env.API_KEY;
  const uri = "/api/v1/echo";
  const bodyJson = {
    "message": "Hello World",
  };
  const token = generateJWT(uri, bodyJson);

  try {
    const response = await axios.post(`https://api.brl.xyz${uri}`, bodyJson, {
      headers: {
        'X-API-Key': apiKey,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
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
    await makeApiRequest();
  } catch (error) {
    console.error('Error in main:', error.message);
  }
}

main();

