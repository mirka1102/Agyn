from pydantic import BaseModel

class TrafficRequest(BaseModel):
    node_id: str
    queue_length: int
    hour: int

class TrafficResponse(BaseModel):
    node_id: str
    action: str
    delay_pred: int
    confidence: float
    congestion_score: float
