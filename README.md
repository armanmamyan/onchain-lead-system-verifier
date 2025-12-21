# AIR Kit Verified Lead System - POC

A proof-of-concept demonstrating a blockchain-based verified lead generation system. This POC simulates the complete ecosystem: Partner (Oyunfor), Credential Issuer, DAT Network Verifier, and Advertiser destinations.

## 🎯 Overview

This POC demonstrates how DAT Network can verify user wallet credentials using Moca Network's AIR Kit before routing them to advertiser offers. The system ensures advertisers only pay for qualified leads with verifiable on-chain credentials.

## 🏗️ System Architecture

This POC simulates **4 distinct parties** in a single application:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           POC APPLICATION                                     │
│                     (Simulates all parties)                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    PARTNER SITE (Oyunfor)                            │    │
│  │                         Route: /                                     │    │
│  │                                                                      │    │
│  │  • Simulated gaming platform                                        │    │
│  │  • Displays ad for premium game                                     │    │
│  │  • Links users to credential issuance (/issue)                      │    │
│  └───────────────────────────────┬─────────────────────────────────────┘    │
│                                  │                                           │
│                                  │ User clicks "Play Now - Get Verified"     │
│                                  ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │               CREDENTIAL ISSUER (Oyunfor as AIR Kit Partner)         │    │
│  │                         Route: /issue                                │    │
│  │                                                                      │    │
│  │  Step 1: AIR Kit Login (Decentralized ID)                           │    │
│  │  Step 2: Connect Wallet (MetaMask/WalletConnect)                    │    │
│  │  Step 3: Issue Credential (Balance checked via Alchemy)             │    │
│  │                                                                      │    │
│  │  Result: User now has on-chain credential with wallet balance data  │    │
│  └───────────────────────────────┬─────────────────────────────────────┘    │
│                                  │                                           │
│                                  │ User clicks "Test Verification"           │
│                                  ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    DAT NETWORK VERIFIER                              │    │
│  │                         Route: /verify                               │    │
│  │                                                                      │    │
│  │  • Receives verification parameters via URL                         │    │
│  │  • Uses AIR Kit SDK to verify credential                            │    │
│  │  • Checks balance against rule (e.g., > $1000)                      │    │
│  │  • Routes user based on result                                      │    │
│  └───────────────────────────────┬─────────────────────────────────────┘    │
│                                  │                                           │
│              ┌───────────────────┴───────────────────┐                      │
│              │                                       │                      │
│              ▼                                       ▼                      │
│  ┌───────────────────────────┐       ┌───────────────────────────┐         │
│  │    ADVERTISER SUCCESS     │       │    FALLBACK PAGE          │         │
│  │    Route: /[partner]      │       │    Route: /fallback       │         │
│  │    (e.g., /okx)           │       │                           │         │
│  │                           │       │  • Explains requirements  │         │
│  │  • VIP benefits shown     │       │  • Links back to /issue   │         │
│  │  • Trading credit bonus   │       │  • Alternative options    │         │
│  │  • Premium features       │       │                           │         │
│  └───────────────────────────┘       └───────────────────────────┘         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete User Journey

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY FLOW                                   │
│                     Issue → Verify → Success/Fail                             │
└──────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────┐
                    │      PARTNER SITE (/)       │
                    │         Oyunfor             │
                    │                             │
                    │  User sees ad:              │
                    │  "Exclusive Web3 Game"      │
                    │  Requirement: $1,000+       │
                    │                             │
                    │  [Play Now - Get Verified]  │
                    └──────────┬──────────────────┘
                               │
                               │ Links to /issue
                               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    CREDENTIAL ISSUANCE (/issue)                               │
