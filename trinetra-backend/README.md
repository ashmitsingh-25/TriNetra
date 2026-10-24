# TriNetra model backend

Includes your original model, a FastAPI API, Docker deployment, Render configuration, and a Next.js adapter.

## What the model does

The artifact is a scikit-learn 1.6.1 Pipeline: TF-IDF (up to 5000 features, word unigrams/bigrams) followed by logistic regression. It takes message text and predicts numeric classes 0 and 1. It does NOT take transaction feature vectors and does not decode QR images, crawl URLs, perform HDBSCAN, or confirm bank payments.

The artifact does not store what 0 and 1 mean. Until you confirm the mapping from your training notebook, the API returns numeric class probabilities with null fraud score/risk tier. If class 1 means fraud, set FRAUD_CLASS=1. Never guess this mapping.

## Run on your laptop (Windows PowerShell)

Open a terminal in this extracted folder:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
# Set this ONLY after checking your training labels:
# $env:FRAUD_CLASS="1"
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

If Python 3.11 is unavailable, install it first. Local base URL: http://127.0.0.1:8000. Interactive documentation: http://127.0.0.1:8000/docs. These addresses only work while you run the backend on that same computer, not for a publicly deployed frontend.

Linux/macOS: use python3 -m venv .venv, .venv/bin/python -m pip install -r requirements.txt, then .venv/bin/python -m uvicorn main:app --port 8000.

## Endpoints

- GET /health — model readiness.
- POST /predict — JSON body {"messageText":"URGENT: Pay your electricity bill immediately"}.
- GET /docs — interactive API documentation.

The response includes predicted_class, class_probabilities, and (when FRAUD_CLASS is configured) fraud_probability, score and riskTier. Score is probability multiplied by 100; default risk cutoffs are 31 and 66. These thresholds and probabilities are not calibrated guarantees of fraud or safety. Requests reject blank, non-string, overlong messages and unexpected fields. API_KEY enables X-API-Key authentication. No messages are explicitly logged or persisted by this application.

## Get a public URL

This ZIP is a downloadable backend, not a running hosted endpoint. No public deployment has been created.

1. Add this folder as a separate GitHub repository (or backend folder in your existing repo).
2. On Render, create a Web Service from that repository and choose Docker. If the code is under a subfolder, set Root Directory to that folder. Alternatively use the included render.yaml as a Blueprint when this folder is the repository root.
3. Set API_KEY to a long random secret (Blueprint generates one). Set FRAUD_CLASS after verifying your labels. ALLOWED_ORIGINS can remain localhost if Next.js calls this server-to-server.
4. Deploy and copy the actual service URL shown by Render. Open its /health and /docs endpoints to verify.
5. Put that base URL in MODEL_API_URL in Next.js. Never invent the URL before deployment. Check hosting charges before choosing a plan.

Use the Dockerfile on any Python/Docker host if you prefer another provider. Configure the platform's port as needed; the container reads PORT, defaulting to 8000. Do not expose an unauthenticated endpoint publicly. Add platform rate limits before wider use.

## Connect in Antigravity / Next.js

Copy antigravity-route.ts to app/api/model-predict/route.ts. In your Next.js .env.local:

```env
MODEL_API_URL=http://127.0.0.1:8000
MODEL_API_KEY=
```

For hosting, replace the local URL with the actual deployed URL and match MODEL_API_KEY to the backend API_KEY. Keep these variables server-side (no NEXT_PUBLIC_ prefix). Restart Next.js after changes.

Frontend request:

```javascript
const response = await fetch('/api/model-predict', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({messageText})
});
const result = await response.json();
if (!response.ok) throw new Error(result.error || 'Model unavailable');
```

Use fraud_probability * 100 as the message/NLP subscore only after confirming labels. Preserve independent QR and URL checks. Do not silently show LOW if the backend fails. The existing /api/check-payment route will not automatically use this model; it needs an explicit integration.

## Prompt to paste into Antigravity

Integrate the supplied TriNetra FastAPI backend into my existing Next.js project. Copy antigravity-route.ts to app/api/model-predict/route.ts. Read MODEL_API_URL and MODEL_API_KEY only on the server. Send {messageText} to POST /predict and display numeric class probabilities. If fraud_probability is null, show that label mapping needs confirmation. Once FRAUD_CLASS is confirmed, use fraud_probability * 100 for the NLP component of the existing composite risk calculation. Keep QR and URL checks separate. Handle timeouts/errors as unavailable, never low risk. Do not claim this text model verifies bank ownership, payment settlement, or live web evidence. Preserve the existing UI and explain exactly which files you change.

## Validation and limitations

See test_backend.py; run python -m pip install httpx==0.28.1 and python -m unittest test_backend.py. Tests check API output matches direct model probabilities, input validation, authentication, label configuration, health and CORS. They do not measure fraud detection quality.

Manual inspection found that a benign example ("Hello, your order is delivered") was predicted as class 1 with approximately 71% probability. Confirm label meaning and evaluate on a held-out labelled dataset before making accuracy claims. Only load trusted joblib files: loading executes Python serialization. The API offers no model upload endpoint.
