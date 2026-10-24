import hmac
import os
from contextlib import asynccontextmanager
from pathlib import Path

import joblib
import sklearn
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, field_validator

MODEL_PATH = Path(os.getenv('MODEL_PATH', str(Path(__file__).parent / 'models/trinetra_fraud_model.joblib')))
API_KEY = os.getenv('API_KEY', '')
# The uploaded artifact contains numeric labels but no semantic label mapping.
FRAUD_CLASS = os.getenv('FRAUD_CLASS', '')
model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    model = joblib.load(MODEL_PATH)
    if not hasattr(model, 'predict_proba'):
        raise RuntimeError('Model must support predict_proba')
    if FRAUD_CLASS and FRAUD_CLASS not in [str(c) for c in model.classes_]:
        raise RuntimeError('FRAUD_CLASS must match a model class')
    yield
    model = None


app = FastAPI(title='TriNetra Message Model API', version='1.0.0', lifespan=lifespan,
              description='Scores message text with the uploaded TF-IDF/logistic regression model. Does not verify QR ownership, crawl websites, or confirm payments.')
app.add_middleware(CORSMiddleware,
    allow_origins=[s.strip() for s in os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',') if s.strip()],
    allow_credentials=False, allow_methods=['GET', 'POST'],
    allow_headers=['Content-Type', 'X-API-Key'])


class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')
    messageText: str = Field(min_length=1, max_length=10000, strict=True)

    @field_validator('messageText')
    @classmethod
    def nonblank(cls, value):
        value = value.strip()
        if not value:
            raise ValueError('messageText cannot be blank')
        return value


@app.get('/')
def root():
    return {'service': 'TriNetra Message Model API', 'docs': '/docs', 'health': '/health', 'predict': '/predict'}


@app.get('/health')
def health():
    return {'status': 'ok' if model is not None else 'unavailable', 'model_loaded': model is not None,
            'sklearn_version': sklearn.__version__, 'fraud_class_configured': bool(FRAUD_CLASS)}


@app.post('/predict')
def predict(body: PredictionRequest, x_api_key: str | None = Header(default=None)):
    if API_KEY and not hmac.compare_digest(x_api_key or '', API_KEY):
        raise HTTPException(401, 'Invalid or missing X-API-Key')
    if model is None:
        raise HTTPException(503, 'Model is not loaded')
    probabilities = model.predict_proba([body.messageText])[0]
    labels = [str(c) for c in model.classes_]
    prediction = str(model.predict([body.messageText])[0])
    scores = {label: float(p) for label, p in zip(labels, probabilities)}
    probability = scores[FRAUD_CLASS] if FRAUD_CLASS else None
    risk_score = round(probability * 100, 2) if probability is not None else None
    # Demo thresholds, not calibrated or validated against real-world fraud.
    tier = ('HIGH' if risk_score >= 66 else 'MEDIUM' if risk_score >= 31 else 'LOW') if risk_score is not None else None
    return {'success': True, 'predicted_class': prediction, 'class_probabilities': scores,
            'fraud_class': FRAUD_CLASS or None, 'fraud_probability': probability,
            'score': risk_score, 'riskTier': tier,
            'scope': 'message_text_only',
            'label_mapping_confirmed': bool(FRAUD_CLASS),
            'notice': 'Model scores are not proof of fraud or safety. Confirm label mapping from training code; risk thresholds are demonstration defaults.'}
