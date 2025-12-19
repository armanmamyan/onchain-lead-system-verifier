# API Reference

**AIR Kit Verified Lead System - API Documentation**

This document provides detailed API endpoint documentation for the Verified Lead System.

---

## 🔗 Base URLs

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:3000` |
| Production | `https://your-domain.com` |

---

## 📍 Endpoints

### Public Endpoints

#### GET `/api/.well-known/jwks`

Returns the JSON Web Key Set (JWKS) containing public keys for JWT verification.

**Request:**
```bash
curl https://your-domain.com/api/.well-known/jwks
```

**Response:**
```json
{
  "keys": [
    {
      "kty": "RSA",
      "n": "xGOr8sKbFW...",
      "e": "AQAB",
      "kid": "partner-id-123",
      "use": "sig",
      "alg": "RS256"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `kty` | string | Key type (RSA) |
| `n` | string | RSA modulus (public key component) |
| `e` | string | RSA exponent |
| `kid` | string | Key ID (matches Partner ID) |
| `use` | string | Key usage (`sig` for signature) |
| `alg` | string | Algorithm (`RS256`) |

---

#### GET `/api/auth-token`

Generates a JWT token for AIR Kit credential operations.

**Request:**
```bash
curl https://your-domain.com/api/auth-token
```

**Response:**
```json
{
  "authToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6InBhcnRuZXItaWQtMTIzIiwidHlwIjoiSldUIn0..."
}
```

**Token Payload:**
```json
{
  "partnerId": "your-partner-id",
  "scope": "verify",
  "iat": 1702646400,
  "exp": 1702647300
}
```

**Token Properties:**
- **Algorithm**: RS256
- **Expiration**: 15 minutes
- **Key ID**: Partner ID (for JWKS lookup)

---

### Authentication Endpoints (NextAuth.js)

#### POST `/api/auth/callback/admin-credentials`

Admin login endpoint for dashboard access.

**Request:**
```bash
curl -X POST https://your-domain.com/api/auth/callback/admin-credentials \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-admin-password"
  }'
```

**Response (Success):**
Redirects to dashboard with session cookie

**Response (Failure):**
```json
{
  "error": "Invalid credentials"
}
```

---

#### GET `/api/auth/session`

Get current session information.

**Request:**
```bash
curl https://your-domain.com/api/auth/session \
  -H "Cookie: next-auth.session-token=..."
