"""
Training Pipeline for Plant Disease Classification
Author: Peter Maina (136532)
Project: AI-Based Tomato & Potato Disease Classification

This script handles the complete training pipeline.
"""

import os
import sys
import argparse
import yaml
from pathlib import Path
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import (
    ModelCheckpoint, EarlyStopping, ReduceLROnPlateau,
    TensorBoard, CSVLogger
)
import json
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from ml.models import get_model, print_model_summary


def load_config():
    """Load ML configuration from YAML file."""
    config_path = project_root / "ml" / "config.yaml"
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    return config


def setup_gpu(config):
    """
    Setup GPU configuration.

    Args:
        config (dict): ML configuration
    """
    gpus = tf.config.list_physical_devices('GPU')

    if gpus:
        print(f"✓ Found {len(gpus)} GPU(s)")
        try:
            # Enable memory growth
            if config['gpu']['memory_growth']:
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
                print("✓ GPU memory growth enabled")

            # Enable mixed precision
            if config['gpu']['mixed_precision']:
                policy = tf.keras.mixed_precision.Policy('mixed_float16')
                tf.keras.mixed_precision.set_global_policy(policy)
                print("✓ Mixed precision training enabled")

        except RuntimeError as e:
            print(f"GPU setup error: {e}")
    else:
        print("⚠ No GPU found, using CPU")


def create_data_generators(config):
    """
    Create data generators for training and validation.

    Args:
        config (dict): ML configuration

    Returns:
        tuple: (train_generator, val_generator, test_generator)
    """
    print("\nCreating data generators...")

    # Data augmentation for training
    if config['data_augmentation']['enabled']:
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=config['data_augmentation']['rotation_range'],
            width_shift_range=config['data_augmentation']['width_shift_range'],
            height_shift_range=config['data_augmentation']['height_shift_range'],
            shear_range=config['data_augmentation']['shear_range'],
            zoom_range=config['data_augmentation']['zoom_range'],
            horizontal_flip=config['data_augmentation']['horizontal_flip'],
            vertical_flip=config['data_augmentation']['vertical_flip'],
            fill_mode=config['data_augmentation']['fill_mode'],
            brightness_range=config['data_augmentation'].get('brightness_range')
        )
    else:
        train_datagen = ImageDataGenerator(rescale=1./255)

    # Validation and test data (no augmentation, only rescaling)
    val_test_datagen = ImageDataGenerator(rescale=1./255)

    # Get paths
    train_dir = str(project_root / config['paths']['train_dir'])
    val_dir = str(project_root / config['paths']['val_dir'])
    test_dir = str(project_root / config['paths']['test_dir'])

    # Image parameters
    img_height, img_width = config['model']['input_shape'][:2]
    batch_size = config['training']['batch_size']

    # Create generators
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=True
    )

    val_generator = val_test_datagen.flow_from_directory(
        val_dir,
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )

    test_generator = val_test_datagen.flow_from_directory(
        test_dir,
        target_size=(img_height, img_width),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )

    print(f"✓ Training samples: {train_generator.samples}")
    print(f"✓ Validation samples: {val_generator.samples}")
    print(f"✓ Test samples: {test_generator.samples}")
    print(f"✓ Number of classes: {train_generator.num_classes}")

    # Save class indices
    class_indices_path = project_root / "ml" / "class_indices.json"
    with open(class_indices_path, 'w') as f:
        json.dump(train_generator.class_indices, f, indent=4)
    print(f"✓ Class indices saved to: {class_indices_path}")

    return train_generator, val_generator, test_generator


