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
  const uri = "/api/v1/echo";
  const bodyJson = {
    "message": "Hello World",
  };

  const bodyString = JSON.stringify(bodyJson)
  const token = generateJWT(uri, bodyString);

  try {
    const response = await axios.post(`http://localhost:3100${uri}`, bodyString, {
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
    const args = process.argv.slice(2);
    const tokenOnly = args.includes('--token-only') || args.includes('-t');

    if (tokenOnly) {
      const uri = "/api/v1/echo";
      const bodyJson = {
        "message": "Hello World",
      };
      const bodyString = JSON.stringify(bodyJson, null, 2)
 
      const token = generateJWT(uri, bodyString);
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

