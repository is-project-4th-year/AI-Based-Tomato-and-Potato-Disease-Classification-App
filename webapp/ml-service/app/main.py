"""
FastAPI ML Service

Main application for plant disease prediction using MobileNetV2.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models.prediction import (
    PredictionResponse,
    HealthResponse,
    ModelInfoResponse,
    ErrorResponse
)
from app.services.predictor import predictor
from app.services.model_loader import model_loader

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI.

    Handles startup and shutdown events.
    """
    # Startup: Load model
    logger.info("Starting up ML service...")
    try:
        predictor.initialize()
        logger.info("ML service started successfully")
    except FileNotFoundError as e:
        logger.error(f"Model file not found: {str(e)}")
        logger.error("Service will start but predictions will fail until model is provided")
    except Exception as e:
        logger.error(f"Failed to initialize predictor: {str(e)}")
        logger.error("Service will start but may not function correctly")

    yield

    # Shutdown: Cleanup (if needed)
    logger.info("Shutting down ML service...")


# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="ML inference service for plant disease classification using MobileNetV2",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with service information."""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "model_info": "/model-info",
            "docs": "/docs"
        }
    }


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Health check endpoint"
)
async def health_check():
    """
    Health check endpoint.

    Returns the current status of the service and whether the model is loaded.
    """
    return HealthResponse(
        status="healthy" if predictor.is_initialized() else "degraded",
        model_loaded=predictor.is_initialized(),
        version=settings.app_version
    )


@app.get(
    "/model-info",
    response_model=ModelInfoResponse,
    tags=["Model"],
    summary="Get model information"
)
async def get_model_info():
    """
    Get information about the loaded model.

    Returns model architecture, version, number of classes, and class names.

    Raises:
        HTTPException: If model is not loaded
    """
    if not predictor.is_initialized():
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please ensure the model file is available."
        )

    try:
        model_info = model_loader.get_model_info()
        return ModelInfoResponse(**model_info)

    except Exception as e:
        logger.error(f"Failed to get model info: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/predict",
    response_model=PredictionResponse,
    tags=["Prediction"],
    summary="Predict plant disease from image"
)
async def predict_disease(file: UploadFile = File(...)):
    """
    Predict plant disease from uploaded image.

    Accepts an image file and returns:
    - Top predicted disease class
    - Confidence score
    - All class predictions with confidence scores
    - Inference time

    Args:
        file: Uploaded image file (JPEG, PNG)

    Returns:
        PredictionResponse with prediction results

    Raises:
        HTTPException: If prediction fails
    """
    # Check if model is loaded
    if not predictor.is_initialized():
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please contact the administrator."
        )

    # Validate file type
    if file.content_type not in ['image/jpeg', 'image/jpg', 'image/png']:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Only JPEG and PNG are supported."
        )

    try:
        # Read file content
        file_content = await file.read()

        # Perform prediction
        prediction_result = predictor.predict(file_content)

        logger.info(
            f"Prediction: {prediction_result.predicted_class} "
            f"({prediction_result.confidence:.4f}) "
            f"in {prediction_result.inference_time:.3f}s"
        )

        return prediction_result

    except ValueError as e:
        # Validation or preprocessing errors
        logger.warning(f"Prediction validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        # Unexpected errors
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.env == "development" else "An unexpected error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=(settings.env == "development"),
        workers=settings.workers
    )