│                    Oyunfor issues credentials                                 │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Step 1: AIR Kit Login                                                  │ │
│  │ • User authenticates with decentralized identity                       │ │
│  │ • Privacy-preserving authentication                                    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│                                  ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Step 2: Connect Wallet                                                 │ │
│  │ • MetaMask, WalletConnect, Coinbase Wallet                             │ │
│  │ • User signs message to prove ownership                                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│                                  ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Step 3: Issue Credential                                               │ │
│  │ • Alchemy API fetches ETH + ERC20 balances                             │ │
│  │ • Calculate total USD value                                            │ │
│  │ • AIR Kit issues on-chain credential with:                             │ │
│  │   - walletAddress                                                      │ │
│  │   - balance-eth                                                        │ │
│  │   - balance-usd                                                        │ │
│  │   - verified-at                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                  │                                           │
│                                  ▼                                           │
│                    ┌─────────────────────────────┐                          │
│                    │     SUCCESS!                │                          │
│                    │                             │                          │
│                    │  Options:                   │                          │
│                    │  [Browse Offers] → /        │                          │
│                    │  [Test Verification] →      │                          │
│                    │    /verify?...              │                          │
│                    └──────────────┬──────────────┘                          │
└───────────────────────────────────┼──────────────────────────────────────────┘
                                    │
                                    │ User clicks "Test Verification"
                                    │ (or partner links directly here)
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    DAT NETWORK VERIFIER (/verify)                             │
│                    Verifies credential meets criteria                         │
│                                                                              │
│  URL Parameters:                                                             │
│  • partnerId=oyunfor                                                         │
│  • successUrl=/okx                                                           │
│  • failUrl=/fallback                                                         │
│  • rule=wallet_balance_gt_1000                                               │
│                                                                              │
│  Process:                                                                    │
│  1. Initialize AIR Kit SDK                                                   │
│  2. User clicks "Verify My Credentials"                                      │
│  3. AIR Kit login (if not already)                                           │
│  4. Fetch auth token from /api/auth-token                                    │
│  5. AIR Kit verifies credential using ZK proof                               │
│  6. Extract balance-usd from credential                                      │
│  7. Compare against rule threshold                                           │
└──────────────────────────────────┬───────────────────────────────────────────┘
                                   │
               ┌───────────────────┴───────────────────┐
               │                                       │
               ▼                                       ▼
┌─────────────────────────────┐       ┌─────────────────────────────┐
│    ✅ SUCCESS                │       │    ❌ FAILURE                │
│    balance > threshold      │       │    balance < threshold      │
│                             │       │    OR no credential         │
│    Countdown: 3 seconds     │       │    OR user cancelled        │
│                             │       │                             │
│    Redirect to:             │       │    Countdown: 5 seconds     │
│    successUrl (/okx)        │       │                             │
│                             │       │    Redirect to:             │
│                             │       │    failUrl (/fallback)      │
└──────────────┬──────────────┘       └──────────────┬──────────────┘
               │                                      │
               ▼                                      ▼
┌─────────────────────────────┐       ┌─────────────────────────────┐
│  ADVERTISER SUCCESS PAGE    │       │  FALLBACK PAGE              │
│  /okx (or /[partner])       │       │  /fallback                  │
│                             │       │                             │
│  "Welcome to OKX Premium!"  │       │  "Requirements Not Met"     │
│  • VIP benefits             │       │  • Required: $1,000+        │
│  • 50% lower fees           │       │  • How to qualify           │
│  • $20 trading credit       │       │  • [Get Verified] → /issue  │
│  • Early access             │       │  • [Browse Offers] → /      │
└─────────────────────────────┘       └─────────────────────────────┘
```

---

## 📍 Route Structure

| Route | Role | Description |
|-------|------|-------------|
| `/` | **Partner (Oyunfor)** | Simulated gaming platform with featured ad |
| `/issue` | **Credential Issuer** | 3-step flow to issue wallet balance credentials |
| `/verify` | **DAT Network Verifier** | Verifies credentials and routes users |
| `/[partner]` | **Advertiser Success** | Dynamic success pages (e.g., `/okx`) |
| `/fallback` | **Verification Failed** | Explains requirements, links to `/issue` |
| `/admin` | **Admin Login** | DAT Network admin authentication |
| `/admin/dashboard` | **Admin Dashboard** | Campaign management |
| `/submit-ad` | **Ad Submission** | Partners submit new campaigns |

---

## 🔗 Verification URL Parameters

The verifier at `/verify` accepts these parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `partnerId` | string | `"oyunfor"` | Partner identifier (for tracking) |
| `successUrl` | string | `"/okx"` | Where to redirect on success |
| `failUrl` | string | `"/fallback"` | Where to redirect on failure |
| `rule` | string | `"wallet_balance_gt_1000"` | Verification criteria |

### Example URLs

```bash
# Basic verification (internal routes)
/verify

# Full parameters (internal routes)
/verify?partnerId=oyunfor&successUrl=/okx&failUrl=/fallback&rule=wallet_balance_gt_1000

# Different threshold ($500)
/verify?rule=wallet_balance_gt_500&successUrl=/gamefi&failUrl=/fallback

# Custom partner
/verify?partnerId=premium&successUrl=/premium&failUrl=/upgrade&rule=wallet_balance_gt_5000

