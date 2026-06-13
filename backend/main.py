from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_engine import get_traffic_prediction
from db import save_simulation, get_history

app = FastAPI(title="Ağyn Traffic AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TrafficRequest(BaseModel):
    node_id: str
    queue_length: int
    hour: int


@app.post("/api/predict")
async def predict_traffic(data: TrafficRequest):
    result = get_traffic_prediction(data.node_id, data.queue_length, data.hour)
    save_simulation(result.copy())
    return result


@app.get("/api/history")
async def history():
    return get_history()


@app.get("/health")
def health():
    return {"status": "ok", "service": "agyn-traffic-ai"}
