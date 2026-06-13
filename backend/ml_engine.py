from schemas import TrafficResponse

_RUSH_WINDOWS = [(7, 9), (17, 19)]


def _is_rush_hour(hour: int) -> bool:
    return any(start <= hour <= end for start, end in _RUSH_WINDOWS)


def get_traffic_prediction(node_id: str, queue_length: int, hour: int) -> dict:
    """
    Heuristic decision engine. Actions:
      FORCE_GREEN_WAVE  — severe congestion (rush hour + high queue)
      OPTIMIZE_TIMING   — moderate or off-peak high queue
      STAY_NORMAL       — low demand
    """
    rush = _is_rush_hour(hour)
    rush_coefficient = 1.6 if rush else 1.0

    base_delay = queue_length * 0.9
    delay_pred = int(base_delay * rush_coefficient)

    congestion_score = round(min(1.0, queue_length / 300.0), 2)

    if delay_pred > 80 or (rush and queue_length > 150):
        action = "FORCE_GREEN_WAVE"
        confidence = round(min(0.97, 0.85 + queue_length / 1000), 2)
    elif delay_pred > 35:
        action = "OPTIMIZE_TIMING"
        confidence = round(min(0.87, 0.74 + queue_length / 1200), 2)
    else:
        action = "STAY_NORMAL"
        confidence = round(min(0.82, 0.70 + (300 - queue_length) / 3000), 2)

    return {
        "node_id": node_id,
        "action": action,
        "delay_pred": delay_pred,
        "confidence": confidence,
        "congestion_score": congestion_score,
    }


class TrafficPredictor:
    def predict(self, node_id: str, queue_length: int, hour: int) -> TrafficResponse:
        result = get_traffic_prediction(node_id, queue_length, hour)
        return TrafficResponse(**result)
