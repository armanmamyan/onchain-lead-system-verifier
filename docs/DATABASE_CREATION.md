# Database Setup Guide

**AIR Kit Verified Lead System - Database Configuration**

This guide explains how to set up and configure the database for the Verified Lead System using Prisma Accelerate.

---

## 🗄️ Database Overview

The system uses:
- **PostgreSQL** as the database
- **Prisma ORM** for database access
- **Prisma Accelerate** for connection pooling and edge compatibility

---

## 🚀 Quick Setup

### 1. Create Prisma Accelerate Project

1. Go to [https://console.prisma.io](https://console.prisma.io)
2. Sign up or log in
3. Click **"New Project"**
4. Enter project name (e.g., "Verified Lead System")
5. Click **"Create Project"**

### 2. Enable Accelerate

1. In your project, go to **"Accelerate"**
2. Click **"Enable Accelerate"**
3. Choose your database provider:
   - **Prisma Postgres** (managed) - Recommended
   - **External database** (bring your own)

### 3. Get Connection String

After enabling Accelerate, copy the connection string:

```
prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Configure Environment

Add to your `.env` file:

```bash
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
```

---

## 📊 Database Schema

### Prisma Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

// Admin user for dashboard access
model Admin {
  id            String         @id @default(cuid())
  username      String         @unique
  password      String         // bcrypt hashed
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  adSubmissions AdSubmission[]
}

// Ad campaign submissions from partners
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

  @@index([status])
  @@index([createdAt])
}

enum AdStatus {
  PENDING
  APPROVED
  ACTIVE
  REJECTED
  EXPIRED
}
```

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────┐
│                         Admin                            │
├─────────────────────────────────────────────────────────┤
│ id              String    @id @default(cuid())          │
│ username        String    @unique                       │
│ password        String                                  │
│ createdAt       DateTime  @default(now())               │
│ updatedAt       DateTime  @updatedAt                    │
└──────────────────────────┬──────────────────────────────┘
                           │
                           │ 1:N (One Admin → Many Submissions)
                           │
┌──────────────────────────▼──────────────────────────────┐
│                      AdSubmission                        │
├─────────────────────────────────────────────────────────┤
│ id                String    @id @default(cuid())        │
│ adName            String                                │
│ adDescription     String    @db.Text                    │
│ maximumIssuance   Int                                   │
│ accessibleFrom    DateTime                              │
│ accessibleUntil   DateTime                              │
│ contactEmail      String                                │
│ contactPersonName String                                │
│ status            AdStatus  @default(PENDING)           │
│ createdAt         DateTime  @default(now())             │
│ updatedAt         DateTime  @updatedAt                  │
│ createdById       String?                               │
│ createdBy         Admin?    @relation                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Prisma Commands

### Generate Client

```bash
npx prisma generate
```

Generates the Prisma Client with Accelerate extension support.

### Run Migrations (Development)

```bash
npx prisma migrate dev --name <migration_name>
```

Creates and applies a new migration in development.

### Deploy Migrations (Production)

```bash
npx prisma migrate deploy
```

Applies pending migrations to production database.

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

⚠️ **Warning**: Drops all data and re-applies migrations.

### Seed Database

```bash
yarn seed
# or
npm run seed
```

Creates the admin user with credentials from `ADMIN_PASS`.

### Open Prisma Studio

```bash
npx prisma studio
```

Opens visual database browser at `http://localhost:5555`.

---

## 🌱 Database Seeding

### Seed Script (`prisma/seed.ts`)

```typescript
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma';

async function main() {
  const adminUsername = 'admin';
  const adminPassword = process.env.ADMIN_PASS;

  if (!adminPassword) {
    throw new Error('Missing ADMIN_PASS environment variable');
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      password: hashedPassword,
    },
  });

  console.log('✅ Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Running the Seed

```bash
# Using yarn
yarn seed

# Using npm
npm run seed

# Using Prisma directly
npx prisma db seed
```

### Required Environment Variable

```bash
ADMIN_PASS="your-secure-admin-password"
```

---

## ⚙️ Prisma Client Configuration

### Prisma Client with Accelerate (`src/lib/prisma.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma ||
  new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

### Key Points

1. **`withAccelerate()`**: Enables Prisma Accelerate features
2. **Global singleton**: Prevents multiple client instances in development
3. **Production mode**: Creates single instance per serverless function

---

## 🔄 Migration History

### Initial Migration

```sql
-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('PENDING', 'APPROVED', 'ACTIVE', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdSubmission" (
    "id" TEXT NOT NULL,
    "adName" TEXT NOT NULL,
    "adDescription" TEXT NOT NULL,
    "maximumIssuance" INTEGER NOT NULL,
    "accessibleFrom" TIMESTAMP(3) NOT NULL,
    "accessibleUntil" TIMESTAMP(3) NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPersonName" TEXT NOT NULL,
    "status" "AdStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "AdSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE INDEX "AdSubmission_status_idx" ON "AdSubmission"("status");

-- CreateIndex
CREATE INDEX "AdSubmission_createdAt_idx" ON "AdSubmission"("createdAt");

-- AddForeignKey
ALTER TABLE "AdSubmission" ADD CONSTRAINT "AdSubmission_createdById_fkey" 
    FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

---

## 📊 Common Queries

### Find Admin by Username

```typescript
const admin = await prisma.admin.findUnique({
  where: { username: 'admin' }
});
```

### Get All Submissions with Status

```typescript
const submissions = await prisma.adSubmission.findMany({
  where: { status: 'PENDING' },
  orderBy: { createdAt: 'desc' },
  include: { createdBy: true }
});
```

### Update Submission Status

```typescript
const updated = await prisma.adSubmission.update({
  where: { id: 'submission-id' },
  data: { status: 'APPROVED' }
});
```

### Get Statistics

```typescript
const stats = await prisma.adSubmission.groupBy({
  by: ['status'],
  _count: { status: true }
});
```

### Count by Status

```typescript
const [total, pending, approved, active, rejected, expired] = await Promise.all([
  prisma.adSubmission.count(),
  prisma.adSubmission.count({ where: { status: 'PENDING' } }),
  prisma.adSubmission.count({ where: { status: 'APPROVED' } }),
  prisma.adSubmission.count({ where: { status: 'ACTIVE' } }),
  prisma.adSubmission.count({ where: { status: 'REJECTED' } }),
  prisma.adSubmission.count({ where: { status: 'EXPIRED' } }),
]);
```

---

## 🐛 Troubleshooting

### Error: "DATABASE_URL is not set"

**Solution:** Ensure `.env` file exists with valid `DATABASE_URL`

```bash
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_KEY"
```

### Error: "Connection timeout"

**Solution:** 
1. Check Prisma Accelerate status at [status.prisma.io](https://status.prisma.io)
2. Verify API key is correct
3. Ensure database is accessible

### Error: "Invalid `prisma.admin.findUnique()` invocation"

**Solution:** Run `npx prisma generate` after schema changes

### Error: "The table does not exist"

**Solution:** Run migrations:
```bash
npx prisma migrate deploy
```

### Error: "Admin user not found" (login fails)

**Solution:** Run seed script:
```bash
yarn seed
```

---

## 🔒 Security Considerations

### Password Hashing

- Passwords are hashed using **bcrypt** with salt rounds of 10
- Never store plain text passwords
- Use strong passwords (min 12 characters recommended)

### Connection Security

- Prisma Accelerate uses encrypted connections (TLS)
- API keys should be treated as secrets
- Use environment variables, never commit credentials

### Access Control

- Admin access requires authentication
- Session tokens expire automatically
- Use HTTPS in production

---

## 🔗 Related Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate)
- [Prisma Console](https://console.prisma.io)

---

**For setup instructions, see:**
- [README.md](../README.md) - Main setup guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture

