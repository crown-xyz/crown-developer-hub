# Crown API Authentication Examples

This folder contains authentication examples for the Crown API in various programming languages. Each example demonstrates how to generate signed JWT tokens and make authenticated API requests.

## Overview

The Crown API uses JWT-based authentication with RSA signatures. Each API request requires:
- An API key in the `X-API-Key` header
- A signed JWT token in the `Authorization` header as a Bearer token

## Authentication Flow

1. Generate an RSA key pair (private/public keys)
2. Create a JWT payload with required claims
3. Sign the JWT using your private key
4. Include the signed JWT and API key in your requests

## JWT Claims

Each JWT must include the following claims:
- `uri` - The API endpoint path
- `nonce` - A unique identifier (typically UUID)
- `iat` - Issued at timestamp
- `exp` - Expiration timestamp
- `sub` - Your API key
- `bodyHash` - SHA-256 hash of the request body. If it is a request without a body, use a empty string to generate the hash (For instance a GET request)

## Available Examples

[JavaScript](https://github.com/crown-xyz/crown-developer-hub/tree/main/examples/api-authentication/javascript)

