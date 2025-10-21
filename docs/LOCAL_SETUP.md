# Local Development Setup Guide

**Author:** Peter Maina (136532)
**Project:** AI-Based Tomato & Potato Disease Classification

This guide provides step-by-step instructions for setting up and testing the project locally, including how to switch to the Claude branch in complete isolation.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Git Workflow - Switch to Claude Branch](#git-workflow---switch-to-claude-branch)
3. [Environment Setup](#environment-setup)
4. [Dataset Setup](#dataset-setup)
5. [Training Pipeline](#training-pipeline)
6. [Return to Main Branch](#return-to-main-branch)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- [ ] **Python 3.9+** installed
- [ ] **Git** installed and configured
- [ ] **Kaggle account** (for dataset download)
- [ ] **16GB+ RAM** recommended
- [ ] **50GB+ free disk space** (for dataset)

### Verify Installation
```bash
# Check Python version
python --version  # Should be 3.9 or higher

# Check Git version
git --version

# Check pip
pip --version
```

---

## Git Workflow - Switch to Claude Branch

### Step 1: Save Current Work on Main Branch

If you have uncommitted changes on `main` that you want to preserve:

```bash
# Navigate to project directory
cd AI-Based-Tomato-and-Potato-Disease-Classification-App

# Check current branch and status
git status
```

**Option A: Stash Your Changes (Recommended)**
```bash
# Stash all uncommitted changes with a descriptive message
git stash push -m "WIP: My uncommitted changes before testing Claude branch"

# Verify stash was created
git stash list
# You should see: stash@{0}: On main: WIP: My uncommitted changes before testing Claude branch
```

**Option B: Commit Your Changes**
```bash
# If you prefer to commit instead of stash
git add .
git commit -m "WIP: Save progress before testing Claude branch"
```

### Step 2: Switch to Claude Branch

```bash
# Fetch latest changes from remote
git fetch origin

# Switch to the Claude branch
git checkout claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp

# Verify you're on the correct branch
git branch
# * claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp

# Pull latest changes (if any)
git pull origin claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp
```

### Step 3: Verify Branch Isolation

```bash
# Check that you're in a clean state
git status
# Should show: "nothing to commit, working tree clean"

# View recent commits on this branch
git log --oneline -5

# List all files in the branch
ls -la
```

You are now in **complete isolation** on the Claude branch! Any changes you make will only affect this branch.

---

## Environment Setup

### Step 1: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate

# Verify activation (your prompt should show (venv))
which python  # Should point to venv/bin/python
```

### Step 2: Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install all required packages
pip install -r requirements.txt

# This will install:
# - TensorFlow 2.13.0
# - Keras, NumPy, Pandas
# - OpenCV, Pillow
# - Matplotlib, Seaborn
# - scikit-learn
# - And all other dependencies

# Installation may take 5-10 minutes
```

### Step 3: Verify Installation

```bash
# Test TensorFlow installation
python -c "import tensorflow as tf; print(f'TensorFlow version: {tf.__version__}')"

# Check GPU availability (if you have GPU)
python -c "import tensorflow as tf; print(f'GPU Available: {tf.config.list_physical_devices(\"GPU\")}')"

# Verify other key packages
python -c "import numpy, pandas, PIL, cv2, sklearn; print('✓ All packages installed')"
```

**Expected Output:**
```
TensorFlow version: 2.13.0
GPU Available: []  # or list of GPUs if available
✓ All packages installed
```

### Step 4: Verify Project Structure

```bash
# Check that all files are present
ls -R

# Verify Python scripts compile
python -m py_compile ml/models.py
python -m py_compile ml/training.py
python -m py_compile ml/evaluation.py

# Load configuration files
python -c "import yaml; yaml.safe_load(open('ml/config.yaml')); print('✓ Config loaded')"
```

---

## Dataset Setup

### Step 1: Setup Kaggle Credentials

```bash
# Create .kaggle directory
mkdir -p ~/.kaggle

# Copy your kaggle.json file to ~/.kaggle/
# Download from: https://www.kaggle.com/settings (API section)
cp /path/to/your/kaggle.json ~/.kaggle/

# Set proper permissions
chmod 600 ~/.kaggle/kaggle.json

# Verify
ls -l ~/.kaggle/kaggle.json
# Should show: -rw------- (only you can read/write)
```

### Step 2: Download PlantVillage Dataset

```bash
# Download dataset (4.37 GB - may take 10-30 minutes)
python data/scripts/download_dataset.py

# Monitor progress
# The script will:
# 1. Download dataset from Kaggle
# 2. Extract 54,000+ images
# 3. Organize into tomato/potato folders
# 4. Validate all images
```

**Expected Output:**
```
============================================================
PlantVillage Dataset Download Script
============================================================
Downloading... (this may take several minutes)

✓ Download completed successfully!
✓ Organized 13 disease classes
✓ Dataset validation completed

Total images: 54,000+
============================================================
```

### Step 3: Data Preprocessing

```bash
# Preprocess images (standardize format, validate integrity)
python data/scripts/preprocess_data.py

# This will:
# - Validate all images
# - Copy to processed directory
# - Generate preprocessing report
```

### Step 4: Split Dataset

```bash
# Split into train/val/test (70/20/10)
python data/scripts/split_dataset.py

# This creates:
# - data/processed/train/     (70% of images)
# - data/processed/validation/ (20% of images)
# - data/processed/test/       (10% of images)
```

**Verify Split:**
```bash
# Check split report
cat data/processed/split_report.txt

# Count files in each split
find data/processed/train -type f | wc -l
find data/processed/validation -type f | wc -l
find data/processed/test -type f | wc -l
```

---

## Training Pipeline

### Step 1: Explore Data (Optional)

```bash
# Launch Jupyter notebook for data exploration
jupyter notebook ml/notebooks/data_exploration.ipynb

# Or run in headless mode
jupyter nbconvert --to notebook --execute ml/notebooks/data_exploration.ipynb
```

### Step 2: Configure Training

Edit `ml/config.yaml` if needed:

```bash
# Open configuration file
nano ml/config.yaml  # or your preferred editor

# Key parameters to adjust:
# - model.architecture: "baseline" | "MobileNetV2" | "EfficientNetB0"
# - training.epochs: 50-100
# - training.batch_size: 16-64 (depending on RAM/GPU)
# - training.learning_rate: 0.0001
```

### Step 3: Train Model

**Option A: Train with Default Settings (MobileNetV2)**
```bash
# Train MobileNetV2 model
python ml/training.py

# This will:
# 1. Load and preprocess data
# 2. Create MobileNetV2 model with transfer learning
# 3. Train for 100 epochs (with early stopping)
# 4. Save best model checkpoint
# 5. Generate training logs
```

**Option B: Train with Custom Settings**
```bash
# Train Baseline CNN
python ml/training.py --architecture baseline --epochs 50 --batch-size 32

# Train EfficientNetB0
python ml/training.py --architecture EfficientNetB0 --epochs 50 --batch-size 16

# Force GPU usage
python ml/training.py --use-gpu
```

**Monitor Training:**
```bash
# In a separate terminal, launch TensorBoard
tensorboard --logdir ml/logs/tensorboard

# Open browser to: http://localhost:6006
```

**Expected Training Time:**
- **Baseline CNN**: 2-4 hours (CPU) / 30-60 min (GPU)
- **MobileNetV2**: 3-6 hours (CPU) / 45-90 min (GPU)
- **EfficientNetB0**: 4-8 hours (CPU) / 60-120 min (GPU)

### Step 4: Evaluate Model

```bash
# Find the trained model
ls ml/trained_models/final/

# Evaluate on test set
python ml/evaluation.py --model ml/trained_models/final/MobileNetV2_*_final.h5

# This generates:
# - Accuracy, Precision, Recall, F1-Score
# - Confusion matrix
# - Per-class metrics
# - Classification report
```

**View Results:**
```bash
# View evaluation report
cat ml/logs/*_evaluation.txt

# View confusion matrix
# Open: ml/logs/confusion_matrix.png
```

### Step 5: Test Inference

**Single Image Prediction:**
```bash
# Get a test image
TEST_IMAGE=$(find data/processed/test -name "*.jpg" | head -1)

# Make prediction
python ml/inference.py \
    --model ml/trained_models/final/MobileNetV2_*_final.h5 \
    --image "$TEST_IMAGE"
```

**Batch Prediction:**
```bash
# Predict on all test images
python ml/inference.py \
    --model ml/trained_models/final/MobileNetV2_*_final.h5 \
    --image-dir data/processed/test/Tomato___Early_blight \
    --output predictions.json
```

### Step 6: Convert to TFLite (Mobile Deployment)

```bash
# Convert model to TensorFlow Lite
python -c "
from ml.utils import convert_to_tflite
import glob

model_path = glob.glob('ml/trained_models/final/*_final.h5')[0]
tflite_path = convert_to_tflite(model_path, quantization='float16')
print(f'TFLite model: {tflite_path}')
"
```

---

## Return to Main Branch

### Step 1: Clean Up (Optional)

If you made any test changes on the Claude branch:

```bash
# See what changed
git status

# Discard all local changes (if you want a clean slate)
git reset --hard HEAD

# Or commit your test changes
git add .
git commit -m "Test changes on Claude branch"
```

### Step 2: Switch Back to Main

```bash
# Switch back to main branch
git checkout main

# Verify you're on main
git branch
# * main
```

### Step 3: Restore Your Stashed Changes

If you stashed changes in Step 1:

```bash
# List your stashes
git stash list

# Restore the most recent stash
git stash pop

# Or apply a specific stash (keeps stash in list)
git stash apply stash@{0}

# Verify your changes are back
git status
```

### Step 4: Clean Up Virtual Environment (Optional)

```bash
# Deactivate virtual environment
deactivate

# Remove virtual environment (if you want to start fresh later)
rm -rf venv
```

---

## Troubleshooting

### Issue: Import Errors

**Problem:**
```
ModuleNotFoundError: No module named 'tensorflow'
```

**Solution:**
```bash
# Verify virtual environment is activated
which python  # Should point to venv/bin/python

# If not, activate it
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Out of Memory

**Problem:**
```
ResourceExhaustedError: OOM when allocating tensor
```

**Solution:**
```bash
# Reduce batch size
python ml/training.py --batch-size 8  # instead of 32

# Or edit ml/config.yaml
# training.batch_size: 8
```

### Issue: Kaggle Download Fails

**Problem:**
```
403 Forbidden - Kaggle API credentials not configured
```

**Solution:**
```bash
# Check kaggle.json exists and has correct permissions
ls -l ~/.kaggle/kaggle.json

# Re-download from https://www.kaggle.com/settings
# Copy to ~/.kaggle/ and set permissions
chmod 600 ~/.kaggle/kaggle.json
```

### Issue: Git Branch Switch Fails

**Problem:**
```
error: Your local changes to the following files would be overwritten by checkout
```

**Solution:**
```bash
# Stash your changes first
git stash push -m "Saving changes before branch switch"

# Then switch
git checkout claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp
```

### Issue: Dataset Too Large

**Problem:**
```
Not enough disk space
```

**Solution:**
```bash
# Check available space
df -h

# Clean up unnecessary files
rm -rf data/raw/__MACOSX  # Remove Mac metadata
find data/raw -name ".DS_Store" -delete

# Or download only specific classes (manual approach)
```

### Issue: Training Takes Too Long

**Solution:**
```bash
# Use smaller subset for testing
# Edit data/scripts/split_dataset.py to use smaller sample

# Or reduce epochs for testing
python ml/training.py --epochs 5

# Or use baseline CNN (faster)
python ml/training.py --architecture baseline --epochs 10
```

---

## Performance Benchmarks

### Expected Results

| Model | Accuracy | Training Time (GPU) | Model Size |
|-------|----------|---------------------|------------|
| Baseline CNN | 85-90% | 30-60 min | ~50 MB |
| MobileNetV2 | 92-95% | 45-90 min | ~25 MB |
| EfficientNetB0 | 95-97% | 60-120 min | ~30 MB |

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 8 GB | 16 GB |
| Storage | 20 GB | 50 GB |
| GPU | None (CPU ok) | NVIDIA GPU 4GB+ |
| CPU | 4 cores | 8+ cores |

---

## Quick Commands Reference

```bash
# Stash and switch to Claude branch
git stash push -m "Saving work" && git checkout claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp

# Setup environment
python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# Download and prepare data
python data/scripts/download_dataset.py && \
python data/scripts/preprocess_data.py && \
python data/scripts/split_dataset.py

# Train model
python ml/training.py --architecture MobileNetV2 --epochs 50

# Evaluate
python ml/evaluation.py --model ml/trained_models/final/*_final.h5

# Return to main
git checkout main && git stash pop
```

---

## Next Steps

After local testing is complete:
1. Review evaluation metrics
2. Compare with Google Colab results
3. Fine-tune hyperparameters if needed
4. Proceed to API development (Phase 2)
5. Integrate with mobile app (Phase 3)

---

**For Google Colab setup, see:** [COLAB_SETUP.md](COLAB_SETUP.md)
**For quick reference, see:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
