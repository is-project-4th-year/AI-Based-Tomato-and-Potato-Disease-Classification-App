"""
Model Loader Service

Handles loading and caching of the TensorFlow model.
"""

import json
import logging
from pathlib import Path
from typing import List, Optional

import tensorflow as tf

from app.config import settings

logger = logging.getLogger(__name__)


class ModelLoader:
    """Singleton class for loading and caching the ML model."""

    _instance: Optional['ModelLoader'] = None
    _model: Optional[tf.keras.Model] = None
    _class_labels: Optional[List[str]] = None

    def __new__(cls):
        """Ensure only one instance exists (Singleton pattern)."""
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
        return cls._instance

    def load_model(self) -> tf.keras.Model:
        """
        Load the TensorFlow model from disk.

        Returns:
            Loaded TensorFlow Keras model

        Raises:
            FileNotFoundError: If model file doesn't exist
            Exception: If model loading fails
        """
        if self._model is not None:
            logger.info("Model already loaded, returning cached instance")
            return self._model

        model_path = Path(settings.model_path)

        if not model_path.exists():
            error_msg = (
                f"Model file not found at {model_path}. "
                f"Please download the model and place it in the models/ directory. "
                f"See models/README.md for instructions."
            )
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        try:
            logger.info(f"Loading model from {model_path}")
            self._model = tf.keras.models.load_model(str(model_path))
            logger.info(f"Model loaded successfully. Input shape: {self._model.input_shape}")
            return self._model

        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise Exception(f"Model loading error: {str(e)}")

    def load_class_labels(self) -> List[str]:
        """
        Load class labels from JSON file.

        Returns:
            List of class labels

        Raises:
            FileNotFoundError: If labels file doesn't exist
            json.JSONDecodeError: If labels file is invalid JSON
        """
        if self._class_labels is not None:
            return self._class_labels

        labels_path = Path(settings.class_labels_path)

        if not labels_path.exists():
            raise FileNotFoundError(f"Class labels file not found at {labels_path}")

        try:
            with open(labels_path, 'r') as f:
                self._class_labels = json.load(f)
            logger.info(f"Loaded {len(self._class_labels)} class labels")
            return self._class_labels

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in class labels file: {str(e)}")
            raise

    def get_model(self) -> Optional[tf.keras.Model]:
        """Get the cached model (if loaded)."""
        return self._model

    def get_class_labels(self) -> Optional[List[str]]:
        """Get the cached class labels (if loaded)."""
        return self._class_labels

    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self._model is not None and self._class_labels is not None

    def get_model_info(self) -> dict:
        """
        Get information about the loaded model.

        Returns:
            Dictionary with model information

        Raises:
            RuntimeError: If model is not loaded
        """
        if not self.is_loaded():
            raise RuntimeError("Model not loaded. Call load_model() first.")

        return {
            "model_name": "MobileNetV2",
            "model_version": "20251027_200458_final",
            "num_classes": len(self._class_labels),
            "classes": self._class_labels,
            "input_shape": list(self._model.input_shape[1:])  # Exclude batch dimension
        }


# Global model loader instance
model_loader = ModelLoader()
