"""
ML Service Configuration

Loads configuration from environment variables.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    app_name: str = "Plant Disease Detection ML Service"
    app_version: str = "1.0.0"
    env: str = "development"

    # Model Configuration
    model_path: str = "models/MobileNetV2_20251027_200458_final.h5"
    class_labels_path: str = "models/class_labels.json"

    # Image Processing
    max_image_size: int = 10485760  # 10MB
    allowed_extensions: List[str] = ["jpg", "jpeg", "png"]
    image_size: int = 224  # MobileNetV2 input size

    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 1

    # Logging
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
