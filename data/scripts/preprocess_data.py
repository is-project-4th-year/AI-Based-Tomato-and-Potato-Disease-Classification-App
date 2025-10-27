"""
Data Preprocessing Script
Author: Peter Maina (136532)
Project: AI-Based Tomato & Potato Disease Classification

This script preprocesses images for model training.
"""

import os
import sys
import argparse
import yaml
from pathlib import Path
from PIL import Image
import numpy as np
from tqdm import tqdm
import shutil

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))


def load_config():
    """Load data configuration from YAML file."""
    config_path = project_root / "data" / "configs" / "data_config.yaml"
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    return config


def preprocess_image(image_path, target_size, normalize=True):
    """
    Preprocess a single image.

    Args:
        image_path (Path): Path to image file
        target_size (tuple): Target image size (height, width)
        normalize (bool): Whether to normalize pixel values

    Returns:
        numpy.ndarray: Preprocessed image or None if error
    """
    try:
        # Open image
        img = Image.open(image_path)

        # Convert to RGB (in case of RGBA or grayscale)
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Resize image
        img = img.resize(target_size, Image.BILINEAR)

        # Convert to numpy array
        img_array = np.array(img)

        # Normalize if requested
        if normalize:
            img_array = img_array.astype(np.float32) / 255.0

        return img_array

    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")
        return None


def validate_image(image_path, max_size_mb=10):
    """
    Validate image file.

    Args:
        image_path (Path): Path to image file
        max_size_mb (int): Maximum file size in MB

    Returns:
        bool: True if valid, False otherwise
    """
    try:
        # Check file exists
        if not image_path.exists():
            return False

        # Check file size
        file_size_mb = image_path.stat().st_size / (1024 * 1024)
        if file_size_mb > max_size_mb:
            print(f"Warning: {image_path.name} exceeds {max_size_mb}MB")
            return False

        # Try to open image
        with Image.open(image_path) as img:
            img.verify()

        return True

    except Exception:
        return False


def preprocess_dataset(raw_dir, processed_dir, config):
    """
    Preprocess entire dataset.

    Args:
        raw_dir (Path): Raw data directory
        processed_dir (Path): Output directory for processed data
        config (dict): Data configuration
    """
    print(f"\n{'='*60}")
    print("Data Preprocessing Pipeline")
    print(f"{'='*60}")
    print(f"Input Directory: {raw_dir}")
    print(f"Output Directory: {processed_dir}")
    print(f"Target Size: {config['preprocessing']['target_size']}")
    print(f"Normalize: {config['preprocessing']['normalize']}")
    print(f"{'='*60}\n")

    # Get preprocessing parameters
    target_size = tuple(config['preprocessing']['target_size'])
    normalize = config['preprocessing']['normalize']
    max_size_mb = config['validation']['max_image_size_mb']

    # Create processed directory
    processed_dir.mkdir(parents=True, exist_ok=True)

    # Get all class directories
    crop_dirs = ['tomato', 'potato']

    total_processed = 0
    total_failed = 0

    for crop in crop_dirs:
        crop_raw_dir = raw_dir / crop
        crop_processed_dir = processed_dir / crop

        if not crop_raw_dir.exists():
            print(f"Warning: {crop_raw_dir} not found, skipping...")
            continue

        print(f"\nProcessing {crop.upper()} images...")

        # Process each disease class
        for class_dir in crop_raw_dir.iterdir():
            if not class_dir.is_dir():
                continue

            class_name = class_dir.name
            output_class_dir = crop_processed_dir / class_name
            output_class_dir.mkdir(parents=True, exist_ok=True)

            # Get all images in class
            image_files = []
            for ext in config['validation']['allowed_extensions']:
                image_files.extend(list(class_dir.glob(f"*{ext}")))
                image_files.extend(list(class_dir.glob(f"*{ext.upper()}")))

            print(f"\n  Processing {class_name}: {len(image_files)} images")

            # Process images with progress bar
            processed_count = 0
            failed_count = 0

            for image_path in tqdm(image_files, desc=f"  {class_name}"):
                # Validate image
                if not validate_image(image_path, max_size_mb):
                    failed_count += 1
                    continue

                # Output path
                output_path = output_class_dir / image_path.name

                # Simply copy the file (preprocessing will be done during training)
                # This is more efficient and flexible
                try:
                    shutil.copy2(image_path, output_path)
                    processed_count += 1
                except Exception as e:
                    print(f"\n  Error copying {image_path.name}: {str(e)}")
                    failed_count += 1

            total_processed += processed_count
            total_failed += failed_count

            print(f"  ✓ Processed: {processed_count}, Failed: {failed_count}")

    print(f"\n{'='*60}")
    print("Preprocessing Summary")
    print(f"{'='*60}")
    print(f"Total Processed: {total_processed}")
    print(f"Total Failed: {total_failed}")
    print(f"Success Rate: {(total_processed/(total_processed+total_failed)*100):.2f}%")
    print(f"{'='*60}\n")


def generate_preprocessing_report(processed_dir, config):
    """
    Generate preprocessing report.

    Args:
        processed_dir (Path): Processed data directory
        config (dict): Data configuration
    """
    print("\nGenerating preprocessing report...")

    report_path = processed_dir / "preprocessing_report.txt"

    with open(report_path, 'w') as f:
        f.write("="*60 + "\n")
        f.write("Data Preprocessing Report\n")
        f.write("="*60 + "\n\n")

        # Dataset statistics
        crop_dirs = ['tomato', 'potato']

        for crop in crop_dirs:
            crop_dir = processed_dir / crop

            if not crop_dir.exists():
                continue

            f.write(f"\n{crop.upper()} Dataset:\n")
            f.write("-" * 40 + "\n")

            total_images = 0

            for class_dir in sorted(crop_dir.iterdir()):
                if not class_dir.is_dir():
                    continue

                # Count images
                image_files = []
                for ext in config['validation']['allowed_extensions']:
                    image_files.extend(list(class_dir.glob(f"*{ext}")))
                    image_files.extend(list(class_dir.glob(f"*{ext.upper()}")))

                num_images = len(image_files)
                total_images += num_images

                f.write(f"  {class_dir.name}: {num_images} images\n")

            f.write(f"\nTotal {crop} images: {total_images}\n")

        f.write("\n" + "="*60 + "\n")

    print(f"✓ Report saved to: {report_path}")


def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(description="Preprocess PlantVillage Dataset")
    parser.add_argument(
        '--raw-dir',
        type=str,
        default=None,
        help='Raw data directory (default: data/raw)'
    )
    parser.add_argument(
        '--output-dir',
        type=str,
        default=None,
        help='Output directory (default: data/processed)'
    )

    args = parser.parse_args()

    # Load configuration
    config = load_config()

    # Setup directories
    raw_dir = Path(args.raw_dir) if args.raw_dir else project_root / "data" / "raw"
    processed_dir = Path(args.output_dir) if args.output_dir else project_root / "data" / "processed"

    # Preprocess dataset
    preprocess_dataset(raw_dir, processed_dir, config)

    # Generate report
    generate_preprocessing_report(processed_dir, config)

    print("\n✓ Data preprocessing completed successfully!\n")
    print("Next steps:")
    print("  python data/scripts/split_dataset.py")


if __name__ == "__main__":
    main()
