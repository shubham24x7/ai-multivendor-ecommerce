# Deployment Guide

## Required Backend Environment Variables

```text
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
MONGODB_URI=mongodb+srv://...
JWT_ACCESS_SECRET=long-random-secret
JWT_REFRESH_SECRET=long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
AI_DEFAULT_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_BASE_URL=https://api-m.paypal.com
SWAGGER_SERVER_URL=https://your-backend-domain.com/api/v1
```

## Required Frontend Environment Variables

```text
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
NEXT_PUBLIC_APP_NAME=Global Bazaar AI
```

## MongoDB Atlas

1. Create an Atlas cluster.
2. Create a database user with least-privilege access.
3. Add your Railway backend outbound IP or allow required network access.
4. Use the Atlas connection string as `MONGODB_URI`.
5. Enable backups before production launch.

## Railway Backend

1. Create a new Railway project.
2. Deploy from the repository root and select the `backend` folder as the service root.
3. Add backend environment variables.
4. Set start command to `npm start`.
5. Configure custom domain.
6. Register webhook URLs:

```text
https://your-backend-domain.com/api/v1/payments/webhooks/stripe
https://your-backend-domain.com/api/v1/payments/webhooks/razorpay
https://your-backend-domain.com/api/v1/payments/webhooks/paypal
```

## Vercel Frontend

1. Import the repository in Vercel.
2. Set project root to `frontend`.
3. Add `NEXT_PUBLIC_API_URL`.
4. Deploy.
5. Set `CLIENT_URL` on Railway to the Vercel domain.

## Docker Local Run

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```
