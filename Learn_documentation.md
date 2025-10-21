# AI-Based Tomato & Potato Disease Classification - Learning Guide

**Author:** Peter Maina (136532)
**Institution:** Strathmore University
**Project:** Final Year AI/ML Project
**Target:** Kenyan Smallholder Farmers

---

## Learning Objectives

By the end of this guide, you will understand:

1. **Project structure** and file organization
2. **Data pipeline** from raw images to trained models
3. **Local vs Google Colab** development workflows
4. **Machine learning lifecycle** for computer vision
5. **Production deployment** considerations

---

## Project Structure Overview

```
AI-Based-Tomato-and-Potato-Disease-Classification-App/
├──  data/                          # Dataset management
│   ├── raw/                          # Original PlantVillage images
│   │   ├── tomato/                   # 10 tomato disease classes
│   │   └── potato/                   # 3 potato disease classes
│   ├── processed/                    # Preprocessed training data
│   │   ├── train/                    # 70% - Model training
│   │   ├── validation/               # 20% - Model validation
│   │   └── test/                     # 10% - Final evaluation
│   ├── scripts/                      # Data processing utilities
│   │   ├── download_dataset.py       # Kaggle dataset downloader
│   │   ├── preprocess_data.py        # Image preprocessing
│   │   └── split_dataset.py          # Train/val/test splitting
│   └── configs/                      # Data configuration files
│       └── data_config.yaml          # Dataset parameters
│
├── ml/                            # Machine Learning core
│   ├── config.yaml                   # ML hyperparameters
│   ├── models.py                     # CNN architectures
│   ├── training.py                   # Training pipeline
│   ├── inference.py                  # Prediction utilities
│   ├── evaluation.py                 # Model assessment
│   ├── utils.py                      # Helper functions
│   ├── notebooks/                    # Jupyter experiments
│   │   ├── data_exploration.ipynb    # EDA analysis
│   │   └── colab_training.ipynb      # Colab training
│   ├── trained_models/               # Saved models
│   │   ├── checkpoints/              # Training snapshots
│   │   ├── final/                    # Production models
│   │   └── experiments/              # Research models
│   └── logs/                         # Training metrics
│       ├── tensorboard/              # TensorBoard logs
│       └── training/                 # Training history
│
├── api/                           # Backend API (Phase 2)
├── mobile/                        # Mobile App (Phase 3)
├── tests/                         # Testing framework
├── docs/                          # Documentation
├── deployment/                    # Production deployment
└── scripts/                      # Automation scripts
    ├── setup.sh                     # Project initialization
    ├── test.sh                      # Comprehensive testing
    └── lint.sh                      # Code quality checks
```

---

## Learning Path: Beginner to Advanced

### **Level 1: Understanding the Problem**

#### **What We're Solving:**

- **Problem:** Kenyan farmers struggle to identify plant diseases
- **Solution:** AI-powered mobile app for disease diagnosis
- **Input:** Smartphone photo of plant leaf
- **Output:** Disease diagnosis + treatment recommendations

#### **Dataset Details:**

- **Source:** PlantVillage Dataset (Kaggle)
- **Size:** 4.37GB, 54,000+ images
- **Classes:** 13 total (10 tomato + 3 potato diseases/healthy)
- **Format:** RGB images, various sizes

### **Level 2: Project Components**

#### **Core Technologies:**

```python
# Deep Learning Framework
tensorflow==2.13.0          # Neural network training

# Computer Vision
opencv-python==4.8.0        # Image processing
PIL (Pillow)==10.0.0        # Image manipulation

# Data Science
pandas==2.0.3               # Data analysis
numpy==1.24.3               # Numerical computing
matplotlib==3.7.2           # Visualization

# Web Framework (Phase 2)
fastapi==0.103.0            # API development
```

#### **Development Environments:**

1. **Local Development** - Your computer
2. **Google Colab** - Cloud GPU training
3. **Production** - Mobile app deployment

### **Level 3: Data Processing Lifecycle**

#### **Phase 1: Data Acquisition**