# Production example with external URLs
/verify?partnerId=oyunfor&successUrl=https://advertiser.com/premium&failUrl=https://partner.com/upgrade&rule=wallet_balance_gt_1000

# Mixed: external success, internal fail
/verify?partnerId=nftplatform&successUrl=https://nft-drop.com/mint&failUrl=/fallback&rule=wallet_balance_gt_5000
```

---

## 📋 Rule Format

Rules define the minimum wallet balance requirement:

```
wallet_balance_gt_{threshold}
```

| Rule | Threshold |
|------|-----------|
| `wallet_balance_gt_100` | > $100 |
| `wallet_balance_gt_500` | > $500 |
| `wallet_balance_gt_1000` | > $1,000 (default) |
| `wallet_balance_gt_5000` | > $5,000 |
| `wallet_balance_gt_10000` | > $10,000 |

### Verification Utilities

Located in `src/lib/utils/verification.ts`:

```typescript
// Parse rule string to extract threshold
import { parseRule } from "@/lib/utils/verification";
const threshold = parseRule("wallet_balance_gt_1000"); // Returns 1000

// Build custom verifier URLs
import { buildVerifierUrl } from "@/lib/utils/verification";
const url = buildVerifierUrl({
  partnerId: "myPartner",
  rule: "wallet_balance_gt_5000",
  successUrl: "https://advertiser.com/premium",
  failUrl: "/fallback"
});
// Returns: /verify?partnerId=myPartner&rule=wallet_balance_gt_5000&successUrl=https%3A%2F%2Fadvertiser.com%2Fpremium&failUrl=%2Ffallback
```

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Blockchain**: AIR Kit SDK (Moca Network)
- **Wallet Data**: Alchemy SDK (ETH Mainnet)
- **Wallet Connect**: Reown AppKit (WalletConnect)
- **Database**: PostgreSQL + Prisma ORM + Prisma Accelerate
- **Authentication**: JWT + JWKS (RS256) + NextAuth.js
- **Styling**: Tailwind CSS + shadcn/ui

---

## 🔧 Environment Variables

Create a `.env` file:

```bash
# ═══════════════════════════════════════════════════════════════════
# DATABASE (Prisma Accelerate)
# Source: https://console.prisma.io → Create Project → Enable Accelerate
# ═══════════════════════════════════════════════════════════════════
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# ═══════════════════════════════════════════════════════════════════
# ADMIN AUTHENTICATION (NextAuth.js)
# ═══════════════════════════════════════════════════════════════════
ADMIN_PASS="your-secure-admin-password"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# ═══════════════════════════════════════════════════════════════════
# AIR KIT (Moca Network)
# Source: https://developers.sandbox.air3.com → Partner Dashboard
# ═══════════════════════════════════════════════════════════════════
NEXT_PUBLIC_PARTNER_ID="your-partner-id"
NEXT_PUBLIC_ISSUER_DID="did:polygonid:polygon:amoy:YOUR_DID"
NEXT_PUBLIC_CREDENTIAL_ID="your-credential-id"
NEXT_PUBLIC_PROGRAM_ID="your-program-id"
NEXT_PUBLIC_VERIFIER_PROGRAM_ID="your-verifier-program-id"
NEXT_PUBLIC_ISSUER_URL="https://developers.sandbox.air3.com"

# ═══════════════════════════════════════════════════════════════════
# JWT KEYS (RS256 - RSA Algorithm)
# Generate RSA key pair:
#   1. Generate private key:
#      openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
#   2. Extract public key:
#      openssl rsa -pubout -in private.key -out public.key
#   3. Convert to single-line format (remove headers/newlines):
#      cat private.key | tr -d '\n' | sed 's/-----BEGIN PRIVATE KEY-----//g' | sed 's/-----END PRIVATE KEY-----//g'
#      cat public.key | tr -d '\n' | sed 's/-----BEGIN PUBLIC KEY-----//g' | sed 's/-----END PUBLIC KEY-----//g'
# ═══════════════════════════════════════════════════════════════════
PARTNER_PRIVATE_KEY="MIIEvgIBADANBgkqhkiG9w0BAQEFA..."
PARTNER_PUBLIC_KEY="MIIBIjANBgkqhkiG9w0BAQEFAAOCA..."
SIGNING_ALGORITHM="RS256"