```

**Response (Authenticated):**
```json
{
  "user": {
    "id": "admin-id",
    "username": "admin"
  },
  "expires": "2024-01-15T12:00:00.000Z"
}
```

**Response (Unauthenticated):**
```json
{}
```

---

## 📄 Page Routes

### Partner/Issue/Verify Pages

#### GET `/`

Partner landing page (Oyunfor). Displays featured advertisement and links to verification.

#### GET `/issue`

Credential issuance page. 3-step flow:
1. AIR Kit login
2. Wallet connection
3. Credential issuance

#### GET `/verify`

Credential verification page.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `partnerId` | string | No | `"oyunfor"` | Partner identifier for tracking |
| `successUrl` | string | No | `"/okx"` | Redirect URL on successful verification |
| `failUrl` | string | No | `"/fallback"` | Redirect URL on failed verification |
| `rule` | string | No | `"wallet_balance_gt_1000"` | Verification rule |

**Example URLs:**
```
/verify
/verify?partnerId=gamefi
/verify?successUrl=https://game.com/play&failUrl=https://game.com/signup
/verify?rule=wallet_balance_gt_5000
/verify?partnerId=premium&successUrl=/premium&failUrl=/upgrade&rule=wallet_balance_gt_10000
```

#### GET `/[partner]`

Dynamic advertiser success page. Displays confirmation for verified user.

**Example:** `/okx` - Success page for OKX partner

#### GET `/fallback`

Fallback page for failed verifications. Shows:
- Requirements explanation
- Link to `/issue` for getting credentials
- Alternative options

---

### Admin Pages

#### GET `/admin`

Admin login page.

**Requires:** No authentication (login form)

#### GET `/admin/dashboard`

Admin dashboard with campaign management.

**Requires:** Admin session

**Features:**
- Statistics cards (Total, Pending, Approved, Active, Rejected, Expired)
- Campaign submissions table
- Status management (Approve, Reject, Activate)
- CSV export

#### GET `/submit-ad`

Ad campaign submission form.

---

## 🔧 Server Actions

Server actions are used for data mutations. They are called from client components.

### Ad Submissions

#### `createAdSubmission(data: AdSubmissionInput)`

Create a new ad campaign submission.

**Input:**
```typescript
{
  adName: string;           // Campaign name (min 3 chars)
  adDescription: string;    // Description (min 10 chars)
  maximumIssuance: number;  // Max verified users
  accessibleFrom: Date;     // Start date
  accessibleUntil: Date;    // End date
  contactEmail: string;     // Contact email
  contactPersonName: string; // Contact name (min 2 chars)
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: AdSubmission;
  error?: string | ZodError;
}
```

---

#### `getAllAdSubmissions()`

Get all ad submissions (admin only).

**Response:**
```typescript
{
  success: boolean;
  data?: AdSubmission[];
  error?: string;
}
```

---

#### `updateAdSubmissionStatus(id: string, status: AdStatus)`

Update submission status.

**Status Values:**
- `PENDING` - Awaiting review
- `APPROVED` - Approved, not yet active
- `ACTIVE` - Currently running
- `REJECTED` - Declined
- `EXPIRED` - Past end date

**Response:**
```typescript
{
  success: boolean;
  data?: AdSubmission;
  error?: string;
}
```

---

#### `deleteAdSubmission(id: string)`

Delete an ad submission.

**Response:**
```typescript
{
  success: boolean;
  error?: string;
}
```

---

#### `getAdSubmissionsStats()`

Get submission statistics.

**Response:**
```typescript
{
  success: boolean;
  data?: {
    total: number;
    pending: number;
    approved: number;
    active: number;
    rejected: number;
    expired: number;
  };
  error?: string;
}
```

---

## 📊 Rule Format

Rules define verification criteria using a simple string format.

### Syntax

```
wallet_balance_gt_{threshold}
```

### Parsing Logic

```typescript
const parseRule = (ruleString: string): number => {
  const parts = ruleString.split("_");
  const threshold = parts[parts.length - 1];
  return parseInt(threshold) || 1000;  // Default: 1000
};
```

### Examples

| Rule | Threshold (USD) |
|------|----------------|
| `wallet_balance_gt_100` | $100 |
| `wallet_balance_gt_500` | $500 |
| `wallet_balance_gt_1000` | $1,000 |
| `wallet_balance_gt_5000` | $5,000 |
| `wallet_balance_gt_10000` | $10,000 |

---

## 🔐 Authentication Flow

### Admin Authentication

```
┌─────────────────────────────────────────────────────────┐
│ 1. POST /api/auth/callback/admin-credentials            │
│    Body: { username, password }                         │
│                                                         │
│ 2. Server validates credentials via Prisma              │
│    - Find admin by username                             │
│    - bcrypt.compare(password, hash)                     │
│                                                         │
│ 3. If valid: Create JWT session                         │
│    Set cookie: next-auth.session-token                  │
│                                                         │
│ 4. Access protected routes with session cookie          │
└─────────────────────────────────────────────────────────┘
```

### AIR Kit Authentication

```
┌─────────────────────────────────────────────────────────┐
│ 1. GET /api/auth-token                                  │
│    Returns: JWT signed with PARTNER_PRIVATE_KEY         │
│                                                         │
│ 2. Client sends JWT to AIR Kit SDK                      │
│    airService.issueCredential({ authToken, ... })       │
│    airService.verifyCredential({ authToken, ... })      │
│                                                         │
│ 3. AIR Kit verifies JWT                                 │
│    - Fetch JWKS from /api/.well-known/jwks              │
│    - Find key by kid (Partner ID)                       │
│    - Verify RS256 signature                             │
│    - Check expiration                                   │
│                                                         │
│ 4. If valid: Process credential operation               │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Data Types

### AdSubmission

```typescript
interface AdSubmission {
  id: string;
  adName: string;
  adDescription: string;
  maximumIssuance: number;
  accessibleFrom: Date;
  accessibleUntil: Date;
  contactEmail: string;
  contactPersonName: string;
  status: AdStatus;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
  createdBy?: Admin;
}

enum AdStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED"
}
```

### BalanceData

```typescript
interface BalanceData {
  totalUsd: number;
  eth: number;
  tokens: Array<{
    symbol: string;
    balance: number;
    usdValue: number;
  }>;
}
```

### CredentialSubject

```typescript
interface CredentialSubject {
  id: string;              // Partner-WalletAddress
  walletAddress: string;   // 0x...
  "balance-eth": number;   // ETH balance
  "balance-usd": number;   // USD value
  "verified-at": string;   // ISO timestamp
}
```

---

## 🔧 Error Handling

### Standard Error Response

```typescript
{
  success: false,
  error: string | ZodError
}
```

### Common Errors

| Error | Status | Description |
|-------|--------|-------------|
| Invalid credentials | 401 | Admin login failed |
| Unauthorized | 401 | No valid session |
| Validation error | 400 | Invalid input data |
| Not found | 404 | Resource not found |
| Server error | 500 | Internal server error |

---

## 🧪 Testing Endpoints

### Test JWKS
```bash
curl http://localhost:3000/api/.well-known/jwks | jq
```

### Test Auth Token
```bash
curl http://localhost:3000/api/auth-token | jq
```

### Test Admin Session
```bash
curl http://localhost:3000/api/auth/session \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

---

**For more information, see:**
- [README.md](../README.md) - Setup and overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Partner integration