def create_callbacks(config, model_name):
    """
    Create training callbacks.

    Args:
        config (dict): ML configuration
        model_name (str): Name of the model

    Returns:
        list: List of callbacks
    """
    callbacks = []

    # Model checkpoint
    if config['callbacks']['model_checkpoint']['enabled']:
        checkpoint_dir = project_root / config['paths']['checkpoint_dir']
        checkpoint_dir.mkdir(parents=True, exist_ok=True)

        checkpoint_path = checkpoint_dir / f"{model_name}_{{epoch:02d}}_{{val_accuracy:.4f}}.h5"

        checkpoint = ModelCheckpoint(
            filepath=str(checkpoint_path),
            monitor=config['callbacks']['model_checkpoint']['monitor'],
            save_best_only=config['callbacks']['model_checkpoint']['save_best_only'],
            save_weights_only=config['callbacks']['model_checkpoint']['save_weights_only'],
            mode=config['callbacks']['model_checkpoint']['mode'],
            verbose=1
        )
        callbacks.append(checkpoint)
        print(f"✓ Model checkpoint enabled: {checkpoint_dir}")

    # Early stopping
    if config['training']['use_early_stopping']:
        early_stop = EarlyStopping(
            monitor=config['training']['early_stopping']['monitor'],
            patience=config['training']['early_stopping']['patience'],
            restore_best_weights=config['training']['early_stopping']['restore_best_weights'],
            min_delta=config['training']['early_stopping']['min_delta'],
            verbose=1
        )
        callbacks.append(early_stop)
        print("✓ Early stopping enabled")

    # Learning rate scheduler
    if config['training']['use_lr_scheduler']:
        lr_scheduler = ReduceLROnPlateau(
            monitor=config['training']['lr_scheduler']['monitor'],
            factor=config['training']['lr_scheduler']['factor'],
            patience=config['training']['lr_scheduler']['patience'],
            min_lr=config['training']['lr_scheduler']['min_lr'],
            verbose=1
        )
        callbacks.append(lr_scheduler)
        print("✓ Learning rate scheduler enabled")

    # TensorBoard
    if config['callbacks']['tensorboard']['enabled']:
        log_dir = project_root / config['callbacks']['tensorboard']['log_dir']
        log_dir = log_dir / datetime.now().strftime("%Y%m%d-%H%M%S")
        log_dir.mkdir(parents=True, exist_ok=True)

        tensorboard = TensorBoard(
            log_dir=str(log_dir),
            histogram_freq=config['callbacks']['tensorboard']['histogram_freq'],
            write_graph=config['callbacks']['tensorboard']['write_graph'],
            write_images=config['callbacks']['tensorboard']['write_images']
        )
        callbacks.append(tensorboard)
        print(f"✓ TensorBoard enabled: {log_dir}")

    # CSV Logger
    if config['callbacks']['csv_logger']['enabled']:
        csv_log_path = project_root / config['callbacks']['csv_logger']['filename']
        csv_log_path.parent.mkdir(parents=True, exist_ok=True)

        csv_logger = CSVLogger(
            str(csv_log_path),
            append=config['callbacks']['csv_logger']['append']
        )
        callbacks.append(csv_logger)
        print(f"✓ CSV logger enabled: {csv_log_path}")

    return callbacks


def compile_model(model, config):
    """
    Compile the model with optimizer, loss, and metrics.

    Args:
        model (keras.Model): Model to compile
        config (dict): ML configuration
    """
    # Get optimizer
    optimizer_name = config['training']['optimizer'].lower()
    learning_rate = config['training']['learning_rate']

    if optimizer_name == 'adam':
        optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
    elif optimizer_name == 'sgd':
        optimizer = keras.optimizers.SGD(learning_rate=learning_rate, momentum=0.9)
    elif optimizer_name == 'rmsprop':
        optimizer = keras.optimizers.RMSprop(learning_rate=learning_rate)
    else:
        optimizer = keras.optimizers.Adam(learning_rate=learning_rate)

    # Get metrics
    metrics = []
    for metric_name in config['metrics']:
        metric_name = metric_name.lower()
        if metric_name == 'accuracy':
            metrics.append('accuracy')
        elif metric_name == 'precision':
            metrics.append(keras.metrics.Precision(name='precision'))
        elif metric_name == 'recall':
            metrics.append(keras.metrics.Recall(name='recall'))
        elif metric_name == 'auc':
            metrics.append(keras.metrics.AUC(name='auc'))

    # Compile model
    model.compile(
        optimizer=optimizer,
        loss=config['training']['loss_function'],
        metrics=metrics
    )

    print(f"✓ Model compiled with {optimizer_name} optimizer")


def train_model(model, train_gen, val_gen, config, callbacks, model_name):
    """
    Train the model.

    Args:
        model (keras.Model): Model to train
        train_gen: Training data generator
        val_gen: Validation data generator
        config (dict): ML configuration
        callbacks (list): Training callbacks
        model_name (str): Name of the model

    Returns:
        keras.callbacks.History: Training history
    """
    print(f"\n{'='*60}")
    print("Starting Training")
    print(f"{'='*60}\n")

    epochs = config['training']['epochs']

    # Train model
    history = model.fit(
        train_gen,
        epochs=epochs,
        validation_data=val_gen,
        callbacks=callbacks,
        verbose=1
    )

    print(f"\n{'='*60}")
    print("Training Completed")
    print(f"{'='*60}\n")

    return history


