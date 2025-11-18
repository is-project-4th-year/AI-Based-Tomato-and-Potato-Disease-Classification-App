"""
Pydantic models for prediction requests and responses.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class ClassPrediction(BaseModel):
    """Individual class prediction with confidence score."""

    class_name: str = Field(..., description="Predicted class name")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score (0-1)")


class PredictionResponse(BaseModel):
    """Response model for prediction endpoint."""

    predicted_class: str = Field(..., description="Top predicted class")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence of top prediction")
    all_predictions: List[ClassPrediction] = Field(
        ..., description="All class predictions sorted by confidence"
    )
    inference_time: float = Field(..., description="Inference time in seconds")


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""

    status: str = Field(..., description="Service status")
    model_loaded: bool = Field(..., description="Whether model is loaded")
    version: str = Field(..., description="Service version")


class ModelInfoResponse(BaseModel):
    """Response model for model info endpoint."""

    model_name: str = Field(..., description="Model architecture name")
    model_version: str = Field(..., description="Model version/timestamp")
    num_classes: int = Field(..., description="Number of output classes")
    classes: List[str] = Field(..., description="List of class names")
    input_shape: List[int] = Field(..., description="Model input shape")


class ErrorResponse(BaseModel):
    """Error response model."""

    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
