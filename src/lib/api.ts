export interface TrafficResponse {
  node_id: string;
  action: string;
  delay_pred: number;
  confidence: number;
  congestion_score: number;
}

export const callTrafficAPI = async (
  endpoint: string,
  payload: object
): Promise<any> => {
  const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};
