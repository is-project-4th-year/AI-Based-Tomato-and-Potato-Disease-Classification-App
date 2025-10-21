"""
Dataset Splitting Script
Author: Peter Maina (136532)
Project: AI-Based Tomato & Potato Disease Classification

This script splits the dataset into train, validation, and test sets.
"""

import os
import sys
import argparse
import yaml
from pathlib import Path
import shutil
import random
from collections import defaultdict

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))


def load_config():
    """Load data configuration from YAML file."""
    config_path = project_root / "data" / "configs" / "data_config.yaml"
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    return config


def split_class_data(class_images, train_ratio, val_ratio, test_ratio, random_seed=42):
    """
    Split images from a single class into train, val, test sets.

    Args:
        class_images (list): List of image paths
        train_ratio (float): Training set ratio
        val_ratio (float): Validation set ratio
        test_ratio (float): Test set ratio
        random_seed (int): Random seed for reproducibility

    Returns:
        tuple: (train_images, val_images, test_images)
    """
    # Shuffle images
    random.seed(random_seed)
    shuffled_images = class_images.copy()
    random.shuffle(shuffled_images)

    # Calculate split indices
    total = len(shuffled_images)
    train_end = int(total * train_ratio)
    val_end = train_end + int(total * val_ratio)

    # Split
    train_images = shuffled_images[:train_end]
    val_images = shuffled_images[train_end:val_end]
    test_images = shuffled_images[val_end:]

    return train_images, val_images, test_images


def copy_images(image_list, dest_dir):
    """
    Copy images to destination directory.

    Args:
        image_list (list): List of image paths
        dest_dir (Path): Destination directory
    """
    dest_dir.mkdir(parents=True, exist_ok=True)

    for img_path in image_list:
        dest_path = dest_dir / img_path.name
        shutil.copy2(img_path, dest_path)


def split_dataset(processed_dir, config):
    """
    Split dataset into train, validation, and test sets.

    Args:
        processed_dir (Path): Processed data directory
        config (dict): Data configuration
    """
    print(f"\n{'='*60}")
    print("Dataset Splitting Pipeline")
    print(f"{'='*60}")
    print(f"Input Directory: {processed_dir}")
    print(f"Train Ratio: {config['split']['train']}")
    print(f"Validation Ratio: {config['split']['validation']}")
    print(f"Test Ratio: {config['split']['test']}")
    print(f"Stratified: {config['split']['stratified']}")
    print(f"Random Seed: {config['split']['random_seed']}")
    print(f"{'='*60}\n")

    # Get split ratios
    train_ratio = config['split']['train']
    val_ratio = config['split']['validation']
    test_ratio = config['split']['test']
    random_seed = config['split']['random_seed']

    # Create output directories
    train_dir = project_root / config['paths']['train']
    val_dir = project_root / config['paths']['validation']
    test_dir = project_root / config['paths']['test']

    for dir_path in [train_dir, val_dir, test_dir]:
        dir_path.mkdir(parents=True, exist_ok=True)

    # Process each crop type
    crop_dirs = ['tomato', 'potato']

    split_statistics = defaultdict(lambda: {'train': 0, 'val': 0, 'test': 0})

    for crop in crop_dirs:
        crop_dir = processed_dir / crop

        if not crop_dir.exists():
            print(f"Warning: {crop_dir} not found, skipping...")
            continue

        print(f"\nSplitting {crop.upper()} dataset...")

        # Process each class
        for class_dir in sorted(crop_dir.iterdir()):
            if not class_dir.is_dir():
                continue

            class_name = class_dir.name
            print(f"\n  Processing {class_name}...")

            # Get all images
            image_files = []
            for ext in config['validation']['allowed_extensions']:
                image_files.extend(list(class_dir.glob(f"*{ext}")))
                image_files.extend(list(class_dir.glob(f"*{ext.upper()}")))

            total_images = len(image_files)

            if total_images == 0:
                print(f"    Warning: No images found in {class_name}")
                continue

            # Split images
            train_images, val_images, test_images = split_class_data(
                image_files,
                train_ratio,
                val_ratio,
                test_ratio,
                random_seed
            )

            # Copy to respective directories
            train_class_dir = train_dir / class_name
            val_class_dir = val_dir / class_name
            test_class_dir = test_dir / class_name

            copy_images(train_images, train_class_dir)
            copy_images(val_images, val_class_dir)
            copy_images(test_images, test_class_dir)

            # Update statistics
            split_statistics[class_name]['train'] = len(train_images)
            split_statistics[class_name]['val'] = len(val_images)
            split_statistics[class_name]['test'] = len(test_images)

            print(f"    Total: {total_images}")
            print(f"    Train: {len(train_images)} ({len(train_images)/total_images*100:.1f}%)")
            print(f"    Val: {len(val_images)} ({len(val_images)/total_images*100:.1f}%)")
            print(f"    Test: {len(test_images)} ({len(test_images)/total_images*100:.1f}%)")

    # Print summary
    print(f"\n{'='*60}")
    print("Dataset Split Summary")
    print(f"{'='*60}\n")

    total_train = sum(stats['train'] for stats in split_statistics.values())
    total_val = sum(stats['val'] for stats in split_statistics.values())
    total_test = sum(stats['test'] for stats in split_statistics.values())
    total_all = total_train + total_val + total_test

    print(f"Training Set: {total_train} images ({total_train/total_all*100:.1f}%)")
    print(f"Validation Set: {total_val} images ({total_val/total_all*100:.1f}%)")
    print(f"Test Set: {total_test} images ({total_test/total_all*100:.1f}%)")
    print(f"Total: {total_all} images\n")

    # Save statistics to file
    save_split_statistics(split_statistics, config)


