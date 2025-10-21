"""
Model Evaluation Script
Author: Peter Maina (136532)
Project: AI-Based Tomato & Potato Disease Classification

This script evaluates trained models on test dataset.
"""

import os
import sys
import argparse
from pathlib import Path
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)
import json

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from ml.utils import (
    load_ml_config,
    get_class_names,
    plot_confusion_matrix,
    get_model_size_mb,
    count_model_parameters
)


def create_test_generator(config):
    """
    Create test data generator.

    Args:
        config (dict): ML configuration

    Returns:
        ImageDataGenerator: Test data generator
    """
    test_datagen = ImageDataGenerator(rescale=1./255)

    test_dir = str(project_root / config['paths']['test_dir'])
    img_height, img_width = config['model']['input_shape'][:2]
    batch_size = config['evaluation']['batch_size']

    test_generator = test_datagen.flow_from_directory(
        test_dir,
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False  # Important for evaluation
    )

    return test_generator


def evaluate_model(model_path, config):
    """
    Evaluate model on test dataset.

    Args:
        model_path (str): Path to trained model
        config (dict): ML configuration

    Returns:
        dict: Evaluation results
    """
    print(f"\n{'='*60}")
    print("Model Evaluation")
    print(f"{'='*60}")
    print(f"Model: {model_path}")
    print(f"{'='*60}\n")

    # Load model
    print("Loading model...")
    model = keras.models.load_model(model_path)
    print("✓ Model loaded successfully")

    # Get model info
    model_size = get_model_size_mb(model_path)
    param_counts = count_model_parameters(model)

    print(f"\nModel Information:")
    print(f"  Size: {model_size:.2f} MB")
    print(f"  Total Parameters: {param_counts['total']:,}")
    print(f"  Trainable Parameters: {param_counts['trainable']:,}")
    print(f"  Non-trainable Parameters: {param_counts['non_trainable']:,}")

    # Create test generator
    print("\nCreating test data generator...")
    test_gen = create_test_generator(config)
    print(f"✓ Test samples: {test_gen.samples}")

    # Evaluate model
    print("\nEvaluating model on test set...")
    test_loss, test_accuracy = model.evaluate(test_gen, verbose=1)[:2]

    print(f"\n{'='*60}")
    print("Basic Metrics")
    print(f"{'='*60}")
    print(f"Test Loss: {test_loss:.4f}")
    print(f"Test Accuracy: {test_accuracy*100:.2f}%")
    print(f"{'='*60}\n")

    # Get predictions
    print("Generating predictions...")
    predictions = model.predict(test_gen, verbose=1)
    predicted_classes = np.argmax(predictions, axis=1)

    # Get true labels
    true_classes = test_gen.classes

    # Get class names
    class_names = get_class_names()

    # Compute detailed metrics
    print("\nComputing detailed metrics...")

    # Overall metrics
    accuracy = accuracy_score(true_classes, predicted_classes)
    precision = precision_score(true_classes, predicted_classes, average='weighted')
    recall = recall_score(true_classes, predicted_classes, average='weighted')
    f1 = f1_score(true_classes, predicted_classes, average='weighted')

    print(f"\n{'='*60}")
    print("Detailed Metrics")
    print(f"{'='*60}")
    print(f"Accuracy: {accuracy*100:.2f}%")
    print(f"Precision (weighted): {precision*100:.2f}%")
    print(f"Recall (weighted): {recall*100:.2f}%")
    print(f"F1-Score (weighted): {f1*100:.2f}%")
    print(f"{'='*60}\n")

    # Classification report
    if config['evaluation']['generate_classification_report']:
        print("\nClassification Report:")
        print("="*60)
        report = classification_report(
            true_classes,
            predicted_classes,
            target_names=class_names,
            digits=4
        )
        print(report)

    # Confusion matrix
    cm = None
    if config['evaluation']['generate_confusion_matrix']:
        print("\nGenerating confusion matrix...")
        cm = confusion_matrix(true_classes, predicted_classes)

        # Save confusion matrix plot
        cm_plot_path = project_root / "ml" / "logs" / "confusion_matrix.png"
        cm_plot_path.parent.mkdir(parents=True, exist_ok=True)
        plot_confusion_matrix(cm, class_names, save_path=str(cm_plot_path))

    # Compile results
    results = {
        'model_path': model_path,
        'model_size_mb': model_size,
        'parameters': param_counts,
        'test_samples': int(test_gen.samples),
        'metrics': {
            'test_loss': float(test_loss),
            'test_accuracy': float(test_accuracy),
            'accuracy': float(accuracy),
            'precision': float(precision),
            'recall': float(recall),
            'f1_score': float(f1)
        },
        'per_class_metrics': classification_report(
            true_classes,
            predicted_classes,
            target_names=class_names,
            output_dict=True
        )
    }

    # Save predictions if requested
    if config['evaluation']['save_predictions']:
        predictions_file = project_root / "ml" / "logs" / "predictions.json"
        predictions_file.parent.mkdir(parents=True, exist_ok=True)

        pred_data = []
        for i in range(len(true_classes)):
            pred_data.append({
                'true_class': class_names[true_classes[i]],
                'predicted_class': class_names[predicted_classes[i]],
                'confidence': float(predictions[i][predicted_classes[i]]),
                'correct': bool(true_classes[i] == predicted_classes[i])
            })

        with open(predictions_file, 'w') as f:
            json.dump(pred_data, f, indent=4)

        print(f"✓ Predictions saved to: {predictions_file}")

    return results


