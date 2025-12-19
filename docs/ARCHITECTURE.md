# System Architecture

**AIR Kit Verified Lead System - POC Architecture**

This document provides a technical overview of the proof-of-concept architecture that simulates the complete verified lead ecosystem.

---

## 🏗️ POC Architecture Overview

This POC simulates **4 distinct parties** in a single Next.js application:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      POC APPLICATION ARCHITECTURE                             │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         NEXT.JS APP ROUTER                             │ │
│  │                                                                        │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │ │
│  │  │    /         │ │   /issue     │ │   /verify    │ │ /[partner]   │  │ │
│  │  │              │ │              │ │              │ │ /fallback    │  │ │
│  │  │  PARTNER     │ │  ISSUER      │ │  VERIFIER    │ │  DESTINATION │  │ │
│  │  │  (Oyunfor)   │ │  (Oyunfor)   │ │  (DAT Net)   │ │  (Advertiser)│  │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  │ │
│  │                                                                        │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        /api ROUTES                               │ │ │
│  │  │                                                                  │ │ │
│  │  │  /api/auth-token      - JWT generation for AIR Kit               │ │ │
│  │  │  /api/auth/[...]      - NextAuth.js (admin login)                │ │ │
│  │  │  /api/.well-known/jwks - JWKS public keys                        │ │ │
│  │  └──────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                        │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐ │ │
│  │  │                      ADMIN ROUTES                                │ │ │
│  │  │                                                                  │ │ │
│  │  │  /admin               - Admin login page                         │ │ │
│  │  │  /admin/dashboard     - Campaign management                      │ │ │
│  │  │  /submit-ad           - Ad submission form                       │ │ │
│  │  └──────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                       EXTERNAL SERVICES                                │ │
│  │                                                                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │ │
│  │  │  AIR Kit    │  │  Alchemy    │  │  Prisma     │  │  Reown      │   │ │
│  │  │  (Moca)     │  │  (Balance)  │  │  Accelerate │  │  AppKit     │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete User Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY FLOW                                   │
│                     Issue → Verify → Success/Fail                             │
└──────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────┐
                    │      PARTNER SITE (/)       │
                    │         Oyunfor             │
                    │                             │
                    │  Featured Ad:               │
                    │  "Exclusive Web3 Game"      │
                    │  Requirement: $1,000+       │
                    │                             │
                    │  [Play Now - Get Verified]  │
                    └──────────┬──────────────────┘
                               │
                               │ href="/issue"
                               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    CREDENTIAL ISSUANCE (/issue)                               │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ STEP 1: AIR KIT LOGIN                                                  │ │
│  │                                                                        │ │
│  │ • airService.login() called                                            │ │
│  │ • User authenticates with AIR Kit                                      │ │
│  │ • Decentralized identity created/accessed                              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│                                  ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ STEP 2: CONNECT WALLET                                                 │ │
│  │                                                                        │ │
│  │ • Reown AppKit opens wallet modal                                      │ │
│  │ • User connects MetaMask/WalletConnect                                 │ │
│  │ • Sign message to prove ownership                                      │ │
│  │ • Wallet address captured                                              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│                                  ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ STEP 3: FETCH BALANCE (Alchemy)                                        │ │
│  │                                                                        │ │
│  │ • alchemy.core.getBalance(address) → ETH balance                       │ │
│  │ • alchemy.core.getTokenBalances(address) → ERC20 balances              │ │
│  │ • getEthPrice() → Current ETH price                                    │ │
│  │ • Calculate total USD value                                            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│                                  ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ STEP 4: ISSUE CREDENTIAL                                               │ │
│  │                                                                        │ │
│  │ // Get JWT from backend                                                │ │
│  │ const { authToken } = await axios.get('/api/auth-token');              │ │
│  │                                                                        │ │
│  │ // Build credential subject                                            │ │
│  │ const credentialSubject = {                                            │ │
│  │   id: `${PARTNER_ID}-${walletAddress}`,                                │ │
│  │   walletAddress,                                                       │ │
│  │   "balance-eth": 2.5,                                                  │ │
│  │   "balance-usd": 7500,                                                 │ │
│  │   "verified-at": "2024-01-15T10:30:00Z"                                │ │
│  │ };                                                                     │ │
│  │                                                                        │ │
│  │ // Issue via AIR Kit SDK                                               │ │
│  │ await airService.issueCredential({                                     │ │
│  │   authToken,                                                           │ │
│  │   issuerDid: ISSUER_DID,                                               │ │
│  │   credentialId: CREDENTIAL_ID,                                         │ │
│  │   credentialSubject                                                    │ │
│  │ });                                                                    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│                                  ▼                                           │
│                    ┌─────────────────────────────┐                          │
│                    │        SUCCESS!             │                          │
│                    │                             │                          │
│                    │  Credential issued on-chain │                          │
│                    │                             │                          │
│                    │  [Test Verification] ──────┼──────────────┐           │
│                    │  [Browse Offers] → /        │              │           │
│                    └─────────────────────────────┘              │           │
└────────────────────────────────────────────────────────────────┼────────────┘
                                                                  │
                     href="/verify?partnerId=oyunfor&rule=wallet_balance_gt_1000
                          &successUrl=/okx&failUrl=/fallback"
                                                                  │
                                                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    DAT NETWORK VERIFIER (/verify)                             │
