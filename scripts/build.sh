if [ "$VERCEL_ENV" = "production" ]; then
  npx prisma migrate deploy
fi

pnpm build
