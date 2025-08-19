# JWT Token Generator

A simple JavaScript implementation that generates signed JWT tokens based on the Fireblocks SDK pattern.

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

Run the script to generate a signed JWT token:

```bash
npm start
# or
node index.js
```

The script will output:
- The signed JWT token
- The claims used in the token
- The JSON body that was hashed

## Token Structure

The JWT includes these claims:
- `uri`: API endpoint path
- `nonce`: Unique identifier (UUID)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (55 seconds from now)
- `sub`: API key
- `bodyHash`: SHA-256 hash of the request body

## Security Notes

- Keep your private key secure and never commit it to version control
- The token expires in 55 seconds for security
- Each token includes a unique nonce to prevent replay attacks