│                                                                              │
│  URL Parameters Received:                                                    │
│  • partnerId = "oyunfor"                                                     │
│  • successUrl = "/okx"                                                       │
│  • failUrl = "/fallback"                                                     │
│  • rule = "wallet_balance_gt_1000"                                           │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ PARSE RULE                                                             │ │
│  │                                                                        │ │
│  │ const parseRule = (rule) => {                                          │ │
│  │   const parts = rule.split("_");                                       │ │
│  │   return parseInt(parts[parts.length - 1]) || 1000;                    │ │
│  │ };                                                                     │ │
│  │ // requiredBalance = 1000                                              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│                                  ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ USER CLICKS "Verify My Credentials"                                    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│                                  ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ VERIFY CREDENTIAL                                                      │ │
│  │                                                                        │ │
│  │ // Login if needed                                                     │ │
│  │ if (!airService.isLoggedIn) await airService.login();                  │ │
│  │                                                                        │ │
│  │ // Get auth token                                                      │ │
│  │ const { authToken } = await axios.get('/api/auth-token');              │ │
│  │                                                                        │ │
│  │ // Verify via AIR Kit (ZK proof)                                       │ │
│  │ const result = await airService.verifyCredential({                     │ │
│  │   authToken,                                                           │ │
│  │   programId: VERIFIER_PROGRAM_ID,                                      │ │
│  │   redirectUrl: ISSUER_URL                                              │ │
│  │ });                                                                    │ │
│  │                                                                        │ │
│  │ // Check result (use bracket notation for kebab-case)                 │ │
│  │ const userBalance = result?.credentialSubject?.["balance-usd"] || 0;   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│              ┌───────────────────┴───────────────────┐                      │
│              │                                       │                      │
│              ▼                                       ▼                      │
│  ┌───────────────────────────┐       ┌───────────────────────────┐         │
│  │ userBalance > 1000        │       │ userBalance <= 1000       │         │
│  │                           │       │ OR no credential          │         │
│  │ ✅ SUCCESS                 │       │ OR user cancelled         │         │
│  │                           │       │                           │         │
│  │ setStatus("success")      │       │ ❌ FAILURE                 │         │
│  │ setCountdown(3)           │       │                           │         │
│  │                           │       │ setStatus("failed")       │         │
│  │ After 3s:                 │       │ setCountdown(5)           │         │
│  │ router.push(successUrl)   │       │                           │         │
│  │ → /okx                    │       │ After 5s:                 │         │
│  │                           │       │ router.push(failUrl)      │         │
│  │                           │       │ → /fallback               │         │
│  └───────────────┬───────────┘       └───────────────┬───────────┘         │
└──────────────────┼───────────────────────────────────┼──────────────────────┘
                   │                                   │
                   ▼                                   ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│  ADVERTISER SUCCESS (/okx)    │   │  FALLBACK (/fallback)         │
