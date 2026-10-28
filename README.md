# CampusBid

CampusBid is a campus-only marketplace where senior students can auction used items to juniors through transparent, time-limited bidding.

## Project structure

- `frontend/` - React + Vite client application.
- `backend/` - Express API and Socket.IO server.

## Prerequisites

- Node.js 20+
- MongoDB 7+ locally, or a MongoDB Atlas connection string

## Backend setup

```powershell
cd D:\CampusBid\backend
npm install
Copy-Item .env.example .env
npm run dev
```

The API runs on `http://localhost:5001`. `GET /api/health` is the connection check.

## Frontend setup

```powershell
cd D:\CampusBid\frontend
npm install
Copy-Item .env.example .env
npm run dev
```

The frontend runs on the Vite URL shown in the terminal, normally `http://localhost:5173`.

Run both terminals at the same time. The frontend calls the backend through `VITE_API_URL`.

## Environment variables

### Backend

See `backend/.env.example`: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, and optional Cloudinary credentials.

### Frontend

See `frontend/.env.example`: `VITE_API_URL` and `VITE_SOCKET_URL`.

Never commit a real `.env` file or API credentials.

## API currently available

- `GET /api/health` - service and database status.
- `POST /api/auth/register` and `POST /api/auth/login` - student authentication.
- `GET /api/listings` - browse active listings.
- `GET /api/listings/:id` - view a listing and its public bid history.
- `POST /api/listings` - create a listing (JWT required).
- `POST /api/listings/:id/bids` - place an atomic bid (JWT required).

Bids are accepted only while an auction is active and before its server-checked deadline. The first bid must meet the starting price; later bids must meet the current price plus the minimum increment.

Listing photos can be selected as up to five local image files, with a 5 MB limit per image.

New bids start as `PENDING`. The listing seller can approve or reject each bid while the auction is open. When the closing time passes, the server finalizes the auction: the highest approved bid wins and the winner is displayed on the listing, or the listing is marked unsold when no bid was approved.

The API is organized by routes, controllers, models, middleware, services, and jobs so auction closing, handover, notifications, saved searches, and questions can be added without mixing concerns.

## Testing

```powershell
cd D:\CampusBid\backend
npm test
```

## Deployment outline

Build the frontend with `npm run build` in `frontend/`, deploy its `dist/` folder to a static host, and deploy the backend to a Node-compatible host. Set the production frontend URL in `FRONTEND_URL` and the production API URL in `VITE_API_URL`.
