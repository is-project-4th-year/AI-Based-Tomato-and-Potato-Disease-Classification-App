"""
Predictor Service

Handles ML model inference and prediction generation.
"""

import logging
import time
from typing import List, Tuple

import numpy as np

from app.models.prediction import ClassPrediction, PredictionResponse
from app.services.model_loader import model_loader
from app.services.preprocessor import image_preprocessor

logger = logging.getLogger(__name__)


class Predictor:
    """Handles model inference and prediction generation."""

    def __init__(self):
        """Initialize predictor."""
        self.model = None
        self.class_labels = None

    def initialize(self):
        """
        Initialize the predictor by loading model and class labels.

        Raises:
            Exception: If initialization fails
        """
        try:
            logger.info("Initializing predictor...")
            self.model = model_loader.load_model()
            self.class_labels = model_loader.load_class_labels()
            logger.info("Predictor initialized successfully")

        except Exception as e:
            logger.error(f"Predictor initialization failed: {str(e)}")
            raise

    def predict(self, image_bytes: bytes) -> PredictionResponse:
        """
        Perform prediction on uploaded image.

        Args:
            image_bytes: Raw bytes of the uploaded image

        Returns:
            PredictionResponse with prediction results

        Raises:
            ValueError: If prediction fails
            RuntimeError: If model is not initialized
        """
        if self.model is None or self.class_labels is None:
            raise RuntimeError("Predictor not initialized. Call initialize() first.")

        # Validate image
        is_valid, error_msg = image_preprocessor.validate_image(image_bytes)
        if not is_valid:
            raise ValueError(error_msg)

        # Preprocess image
        try:
            preprocessed_image = image_preprocessor.preprocess_image(image_bytes)
        except Exception as e:
            raise ValueError(f"Image preprocessing failed: {str(e)}")

        # Perform inference
        start_time = time.time()

        try:
            predictions = self.model.predict(preprocessed_image, verbose=0)
            inference_time = time.time() - start_time

            logger.info(f"Inference completed in {inference_time:.3f} seconds")

        except Exception as e:
            logger.error(f"Model inference failed: {str(e)}")
            raise ValueError(f"Model inference error: {str(e)}")

        # Process predictions
        predictions = predictions[0]  # Remove batch dimension
        all_predictions = self._process_predictions(predictions)

        # Get top prediction
        top_prediction = all_predictions[0]

        return PredictionResponse(
            predicted_class=top_prediction.class_name,
            confidence=top_prediction.confidence,
            all_predictions=all_predictions,
            inference_time=round(inference_time, 3)
        )

    def _process_predictions(self, predictions: np.ndarray) -> List[ClassPrediction]:
        """
        Process raw model predictions into sorted ClassPrediction objects.

        Args:
            predictions: Raw prediction array from model (shape: [num_classes])

        Returns:
            List of ClassPrediction objects sorted by confidence (descending)
        """
        # Create list of (class_name, confidence) tuples
        class_predictions = [
            ClassPrediction(
                class_name=class_name,
                confidence=float(confidence)
            )
            for class_name, confidence in zip(self.class_labels, predictions)
        ]

        # Sort by confidence (descending)
        class_predictions.sort(key=lambda x: x.confidence, reverse=True)

        return class_predictions

    def is_initialized(self) -> bool:
        """Check if predictor is initialized."""
        return self.model is not None and self.class_labels is not None


# Global predictor instance
predictor = Predictor()
