"""
Dataset Download Script for PlantVillage Dataset
Author: Peter Maina (136532)
Project: AI-Based Tomato & Potato Disease Classification

This script downloads the PlantVillage dataset from Kaggle.
"""

import os
import sys
import argparse
import zipfile
import shutil
from pathlib import Path
import yaml

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))


def load_config():
    """Load data configuration from YAML file."""
    config_path = project_root / "data" / "configs" / "data_config.yaml"
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    return config


def setup_kaggle_credentials(colab_mode=False):
    """
    Setup Kaggle API credentials.

    Args:
        colab_mode (bool): Whether running in Google Colab environment
    """
    if colab_mode:
        print("Setting up Kaggle credentials for Colab...")
        # In Colab, kaggle.json should be uploaded first
        kaggle_dir = Path.home() / ".kaggle"
        kaggle_dir.mkdir(exist_ok=True)

        # Set permissions
        kaggle_json = kaggle_dir / "kaggle.json"
        if kaggle_json.exists():
            os.chmod(kaggle_json, 0o600)
            print("✓ Kaggle credentials configured")
        else:
            print("ERROR: Please upload kaggle.json file first!")
            print("Instructions:")
            print("1. Go to https://www.kaggle.com/settings")
            print("2. Scroll to API section")
            print("3. Click 'Create New API Token'")
            print("4. Upload the downloaded kaggle.json file")
            sys.exit(1)
    else:
        kaggle_dir = Path.home() / ".kaggle"
        kaggle_json = kaggle_dir / "kaggle.json"

        if not kaggle_json.exists():
            print("ERROR: Kaggle credentials not found!")
            print("\nSetup Instructions:")
            print("1. Go to https://www.kaggle.com/settings")
            print("2. Scroll to API section")
            print("3. Click 'Create New API Token'")
            print("4. Move downloaded kaggle.json to ~/.kaggle/")
            print("5. Run: chmod 600 ~/.kaggle/kaggle.json")
            sys.exit(1)


def download_dataset(config, output_dir, colab_mode=False):
    """
    Download PlantVillage dataset from Kaggle.

    Args:
        config (dict): Data configuration
        output_dir (Path): Directory to save downloaded data
        colab_mode (bool): Whether running in Colab
    """
    try:
        import kaggle

        dataset_name = config['dataset']['kaggle_dataset']
        print(f"\n{'='*60}")
        print(f"Downloading PlantVillage Dataset from Kaggle")
        print(f"{'='*60}")
        print(f"Dataset: {dataset_name}")
        print(f"Size: {config['dataset']['size_gb']} GB")
        print(f"Total Images: {config['dataset']['total_images']:,}")
        print(f"Output Directory: {output_dir}")
        print(f"{'='*60}\n")

        # Download dataset
        print("Downloading... (this may take several minutes)")
        kaggle.api.dataset_download_files(
            dataset_name,
            path=output_dir,
            unzip=True,
            quiet=False
        )

        print("\n✓ Download completed successfully!")

    except Exception as e:
        print(f"\n✗ Download failed: {str(e)}")
        sys.exit(1)


def organize_dataset(config, raw_dir):
    """
    Organize downloaded dataset into proper structure.

    Args:
        config (dict): Data configuration
        raw_dir (Path): Raw data directory
    """
    print("\nOrganizing dataset structure...")

    # Find the downloaded dataset directory
    # PlantVillage dataset typically extracts to a specific folder
    possible_dirs = [
        raw_dir / "PlantVillage",
        raw_dir / "plant-village",
        raw_dir / "plantvillage-dataset",
        raw_dir,
    ]

    dataset_dir = None
    for pdir in possible_dirs:
        if pdir.exists() and any(pdir.iterdir()):
            dataset_dir = pdir
            break

    if not dataset_dir:
        print("✗ Could not find extracted dataset directory")
        return False

    print(f"Found dataset at: {dataset_dir}")

    # Create tomato and potato directories
    tomato_dir = raw_dir / "tomato"
    potato_dir = raw_dir / "potato"
    tomato_dir.mkdir(exist_ok=True)
    potato_dir.mkdir(exist_ok=True)

    # Move tomato and potato classes to respective directories
    class_count = 0

    for class_dir in dataset_dir.iterdir():
        if class_dir.is_dir():
            class_name = class_dir.name

            # Determine if it's tomato or potato
            if "tomato" in class_name.lower():
                dest = tomato_dir / class_name
                if not dest.exists():
                    shutil.move(str(class_dir), str(dest))
                    class_count += 1
                    print(f"  ✓ Moved {class_name}")
            elif "potato" in class_name.lower():
                dest = potato_dir / class_name
                if not dest.exists():
                    shutil.move(str(class_dir), str(dest))
                    class_count += 1
                    print(f"  ✓ Moved {class_name}")

    print(f"\n✓ Organized {class_count} disease classes")
    return True