def save_final_model(model, config, model_name):
    """
    Save the final trained model.

    Args:
        model (keras.Model): Trained model
        config (dict): ML configuration
        model_name (str): Name of the model
    """
    # Save directory
    save_dir = project_root / config['paths']['model_save_dir']
    save_dir.mkdir(parents=True, exist_ok=True)

    # Save model
    model_path = save_dir / f"{model_name}_final.h5"
    model.save(str(model_path), include_optimizer=config['export']['include_optimizer'])

    print(f"\n✓ Final model saved to: {model_path}")

    # Save model architecture as JSON
    json_path = save_dir / f"{model_name}_architecture.json"
    with open(json_path, 'w') as f:
        f.write(model.to_json())
    print(f"✓ Model architecture saved to: {json_path}")


def save_training_history(history, model_name):
    """
    Save training history to file.

    Args:
        history (keras.callbacks.History): Training history
        model_name (str): Name of the model
    """
    history_path = project_root / "ml" / "logs" / "training" / f"{model_name}_history.json"
    history_path.parent.mkdir(parents=True, exist_ok=True)

    # Convert history to dict
    history_dict = {key: [float(val) for val in values]
                   for key, values in history.history.items()}

    with open(history_path, 'w') as f:
        json.dump(history_dict, f, indent=4)

    print(f"✓ Training history saved to: {history_path}")


def main():
    """Main training function."""
    parser = argparse.ArgumentParser(description="Train Plant Disease Classification Model")
    parser.add_argument(
        '--architecture',
        type=str,
        default=None,
        help='Model architecture (baseline, MobileNetV2, EfficientNetB0)'
    )
    parser.add_argument(
        '--epochs',
        type=int,
        default=None,
        help='Number of training epochs'
    )
    parser.add_argument(
        '--batch-size',
        type=int,
        default=None,
        help='Batch size for training'
    )
    parser.add_argument(
        '--use-gpu',
        action='store_true',
        help='Force GPU usage'
    )

    args = parser.parse_args()

    # Load configuration
    config = load_config()

    # Override config with command line arguments
    if args.architecture:
        config['model']['architecture'] = args.architecture
    if args.epochs:
        config['training']['epochs'] = args.epochs
    if args.batch_size:
        config['training']['batch_size'] = args.batch_size
    if args.use_gpu:
        config['gpu']['use_gpu'] = True

    print(f"\n{'='*60}")
    print("Plant Disease Classification - Training Pipeline")
    print(f"{'='*60}")
    print(f"Architecture: {config['model']['architecture']}")
    print(f"Epochs: {config['training']['epochs']}")
    print(f"Batch Size: {config['training']['batch_size']}")
    print(f"Learning Rate: {config['training']['learning_rate']}")
    print(f"{'='*60}\n")

    # Setup GPU
    if config['gpu']['use_gpu']:
        setup_gpu(config)

    # Create data generators
    train_gen, val_gen, test_gen = create_data_generators(config)

    # Create model
    print("\nCreating model...")
    model = get_model(
        architecture=config['model']['architecture'],
        input_shape=tuple(config['model']['input_shape']),
        num_classes=config['model']['num_classes'],
        use_pretrained=config['model']['use_pretrained'],
        freeze_base=config['model']['freeze_base_model'],
        fine_tune_layers=config['model']['fine_tune_layers']
    )

    # Print model summary
    print_model_summary(model)

    # Compile model
    compile_model(model, config)

    # Create callbacks
    model_name = f"{config['model']['architecture']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    callbacks = create_callbacks(config, model_name)

    # Train model
    history = train_model(model, train_gen, val_gen, config, callbacks, model_name)

    # Save final model
    save_final_model(model, config, model_name)

    # Save training history
    save_training_history(history, model_name)

    print(f"\n{'='*60}")
    print("✓ Training pipeline completed successfully!")
    print(f"{'='*60}\n")
    print("Next steps:")
    print(f"  1. Evaluate model: python ml/evaluation.py --model {model_name}_final.h5")
    print(f"  2. View TensorBoard: tensorboard --logdir ml/logs/tensorboard")


if __name__ == "__main__":
    main()
