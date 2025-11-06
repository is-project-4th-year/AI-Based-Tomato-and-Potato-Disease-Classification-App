# Plant Disease Detection ML Service

FastAPI-based microservice for plant disease classification using MobileNetV2.

## Overview

This service provides a REST API for predicting plant diseases from images. It uses a trained MobileNetV2 model to classify images into 13 different classes covering tomato and potato diseases.

## Features

- **Fast Inference:** MobileNetV2 architecture optimized for speed
- **RESTful API:** Simple HTTP endpoints for prediction
- **Health Monitoring:** Built-in health check endpoints
- **Docker Support:** Containerized for easy deployment
- **Production Ready:** Proper error handling, logging, and validation

## Model Specifications

- **Architecture:** MobileNetV2
- **Input Size:** 224 x 224 x 3 (RGB)
- **Output:** 13 classes
- **Model File:** `MobileNetV2_20251027_200458_final.h5` (~25 MB)

### Supported Classes

1. Tomato___Bacterial_spot
2. Tomato___Early_blight
3. Tomato___Late_blight
4. Tomato___Leaf_Mold
5. Tomato___Septoria_leaf_spot
6. Tomato___Spider_mites Two-spotted_spider_mite
7. Tomato___Target_Spot
8. Tomato___Tomato_Yellow_Leaf_Curl_Virus
9. Tomato___Tomato_mosaic_virus
10. Tomato___healthy
11. Potato___Early_blight
12. Potato___Late_blight
13. Potato___healthy

## Prerequisites

- Python 3.10+
- TensorFlow 2.13+
- Trained model file (download from Google Drive)

## Installation

### Local Development

1. **Clone the repository and navigate to ML service directory:**

```bash
cd webapp/ml-service
```

2. **Create and activate virtual environment:**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

4. **Download the trained model:**

Place `MobileNetV2_20251027_200458_final.h5` in the `models/` directory.

See `models/README.md` for download instructions.

5. **Create .env file:**

```bash
cp .env.example .env
```

Edit `.env` if needed to customize configuration.

6. **Run the service:**

```bash
python -m uvicorn app.main:app --reload
```

The service will start at `http://localhost:8000`

### Docker Deployment

1. **Build the Docker image:**

```bash
docker build -t plant-disease-ml-service .
```

2. **Run the container:**

```bash
docker run -p 8000:8000 \
  -v $(pwd)/models:/app/models \
  plant-disease-ml-service
```

**Note:** Mount the models directory as a volume to provide the model file.

## API Endpoints

### 1. Root

**GET /**

Returns service information and available endpoints.

**Response:**
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

### 2. Health Check

**GET /health**

Check if the service is running and model is loaded.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

### 3. Model Information

**GET /model-info**

Get information about the loaded model.

**Response:**
```json
{
  "model_name": "MobileNetV2",
  "model_version": "20251027_200458_final",
  "num_classes": 13,
  "classes": ["Tomato___Bacterial_spot", "..."],
  "input_shape": [224, 224, 3]
}
```

### 4. Predict Disease

**POST /predict**

Predict plant disease from an uploaded image.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `file` (image file - JPEG or PNG)

**Example using curl:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@plant_image.jpg"
```

**Example using Python:**
```python
import requests

url = "http://localhost:8000/predict"
files = {"file": open("plant_image.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

**Response:**
```json
{
  "predicted_class": "Tomato___Late_blight",
  "confidence": 0.9823,
  "all_predictions": [
    {
      "class_name": "Tomato___Late_blight",
      "confidence": 0.9823
    },
    {
      "class_name": "Tomato___Early_blight",
      "confidence": 0.0122
    },
    ...
  ],
  "inference_time": 0.234
}
```

## API Documentation

Interactive API documentation is available at:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

## Configuration

Configuration is managed through environment variables. See `.env.example` for all available options.

Key configurations:

- `MODEL_PATH`: Path to the model file
- `CLASS_LABELS_PATH`: Path to class labels JSON
- `MAX_IMAGE_SIZE`: Maximum image size in bytes (default: 10MB)
- `IMAGE_SIZE`: Input image size for model (default: 224)
- `LOG_LEVEL`: Logging level (DEBUG, INFO, WARNING, ERROR)

## Testing

### Manual Testing

1. **Test health endpoint:**

```bash
curl http://localhost:8000/health
```

2. **Test prediction with sample image:**

```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@test_image.jpg"
```

### Automated Testing

(To be implemented)

```bash
pytest tests/
```

## Deployment

### Railway / Render

1. **Connect your GitHub repository**

2. **Set environment variables:**
   - Add model file to cloud storage or include in deployment
   - Set `MODEL_PATH` to correct location

3. **Deploy:**
   - Railway/Render will automatically detect the Dockerfile
   - Service will start on configured port

### Manual Server Deployment

1. **Build and run with Docker:**

```bash
docker build -t plant-disease-ml .
docker run -d -p 8000:8000 plant-disease-ml
```

2. **Or use docker-compose:**

```yaml
version: '3.8'
services:
  ml-service:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./models:/app/models
    environment:
      - ENV=production
```

## Performance

- **Inference Time:** ~200-300ms per image (CPU)
- **Inference Time:** ~50-100ms per image (GPU)
- **Model Size:** ~25 MB
- **Memory Usage:** ~500 MB (with model loaded)

## Troubleshooting

### Model Not Found Error

**Error:** `Model file not found`

**Solution:**
1. Ensure model file exists in `models/` directory
2. Check `MODEL_PATH` in `.env` is correct
3. Verify file name matches exactly

### Prediction Fails

**Error:** `Prediction failed`

**Possible causes:**
1. Invalid image format (use JPEG or PNG)
2. Image too large (max 10MB)
3. Corrupted image file

**Solution:**
- Check image format and size
- Try with a different image
- Check logs for detailed error message

### Service Won't Start

**Error:** Service starts but predictions fail

**Solution:**
1. Check if model loaded successfully in logs
2. Verify all dependencies are installed
3. Check Python version (3.10+ required)

## Logging

Logs are written to stdout/stderr with the following format:

```
2025-11-06 12:00:00 - app.main - INFO - Prediction: Tomato___Late_blight (0.9823) in 0.234s
```

Set `LOG_LEVEL=DEBUG` for more detailed logs.

## Contributing

When adding features or fixing bugs:

1. Update this README
2. Add tests for new functionality
3. Follow existing code style (PEP 8)
4. Update API documentation

## License

Part of the AI-Based Tomato and Potato Disease Classification project.

## Contact

For issues or questions, please open an issue in the main repository.

---

**Version:** 1.0.0
**Last Updated:** 2025-11-06
