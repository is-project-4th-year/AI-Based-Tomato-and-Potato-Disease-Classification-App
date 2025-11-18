"""
Mock Image Preprocessor Service

Lightweight validation without numpy/tensorflow dependencies.
Suitable for mock mode testing.
"""

import logging
from io import BytesIO
from typing import Tuple

from PIL import Image

from app.config import settings

logger = logging.getLogger(__name__)


class MockImagePreprocessor:
    """Lightweight image preprocessor for mock mode."""

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

            logger.debug(f"✓ Image validated: format={image.format}, size={image.size}")
        except Exception as e:
            return False, f"Invalid image file: {str(e)}"

        return True, ""


# Global mock preprocessor instance
image_preprocessor = MockImagePreprocessor()