def save_evaluation_report(results, output_path):
    """
    Save evaluation report to file.

    Args:
        results (dict): Evaluation results
        output_path (str): Output file path
    """
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Save as JSON
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=4)

    print(f"✓ Evaluation report saved to: {output_path}")

    # Also save as text
    text_path = output_path.with_suffix('.txt')
    with open(text_path, 'w') as f:
        f.write("="*60 + "\n")
        f.write("Model Evaluation Report\n")
        f.write("="*60 + "\n\n")

        f.write(f"Model: {results['model_path']}\n")
        f.write(f"Model Size: {results['model_size_mb']:.2f} MB\n")
        f.write(f"Total Parameters: {results['parameters']['total']:,}\n")
        f.write(f"Test Samples: {results['test_samples']}\n\n")

        f.write("="*60 + "\n")
        f.write("Performance Metrics\n")
        f.write("="*60 + "\n")
        f.write(f"Test Loss: {results['metrics']['test_loss']:.4f}\n")
        f.write(f"Test Accuracy: {results['metrics']['test_accuracy']*100:.2f}%\n")
        f.write(f"Precision: {results['metrics']['precision']*100:.2f}%\n")
        f.write(f"Recall: {results['metrics']['recall']*100:.2f}%\n")
        f.write(f"F1-Score: {results['metrics']['f1_score']*100:.2f}%\n\n")

        f.write("="*60 + "\n")
        f.write("Per-Class Metrics\n")
        f.write("="*60 + "\n\n")

        for class_name, metrics in results['per_class_metrics'].items():
            if class_name not in ['accuracy', 'macro avg', 'weighted avg']:
                f.write(f"{class_name}:\n")
                if isinstance(metrics, dict):
                    f.write(f"  Precision: {metrics.get('precision', 0)*100:.2f}%\n")
                    f.write(f"  Recall: {metrics.get('recall', 0)*100:.2f}%\n")
                    f.write(f"  F1-Score: {metrics.get('f1-score', 0)*100:.2f}%\n")
                    f.write(f"  Support: {metrics.get('support', 0)}\n\n")

    print(f"✓ Text report saved to: {text_path}")


def main():
    """Main evaluation function."""
    parser = argparse.ArgumentParser(description="Evaluate Plant Disease Classification Model")
    parser.add_argument(
        '--model',
        type=str,
        required=True,
        help='Path to trained model (.h5)'
    )
    parser.add_argument(
        '--output',
        type=str,
        default=None,
        help='Output path for evaluation report'
    )

    args = parser.parse_args()

    # Load configuration
    config = load_ml_config()

    # Evaluate model
    results = evaluate_model(args.model, config)

    # Save report
    if args.output:
        output_path = args.output
    else:
        model_name = Path(args.model).stem
        output_path = project_root / "ml" / "logs" / f"{model_name}_evaluation.json"

    save_evaluation_report(results, str(output_path))

    print(f"\n{'='*60}")
    print("✓ Evaluation completed successfully!")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