│                               │   │                               │
│  "Welcome to OKX Premium!"    │   │  "Requirements Not Met"       │
│                               │   │                               │
│  VIP Benefits:                │   │  Required:                    │
│  • 50% lower fees             │   │  • $1,000+ wallet balance     │
│  • $20 trading credit         │   │                               │
│  • Early access               │   │  [Get Credentials] → /issue   │
│  • Premium support            │   │  [Browse Offers] → /          │
└───────────────────────────────┘   └───────────────────────────────┘
```

---

## 🔐 JWT Authentication Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           JWT FLOW FOR AIR KIT                                │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────┐
    │ 1. CLIENT (Issue or Verify Page)                                    │
    │                                                                     │
    │    const { authToken } = await axios.get('/api/auth-token');        │
    └──────────────────────────────────────┬──────────────────────────────┘
                                           │
                                           │ GET /api/auth-token
                                           ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │ 2. API ROUTE (/api/auth-token/route.ts)                             │
    │                                                                     │
    │    // Load private key                                              │
    │    const privateKey = await importPKCS8(                            │
    │      formatPrivateKey(env.PARTNER_PRIVATE_KEY),                     │
    │      'RS256'                                                        │
    │    );                                                               │
    │                                                                     │
    │    // Create and sign JWT                                           │
    │    const jwt = await new SignJWT({                                  │
    │      partnerId: env.NEXT_PUBLIC_PARTNER_ID,                         │
    │      scope: 'verify'                                                │
    │    })                                                               │
    │    .setProtectedHeader({                                            │
    │      alg: 'RS256',                                                  │
    │      kid: env.NEXT_PUBLIC_PARTNER_ID                                │
    │    })                                                               │
    │    .setIssuedAt()                                                   │
    │    .setExpirationTime('15m')                                        │
    │    .sign(privateKey);                                               │
    │                                                                     │
    │    return { authToken: jwt };                                       │
    └──────────────────────────────────────┬──────────────────────────────┘
                                           │
                                           │ JWT returned
                                           ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │ 3. AIR KIT SDK (on client)                                          │
    │                                                                     │
    │    // JWT sent to AIR Kit                                           │
    │    await airService.issueCredential({ authToken, ... });            │
    │    // OR                                                            │
    │    await airService.verifyCredential({ authToken, ... });           │
    └──────────────────────────────────────┬──────────────────────────────┘
                                           │
                                           │ JWT included in request
                                           ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │ 4. AIR KIT NETWORK (Moca Network)                                   │
    │                                                                     │
    │    // Extract kid from JWT header                                   │
    │    const kid = jwt.header.kid; // "partner-id"                      │
    │                                                                     │
    │    // Fetch JWKS from our app                                       │
    │    const jwks = await fetch(                                        │
    │      'https://our-app.com/api/.well-known/jwks'                     │
    │    );                                                               │
    │                                                                     │
    │    // Find matching key                                             │
    │    const key = jwks.keys.find(k => k.kid === kid);                  │
    │                                                                     │
    │    // Verify JWT signature using public key                         │
    │    verify(jwt, key);                                                │
    │                                                                     │
    │    // If valid → process credential operation                       │
    │    // If invalid → reject request                                   │
    └─────────────────────────────────────────────────────────────────────┘
```

---

## 📍 Route Structure

### Public Routes (home group)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/(home)/page.tsx` | Partner page (Oyunfor) |
| `/issue` | `src/app/(home)/issue/page.tsx` | Credential issuance |
| `/verify` | `src/app/(home)/verify/page.tsx` | DAT Network verifier |
| `/[partner]` | `src/app/(home)/[partner]/page.tsx` | Advertiser success (dynamic) |
| `/fallback` | `src/app/(home)/fallback/page.tsx` | Failed verification |
| `/submit-ad` | `src/app/(home)/submit-ad/page.tsx` | Ad submission form |

### Admin Routes

| Route | File | Purpose |
|-------|------|---------|
| `/admin` | `src/app/admin/page.tsx` | Admin login |
| `/admin/dashboard` | `src/app/admin/dashboard/page.tsx` | Campaign management |

### API Routes

| Route | File | Purpose |
|-------|------|---------|
| `/api/auth-token` | `src/app/api/auth-token/route.ts` | JWT generation |
| `/api/auth/[...nextauth]` | `src/app/api/auth/[...nextauth]/route.ts` | NextAuth.js |

---

## 🔗 URL Parameters Reference

### Verifier Page (`/verify`)

```typescript
// In VerifierContent.tsx
const params = use(searchParams);
const partnerId = params.partnerId as string || "oyunfor";
const successUrl = params.successUrl as string || "/okx";
const failUrl = params.failUrl as string || "/fallback";
const rule = params.rule as string || "wallet_balance_gt_1000";
const requiredBalance = parseRule(rule);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `partnerId` | string | `"oyunfor"` | Partner identifier |
| `successUrl` | string | `"/okx"` | Redirect on success |
| `failUrl` | string | `"/fallback"` | Redirect on failure |
| `rule` | string | `"wallet_balance_gt_1000"` | Verification rule |

### Rule Parser

```typescript
const parseRule = (ruleString: string): number => {
  const parts = ruleString.split("_");
  const threshold = parts[parts.length - 1];
  return parseInt(threshold) || 1000;
};
```

---

## 💾 Database Schema

```prisma
model Admin {
  id            String         @id @default(cuid())
  username      String         @unique
  password      String         // bcrypt hashed
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  adSubmissions AdSubmission[]
}

model AdSubmission {
  id                String    @id @default(cuid())
  adName            String
  adDescription     String    @db.Text
  maximumIssuance   Int
  accessibleFrom    DateTime
  accessibleUntil   DateTime
  contactEmail      String
  contactPersonName String
  status            AdStatus  @default(PENDING)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  createdById       String?
  createdBy         Admin?    @relation(fields: [createdById], references: [id])
}

enum AdStatus {
  PENDING
  APPROVED
  ACTIVE
  REJECTED
  EXPIRED
}
```

---

## 🔌 External Service Integrations

### AIR Kit SDK (Moca Network)

```typescript
// Context: src/contexts/AirkitContext.tsx
// Hook: src/hooks/useAirkit.tsx