```bash
# Download PlantVillage dataset (4.37GB)
python data/scripts/download_dataset.py

# What happens:
# 1. Connects to Kaggle API
# 2. Downloads compressed dataset
# 3. Extracts 54,000+ images
# 4. Organizes into crop/disease folders
# 5. Validates image integrity
```

#### **Phase 2: Exploratory Data Analysis (EDA)**

```python
# Run comprehensive analysis
jupyter notebook ml/notebooks/data_exploration.ipynb

# Analysis includes:
# 1. Class distribution (balanced/imbalanced?)
# 2. Image characteristics (size, format, quality)
# 3. Visual inspection of sample images
# 4. Data quality assessment
# 5. Preprocessing recommendations
```

#### **Phase 3: Data Preprocessing**

```python
# Standardize images for training
python data/scripts/preprocess_data.py

# Processing steps:
# 1. Resize to 224x224 pixels (model input size)
# 2. Normalize pixel values [0,1]
# 3. Convert to RGB format
# 4. Handle corrupted images
# 5. Apply data augmentation
```

#### **Phase 4: Dataset Splitting**

```python
# Create train/validation/test sets
python data/scripts/split_dataset.py

# Split strategy:
# - Train: 70% (model learning)
# - Validation: 20% (hyperparameter tuning)
# - Test: 10% (final evaluation)
# - Stratified: maintains class proportions
```

### **Level 4: Machine Learning Pipeline**

#### **Model Architectures:**

1. **Baseline CNN** (Custom Architecture)

```python
# Simple convolutional neural network
# Good for understanding fundamentals
# Trains from scratch
```

2. **MobileNetV2** (Transfer Learning)

```python
# Pre-trained on ImageNet (1.4M images)
# Optimized for mobile devices
# Fast inference, good accuracy
```

3. **EfficientNetB0** (State-of-the-art)

```python
# Best accuracy/efficiency trade-off
# Advanced architecture design
# Higher computational requirements
```

#### **Training Process:**

```python
# Start training
python ml/training.py --architecture MobileNetV2

# Training steps:
# 1. Load preprocessed data
# 2. Initialize model architecture
# 3. Apply data augmentation
# 4. Train with validation monitoring
# 5. Save best model checkpoints
# 6. Generate performance reports
```

#### **Key Training Concepts:**

**Data Augmentation** (Increases dataset diversity):

```python
rotation_range=20        # Rotate images ±20 degrees
width_shift_range=0.2    # Shift horizontally ±20%
height_shift_range=0.2   # Shift vertically ±20%
horizontal_flip=True     # Mirror images
brightness_range=[0.8,1.2]  # Adjust lighting
```

**Callbacks** (Training automation):

```python
EarlyStopping           # Stop if no improvement
ReduceLROnPlateau      # Lower learning rate
ModelCheckpoint        # Save best model
TensorBoard           # Visualize training
```

**Metrics** (Performance measurement):

```python
Accuracy    # Overall correctness
Precision   # True positives / (True + False positives)
Recall      # True positives / (True + False negatives)
F1-Score    # Harmonic mean of precision/recall
```

---

## Development Workflows

### **Local Development Setup**

#### **Prerequisites:**

```bash
# 1. Install Python 3.9+
python --version

# 2. Install Git
git --version

# 3. Clone project
git clone <repository-url>
cd AI-Based-Tomato-and-Potato-Disease-Classification-App
```

#### **Environment Setup:**

```bash
# 1. Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# What it does:
# - Creates Python virtual environment
# - Installs all dependencies
# - Sets up directory structure
# - Configures environment files
```

#### **Local Development Workflow:**

```bash
# 1. Activate environment
source venv/bin/activate

# 2. Download dataset
python data/scripts/download_dataset.py

# 3. Run EDA
jupyter notebook ml/notebooks/data_exploration.ipynb

# 4. Preprocess data
python data/scripts/preprocess_data.py

# 5. Train model
python ml/training.py

# 6. Evaluate results
python ml/evaluation.py
```

