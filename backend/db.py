import json
import os
from datetime import datetime, timezone

_STORAGE = os.path.join(os.path.dirname(__file__), "storage.json")


def _load() -> list:
    if not os.path.exists(_STORAGE):
        return []
    with open(_STORAGE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except (json.JSONDecodeError, ValueError):
            return []


def save_simulation(record: dict) -> None:
    data = _load()
    record["timestamp"] = datetime.now(timezone.utc).isoformat()
    data.append(record)
    with open(_STORAGE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def get_history(limit: int = 50) -> list:
    return _load()[-limit:]
