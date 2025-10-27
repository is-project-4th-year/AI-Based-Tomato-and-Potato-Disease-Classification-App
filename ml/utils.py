"""
Utility Functions for Plant Disease Classification
Author: Peter Maina (136532)
Project: AI-Based Tomato & Potato Disease Classification

This module contains helper functions for ML pipeline.
"""

import os
import json
import yaml
from pathlib import Path
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import tensorflow as tf
from tensorflow import keras


def load_ml_config():
    """Load ML configuration from YAML file."""
    project_root = Path(__file__).parent.parent
    config_path = project_root / "ml" / "config.yaml"
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    return config


def load_class_indices():
    """
    Load class indices mapping.

    Returns:
        dict: Class name to index mapping
    """
    project_root = Path(__file__).parent.parent
    class_indices_path = project_root / "ml" / "class_indices.json"

    if class_indices_path.exists():
        with open(class_indices_path, 'r') as f:
            class_indices = json.load(f)
        return class_indices
    else:
        print("Warning: class_indices.json not found")
        return None


def get_class_names():
    """
    Get list of class names in order.

    Returns:
        list: List of class names
    """
    class_indices = load_class_indices()

    if class_indices:
        # Sort by index value
        sorted_classes = sorted(class_indices.items(), key=lambda x: x[1])
        return [class_name for class_name, _ in sorted_classes]
    else:
        # Fallback to config
        config = load_ml_config()
        return config['class_names']


def plot_training_history(history_dict, save_path=None):
    """
    Plot training history.

    Args:
        history_dict (dict): Training history dictionary
        save_path (str): Path to save plot (optional)
    """
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle('Training History', fontsize=16)

    # Plot accuracy
    if 'accuracy' in history_dict and 'val_accuracy' in history_dict:
        axes[0, 0].plot(history_dict['accuracy'], label='Train Accuracy')
        axes[0, 0].plot(history_dict['val_accuracy'], label='Val Accuracy')
        axes[0, 0].set_title('Model Accuracy')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Accuracy')
        axes[0, 0].legend()
        axes[0, 0].grid(True)

    # Plot loss
    if 'loss' in history_dict and 'val_loss' in history_dict:
        axes[0, 1].plot(history_dict['loss'], label='Train Loss')
        axes[0, 1].plot(history_dict['val_loss'], label='Val Loss')
        axes[0, 1].set_title('Model Loss')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()
        axes[0, 1].grid(True)

    # Plot precision
    if 'precision' in history_dict and 'val_precision' in history_dict:
        axes[1, 0].plot(history_dict['precision'], label='Train Precision')
        axes[1, 0].plot(history_dict['val_precision'], label='Val Precision')
        axes[1, 0].set_title('Model Precision')
        axes[1, 0].set_xlabel('Epoch')
        axes[1, 0].set_ylabel('Precision')
        axes[1, 0].legend()
        axes[1, 0].grid(True)

    # Plot recall
    if 'recall' in history_dict and 'val_recall' in history_dict:
        axes[1, 1].plot(history_dict['recall'], label='Train Recall')
        axes[1, 1].plot(history_dict['val_recall'], label='Val Recall')
        axes[1, 1].set_title('Model Recall')
        axes[1, 1].set_xlabel('Epoch')
        axes[1, 1].set_ylabel('Recall')
        axes[1, 1].legend()
        axes[1, 1].grid(True)

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"✓ Training history plot saved to: {save_path}")

    plt.show()


def plot_confusion_matrix(cm, class_names, save_path=None):
    """
    Plot confusion matrix.

    Args:
        cm (numpy.ndarray): Confusion matrix
        class_names (list): List of class names
        save_path (str): Path to save plot (optional)
    """
    plt.figure(figsize=(15, 12))

    # Normalize confusion matrix
    cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]

    # Plot
    sns.heatmap(
        cm_normalized,
        annot=True,
        fmt='.2f',
        cmap='Blues',
        xticklabels=class_names,
        yticklabels=class_names,
        cbar_kws={'label': 'Percentage'}
    )

    plt.title('Confusion Matrix (Normalized)', fontsize=16, pad=20)
    plt.ylabel('True Label', fontsize=12)
    plt.xlabel('Predicted Label', fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"✓ Confusion matrix saved to: {save_path}")

    plt.show()


