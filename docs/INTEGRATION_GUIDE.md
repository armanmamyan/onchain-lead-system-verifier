# Partner Integration Guide

**AIR Kit Verified Lead System - Integration Documentation**

This guide explains how the verified lead system works and how partners (like Oyunfor) would integrate with DAT Network's verification service.

---

## 🎯 Understanding the POC vs Production

### This POC Simulates

This proof-of-concept application simulates **all parties** in a single app:

| POC Route | Simulates | In Production |
|-----------|-----------|---------------|
| `/` | Partner site (Oyunfor) | `oyunfor.com` |
| `/issue` | Partner's credential issuer | Partner's own AIR Kit integration |
| `/verify` | **DAT Network Verifier** | `verifier.datnetwork.com` |
| `/[partner]` | Advertiser site | `advertiser.com` |
| `/fallback` | Fallback page | Partner's fallback or DAT's generic |

### Production Architecture

```
┌─────────────────────┐     ┌──────────────────────────┐     ┌─────────────────────┐
│   PARTNER SITE      │     │   DAT NETWORK VERIFIER   │     │   ADVERTISER SITE   │
│   (oyunfor.com)     │────▶│   (verifier.datnetwork)  │────▶│   (advertiser.com)  │
│                     │     │                          │     │                     │
│  • Displays ads     │     │  • Verifies credentials  │     │  • Premium content  │
│  • Issues creds     │     │  • Routes users          │     │  • Conversion       │
│  • Links to verify  │     │  • Tracks leads          │     │                     │
└─────────────────────┘     └──────────────────────────┘     └─────────────────────┘
```

---

## 🔄 User Journey (What This POC Demonstrates)

### Complete Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     DEMONSTRATED USER JOURNEY                                 │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────┐
    │                    1. PARTNER SITE (/)                               │
    │                       Oyunfor Gaming Platform                        │
    │                                                                     │
    │   User sees:                                                        │
    │   ┌──────────────────────────────────────────────────────────────┐ │
    │   │  🎮 EXCLUSIVE WEB3 ADVENTURE GAME                            │ │
    │   │                                                              │ │
    │   │  Requirement: Wallet balance > $1,000                        │ │
    │   │                                                              │ │
    │   │  [Play Now - Get Verified] ────────────────────────────────┐ │ │
    │   └──────────────────────────────────────────────────────────────┘ │ │
    │                                                                     │ │
    └─────────────────────────────────────────────────────────────────────┘ │
                                                                             │
                     Currently links to /issue                               │
                     (because users need credentials first)                  │
                                                                             │
                                      ▼                                      │
    ┌─────────────────────────────────────────────────────────────────────┐ │
    │                    2. CREDENTIAL ISSUANCE (/issue)                   │ │
    │                       Oyunfor Issues Credentials                     │ │
    │                                                                     │ │
    │   Step 1: AIR Kit Login                                             │ │
    │   • Decentralized identity created                                  │ │
    │   • Privacy-preserving authentication                               │ │
    │                                                                     │ │
    │   Step 2: Connect Wallet                                            │ │
    │   • MetaMask, WalletConnect, Coinbase Wallet                        │ │
    │   • Sign message to prove ownership                                 │ │
    │                                                                     │ │
    │   Step 3: Issue Credential                                          │ │
    │   • Alchemy fetches ETH + ERC20 balances                            │ │
    │   • Calculates total USD value                                      │ │
    │   • AIR Kit issues on-chain credential                              │ │
    │                                                                     │ │
    │   Credential contains:                                              │ │
    │   {                                                                 │ │
    │     "id": "partner-id-0x742d...",                                   │ │
    │     "walletAddress": "0x742d35Cc...",                               │ │
    │     "balance-eth": 2.5,                                             │ │
    │     "balance-usd": 7500,                                            │ │
    │     "verified-at": "2024-01-15T10:30:00Z"                           │ │
    │   }                                                                 │ │
    │                                                                     │ │
    │   On success:                                                       │ │
    │   [Test Verification] → /verify?partnerId=oyunfor&...               │ │
    └─────────────────────────────────────────────────────────────────────┘ │
                                                                             │
                                      ▼                                      │
    ┌─────────────────────────────────────────────────────────────────────┐ │
    │                    3. DAT NETWORK VERIFIER (/verify)                 │ │
    │                       Verifies Credential Meets Criteria             │ │
    │                                                                     │ │
    │   URL: /verify?partnerId=oyunfor&successUrl=/okx                    │ │
    │              &failUrl=/fallback&rule=wallet_balance_gt_1000         │ │
    │                                                                     │ │
    │   Process:                                                          │ │
    │   1. User clicks "Verify My Credentials"                            │ │
    │   2. AIR Kit SDK verifies credential exists                         │ │
    │   3. Zero-knowledge proof generated (privacy preserved)             │ │
    │   4. Balance extracted and compared against rule                    │ │
    │   5. Route user based on result                                     │ │
    └─────────────────────────────────────────────────────────────────────┘ │
                                                                             │
                    ┌────────────────┴────────────────┐                     │
                    │                                  │                     │
                    ▼                                  ▼                     │
    ┌───────────────────────────┐     ┌───────────────────────────┐        │
    │  4a. SUCCESS (/okx)       │     │  4b. FAILURE (/fallback)  │        │
    │                           │     │                           │        │
    │  "Welcome to OKX Premium!"│     │  "Requirements Not Met"   │        │
    │                           │     │                           │        │
    │  • VIP benefits           │     │  Required: $1,000+        │        │
    │  • 50% lower fees         │     │                           │        │
    │  • $20 trading credit     │     │  [Get Credentials]        │        │
    │  • Early access           │     │    → /issue               │        │
    └───────────────────────────┘     └───────────────────────────┘        │
