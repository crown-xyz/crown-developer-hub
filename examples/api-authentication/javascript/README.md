# Crown API Authentication with a Signed JWT example

A JavaScript implementation that generates signed JWT tokens and makes authenticated API requests to a Crown API endpoint.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate RSA Key Pair

Create a private and public key pair using OpenSSL:

```bash
# Generate private key
openssl genrsa -out private.pem 2048

# Extract public key from private key
openssl rsa -in private.pem -pubout -out public.pem

# View the private key content (copy this to .env)
cat private.pem
```

**Production Security**: For production environments, generate private keys in a secure environment such as:
- AWS Nitro Enclaves
- Hardware Security Modules (HSMs)
- Secure offline environments with proper air-gapping

### 3. Configure Environment Variables

Edit the `.env` file with your actual values:

```
API_KEY=your_actual_api_key
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...your_private_key_content...
-----END RSA PRIVATE KEY-----"
```

**Important**: Make sure to include the full private key with proper line breaks and headers.

## Usage

### Generate Token and Make API Request (Default)

```bash
npm start
# or
node index.js
```

The script will:
- Generate a signed JWT token
- Make an authenticated POST request to `https://api.brl.xyz/api/v1/echo`
- Include the API key in the `X-API-Key` header
- Include the JWT token in the `Authorization` header as a Bearer token
- Display the API response

### Generate Token Only

To generate only the JWT token without making the API request:

```bash
node index.js --token-only
# or
node index.js -t
```

This will output only the generated JWT token, useful for debugging or using the token in other applications.

## Token Structure

The JWT includes these claims:
- `uri`: API endpoint path
- `nonce`: Unique identifier (UUID)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (55 seconds from now)
- `sub`: API key
- `bodyHash`: SHA-256 hash of the request body. If it is a request without a body, use a empty string to generate the hash (For instance a GET request)

## Security Notes

- Keep your private key secure and never commit it to version control
- The token expires in 55 seconds for security
- Each token includes a unique nonce to prevent replay attacks