def convert_to_tflite(model_path, output_path=None, quantization='float16'):
    """
    Convert Keras model to TensorFlow Lite format for mobile deployment.

    Args:
        model_path (str): Path to Keras model (.h5)
        output_path (str): Output path for TFLite model (optional)
        quantization (str): Quantization method ('float16', 'int8', 'dynamic', None)

    Returns:
        str: Path to saved TFLite model
    """
    print(f"\nConverting model to TensorFlow Lite...")
    print(f"Input: {model_path}")
    print(f"Quantization: {quantization}")

    # Load model
    model = keras.models.load_model(model_path)

    # Create converter
    converter = tf.lite.TFLiteConverter.from_keras_model(model)

    # Set optimization
    if quantization:
        if quantization == 'float16':
            converter.optimizations = [tf.lite.Optimize.DEFAULT]
            converter.target_spec.supported_types = [tf.float16]
        elif quantization == 'int8':
            converter.optimizations = [tf.lite.Optimize.DEFAULT]
            # For full int8 quantization, you need representative dataset
        elif quantization == 'dynamic':
            converter.optimizations = [tf.lite.Optimize.DEFAULT]

    # Convert model
    tflite_model = converter.convert()

    # Save model
    if output_path is None:
        model_path_obj = Path(model_path)
        output_path = model_path_obj.parent / f"{model_path_obj.stem}.tflite"

    with open(output_path, 'wb') as f:
        f.write(tflite_model)

    # Get model sizes
    original_size = os.path.getsize(model_path) / (1024 * 1024)  # MB
    tflite_size = os.path.getsize(output_path) / (1024 * 1024)  # MB

    print(f"\n✓ TFLite conversion completed")
    print(f"  Original model size: {original_size:.2f} MB")
    print(f"  TFLite model size: {tflite_size:.2f} MB")
    print(f"  Size reduction: {(1 - tflite_size/original_size)*100:.1f}%")
    print(f"  Saved to: {output_path}")

    return str(output_path)


def load_and_preprocess_image(image_path, target_size=(224, 224)):
    """
    Load and preprocess a single image for prediction.

    Args:
        image_path (str): Path to image file
        target_size (tuple): Target image size

    Returns:
        numpy.ndarray: Preprocessed image array
    """
    from PIL import Image

    # Load image
    img = Image.open(image_path)

    # Convert to RGB
    if img.mode != 'RGB':
        img = img.convert('RGB')

    # Resize
    img = img.resize(target_size, Image.BILINEAR)

    # Convert to array and normalize
    img_array = np.array(img)
    img_array = img_array.astype(np.float32) / 255.0

    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


def predict_image(model, image_path, class_names=None):
    """
    Predict disease class for a single image.

    Args:
        model: Trained Keras model
        image_path (str): Path to image file
        class_names (list): List of class names (optional)

    Returns:
        tuple: (predicted_class, confidence, all_predictions)
    """
    # Preprocess image
    img_array = load_and_preprocess_image(image_path)

    # Make prediction
    predictions = model.predict(img_array, verbose=0)[0]

    # Get predicted class
    predicted_idx = np.argmax(predictions)
    confidence = predictions[predicted_idx]

    # Get class names
    if class_names is None:
        class_names = get_class_names()

    predicted_class = class_names[predicted_idx] if class_names else f"Class_{predicted_idx}"

    return predicted_class, confidence, predictions


def visualize_prediction(image_path, predicted_class, confidence, top_k=5):
    """
    Visualize prediction results.

    Args:
        image_path (str): Path to image file
        predicted_class (str): Predicted class name
        confidence (float): Prediction confidence
        top_k (int): Number of top predictions to show
    """
    from PIL import Image

    # Load image
    img = Image.open(image_path)

    # Create figure
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))

    # Display image
    ax1.imshow(img)
    ax1.axis('off')
    ax1.set_title(f'Predicted: {predicted_class}\nConfidence: {confidence*100:.2f}%',
                  fontsize=12, fontweight='bold')

    # Display top predictions (if available)
    # This would require all_predictions to be passed
    ax2.text(0.5, 0.5, f'{predicted_class}\n{confidence*100:.2f}%',
             ha='center', va='center', fontsize=16, fontweight='bold')
    ax2.axis('off')

    plt.tight_layout()
    plt.show()


def get_model_size_mb(model_path):
    """
    Get model file size in MB.

    Args:
        model_path (str): Path to model file

    Returns:
        float: Model size in MB
    """
    size_bytes = os.path.getsize(model_path)
    size_mb = size_bytes / (1024 * 1024)
    return size_mb


def count_model_parameters(model):
    """
    Count trainable and non-trainable parameters in model.

    Args:
        model: Keras model

    Returns:
        dict: Dictionary with parameter counts
    """
    trainable_count = sum([tf.size(w).numpy() for w in model.trainable_weights])
    non_trainable_count = sum([tf.size(w).numpy() for w in model.non_trainable_weights])

    return {
        'trainable': trainable_count,
        'non_trainable': non_trainable_count,
        'total': trainable_count + non_trainable_count
    }


# Example usage
if __name__ == "__main__":
    print("ML Utility Functions")
    print("="*60)

    # Test class names loading
    class_names = get_class_names()
    print(f"\nLoaded {len(class_names)} classes:")
    for i, name in enumerate(class_names):
        print(f"  {i}: {name}")
