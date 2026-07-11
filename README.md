# GrowEasy CRM - AI-Powered CSV Importer

This project allows users to upload raw CSV exports from various sources (Google Ads, Facebook Leads, Real Estate platforms), and uses AI (Google Gemini 1.5 Flash) to intelligently map the arbitrary column structures into the fixed GrowEasy CRM schema.

## Architecture

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, TanStack Table, react-dropzone.
- **Backend:** Node.js, Express, TypeScript, Multer, PapaParse, Google Generative AI SDK.
- **State:** In-memory job queue tracking batch progress via SSE (Server-Sent Events) to the client.

## Requirements

- Node.js v18+
- A free Google Gemini API Key (get one at [aistudio.google.com](https://aistudio.google.com/))

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install

# Edit .env and set GEMINI_API_KEY=your_key_here

# Run the dev server
npm run dev
```
The backend will run on `http://localhost:3001`.

### 2. Frontend Setup

```bash
cd frontend
npm install

# The frontend comes with .env.local pointing to localhost:3001

# Run the dev server
npm run dev
```
The frontend will run on `http://localhost:3000`.

## Why Google Gemini 1.5 Flash?

We chose **Gemini 1.5 Flash** for its incredibly fast inference speeds, excellent reasoning capabilities to infer column meaning from both headers and cell content, and its massive free tier (15 RPM, 1 million TPM, 1,500 RPD), ensuring it can handle large CSV batches smoothly in a production environment without strict rate limits.

## Deployment

- **Backend:** Can be deployed using the included Dockerfile to Render, Railway, or Fly.io. Ensure `GEMINI_API_KEY`, `PORT`, and `FRONTEND_URL` environment variables are set.
- **Frontend:** Deploy seamlessly on Vercel. Ensure `NEXT_PUBLIC_BACKEND_URL` is set to the production backend URL.