# ═══════════════════════════════════════════════════════════════════
# ALCHEMY (Blockchain Data)
# Source: https://alchemy.com → Create App → API Key
# ═══════════════════════════════════════════════════════════════════
NEXT_PUBLIC_ALCHEMY_ID="your-alchemy-api-key"

# ═══════════════════════════════════════════════════════════════════
# SITE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════
NEXT_PUBLIC_SITE_NAME="DAT Network Verifier"
NEXT_PUBLIC_SITE_DESCRIPTION="Verified Lead System powered by AIR Kit"
NEXT_PUBLIC_RETURN_SITE_NAME="Partner Site"
NEXT_PUBLIC_RETURN_URL="/"
NEXT_PUBLIC_BUILD_ENV="sandbox"
NEXT_PUBLIC_THEME="system"
```

---

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
git clone <your-repo-url>
cd onchain-lead-system-verifier
yarn install
```

### 2. Configure Environment

Copy the environment variables above and fill in your values.

### 3. Setup Database

```bash
npx prisma generate
npx prisma migrate deploy
yarn seed
```

### 4. Run Development Server

```bash
yarn dev
```

### 5. Test the Flow

1. **Go to Partner Page**: http://localhost:3000
2. **Click "Play Now - Get Verified"** → Redirects to `/issue`
3. **Complete credential issuance** (AIR Kit login → Connect wallet → Issue)
4. **Click "Test Verification"** → Goes to `/verify?partnerId=oyunfor&rule=wallet_balance_gt_1000&successUrl=/okx&failUrl=/fallback`
5. **Verify credentials** → Redirects to `/okx` (success) or `/fallback` (fail)

---

## 👨‍💼 Admin Dashboard

### Access

1. Navigate to `/admin`
2. Login with:
   - **Username**: `admin`
   - **Password**: Value of `ADMIN_PASS`

### Features

- **Campaign Statistics**: Total, Pending, Approved, Active, Rejected, Expired
- **Campaign Management**: Approve, Reject, Activate campaigns
- **CSV Export**: Download campaign data

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (home)/                   # Public pages
│   │   ├── page.tsx              # / - Partner page (Oyunfor)
│   │   ├── [partner]/page.tsx    # /[partner] - Advertiser success
│   │   ├── issue/page.tsx        # /issue - Credential issuance
│   │   ├── verify/page.tsx       # /verify - DAT Network verifier
│   │   ├── fallback/page.tsx     # /fallback - Failed verification
│   │   └── submit-ad/page.tsx    # /submit-ad - Ad submission form
│   ├── admin/                    # Admin pages
│   │   ├── page.tsx              # /admin - Login
│   │   └── dashboard/page.tsx    # /admin/dashboard
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth endpoints
│       └── auth-token/           # JWT generation
├── components/
│   ├── pages/                    # Page-specific components
│   │   ├── admin/                # Admin components
│   │   ├── issue/                # Issue page components
│   │   └── verify/               # Verify page components
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── actions/                  # Server actions
│   ├── env/                      # Environment validation
│   └── utils/                    # Utilities (jwt, web3, etc.)
├── hooks/                        # React hooks (useAirkit)
├── contexts/                     # React contexts
└── providers/                    # Provider components
```

---

## 🔄 How It Maps to Real World

| POC Component | Real World Equivalent |
|---------------|----------------------|
| `/` (Oyunfor) | Partner's website with ads |
| `/issue` | Partner's credential issuance system |
| `/verify` | **DAT Network's verification service** |
| `/[partner]` | Advertiser's landing page |
| `/fallback` | Generic fallback or partner's signup page |

In production:
- Partners would link directly to DAT Network's verifier
- Verifier would be hosted at `verifier.datnetwork.com`
- Success/fail URLs would point to external sites

---

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Technical architecture details
- [Integration Guide](./docs/INTEGRATION_GUIDE.md) - Partner integration guide
- [API Reference](./docs/API_REFERENCE.md) - API endpoint documentation
- [Database Setup](./docs/DATABASE_CREATION.md) - Database configuration

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| AIR Kit not initializing | Check `NEXT_PUBLIC_PARTNER_ID` is set |
| Credential issuance fails | Verify AIR Kit credentials in dashboard |
| Balance shows $0 | Ensure wallet has ETH or ERC20 tokens |
| Admin login fails | Run `yarn seed` to create admin user |
| Database timeout | Verify `DATABASE_URL` uses Prisma Accelerate format |

---

## 📄 License

MIT License

---

**Built with ❤️ using AIR Kit by Moca Network**
