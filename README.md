##LIVE DEMO:https://concretemixdesign.onrender.com/

# 🏗️ ConcreteMix AI

An intelligent Machine Learning platform designed to predict optimal concrete mix designs based on target compressive strength.

## 🚀 Overview
ConcreteMix AI eliminates the trial-and-error process of traditional concrete design. By leveraging advanced regression models, it instantly estimates the required quantities for 7 key ingredients:
- Cement, Water, and Aggregates
- Blast Furnace Slag & Fly Ash
- Superplasticizers

## ✨ Key Features
### 🧠 Machine Learning & Data
- **Inverse Design**: Predict ingredient quantities from 1 strength input.
- **Model Transparency**: Performance benchmarking and feature importance analysis.
- **Exportable Insights**: Download history as professional CSV or PDF reports.

### 🔒 Security & UX
- **Secure Access**: JWT-based authentication and bcrypt password protection.
- **Modern Dashboard**: Responsive UI with vibrant charts and dark mode support.
- **History Tracking**: Persistent storage of all predictions using MongoDB.

## 🛠️ Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Recharts, Framer Motion.
- **Backend**: FastAPI (Python), Motor (Async MongoDB), Scikit-Learn.
- **Infrastructure**: Docker, MongoDB Atlas, Cloud-ready deployment.

## 🔮 Future Roadmap
*   **🤖 MixAI Assistant**: An integrated AI chatbot to provide real-time engineering support and mix optimization advice.
*   **💰 Cost Estimation**: Real-time material cost calculations for predicted mixes.
*   **📱 On-Site Support**: Mobile-responsive features for field engineers.

## ⚙️ Installation
1.  **Backend**:
    ```bash
    cd backend
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
