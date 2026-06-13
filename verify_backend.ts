/**
 * Run with: npx ts-node verify_backend.ts
 * Verifies the backend /api/predict endpoint returns a valid response.
 */

const BACKEND_URL = 'http://127.0.0.1:8000';

const payload = {
  node_id: 'Turan',
  queue_length: 300,
  hour: 18,
};

async function verifyBackend() {
  console.log(`\n[verify] POST ${BACKEND_URL}/api/predict`);
  console.log('[verify] Payload:', JSON.stringify(payload, null, 2));

  try {
    const res = await fetch(`${BACKEND_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(`[verify] HTTP error: ${res.status} ${res.statusText}`);
      process.exit(1);
    }

    const data = await res.json();
    console.log('\n[verify] SUCCESS — Response:');
    console.log(JSON.stringify(data, null, 2));

    // Validate shape
    const { action, delay_pred, confidence } = data as any;
    console.log(`\n[verify] Action     : ${action}`);
    console.log(`[verify] Delay pred : ${delay_pred}s`);
    console.log(`[verify] Confidence : ${(confidence * 100).toFixed(0)}%`);

    const expectsRedPulse = action === 'FORCE_GREEN_WAVE';
    console.log(`\n[verify] Map marker will be: ${expectsRedPulse ? '🔴 RED + PULSING (animate-pulse)' : '🟢 GREEN'}`);
  } catch (err: any) {
    console.error('[verify] FAILED — Is the backend running on port 8000?');
    console.error('[verify] Error:', err.message);
    console.error('\n[verify] Start the backend with:');
    console.error('  cd backend && uvicorn main:app --reload --port 8000');
    process.exit(1);
  }
}

verifyBackend();