def save_split_statistics(statistics, config):
    """
    Save split statistics to file.

    Args:
        statistics (dict): Split statistics
        config (dict): Data configuration
    """
    report_path = project_root / "data" / "processed" / "split_report.txt"

    with open(report_path, 'w') as f:
        f.write("="*60 + "\n")
        f.write("Dataset Split Report\n")
        f.write("="*60 + "\n\n")

        f.write("Configuration:\n")
        f.write(f"  Train Ratio: {config['split']['train']}\n")
        f.write(f"  Validation Ratio: {config['split']['validation']}\n")
        f.write(f"  Test Ratio: {config['split']['test']}\n")
        f.write(f"  Random Seed: {config['split']['random_seed']}\n\n")

        f.write("="*60 + "\n")
        f.write("Class Distribution\n")
        f.write("="*60 + "\n\n")

        # Write statistics for each class
        total_train = 0
        total_val = 0
        total_test = 0

        for class_name in sorted(statistics.keys()):
            stats = statistics[class_name]
            total = stats['train'] + stats['val'] + stats['test']

            f.write(f"{class_name}:\n")
            f.write(f"  Total: {total}\n")
            f.write(f"  Train: {stats['train']} ({stats['train']/total*100:.1f}%)\n")
            f.write(f"  Val: {stats['val']} ({stats['val']/total*100:.1f}%)\n")
            f.write(f"  Test: {stats['test']} ({stats['test']/total*100:.1f}%)\n\n")

            total_train += stats['train']
            total_val += stats['val']
            total_test += stats['test']

        total_all = total_train + total_val + total_test

        f.write("="*60 + "\n")
        f.write("Overall Summary\n")
        f.write("="*60 + "\n\n")
        f.write(f"Training Set: {total_train} images ({total_train/total_all*100:.1f}%)\n")
        f.write(f"Validation Set: {total_val} images ({total_val/total_all*100:.1f}%)\n")
        f.write(f"Test Set: {total_test} images ({total_test/total_all*100:.1f}%)\n")
        f.write(f"Total: {total_all} images\n")

    print(f"✓ Split report saved to: {report_path}")


def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(description="Split Dataset into Train/Val/Test")
    parser.add_argument(
        '--processed-dir',
        type=str,
        default=None,
        help='Processed data directory (default: data/processed)'
    )

    args = parser.parse_args()

    # Load configuration
    config = load_config()

    # Setup directory
    if args.processed_dir:
        processed_dir = Path(args.processed_dir)
    else:
        processed_dir = project_root / "data" / "processed"

    # Split dataset
    split_dataset(processed_dir, config)

    print(f"\n{'='*60}")
    print("✓ Dataset splitting completed successfully!")
    print(f"{'='*60}\n")
    print("Next steps:")
    print("  1. Explore data: jupyter notebook ml/notebooks/data_exploration.ipynb")
    print("  2. Train model: python ml/training.py")


if __name__ == "__main__":
    main()
