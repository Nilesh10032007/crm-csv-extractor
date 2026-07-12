# GrowEasy CRM - AI-Powered CSV Importer

**Live Demo:** [https://crm-csv-extractor.vercel.app](https://crm-csv-extractor.vercel.app)
This project allows users to upload raw CSV exports from various sources (Google Ads, Facebook Leads, Real Estate platforms), and uses AI (**Google Gemini 3.5 Flash**) to intelligently map the arbitrary column structures into a fixed CRM schema. The extracted leads and import histories are then securely stored in **MongoDB**.

## Architecture

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, TanStack Table, react-dropzone. Features dedicated pages for Import History and Lead Management.
- **Backend:** Node.js, Express, TypeScript, Multer, PapaParse, Google Generative AI SDK, and Mongoose.
- **Database:** MongoDB (via Mongoose) to persistently store job statuses, progress, and all extracted CRM records.
- **State & Streaming:** Real-time job queue tracking batch progress via SSE (Server-Sent Events) to the client, providing live progress bars.

## Requirements

- Node.js v18+
- A free Google Gemini API Key (get one at [aistudio.google.com](https://aistudio.google.com/))
- A MongoDB Cluster URI (e.g., MongoDB Atlas)

## Getting Started

### 1. Project Environment Setup

Create a `.env` file in the root directory (or update the existing one) with the following variables:

```env
# --- GEMINI API SETTINGS ---
GEMINI_API_KEY=your_gemini_key_here

# --- BACKEND SETTINGS ---
PORT=3001
MONGODB_URI=db_url

FRONTEND_URL=http://localhost:3000

# --- FRONTEND SETTINGS ---
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### 2. Backend Setup

```bash
cd backend
npm install --legacy-peer-deps

# Run the dev server
npm run dev
```
The backend will run on `http://localhost:3001`.

### 3. Frontend Setup

```bash
cd frontend
npm install

# Run the dev server
npm run dev
```
The frontend will run on `http://localhost:3000`.

## Key Features

1. **AI Column Mapping:** Automatically understands arbitrary CSV headers and rows.
2. **High-Performance Concurrency:** The backend slices large CSVs into optimized micro-batches (25 rows each) and runs 10 concurrent requests to Gemini 3.5 Flash, providing near-instant AI extraction results.
3. **Import History:** View a log of all previous CSV uploads, their status, and processed rows.
4. **Lead Management:** Search, view, and manage all extracted leads directly from the MongoDB database in a polished UI.

## Why Google Gemini 3.5 Flash?

We chose **Gemini 3.5 Flash** for its blisteringly fast inference speeds, excellent reasoning capabilities to infer column meaning from both headers and cell content, and its massive free tier. Coupled with our high-concurrency micro-batch architecture, the system parses hundreds of rows simultaneously with incredible efficiency.

## Deployment

- **Backend:** Can be deployed to Render, Railway, or Fly.io. Ensure `GEMINI_API_KEY`, `MONGODB_URI`, `PORT`, and `FRONTEND_URL` environment variables are properly set without trailing slashes.
- **Frontend:** Deploy seamlessly on Vercel. Ensure `NEXT_PUBLIC_BACKEND_URL` is set to the production backend URL (e.g., `https://your-backend.onrender.com`).
