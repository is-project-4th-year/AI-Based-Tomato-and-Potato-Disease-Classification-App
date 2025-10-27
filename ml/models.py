"""
Model Architectures for Plant Disease Classification
Author: Peter Maina (136532)
Project: AI-Based Tomato & Potato Disease Classification

This module contains CNN model architectures:
1. Baseline CNN (custom architecture)
2. MobileNetV2 (transfer learning)
3. EfficientNetB0 (state-of-the-art)
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2, EfficientNetB0


def create_baseline_cnn(input_shape=(224, 224, 3), num_classes=13):
    """
    Create a baseline CNN model from scratch.

    This is a custom CNN architecture good for understanding fundamentals
    and establishing a baseline performance.

    Args:
        input_shape (tuple): Input image shape (height, width, channels)
        num_classes (int): Number of output classes

    Returns:
        keras.Model: Compiled baseline CNN model
    """
    model = models.Sequential([
        # Input layer
        layers.Input(shape=input_shape),

        # First convolutional block
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.2),

        # Second convolutional block
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.2),

        # Third convolutional block
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.3),

        # Fourth convolutional block
        layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.3),

        # Fifth convolutional block
        layers.Conv2D(512, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.4),

        # Flatten and dense layers
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),

        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),

        # Output layer
        layers.Dense(num_classes, activation='softmax')
    ], name='baseline_cnn')

    return model


def create_mobilenetv2_model(input_shape=(224, 224, 3), num_classes=13,
                              use_pretrained=True, freeze_base=True,
                              fine_tune_layers=20):
    """
    Create a MobileNetV2-based model with transfer learning.

    MobileNetV2 is optimized for mobile devices with good accuracy
    and fast inference speed.

    Args:
        input_shape (tuple): Input image shape
        num_classes (int): Number of output classes
        use_pretrained (bool): Use ImageNet pretrained weights
        freeze_base (bool): Freeze base model layers initially
        fine_tune_layers (int): Number of layers to unfreeze for fine-tuning

    Returns:
        keras.Model: MobileNetV2-based model
    """
    # Load base model
    weights = 'imagenet' if use_pretrained else None

    base_model = MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights=weights
    )

    # Freeze base model if requested
    if freeze_base and use_pretrained:
        base_model.trainable = False
    elif use_pretrained and fine_tune_layers > 0:
        # Fine-tuning: freeze all layers except the last few
        base_model.trainable = True
        for layer in base_model.layers[:-fine_tune_layers]:
            layer.trainable = False

    # Build model
    inputs = keras.Input(shape=input_shape)

    # Data augmentation (can be added here if needed)
    x = inputs

    # Base model
    x = base_model(x, training=False if freeze_base else True)

    # Classification head
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.5)(x)

    x = layers.Dense(512, activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.5)(x)

    x = layers.Dense(256, activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.3)(x)

    # Output layer
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    model = keras.Model(inputs, outputs, name='mobilenetv2_plant_disease')

    return model


def create_efficientnetb0_model(input_shape=(224, 224, 3), num_classes=13,
                                 use_pretrained=True, freeze_base=True,
                                 fine_tune_layers=20):
    """
    Create an EfficientNetB0-based model with transfer learning.

    EfficientNetB0 provides state-of-the-art accuracy with good efficiency.

    Args:
        input_shape (tuple): Input image shape
        num_classes (int): Number of output classes
        use_pretrained (bool): Use ImageNet pretrained weights
        freeze_base (bool): Freeze base model layers initially
        fine_tune_layers (int): Number of layers to unfreeze for fine-tuning

    Returns:
        keras.Model: EfficientNetB0-based model
    """
    # Load base model
    weights = 'imagenet' if use_pretrained else None

    base_model = EfficientNetB0(
        input_shape=input_shape,
        include_top=False,
        weights=weights
    )

    # Freeze base model if requested
    if freeze_base and use_pretrained:
        base_model.trainable = False
    elif use_pretrained and fine_tune_layers > 0:
        # Fine-tuning: freeze all layers except the last few
        base_model.trainable = True
        for layer in base_model.layers[:-fine_tune_layers]:
            layer.trainable = False

    # Build model
    inputs = keras.Input(shape=input_shape)

    # Data augmentation (can be added here if needed)
    x = inputs

    # Base model
    x = base_model(x, training=False if freeze_base else True)

    # Classification head
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.5)(x)

    x = layers.Dense(512, activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.5)(x)

    x = layers.Dense(256, activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.3)(x)

    # Output layer
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    model = keras.Model(inputs, outputs, name='efficientnetb0_plant_disease')

    return model


def get_model(architecture='MobileNetV2', **kwargs):
    """
    Factory function to get a model by architecture name.

    Args:
        architecture (str): Model architecture name
            Options: 'baseline', 'MobileNetV2', 'EfficientNetB0'
        **kwargs: Additional arguments for model creation

    Returns:
        keras.Model: Requested model

    Raises:
        ValueError: If architecture is not supported
    """
    architecture = architecture.lower()

    if architecture == 'baseline':
        return create_baseline_cnn(**kwargs)
    elif architecture == 'mobilenetv2':
        return create_mobilenetv2_model(**kwargs)
    elif architecture == 'efficientnetb0':
        return create_efficientnetb0_model(**kwargs)
    else:
        raise ValueError(f"Unknown architecture: {architecture}. "
                        f"Choose from: baseline, MobileNetV2, EfficientNetB0")


def print_model_summary(model, show_plots=False):
    """
    Print model summary and optionally plot architecture.

    Args:
        model (keras.Model): Model to summarize
        show_plots (bool): Whether to plot model architecture
    """
    print("\n" + "="*60)
    print("Model Summary")
    print("="*60 + "\n")

    model.summary()

    # Count trainable and non-trainable parameters
    trainable_count = sum([tf.size(w).numpy() for w in model.trainable_weights])
    non_trainable_count = sum([tf.size(w).numpy() for w in model.non_trainable_weights])

    print("\n" + "="*60)
    print("Parameter Summary")
    print("="*60)
    print(f"Trainable parameters: {trainable_count:,}")
    print(f"Non-trainable parameters: {non_trainable_count:,}")
    print(f"Total parameters: {trainable_count + non_trainable_count:,}")
    print("="*60 + "\n")

    if show_plots:
        try:
            keras.utils.plot_model(
                model,
                to_file=f'{model.name}_architecture.png',
                show_shapes=True,
                show_layer_names=True,
                rankdir='TB',
                expand_nested=True,
                dpi=96
            )
            print(f"✓ Model architecture plot saved to: {model.name}_architecture.png")
        except Exception as e:
            print(f"Could not generate model plot: {str(e)}")


# Example usage
if __name__ == "__main__":
    print("Testing Model Architectures\n")

    # Test baseline CNN
    print("\n1. Baseline CNN")
    print("-" * 40)
    baseline_model = create_baseline_cnn()
    print_model_summary(baseline_model)

    # Test MobileNetV2
    print("\n2. MobileNetV2 (Transfer Learning)")
    print("-" * 40)
    mobilenet_model = create_mobilenetv2_model(use_pretrained=False)  # Set to False for testing without download
    print_model_summary(mobilenet_model)

    # Test EfficientNetB0
    print("\n3. EfficientNetB0 (Transfer Learning)")
    print("-" * 40)
    efficientnet_model = create_efficientnetb0_model(use_pretrained=False)  # Set to False for testing without download
    print_model_summary(efficientnet_model)

    print("\n✓ All model architectures created successfully!")
