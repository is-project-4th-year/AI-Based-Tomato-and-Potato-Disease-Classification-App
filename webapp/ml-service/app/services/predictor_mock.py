"""
Mock Predictor Service

Simulates ML model inference for testing without TensorFlow dependency.
Returns realistic predictions matching exact production format.

USAGE:
    This mock allows full application testing without model deployment.
    To revert to production: Import 'predictor' from 'predictor.py' instead.
"""

import logging
import time
import random
import json
from typing import List
from pathlib import Path

from app.models.prediction import ClassPrediction, PredictionResponse
from app.services.preprocessor_mock import image_preprocessor  # Mock preprocessor (no numpy/tensorflow)

logger = logging.getLogger(__name__)


class MockPredictor:
    """Simulates model inference with realistic random predictions."""

    def __init__(self):
        """Initialize mock predictor."""
        self.class_labels = None
        self._is_initialized = False

    def initialize(self):
        """
        Initialize the mock predictor by loading class labels.

        Raises:
            Exception: If initialization fails
        """
        try:
            logger.info("Initializing MOCK predictor...")
            self.class_labels = self._load_class_labels()
            self._is_initialized = True
            logger.info("✓ MOCK predictor initialized successfully (simulation mode)")
            logger.warning("⚠ Running in MOCK mode - predictions are simulated")

        except Exception as e:
            logger.error(f"Mock predictor initialization failed: {str(e)}")
            raise

    def _load_class_labels(self) -> List[str]:
        """Load class labels from JSON file."""
        labels_path = Path("models/class_labels.json")

        if labels_path.exists():
            with open(labels_path, 'r') as f:
                return json.load(f)

        # Fallback: hardcoded class labels
        logger.warning("Class labels file not found, using hardcoded labels")
        return [
            "Tomato___Bacterial_spot",
            "Tomato___Early_blight",
            "Tomato___Late_blight",
            "Tomato___Leaf_Mold",
            "Tomato___Septoria_leaf_spot",
            "Tomato___Spider_mites Two-spotted_spider_mite",
            "Tomato___Target_Spot",
            "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
            "Tomato___Tomato_mosaic_virus",
            "Tomato___healthy",
            "Potato___Early_blight",
            "Potato___Late_blight",
            "Potato___healthy"
        ]

    def predict(self, image_bytes: bytes) -> PredictionResponse:
        """
        Simulate prediction on uploaded image.

        Args:
            image_bytes: Raw bytes of the uploaded image

        Returns:
            PredictionResponse with simulated prediction results

        Raises:
            ValueError: If image validation fails
            RuntimeError: If predictor is not initialized
        """
        if not self._is_initialized:
            raise RuntimeError("Mock predictor not initialized. Call initialize() first.")

        # Validate image (same as production)
        is_valid, error_msg = image_preprocessor.validate_image(image_bytes)
        if not is_valid:
            raise ValueError(error_msg)

        # Simulate inference time (realistic: 0.05 - 0.15 seconds)
        start_time = time.time()
        time.sleep(random.uniform(0.05, 0.15))

        # Generate realistic confidence scores
        all_predictions = self._generate_mock_predictions()

        inference_time = time.time() - start_time

        # Get top prediction
        top_prediction = all_predictions[0]

        logger.info(
            f"✓ Mock prediction: {top_prediction.class_name} "
            f"({top_prediction.confidence:.4f}) in {inference_time:.3f}s"
        )

        return PredictionResponse(
            predicted_class=top_prediction.class_name,
            confidence=top_prediction.confidence,
            all_predictions=all_predictions,
            inference_time=round(inference_time, 3)
        )

    def _generate_mock_predictions(self) -> List[ClassPrediction]:
        """
        Generate realistic mock predictions.

        Strategy:
        - Top prediction: High confidence (0.75 - 0.95)
        - Second prediction: Medium confidence (0.05 - 0.15)
        - Remaining: Low confidence (distributed remainder)

        Returns:
            List of ClassPrediction objects sorted by confidence (descending)
        """
        num_classes = len(self.class_labels)

        # Generate random confidences that sum to 1.0
        confidences = []

        # Top prediction: 75-95% confidence
        top_confidence = random.uniform(0.75, 0.95)
        confidences.append(top_confidence)

        # Second prediction: 5-15% of remaining
        remaining = 1.0 - top_confidence
        second_confidence = random.uniform(0.05, 0.15) * remaining
        confidences.append(second_confidence)

        # Distribute rest randomly across remaining classes
        final_remaining = remaining - second_confidence
        for i in range(num_classes - 2):
            if i == num_classes - 3:
                # Last one gets whatever is left
                confidences.append(final_remaining)
            else:
                # Random portion of remaining
                conf = random.uniform(0, final_remaining / (num_classes - i - 2))
                confidences.append(conf)
                final_remaining -= conf

        # Shuffle class order to vary which disease gets top prediction
        indices = list(range(num_classes))
        random.shuffle(indices)

        # Create predictions
        class_predictions = [
            ClassPrediction(
                class_name=self.class_labels[idx],
                confidence=float(confidences[i])
            )
            for i, idx in enumerate(indices)
        ]

        # Sort by confidence (descending)
        class_predictions.sort(key=lambda x: x.confidence, reverse=True)

        return class_predictions

    def is_initialized(self) -> bool:
        """Check if mock predictor is initialized."""
        return self._is_initialized


# Global mock predictor instance
predictor = MockPredictor()