### **Google Colab Development**

#### **Why Use Colab?**

- **Free GPU access** (NVIDIA T4/K80)
- **Pre-installed libraries** (TensorFlow, PyTorch)
- **Collaborative environment**
- **No setup required**

#### **Colab Workflow:**

```python
# 1. Upload project to Google Drive
# 2. Open Colab notebook
!git clone <your-repo-url>
%cd AI-Based-Tomato-and-Potato-Disease-Classification-App

# 3. Setup Kaggle authentication
from google.colab import files
uploaded = files.upload()  # Upload kaggle.json

# 4. Download dataset
!python data/scripts/download_dataset.py --colab-mode

# 5. Train with GPU acceleration
!python ml/training.py --use-gpu
```

#### **Colab-Specific Features:**

```python
# GPU utilization
import tensorflow as tf
print("GPU Available: ", tf.config.list_physical_devices('GPU'))

# Progress visualization
from tqdm import tqdm  # Progress bars
import matplotlib.pyplot as plt  # Real-time plots

# Drive integration
from google.colab import drive
drive.mount('/content/drive')  # Persistent storage
```

---

## Complete Project Lifecycle

### **Phase 1: Research & Planning** (Weeks 1-2)

```bash
# Project setup and understanding
./scripts/setup.sh
jupyter notebook ml/notebooks/data_exploration.ipynb

# Deliverables:
# - Dataset analysis report
# - Preprocessing strategy
# - Model architecture selection
```

### **Phase 2: Data Pipeline Development** (Weeks 3-4)

```bash
# Build robust data processing
python data/scripts/download_dataset.py
python data/scripts/preprocess_data.py
python data/scripts/split_dataset.py

# Deliverables:
# - Clean, preprocessed dataset
# - Train/val/test splits
# - Data quality reports
```

### **Phase 3: Model Development** (Weeks 5-8)

```bash
# Implement and train models
python ml/training.py --architecture baseline
python ml/training.py --architecture MobileNetV2
python ml/training.py --architecture EfficientNetB0

# Deliverables:
# - Trained models (.h5 files)
# - Training metrics and logs
# - Model comparison reports
```

### **Phase 4: Evaluation & Optimization** (Weeks 9-10)

```bash
# Comprehensive model assessment
python ml/evaluation.py --model best_model.h5
python ml/inference.py --test-images test_set/

# Deliverables:
# - Performance benchmarks
# - Confusion matrices
# - Error analysis reports
```

### **Phase 5: Deployment Preparation** (Weeks 11-12)

```bash
# Prepare for production
python ml/utils.py --convert-to-tflite
python api/main.py  # Test API endpoints

# Deliverables:
# - Mobile-optimized models
# - API documentation
# - Deployment guides
```

---

## Configuration Management

### **ML Configuration** (`ml/config.yaml`)

```yaml
# Model parameters
model:
  architecture: "MobileNetV2"
  input_shape: [224, 224, 3]
  num_classes: 13

# Training parameters
training:
  batch_size: 32
  epochs: 100
  learning_rate: 0.0001

# Data augmentation
data_augmentation:
  rotation_range: 20
  horizontal_flip: true
```

### **Data Configuration** (`data/configs/data_config.yaml`)

```yaml
# Dataset information
dataset:
  name: "PlantVillage"
  total_images: 54000

# Class definitions
classes:
  tomato: ["Bacterial_spot", "Early_blight", ...]
  potato: ["Early_blight", "Late_blight", "healthy"]
```

---

## Advanced Topics

### **Model Optimization Techniques:**

1. **Transfer Learning**

```python
# Use pre-trained ImageNet weights
base_model = MobileNetV2(weights='imagenet', include_top=False)
base_model.trainable = False  # Freeze base layers
```

2. **Fine-tuning**

```python
# Unfreeze top layers for specialized learning
base_model.trainable = True
for layer in base_model.layers[:-20]:
    layer.trainable = False
```

3. **Class Weighting**

