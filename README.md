# BCH Chat API

Vercel serverless function for bestcontenthosting.com live chat.

## Deploy
1. Connect this repo to Vercel
2. Set environment variable: `NEBULA_WEBHOOK_SECRET`
3. Deploy

## Usage
POST /api/chat
Body: { "message": "user question" }
Response: { "reply": "AI answer" }