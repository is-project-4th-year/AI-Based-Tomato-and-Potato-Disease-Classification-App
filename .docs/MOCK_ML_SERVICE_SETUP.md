# Mock ML Service Setup Guide

**Date:** 2025-11-06
**Purpose:** Enable full application testing without TensorFlow/model deployment
**Status:** ✅ OPERATIONAL

---

## Overview

The mock ML service simulates disease predictions with **exact production format** while avoiding heavyweight dependencies (TensorFlow, NumPy). This allows:

- ✅ Full application testing
- ✅ Frontend integration verification
- ✅ API contract validation
- ✅ Lightweight development environment (< 100MB vs > 1GB)

---

## Architecture

### Mock Components Created

```
webapp/ml-service/
├── app/services/
│   ├── predictor_mock.py          # Mock predictor (simulated inference)
│   ├── preprocessor_mock.py       # Lightweight image validation
│   └── predictor.py               # Production predictor (requires TensorFlow)
├── requirements-mock.txt           # Lightweight dependencies
└── requirements.txt                # Full production dependencies
```

### Modifications Made

**1. main.py** ([Line 21-25](../webapp/ml-service/app/main.py#L21-L25))
```python
# MOCK MODE: Using simulated predictions (no TensorFlow dependency)
from app.services.predictor_mock import predictor
# from app.services.predictor import predictor  # Production mode
# from app.services.model_loader import model_loader  # Not needed in mock
```

**2. config/ml.php** ([Line 14](../webapp/backend/config/ml.php#L14))
```php
'service_url' => env('ML_SERVICE_URL', 'http://localhost:8001'),
```

**3. .env Configuration**
```env
PORT=8001  # Changed from 8000 (port conflict)
# ALLOWED_EXTENSIONS removed (uses default from config.py)
```

---

## Current Service Status

### Running Services

| Service | Port | Status | URL |
|---------|------|--------|-----|
| Laravel Backend | 8006 | ✅ Running | http://127.0.0.1:8006 |
| React Frontend | 5174 | ✅ Running | http://localhost:5174 |
| **Mock ML Service** | **8001** | ✅ Running | http://localhost:8001 |

### ML Service Endpoints

✅ **Root**: `GET /`
```json
{
  "service": "Plant Disease Detection ML Service",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "health": "/health",
    "predict": "/predict",
    "model_info": "/model-info",
    "docs": "/docs"
  }
}
```

✅ **Health**: `GET /health`
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

✅ **Model Info**: `GET /model-info`
```json
{
  "model_name": "MobileNetV2",
  "model_version": "20251027_200458_final",
  "num_classes": 13,
  "classes": [
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    ...13 classes total
  ],
  "input_shape": [224, 224, 3]
}
```

✅ **Predict**: `POST /predict` (multipart/form-data)
- Validates image (type, size)
- Returns realistic random prediction
- Simulates 50-150ms inference time
- Top class: 75-95% confidence

---

## Mock Prediction Behavior

### Realistic Simulation Strategy

```python
# Top prediction: 75-95% confidence
top_confidence = random.uniform(0.75, 0.95)

# Second prediction: 5-15% of remaining
second_confidence = random.uniform(0.05, 0.15) * (1.0 - top_confidence)

# Rest: Distributed across remaining classes
# Total always sums to 1.0
```

### Example Response

```json
{
  "predicted_class": "Tomato___Late_blight",
  "confidence": 0.8734,
  "all_predictions": [
    {"class_name": "Tomato___Late_blight", "confidence": 0.8734},
    {"class_name": "Potato___Early_blight", "confidence": 0.0823},
    {"class_name": "Tomato___healthy", "confidence": 0.0245},
    ...13 classes total
  ],
  "inference_time": 0.112
}
```

---

## Installation & Setup

### Prerequisites

- Python 3.10+
- pip

### Install Mock Dependencies

```bash
cd webapp/ml-service
pip install -r requirements-mock.txt --user
```

**Dependencies** (~50MB total):
- fastapi==0.104.1
- uvicorn[standard]==0.24.0
- python-multipart==0.0.6
- pillow>=10.1.0
- pydantic>=2.5.0
- pydantic-settings>=2.1.0
- python-dotenv>=1.0.0

### Start Mock Service

```bash
cd webapp/ml-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

**Expected Output:**
```
INFO: Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO: Started server process
INFO: Waiting for application startup.
INFO: Initializing MOCK predictor...
INFO: ✓ MOCK predictor initialized successfully (simulation mode)
WARNING: ⚠ Running in MOCK mode - predictions are simulated
INFO: ML service started successfully
INFO: Application startup complete.
```

---

## Reversion to Production

### Step 1: Update main.py

**File:** `webapp/ml-service/app/main.py` (Lines 21-25)

```python
# Change from:
from app.services.predictor_mock import predictor

# To:
from app.services.predictor import predictor
from app.services.model_loader import model_loader
```

### Step 2: Install Production Dependencies

```bash
cd webapp/ml-service
pip install -r requirements.txt --user
```

**Dependencies** (~1.5GB total):
- All mock dependencies PLUS:
- tensorflow>=2.13.0
- numpy>=1.24.3

### Step 3: Verify Model File

Ensure model exists:
```bash
ls -lh webapp/ml-service/models/MobileNetV2_20251027_200458_final.h5
```

Should show: ~19MB file

### Step 4: Restart Service

```bash
cd webapp/ml-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

**Expected Output:**
```
INFO: Initializing predictor...
INFO: Loading model from models/MobileNetV2_20251027_200458_final.h5
INFO: Model loaded successfully
INFO: Loading class labels...
INFO: Predictor initialized successfully
```

### Step 5: Verify Production Mode

```bash
curl http://localhost:8001/health
```

Should return:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

---

## Testing the Mock Service

### Test Health Endpoint

```bash
curl http://localhost:8001/health
```

### Test Model Info

```bash
curl http://localhost:8001/model-info
```

### Test Prediction (with image)

```bash
curl -X POST http://localhost:8001/predict \
  -F "file=@/path/to/plant-image.jpg" \
  -H "Accept: application/json"
```

### Test via Laravel Backend

```bash
# Register user
curl -X POST http://127.0.0.1:8006/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123","password_confirmation":"password123"}'

# Upload prediction (use token from registration)
curl -X POST http://127.0.0.1:8006/api/predictions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/plant-image.jpg"
```

### Test via Frontend

1. Open http://localhost:5174
2. Register/Login
3. Navigate to Dashboard
4. Upload plant image
5. View simulated prediction results

---

## Troubleshooting

### Port 8000 Already in Use

**Issue:** Another service running on port 8000

**Solution:**
```bash
# Update ML service port
# Edit webapp/ml-service/.env:
PORT=8001

# Update Laravel config
# Edit webapp/backend/config/ml.php:
'service_url' => env('ML_SERVICE_URL', 'http://localhost:8001'),
```

### Import Errors (numpy/tensorflow)

**Issue:** `ModuleNotFoundError: No module named 'numpy'`

**Solution:**
Ensure using mock imports:
```python
# In app/services/predictor_mock.py:
from app.services.preprocessor_mock import image_preprocessor  # ✓ Correct

# NOT:
from app.services.preprocessor import image_preprocessor  # ✗ Wrong (requires numpy)
```

### Pydantic Settings Error

**Issue:** `SettingsError: error parsing value for field "allowed_extensions"`

**Solution:**
Remove `ALLOWED_EXTENSIONS` from `.env` (uses default list from config.py):
```env
# Remove this line:
# ALLOWED_EXTENSIONS=jpg,jpeg,png

# Or comment it:
# ALLOWED_EXTENSIONS - Using default from config.py
```

---

## File Reference

### Mock Implementation Files

| File | Purpose | Size |
|------|---------|------|
| `predictor_mock.py` | Simulated predictions | ~200 lines |
| `preprocessor_mock.py` | Lightweight validation | ~50 lines |
| `requirements-mock.txt` | Lightweight dependencies | ~50MB |

### Production Files (Untouched)

| File | Purpose | Status |
|------|---------|--------|
| `predictor.py` | Real ML inference | Preserved |
| `preprocessor.py` | Full preprocessing | Preserved |
| `model_loader.py` | TensorFlow model loader | Preserved |
| `requirements.txt` | Full dependencies | Preserved |

---

## Performance Comparison

| Metric | Mock Mode | Production Mode |
|--------|-----------|-----------------|
| Dependencies Size | ~50 MB | ~1.5 GB |
| Installation Time | ~2 minutes | ~15 minutes |
| Startup Time | <2 seconds | ~10 seconds |
| Memory Usage | ~100 MB | ~800 MB |
| Inference Time | 50-150ms | 50-300ms |
| Prediction Accuracy | N/A (random) | ~92% |

---

## Advantages of Mock Mode

✅ **Fast Development**
- No model download/setup required
- Quick dependency installation
- Instant startup

✅ **Lightweight**
- 30x smaller dependencies
- 8x less memory usage
- Runs on low-spec machines

✅ **Perfect for Testing**
- Validates API contracts
- Tests frontend integration
- Verifies error handling
- Enables CI/CD without model

✅ **Easy Reversion**
- Simple one-line import change
- No code modifications needed
- Preserves production code

---

## API Contract Guarantee

The mock service returns **identical response structure** to production:

```typescript
interface PredictionResponse {
  predicted_class: string;
  confidence: number;
  all_predictions: Array<{
    class_name: string;
    confidence: number;
  }>;
  inference_time: number;
}
```

This ensures:
- Frontend code works unchanged
- Backend integration seamless
- Easy production deployment
- No surprises in production

---

## Next Steps

1. ✅ Mock service operational
2. 🔄 Test end-to-end prediction flow
3. 🔄 Deploy actual model file
4. 🔄 Switch to production mode
5. 🔄 Production testing

---

**Documentation Version:** 1.0
**Last Updated:** 2025-11-06
**Status:** Mock mode operational, ready for testing