```

---

## 🔗 How Partners Would Integrate (Production)

### Step 1: Become an AIR Kit Partner

1. Register at [https://developers.sandbox.air3.com](https://developers.sandbox.air3.com)
2. Get Partner credentials:
   - `PARTNER_ID`
   - `ISSUER_DID`
   - `CREDENTIAL_ID`
3. Set up credential schema (wallet balance fields)
4. Implement credential issuance on your platform

### Step 2: Construct Verification Links

In production, partners link to DAT Network's verifier:

```
https://verifier.datnetwork.com/verify?partnerId={YOUR_PARTNER_ID}&successUrl={SUCCESS_URL}&failUrl={FAIL_URL}&rule={RULE}
```

**POC Equivalent (this app):**
```
/verify?partnerId={YOUR_PARTNER_ID}&successUrl={SUCCESS_URL}&failUrl={FAIL_URL}&rule={RULE}
```

### URL Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `partnerId` | No | `"oyunfor"` | Your partner identifier |
| `successUrl` | No | `"/okx"` | Where to redirect verified users |
| `failUrl` | No | `"/fallback"` | Where to redirect failed verifications |
| `rule` | No | `"wallet_balance_gt_1000"` | Verification criteria |

### Rule Format

```
wallet_balance_gt_{threshold_in_usd}
```

Examples:
- `wallet_balance_gt_100` → Balance > $100
- `wallet_balance_gt_1000` → Balance > $1,000
- `wallet_balance_gt_5000` → Balance > $5,000

---

## 📋 Integration Checklist for Partners

### Prerequisites

- [ ] AIR Kit Partner account
- [ ] Credential issuance implemented on your platform
- [ ] Users have credentials before verification

### Integration Steps

1. **Issue Credentials (Your Platform)**
   ```
   User visits your site → Connects wallet → You issue credential
   ```

2. **Link to DAT Network Verifier**
   ```html
   <!-- In your ad or button -->
   <a href="https://verifier.datnetwork.com/verify?partnerId=yourPartner&successUrl=https://advertiser.com/offer&failUrl=https://yoursite.com/fallback&rule=wallet_balance_gt_1000">
     Access Premium Offer
   </a>
   ```

3. **Handle Success/Fail Redirects**
   - **Success URL**: Where verified users should land (advertiser site)
   - **Fail URL**: Your fallback page or a generic "requirements not met" page

---

## 🔄 Example Integration Scenarios

### Scenario 1: Gaming Platform (This POC)

**Partner**: Oyunfor (gaming platform)
**Advertiser**: OKX (crypto exchange)
**Requirement**: Wallet balance > $1,000

```
User Flow:
1. User on oyunfor.com sees "Exclusive Game" ad
2. Clicks ad → Goes to /issue (get credentials)
3. Credentials issued → User returns
4. User ready to access → Clicks "Play Now"
5. Goes to /verify?partnerId=oyunfor&successUrl=/okx&failUrl=/fallback&rule=wallet_balance_gt_1000
6. If balance > $1000 → Redirect to /okx (OKX success page)
7. If balance < $1000 → Redirect to /fallback
```

### Scenario 2: NFT Marketplace (Production Example)

**Partner**: NFT Platform
**Advertiser**: Premium NFT Drop
**Requirement**: Wallet balance > $5,000

```
Verification Link:
https://verifier.datnetwork.com/verify?partnerId=nftplatform&successUrl=https://premiumdrop.com/mint&failUrl=https://nftplatform.com/upgrade&rule=wallet_balance_gt_5000
```

### Scenario 3: DeFi Protocol (Production Example)

**Partner**: DeFi Dashboard
**Advertiser**: Yield Farming Pool
**Requirement**: Wallet balance > $10,000

```
Verification Link:
https://verifier.datnetwork.com/verify?partnerId=defidash&successUrl=https://yieldpool.com/stake&failUrl=https://defidash.com/learn&rule=wallet_balance_gt_10000
```

---

## 🏗️ Technical Implementation

### Credential Issuance (Partner's Responsibility)

Partners implement AIR Kit credential issuance:

```typescript
// On partner's platform (e.g., /issue page in this POC)
const handleIssueCredential = async () => {
  // 1. Get auth token from your backend
  const { authToken } = await fetch('/api/auth-token').then(r => r.json());
  
  // 2. Build credential subject
  const credentialSubject = {
    id: `${PARTNER_ID}-${walletAddress}`,
    walletAddress: walletAddress,
    "balance-eth": ethBalance,
    "balance-usd": usdBalance,
    "verified-at": new Date().toISOString(),
  };
  
  // 3. Issue via AIR Kit SDK
  await airService.issueCredential({
    authToken,
    issuerDid: ISSUER_DID,
    credentialId: CREDENTIAL_ID,
    credentialSubject,
  });
};
```

### Credential Verification (DAT Network's Service)

DAT Network's verifier checks credentials:

```typescript
// On DAT Network verifier (/verify page in this POC)
const verifyCredential = async () => {
  // 1. Get auth token
  const { authToken } = await fetch('/api/auth-token').then(r => r.json());
  
  // 2. Verify via AIR Kit SDK
  const result = await airService.verifyCredential({
    authToken,
    programId: VERIFIER_PROGRAM_ID,
    redirectUrl: ISSUER_URL,
  });
  
  // 3. Check against rule
  if (result?.credentialSubject?.balanceUsd > requiredBalance) {
    // SUCCESS - redirect to successUrl
  } else {
    // FAIL - redirect to failUrl
  }
};
```

---

## 🔐 Security Considerations

### Zero-Knowledge Proofs

- Verification uses ZK proofs
- DAT Network never sees actual balance
- Only verifies "balance > threshold" is true/false
- User privacy is preserved

### JWT Authentication

- Partners sign JWTs with private key
- DAT Network verifies via JWKS endpoint
- Tokens expire after 15 minutes
- RS256 asymmetric signing

---

## 📊 Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                       │
│                                                                             │
│  ISSUANCE (Partner)                                                         │
│  ─────────────────                                                          │
│  Input:                                                                     │
│  • Wallet address from user                                                 │
│  • Balance from Alchemy API                                                 │
│                                                                             │
│  Output:                                                                    │
│  • On-chain credential with balance data                                    │
│                                                                             │
│  VERIFICATION (DAT Network)                                                 │
│  ──────────────────────────                                                 │
│  Input:                                                                     │
│  • partnerId, successUrl, failUrl, rule (from URL)                          │
│  • User's credential (from AIR Kit)                                         │
│                                                                             │
│  Process:                                                                   │
│  • Extract balance-usd from credential                                      │
│  • Compare against rule threshold                                           │
│                                                                             │
│  Output:                                                                    │
│  • Redirect to successUrl OR failUrl                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🆘 FAQ

**Q: Do users need credentials before verification?**
A: Yes! Partners must issue credentials first. Users without credentials will fail verification and be directed to the fallback page.

**Q: Can I use external URLs for successUrl/failUrl?**
A: In production, yes. In this POC, use internal routes like `/okx` or `/fallback`.

**Q: How do I set custom balance requirements?**
A: Use the `rule` parameter: `rule=wallet_balance_gt_5000` for $5,000 minimum.

**Q: What if the user declines verification?**
A: They're redirected to failUrl after a 5-second countdown.

**Q: How is user privacy protected?**
A: Zero-knowledge proofs verify the balance requirement without revealing the actual balance.

---

## 📞 Support

- **AIR Kit Docs**: [https://docs.moca.network](https://docs.moca.network)
- **AIR Kit Sandbox**: [https://developers.sandbox.air3.com](https://developers.sandbox.air3.com)

---

**Built with ❤️ for Web3 advertisers by DAT Network**
