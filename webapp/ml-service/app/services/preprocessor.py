"""
Image Preprocessor Service

Handles image preprocessing for model inference.
"""

import logging
from io import BytesIO
from typing import Tuple

import numpy as np
from PIL import Image
import tensorflow as tf

from app.config import settings

logger = logging.getLogger(__name__)


class ImagePreprocessor:
    """Handles image preprocessing for ML inference."""

    @staticmethod
    def validate_image(file_content: bytes) -> Tuple[bool, str]:
        """
        Validate uploaded image file.

        Args:
            file_content: Raw bytes of the uploaded file

        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check file size
        if len(file_content) > settings.max_image_size:
            return False, f"Image size exceeds maximum of {settings.max_image_size / 1024 / 1024}MB"

        # Try to open as image
        try:
            image = Image.open(BytesIO(file_content))
            image.verify()  # Verify it's a valid image
        except Exception as e:
            return False, f"Invalid image file: {str(e)}"

        return True, ""

    @staticmethod
    def preprocess_image(file_content: bytes) -> np.ndarray:
        """
        Preprocess image for model inference.

        Preprocessing steps:
        1. Load image from bytes
        2. Convert to RGB (if needed)
        3. Resize to target size (224x224)
        4. Convert to numpy array
        5. Normalize pixel values to [0, 1]
        6. Add batch dimension

        Args:
            file_content: Raw bytes of the uploaded image

        Returns:
            Preprocessed image as numpy array with shape (1, 224, 224, 3)

        Raises:
            ValueError: If image preprocessing fails
        """
        try:
            # Load image
            image = Image.open(BytesIO(file_content))

            # Convert to RGB if needed (handles RGBA, L, etc.)
            if image.mode != 'RGB':
                logger.info(f"Converting image from {image.mode} to RGB")
                image = image.convert('RGB')

            # Resize to target size
            target_size = (settings.image_size, settings.image_size)
            image = image.resize(target_size, Image.LANCZOS)

            # Convert to numpy array
            image_array = np.array(image, dtype=np.float32)

            # Normalize pixel values to [0, 1]
            # MobileNetV2 expects values in range [0, 1]
            image_array = image_array / 255.0

            # Add batch dimension (model expects shape: (batch_size, height, width, channels))
            image_array = np.expand_dims(image_array, axis=0)

            logger.debug(f"Preprocessed image shape: {image_array.shape}")
            logger.debug(f"Pixel value range: [{image_array.min():.3f}, {image_array.max():.3f}]")

            return image_array

        except Exception as e:
            logger.error(f"Image preprocessing failed: {str(e)}")
            raise ValueError(f"Image preprocessing error: {str(e)}")

    @staticmethod
    def preprocess_with_tensorflow(file_content: bytes) -> tf.Tensor:
        """
        Alternative preprocessing using TensorFlow operations.

        This method uses TensorFlow's image processing functions
        which may be more efficient for some operations.

        Args:
            file_content: Raw bytes of the uploaded image

        Returns:
            Preprocessed image as TensorFlow tensor

        Raises:
            ValueError: If image preprocessing fails
        """
        try:
            # Decode image
            image = tf.image.decode_image(file_content, channels=3)

            # Resize
            image = tf.image.resize(
                image,
                [settings.image_size, settings.image_size],
                method='lanczos3'
            )

            # Normalize to [0, 1]
            image = image / 255.0

            # Add batch dimension
            image = tf.expand_dims(image, axis=0)

            return image

        except Exception as e:
            logger.error(f"TensorFlow image preprocessing failed: {str(e)}")
            raise ValueError(f"Image preprocessing error: {str(e)}")


# Global preprocessor instance
image_preprocessor = ImagePreprocessor()
