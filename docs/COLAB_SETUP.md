# Google Colab Setup Guide

**Author:** Peter Maina (136532)
**Project:** AI-Based Tomato & Potato Disease Classification

This guide provides a complete step-by-step checklist for training the plant disease classification model on Google Colab with free GPU access.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Upload Notebook to Colab](#upload-notebook-to-colab)
3. [Setup GPU Runtime](#setup-gpu-runtime)
4. [Execute Training Pipeline](#execute-training-pipeline)
5. [Download Results](#download-results)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts & Files
- [ ] **Google Account** (for Google Colab access)
- [ ] **Kaggle Account** (for dataset download)
- [ ] **kaggle.json** file downloaded from Kaggle

### Get Your Kaggle API Credentials

1. Go to https://www.kaggle.com
2. Sign in or create account
3. Click on your profile picture (top right)
4. Select **"Settings"**
5. Scroll to **"API"** section
6. Click **"Create New API Token"**
7. Download `kaggle.json` file
8. Keep this file safe - you'll upload it to Colab

**✓ Checklist:**
- [ ] Kaggle account created
- [ ] kaggle.json downloaded
- [ ] File saved in accessible location

---

## Upload Notebook to Colab

### Step 1: Access the Repository

**Option A: Download from GitHub**
```
1. Go to: https://github.com/YOUR_USERNAME/AI-Based-Tomato-and-Potato-Disease-Classification-App
2. Navigate to: ml/notebooks/colab_training.ipynb
3. Click "Raw" button
4. Save file (Ctrl+S or Cmd+S)
```

**Option B: Clone Repository**
```bash
# Clone to your local machine
git clone https://github.com/YOUR_USERNAME/AI-Based-Tomato-and-Potato-Disease-Classification-App.git

# Navigate to notebook
cd AI-Based-Tomato-and-Potato-Disease-Classification-App/ml/notebooks/

# Open colab_training.ipynb in your file browser
```

### Step 2: Upload to Google Colab

1. Open https://colab.research.google.com
2. Sign in with your Google account
3. Click **"File"** → **"Upload notebook"**
4. Click **"Choose file"**
5. Select `colab_training.ipynb`
6. Wait for upload to complete

**Alternative: Open from Google Drive**
1. Upload notebook to your Google Drive
2. Right-click on `colab_training.ipynb`
3. Select **"Open with"** → **"Google Colaboratory"**

**✓ Checklist:**
- [ ] Notebook uploaded to Colab
- [ ] Notebook opens successfully
- [ ] You can see all cells

---

## Setup GPU Runtime

### Step 1: Enable GPU Acceleration

1. In Colab, click **"Runtime"** in the menu bar
2. Select **"Change runtime type"**
3. Under **"Hardware accelerator"**, select **"T4 GPU"** or **"GPU"**
4. Click **"Save"**

**Verify GPU:**
```python
# Run this in the first cell
import tensorflow as tf
print("GPU Available:", tf.config.list_physical_devices('GPU'))
```

**Expected Output:**
```
GPU Available: [PhysicalDevice(name='/physical_device:GPU:0', device_type='GPU')]
```

**✓ Checklist:**
- [ ] GPU runtime selected
- [ ] Runtime restarted
- [ ] GPU detected successfully

### Step 2: Mount Google Drive (Optional but Recommended)

This allows you to save models persistently:

1. Run the cell:
```python
from google.colab import drive
drive.mount('/content/drive')
```

2. Click the link that appears
3. Select your Google account
4. Click **"Allow"**
5. Copy the authorization code
6. Paste it in Colab and press Enter

**✓ Checklist:**
- [ ] Google Drive mounted
- [ ] Can access `/content/drive/MyDrive/`

---

## Execute Training Pipeline

### Phase 1: Environment Setup (Cells 1-4)

**Cell 1: Check GPU**
```python
import tensorflow as tf
print("TensorFlow version:", tf.__version__)
print("\nGPU Available:", tf.config.list_physical_devices('GPU'))
```
- [ ] ✓ GPU detected
- [ ] ✓ TensorFlow version 2.x

**Cell 2: Mount Drive**
```python
from google.colab import drive
drive.mount('/content/drive')
```
- [ ] ✓ Drive mounted successfully

**Cell 3: Clone Repository**
```python
!git clone https://github.com/YOUR_USERNAME/AI-Based-Tomato-and-Potato-Disease-Classification-App.git
%cd AI-Based-Tomato-and-Potato-Disease-Classification-App
```
- [ ] ✓ Repository cloned
- [ ] ✓ Changed directory
- [ ] ✓ Files visible with `!ls`

**Cell 4: Install Dependencies**
```python
!pip install -q pyyaml kaggle scikit-learn seaborn
```
- [ ] ✓ Packages installed
- [ ] ✓ No error messages

---

### Phase 2: Kaggle Setup (Cell 5)

**Upload kaggle.json:**

1. Run the cell:
```python
from google.colab import files
uploaded = files.upload()
```

2. Click **"Choose Files"**
3. Select your `kaggle.json` file
4. Wait for upload (should see progress bar)
5. File will be automatically configured

**Expected Output:**
```
Saving kaggle.json to kaggle.json
✓ Kaggle credentials configured
```

**✓ Checklist:**
- [ ] kaggle.json uploaded
- [ ] Credentials configured
- [ ] No 403 errors

---

### Phase 3: Download Dataset (Cell 6)

**This is the longest step - will take 10-30 minutes!**

```python
!python data/scripts/download_dataset.py --colab-mode
```

**What happens:**
1. Downloads 4.37 GB dataset from Kaggle
2. Extracts ~54,000 images
3. Organizes into tomato/potato folders
4. Validates all images

**Progress Indicators:**
- Download progress bar
- Extraction messages
- Organization confirmations

**Expected Output:**
```
============================================================
Downloading PlantVillage Dataset from Kaggle
Dataset: abdallahalidev/plantvillage-dataset
Size: 4.37 GB
Total Images: 54,000
============================================================

Downloading... (this may take several minutes)
✓ Download completed successfully!
✓ Organized 13 disease classes
✓ Dataset validation completed
```

**✓ Checklist:**
- [ ] Download completed (no errors)
- [ ] ~54,000 images extracted
- [ ] 13 disease classes found
- [ ] Validation passed

**⏰ Expected Time:** 10-30 minutes (depending on Colab speed)

---

### Phase 4: Data Exploration (Cells 7-9)

**Cell 7: Load Configuration**
```python
import yaml
with open('data/configs/data_config.yaml', 'r') as f:
    data_config = yaml.safe_load(f)
```
- [ ] ✓ Config loaded
- [ ] ✓ 13 classes confirmed

**Cell 8: Visualize Samples**
```python
# Visualize tomato and potato samples
visualize_samples('data/raw', 'tomato')
visualize_samples('data/raw', 'potato', n_samples=3)
```
- [ ] ✓ Images displayed
- [ ] ✓ Visuals look correct

**Cell 9: Analyze Distribution**
```python
analyze_distribution('data/raw')
```
- [ ] ✓ Bar chart displayed
- [ ] ✓ Statistics shown

---

### Phase 5: Data Preprocessing (Cells 10-11)

**Cell 10: Preprocess Data**
```python
!python data/scripts/preprocess_data.py
```
- [ ] ✓ All images processed
- [ ] ✓ High success rate (>99%)

**Cell 11: Split Dataset**
```python
!python data/scripts/split_dataset.py
```
- [ ] ✓ Train/val/test splits created
- [ ] ✓ 70/20/10 ratio maintained

**⏰ Expected Time:** 5-10 minutes

---

### Phase 6: Model Training (Cell 12)

**This is the core training step - will take 45-90 minutes!**

```python
!python ml/training.py --architecture MobileNetV2 --epochs 50 --batch-size 32 --use-gpu
```

**What happens:**
1. Loads preprocessed data
2. Creates MobileNetV2 model
3. Trains for up to 50 epochs (may stop early)
4. Saves best model checkpoint
5. Generates training logs

**Monitor Progress:**
- Epoch counter (1/50, 2/50, ...)
- Training loss decreasing
- Validation accuracy increasing
- ETA for completion

**Expected Output:**
```
============================================================
Plant Disease Classification - Training Pipeline
Architecture: MobileNetV2
Epochs: 50
Batch Size: 32
============================================================

Epoch 1/50
450/450 [==============================] - 120s - loss: 0.8234 - accuracy: 0.7421 - val_loss: 0.4123 - val_accuracy: 0.8654

Epoch 2/50
450/450 [==============================] - 115s - loss: 0.3421 - accuracy: 0.8876 - val_loss: 0.2345 - val_accuracy: 0.9234

...

✓ Training pipeline completed successfully!
```

**✓ Checklist:**
- [ ] Training started (no crashes)
- [ ] Loss decreasing over epochs
- [ ] Accuracy increasing
- [ ] Model checkpoint saved
- [ ] Final accuracy >90%

**⏰ Expected Time:** 45-90 minutes

**Expected Performance:**
- **Final Training Accuracy:** 95-98%
- **Final Validation Accuracy:** 92-95%
- **Best Epoch:** Usually 20-40

---

### Phase 7: Visualize Training (Cell 13)

```python
# Load and plot training history
from ml.utils import plot_training_history
```
- [ ] ✓ Training curves displayed
- [ ] ✓ Accuracy and loss plots shown

---

### Phase 8: Model Evaluation (Cells 14-15)

**Cell 14: Find Best Model**
```python
best_model = sorted(Path('ml/trained_models/final').glob('*.h5'))[-1]
```
- [ ] ✓ Model file found

**Cell 15: Evaluate**
```python
!python ml/evaluation.py --model {best_model}
```

**Expected Output:**
```
============================================================
Model Evaluation
============================================================

Test Loss: 0.2145
Test Accuracy: 93.45%
Precision: 93.21%
Recall: 93.18%
F1-Score: 93.19%

✓ Evaluation completed successfully!
```

**✓ Checklist:**
- [ ] Test accuracy >90%
- [ ] Confusion matrix generated
- [ ] Classification report created

---

### Phase 9: Test Inference (Cell 16)

```python
# Test prediction on sample image
from ml.inference import predict_single_image
```
- [ ] ✓ Prediction works
- [ ] ✓ Confidence >80%
- [ ] ✓ Visualization displayed

---

### Phase 10: Export to TFLite (Cell 17)

```python
from ml.utils import convert_to_tflite
tflite_model = convert_to_tflite(str(best_model), quantization='float16')
```

**Expected Output:**
```
✓ TFLite conversion completed
  Original model size: 28.54 MB
  TFLite model size: 14.32 MB
  Size reduction: 49.8%
```

**✓ Checklist:**
- [ ] TFLite model created
- [ ] Size reduced by ~50%
- [ ] Model <25MB (good for mobile)

---

## Download Results

### Save to Google Drive (Cell 18)

```python
# Copy models to Google Drive
import shutil
drive_model_dir = Path('/content/drive/MyDrive/PlantDiseaseModels')
drive_model_dir.mkdir(parents=True, exist_ok=True)
```

**✓ Checklist:**
- [ ] Models copied to Drive
- [ ] Evaluation reports saved
- [ ] Files accessible in Drive

### Download to Local Machine

**Option A: Download from Drive**
1. Open Google Drive
2. Navigate to `PlantDiseaseModels/`
3. Right-click files → Download

**Option B: Download from Colab**
```python
from google.colab import files

# Download .h5 model
files.download(str(best_model))

# Download TFLite model
files.download(tflite_model)

# Download evaluation report
files.download('ml/logs/evaluation_report.json')
```

**✓ Checklist:**
- [ ] .h5 model downloaded
- [ ] .tflite model downloaded
- [ ] Evaluation reports downloaded

---

## Troubleshooting

### Issue: GPU Not Available

**Symptom:**
```
GPU Available: []
```

**Solutions:**
1. Runtime → Change runtime type → Select "T4 GPU"
2. Runtime → Restart runtime
3. Check Colab GPU quota (limited free hours per day)
4. Try again later if quota exceeded

---

### Issue: Kaggle Download Fails

**Symptom:**
```
403 Forbidden
```

**Solutions:**
1. Verify kaggle.json is correct
2. Re-upload kaggle.json
3. Check Kaggle API is enabled in your account
4. Download from Kaggle manually and upload to Colab:
   ```python
   from google.colab import files
   uploaded = files.upload()  # Upload dataset zip
   ```

---

### Issue: Out of Memory

**Symptom:**
```
ResourceExhaustedError: OOM
```

**Solutions:**
1. Reduce batch size:
   ```python
   !python ml/training.py --batch-size 16  # instead of 32
   ```
2. Runtime → Factory reset runtime
3. Restart runtime and run again
4. Use smaller model:
   ```python
   !python ml/training.py --architecture baseline
   ```

---

### Issue: Disconnection During Training

**Symptom:**
Colab disconnects after 90 minutes idle

**Solutions:**
1. **Keep tab active** - don't minimize browser
2. **Run console script** to prevent idle:
   ```javascript
   // Paste in browser console (F12)
   function KeepAlive(){
     fetch('/');
     setTimeout(KeepAlive, 60000);
   }
   KeepAlive();
   ```
3. **Use Colab Pro** for longer runtimes
4. **Save checkpoints** - training resumes from last checkpoint

---

### Issue: Dataset Download Too Slow

**Symptom:**
Download takes >1 hour

**Solutions:**
1. Wait - Kaggle servers can be slow
2. Try different time of day
3. Check Colab connection speed
4. Use mirror dataset if available

---

### Issue: Training Not Improving

**Symptom:**
Validation accuracy stuck at ~70%

**Solutions:**
1. Check data augmentation is enabled
2. Verify class balance in dataset
3. Increase epochs to 100
4. Try different architecture:
   ```python
   !python ml/training.py --architecture EfficientNetB0
   ```

---

## Performance Benchmarks

### Expected Results (Free Colab GPU)

| Phase | Time | CPU Usage | RAM Usage |
|-------|------|-----------|-----------|
| Dataset Download | 10-30 min | Low | Low |
| Preprocessing | 5-10 min | High | Medium |
| Training (50 epochs) | 45-90 min | Medium | High |
| Evaluation | 2-5 min | Medium | Medium |
| **Total** | **65-140 min** | - | - |

### Model Performance

| Model | Accuracy | Size | Mobile-Ready |
|-------|----------|------|--------------|
| MobileNetV2 | 92-95% | ~25 MB → 12 MB (TFLite) | ✓✓✓ |
| EfficientNetB0 | 95-97% | ~30 MB → 15 MB (TFLite) | ✓✓ |
| Baseline CNN | 85-90% | ~50 MB → 25 MB (TFLite) | ✓ |

---

## Complete Checklist

### Before Starting
- [ ] Google account ready
- [ ] Kaggle account created
- [ ] kaggle.json downloaded
- [ ] Notebook uploaded to Colab

### Runtime Setup
- [ ] GPU runtime enabled
- [ ] GPU detected
- [ ] Google Drive mounted

### Dataset Pipeline
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Kaggle credentials configured
- [ ] Dataset downloaded (54,000 images)
- [ ] Data preprocessed
- [ ] Dataset split (70/20/10)

### Training Pipeline
- [ ] Model training started
- [ ] Training completed (>90% accuracy)
- [ ] Training history visualized
- [ ] Model evaluated on test set
- [ ] Inference tested
- [ ] TFLite model created

### Save Results
- [ ] Models saved to Google Drive
- [ ] .h5 model downloaded
- [ ] .tflite model downloaded
- [ ] Evaluation reports downloaded

---

## Next Steps

After successful Colab training:

1. **Compare Results** - Check if accuracy meets requirements (>92%)
2. **Test on Mobile** - Deploy TFLite model to mobile app
3. **Fine-tune** - Adjust hyperparameters if needed
4. **API Development** - Integrate model with FastAPI backend
5. **Production Deployment** - Deploy to cloud or on-device

---

## Estimated Total Time

| Session Type | Time Required |
|--------------|---------------|
| **First Run** | 2-3 hours |
| **Subsequent Runs** | 1-2 hours (cached) |
| **Quick Test** | 30-60 min (5 epochs) |

**Recommendation:** Plan for a 3-hour session for your first complete run.

---

**For local setup, see:** [LOCAL_SETUP.md](LOCAL_SETUP.md)
**For quick reference, see:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