```python
# Handle imbalanced classes
from sklearn.utils.class_weight import compute_class_weight
class_weights = compute_class_weight('balanced', classes, y_train)
```

4. **Ensemble Methods**

```python
# Combine multiple models
predictions = (model1.predict(X) + model2.predict(X)) / 2
```

### **Performance Optimization:**

1. **Mixed Precision Training**

```python
# Use 16-bit floats for faster training
tf.keras.mixed_precision.set_global_policy('mixed_float16')
```

2. **Batch Size Optimization**

```python
# Find optimal batch size
for batch_size in [16, 32, 64, 128]:
    model.fit(X_train, y_train, batch_size=batch_size)
```

3. **Learning Rate Scheduling**

```python
# Dynamic learning rate adjustment
ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=5)
```

---

## Common Issues & Solutions

### **Data Issues:**

```bash
# Problem: Corrupted images
# Solution: Run data validation
python data/scripts/validate_dataset.py

# Problem: Class imbalance
# Solution: Use weighted loss or SMOTE
class_weight='balanced'  # in model.fit()
```

### **Training Issues:**

```bash
# Problem: Overfitting (high train, low val accuracy)
# Solutions:
# 1. Add dropout layers
# 2. Reduce model complexity
# 3. Increase data augmentation
# 4. Early stopping

# Problem: Underfitting (low train accuracy)
# Solutions:
# 1. Increase model complexity
# 2. Reduce regularization
# 3. Train for more epochs
# 4. Check learning rate
```

### **Memory Issues:**

```python
# Problem: GPU out of memory
# Solutions:
# 1. Reduce batch size
batch_size = 16  # instead of 32

# 2. Use gradient accumulation
# 3. Enable memory growth
tf.config.experimental.set_memory_growth(gpu, True)
```

---

## Performance Benchmarks

### **Expected Results:**

- **Baseline CNN:** 85-90% accuracy
- **MobileNetV2:** 92-95% accuracy
- **EfficientNetB0:** 95-97% accuracy

### **Evaluation Metrics:**

```python
# Classification Report
              precision  recall  f1-score  support
Tomato_Bacterial   0.94    0.92      0.93      500
Tomato_Early       0.89    0.87      0.88      450
...
Overall            0.93    0.92      0.92     5000
```

---

## Success Criteria

### **Technical Metrics:**

- [ ] **Accuracy:** >92% on test set
- [ ] **Inference Speed:** <500ms on mobile
- [ ] **Model Size:** <25MB for mobile deployment
- [ ] **Recall:** >90% for disease detection

### **Project Deliverables:**

- [ ] **Trained Models:** Production-ready .h5 and .tflite files
- [ ] **API:** RESTful service for predictions
- [ ] **Documentation:** Complete technical documentation
- [ ] **Mobile App:** Android/iOS deployment package

---

## Quick Reference

### **Essential Commands:**

```bash
# Project setup
./scripts/setup.sh

# Data pipeline
python data/scripts/download_dataset.py
python data/scripts/preprocess_data.py

# Model training
python ml/training.py

# Testing
./scripts/test.sh

# Code quality
./scripts/lint.sh
```

### **File Navigation:**

- **Main Config:** `ml/config.yaml`
- **Training Script:** `ml/training.py`
- **EDA Notebook:** `ml/notebooks/data_exploration.ipynb`
- **Model Definitions:** `ml/models.py`
- **Evaluation:** `ml/evaluation.py`

### **Useful Resources:**

- **PlantVillage Dataset:** [Kaggle Link](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset)
- **TensorFlow Docs:** [tensorflow.org](https://tensorflow.org)
- **Mobile Deployment:** [TensorFlow Lite Guide](https://tensorflow.org/lite)

---

**Congratulations!** You now have a comprehensive understanding of the AI-based plant disease classification project. Start with the EDA notebook and gradually work through each phase. Remember: machine learning is iterative – expect to revisit and refine each stage multiple times.

**Next Steps:** Run `jupyter notebook ml/notebooks/data_exploration.ipynb` to begin your hands-on learning journey!
