"""
Inference Script for Plant Disease Classification
Author: Peter Maina (136532)
Project: AI-Based Tomato & Potato Disease Classification

This script handles model inference on single or multiple images.
"""

import os
import sys
import argparse
from pathlib import Path
import tensorflow as tf
from tensorflow import keras
import json

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from ml.utils import (
    load_and_preprocess_image,
    predict_image,
    visualize_prediction,
    get_class_names
)


def predict_single_image(model_path, image_path, visualize=True):
    """
    Predict disease class for a single image.

    Args:
        model_path (str): Path to trained model
        image_path (str): Path to image file
        visualize (bool): Whether to visualize results
    """
    print(f"\n{'='*60}")
    print("Single Image Prediction")
    print(f"{'='*60}")
    print(f"Model: {model_path}")
    print(f"Image: {image_path}")
    print(f"{'='*60}\n")

    # Load model
    print("Loading model...")
    model = keras.models.load_model(model_path)
    print("✓ Model loaded successfully")

    # Get class names
    class_names = get_class_names()

    # Make prediction
    print("\nMaking prediction...")
    predicted_class, confidence, all_predictions = predict_image(
        model, image_path, class_names
    )

    # Display results
    print(f"\n{'='*60}")
    print("Prediction Results")
    print(f"{'='*60}")
    print(f"Predicted Class: {predicted_class}")
    print(f"Confidence: {confidence*100:.2f}%")
    print(f"{'='*60}\n")

    # Show top 5 predictions
    print("Top 5 Predictions:")
    top_indices = all_predictions.argsort()[-5:][::-1]
    for i, idx in enumerate(top_indices, 1):
        print(f"  {i}. {class_names[idx]}: {all_predictions[idx]*100:.2f}%")

    # Visualize if requested
    if visualize:
        visualize_prediction(image_path, predicted_class, confidence)

    return predicted_class, confidence


def predict_batch(model_path, image_dir, output_file=None):
    """
    Predict disease classes for multiple images in a directory.

    Args:
        model_path (str): Path to trained model
        image_dir (str): Directory containing images
        output_file (str): Path to save results (optional)
    """
    print(f"\n{'='*60}")
    print("Batch Prediction")
    print(f"{'='*60}")
    print(f"Model: {model_path}")
    print(f"Image Directory: {image_dir}")
    print(f"{'='*60}\n")

    # Load model
    print("Loading model...")
    model = keras.models.load_model(model_path)
    print("✓ Model loaded successfully")

    # Get class names
    class_names = get_class_names()

    # Get all images
    image_dir = Path(image_dir)
    image_extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
    image_files = []

    for ext in image_extensions:
        image_files.extend(list(image_dir.glob(f"*{ext}")))

    if not image_files:
        print(f"No images found in {image_dir}")
        return

    print(f"Found {len(image_files)} images\n")

    # Make predictions
    results = []

    for i, image_path in enumerate(image_files, 1):
        print(f"Processing {i}/{len(image_files)}: {image_path.name}")

        try:
            predicted_class, confidence, _ = predict_image(
                model, str(image_path), class_names
            )

            result = {
                'image': image_path.name,
                'predicted_class': predicted_class,
                'confidence': float(confidence)
            }
            results.append(result)

            print(f"  → {predicted_class} ({confidence*100:.2f}%)")

        except Exception as e:
            print(f"  ✗ Error: {str(e)}")

    # Print summary
    print(f"\n{'='*60}")
    print("Batch Prediction Summary")
    print(f"{'='*60}")
    print(f"Total Images: {len(image_files)}")
    print(f"Successful Predictions: {len(results)}")
    print(f"Failed Predictions: {len(image_files) - len(results)}")
    print(f"{'='*60}\n")

    # Save results if requested
    if output_file:
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'w') as f:
            json.dump(results, f, indent=4)

        print(f"✓ Results saved to: {output_path}")

    return results


def predict_with_tflite(tflite_model_path, image_path):
    """
    Make prediction using TensorFlow Lite model.

    Args:
        tflite_model_path (str): Path to TFLite model
        image_path (str): Path to image file
    """
    print(f"\n{'='*60}")
    print("TFLite Prediction")
    print(f"{'='*60}")
    print(f"Model: {tflite_model_path}")
    print(f"Image: {image_path}")
    print(f"{'='*60}\n")

    # Load TFLite model
    interpreter = tf.lite.Interpreter(model_path=tflite_model_path)
    interpreter.allocate_tensors()

    # Get input and output details
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    # Preprocess image
    img_array = load_and_preprocess_image(image_path)

    # Set input tensor
    interpreter.set_tensor(input_details[0]['index'], img_array)

    # Run inference
    interpreter.invoke()

    # Get predictions
    predictions = interpreter.get_tensor(output_details[0]['index'])[0]

    # Get class names
    class_names = get_class_names()

    # Get predicted class
    predicted_idx = predictions.argmax()
    predicted_class = class_names[predicted_idx]
    confidence = predictions[predicted_idx]

    # Display results
    print(f"\n{'='*60}")
    print("TFLite Prediction Results")
    print(f"{'='*60}")
    print(f"Predicted Class: {predicted_class}")
    print(f"Confidence: {confidence*100:.2f}%")
    print(f"{'='*60}\n")

    return predicted_class, confidence


def main():
    """Main inference function."""
    parser = argparse.ArgumentParser(description="Plant Disease Classification Inference")
    parser.add_argument(
        '--model',
        type=str,
        required=True,
        help='Path to trained model (.h5 or .tflite)'
    )
    parser.add_argument(
        '--image',
        type=str,
        default=None,
        help='Path to single image for prediction'
    )
    parser.add_argument(
        '--image-dir',
        type=str,
        default=None,
        help='Directory containing images for batch prediction'
    )
    parser.add_argument(
        '--output',
        type=str,
        default=None,
        help='Output file for batch prediction results'
    )
    parser.add_argument(
        '--no-viz',
        action='store_true',
        help='Disable visualization'
    )
    parser.add_argument(
        '--tflite',
        action='store_true',
        help='Use TensorFlow Lite model'
    )

    args = parser.parse_args()

    # Validate inputs
    if not args.image and not args.image_dir:
        print("Error: Please provide either --image or --image-dir")
        return

    # Single image prediction
    if args.image:
        if args.tflite:
            predict_with_tflite(args.model, args.image)
        else:
            predict_single_image(
                args.model,
                args.image,
                visualize=not args.no_viz
            )

    # Batch prediction
    elif args.image_dir:
        if args.tflite:
            print("Batch prediction with TFLite not yet implemented")
        else:
            predict_batch(
                args.model,
                args.image_dir,
                output_file=args.output
            )


if __name__ == "__main__":
    main()
