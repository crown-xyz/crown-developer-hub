const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuid } = require('uuid');
require('dotenv').config();

function generateJWT() {
  const apiKey = process.env.API_KEY;
  let privateKey = process.env.PRIVATE_KEY;

  const bodyJson = {
    "message": "Hello World",
  };

  const claims = {
    uri: "/api/v1/echo",
    nonce: uuid(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 55,
    sub: apiKey,
    bodyHash: crypto.createHash("sha256").update(JSON.stringify(bodyJson || "")).digest().toString("hex")
  };

  const token = jwt.sign(claims, privateKey, { algorithm: "RS256" });

  return token;
}

function main() {
  try {
    const token = generateJWT();

    console.log('Generated JWT Token:');
    console.log('===================');
    console.log(token);
  } catch (error) {
    console.error('Error generating JWT:', error.message);
  }
}

main();

