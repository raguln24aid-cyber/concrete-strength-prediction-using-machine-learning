# ConcreteMix AI

Production-ready AI web application for inverse concrete mix prediction. A user enters target compressive strength, and the model predicts cement, blast furnace slag, fly ash, water, superplasticizer, coarse aggregate, fine aggregate, and age.

## Architecture

```text
React + Vite + TypeScript + Tailwind
        |
        | JWT
        v
FastAPI service layer API
        |
        | Motor async driver
        v
MongoDB users + prediction_history
        |
        v
joblib ML model artifacts from notebooks/training.ipynb
```

## Project Layout

- `notebooks/training.ipynb`: complete ML workflow, EDA, model comparison, tuning, explainability, and artifact saving.
- `models/`: `best_model.pkl`, `scaler.pkl`, and `model_info.json`.
- `backend/`: FastAPI clean modular backend with JWT auth and MongoDB history.
- `frontend/`: React SaaS dashboard with prediction, history, exports, and profile.
- `reports/`: metrics, leaderboard, and generated plots.

## Environment Variables

Create `.env` from `.env.example` and set:

```env
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=concrete_ai
SECRET_KEY=generate_a_long_random_secret
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000
```

## Notebook Training

```bash
cd notebooks
jupyter notebook training.ipynb
```

Run all cells to regenerate:

- `models/best_model.pkl`
- `models/scaler.pkl`
- `models/model_info.json`
- `reports/leaderboard.csv`
- `reports/model_metrics.csv`
- comparison and explainability plots

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API docs are available at `http://localhost:8000/docs`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## MongoDB Setup

Use MongoDB Atlas or local MongoDB. For local Docker MongoDB:

```bash
docker compose up mongodb
```

Set `MONGODB_URL=mongodb://localhost:27017`.

## Docker Setup

```bash
cp .env.example .env
docker compose up --build
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:8000`

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/predict`
- `GET /api/history`
- `GET /api/history/{id}`
- `DELETE /api/history/{id}`
- `DELETE /api/history`
- `GET /api/model-info`

Prediction request:

```json
{ "strength": 40 }
```

## Deployment

### Render

Create a Web Service for the backend using the root `Dockerfile`. Add environment variables from `.env.example`. Create a Static Site for `frontend` with build command `npm install && npm run build` and publish directory `dist`.

### Railway

Deploy the backend from the root Dockerfile and add a MongoDB service or MongoDB Atlas URL. Deploy the frontend from `frontend/` with `VITE_API_URL` pointing to the backend URL.

### VPS, DigitalOcean, AWS EC2, Azure VM

Install Docker and Docker Compose, copy the repository, create `.env`, then run:

```bash
docker compose up --build -d
```

Use Nginx or a cloud load balancer for HTTPS termination.

## Testing

Backend:

```bash
cd backend
pytest
```

Frontend:

```bash
cd frontend
npm run test -- --run
npm run build
```

## Screenshots

- Landing page
- Auth pages
- Dashboard
- Prediction workflow
- History table with export actions

## Troubleshooting

- If authentication fails, verify `SECRET_KEY` is set and the backend was restarted.
- If prediction fails, confirm files exist in `models/`.
- If history fails, verify `MONGODB_URL` and database network access.
- If CORS blocks requests, set `FRONTEND_URL` to the deployed frontend origin.