const { airService, isInitialized } = useAirkit();

// Login
await airService.login();

// Issue credential
await airService.issueCredential({
  authToken,
  issuerDid: ISSUER_DID,
  credentialId: CREDENTIAL_ID,
  credentialSubject
});

// Verify credential
const result = await airService.verifyCredential({
  authToken,
  programId: VERIFIER_PROGRAM_ID,
  redirectUrl: ISSUER_URL
});
```

### Alchemy SDK (Balance Fetching)

```typescript
// In /issue page
const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  network: Network.ETH_MAINNET,
});

// Get ETH balance
const ethBalance = await alchemy.core.getBalance(address, "latest");

// Get token balances
const tokenBalances = await alchemy.core.getTokenBalances(address);

// Get token metadata
const metadata = await alchemy.core.getTokenMetadata(contractAddress);
```

### Reown AppKit (Wallet Connection)

```typescript
// In /issue page
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";

const { address, isConnected } = useAppKitAccount();
const { disconnect } = useDisconnect();
const { open } = useAppKit();

// Open wallet modal
open({ view: "Connect" });
```

---

## 🔧 Environment Variables

```bash
# Database
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."

# Admin Auth
ADMIN_PASS="..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# AIR Kit
NEXT_PUBLIC_PARTNER_ID="..."
NEXT_PUBLIC_ISSUER_DID="did:polygonid:polygon:amoy:..."
NEXT_PUBLIC_CREDENTIAL_ID="..."
NEXT_PUBLIC_VERIFIER_PROGRAM_ID="..."
NEXT_PUBLIC_ISSUER_URL="https://developers.sandbox.air3.com"

# JWT Keys
PARTNER_PRIVATE_KEY="..."
PARTNER_PUBLIC_KEY="..."
SIGNING_ALGORITHM="RS256"

# Alchemy
NEXT_PUBLIC_ALCHEMY_ID="..."

# Site Config
NEXT_PUBLIC_SITE_NAME="DAT Network Verifier"
NEXT_PUBLIC_SITE_DESCRIPTION="..."
NEXT_PUBLIC_BUILD_ENV="sandbox"
NEXT_PUBLIC_THEME="system"
```

---

## 🛡️ Security Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY LAYERS                                   │
│                                                                            │
│  1. JWT Authentication                                                     │
│     • RS256 asymmetric signing                                             │
│     • 15-minute token expiration                                           │
│     • JWKS public key verification                                         │
│                                                                            │
│  2. Zero-Knowledge Proofs                                                  │
│     • Balance verified without revealing amount                            │
│     • User privacy preserved                                               │
│     • Credential integrity maintained                                      │
│                                                                            │
│  3. Admin Authentication                                                   │
│     • NextAuth.js with Credentials provider                                │
│     • bcrypt password hashing                                              │
│     • JWT session tokens                                                   │
│                                                                            │
│  4. Database Security                                                      │
│     • Prisma Accelerate (connection pooling)                               │
│     • Parameterized queries (SQL injection protection)                     │
│     • Encrypted connections                                                │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (home)/                   # Public routes
│   │   ├── page.tsx              # Partner page (/)
│   │   ├── [partner]/page.tsx    # Success page (/okx, etc.)
│   │   ├── issue/page.tsx        # Credential issuance
│   │   ├── verify/page.tsx       # Verifier wrapper
│   │   ├── fallback/page.tsx     # Failed verification
│   │   ├── submit-ad/page.tsx    # Ad submission
│   │   └── layout.tsx            # Home layout
│   ├── admin/
│   │   ├── page.tsx              # Admin login
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard
│   │       └── layout.tsx        # Dashboard layout
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       └── auth-token/route.ts
├── components/
│   ├── pages/
│   │   ├── admin/                # Admin components
│   │   ├── home/                 # Home components
│   │   ├── issue/                # Issue components
│   │   └── verify/
│   │       └── VerifierContent.tsx  # Main verify logic
│   ├── common/                   # Shared components
│   └── ui/                       # shadcn/ui
├── lib/
│   ├── actions/                  # Server actions
│   ├── env/                      # Environment validation
│   ├── schemas/                  # Zod schemas
│   ├── types/                    # TypeScript types
│   └── utils/
│       ├── jwt.ts                # JWT utilities
│       ├── web3.ts               # Web3 utilities
│       └── verification.ts       # Verification helpers
├── hooks/
│   └── useAirkit.tsx             # AIR Kit hook
├── contexts/
│   └── AirkitContext.tsx         # AIR Kit context
└── providers/
    └── AirkitProvider.tsx        # AIR Kit provider
```

---

**For implementation details, see README.md**
**For partner integration, see INTEGRATION_GUIDE.md**