def validate_dataset(config, raw_dir):
    """
    Validate the downloaded dataset.

    Args:
        config (dict): Data configuration
        raw_dir (Path): Raw data directory

    Returns:
        bool: True if validation passes
    """
    print("\nValidating dataset...")

    tomato_dir = raw_dir / "tomato"
    potato_dir = raw_dir / "potato"

    # Check if directories exist
    if not tomato_dir.exists() or not potato_dir.exists():
        print("✗ Dataset structure incomplete")
        return False

    # Count classes
    tomato_classes = list(tomato_dir.iterdir())
    potato_classes = list(potato_dir.iterdir())

    print(f"\nDataset Statistics:")
    print(f"  Tomato classes: {len(tomato_classes)}")
    print(f"  Potato classes: {len(potato_classes)}")

    # Count images per class
    total_images = 0
    for class_dir in tomato_classes + potato_classes:
        if class_dir.is_dir():
            image_files = list(class_dir.glob("*.jpg")) + list(class_dir.glob("*.png")) + list(class_dir.glob("*.jpeg"))
            num_images = len(image_files)
            total_images += num_images
            print(f"  {class_dir.name}: {num_images} images")

    print(f"\nTotal images: {total_images:,}")

    # Validate minimum images per class
    min_images = config['validation']['min_images_per_class']
    for class_dir in tomato_classes + potato_classes:
        if class_dir.is_dir():
            image_files = list(class_dir.glob("*.jpg")) + list(class_dir.glob("*.png")) + list(class_dir.glob("*.jpeg"))
            if len(image_files) < min_images:
                print(f"✗ Warning: {class_dir.name} has only {len(image_files)} images (minimum: {min_images})")

    print("\n✓ Dataset validation completed")
    return True


def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(description="Download PlantVillage Dataset")
    parser.add_argument(
        '--colab-mode',
        action='store_true',
        help='Run in Google Colab mode'
    )
    parser.add_argument(
        '--output-dir',
        type=str,
        default=None,
        help='Custom output directory (default: data/raw)'
    )

    args = parser.parse_args()

    # Load configuration
    config = load_config()

    # Setup output directory
    if args.output_dir:
        output_dir = Path(args.output_dir)
    else:
        output_dir = project_root / "data" / "raw"

    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n{'='*60}")
    print("PlantVillage Dataset Download Script")
    print(f"{'='*60}")
    print(f"Mode: {'Google Colab' if args.colab_mode else 'Local'}")
    print(f"Output Directory: {output_dir}")
    print(f"{'='*60}\n")

    # Setup Kaggle credentials
    setup_kaggle_credentials(colab_mode=args.colab_mode)

    # Download dataset
    download_dataset(config, output_dir, colab_mode=args.colab_mode)

    # Organize dataset
    organize_dataset(config, output_dir)

    # Validate dataset
    validate_dataset(config, output_dir)

    print(f"\n{'='*60}")
    print("✓ Dataset download and setup completed successfully!")
    print(f"{'='*60}\n")
    print("Next steps:")
    print("1. Run data exploration: jupyter notebook ml/notebooks/data_exploration.ipynb")
    print("2. Preprocess data: python data/scripts/preprocess_data.py")
    print("3. Split dataset: python data/scripts/split_dataset.py")


if __name__ == "__main__":
    main()
