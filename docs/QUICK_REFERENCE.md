# Quick Reference Checklists

**Author:** Peter Maina (136532)
**Project:** AI-Based Tomato & Potato Disease Classification

Quick reference checklists for both Google Colab and Local setup.

---

## 🚀 Google Colab - Quick Start (2-3 hours)

### Pre-Flight Checklist
```
□ Google account signed in
□ kaggle.json file ready
□ Stable internet connection
□ 2-3 hours available
```

### Step-by-Step
```
1. □ Open https://colab.research.google.com
2. □ Upload ml/notebooks/colab_training.ipynb
3. □ Runtime → Change runtime type → GPU
4. □ Run Cell 1: Check GPU ✓
5. □ Run Cell 2: Mount Drive ✓
6. □ Run Cell 3: Clone repo ✓
7. □ Run Cell 4: Install packages ✓
8. □ Run Cell 5: Upload kaggle.json ✓
9. □ Run Cell 6: Download dataset (10-30 min) ☕
10. □ Run Cells 7-9: Explore data ✓
11. □ Run Cells 10-11: Preprocess (5-10 min) ✓
12. □ Run Cell 12: Train model (45-90 min) ☕☕
13. □ Run Cell 13: Visualize training ✓
14. □ Run Cells 14-15: Evaluate model ✓
15. □ Run Cell 16: Test inference ✓
16. □ Run Cell 17: Export TFLite ✓
17. □ Run Cell 18: Save to Drive ✓
18. □ Download results ✓
```

### Expected Output
```
✓ Test Accuracy: 92-95%
✓ Model Size: ~25MB → 12MB (TFLite)
✓ Training Time: 45-90 minutes
✓ Total Time: 2-3 hours
```

### Common Issues
```
□ No GPU? → Runtime → Change runtime type
□ 403 Error? → Re-upload kaggle.json
□ OOM Error? → Reduce batch size to 16
□ Disconnected? → Keep tab active
```

---

## 💻 Local Setup - Quick Start (4-6 hours first time)

### Pre-Flight Checklist
```
□ Python 3.9+ installed
□ Git installed
□ kaggle.json file ready
□ 50GB free disk space
□ 16GB RAM (recommended)
```

### Git Workflow - Switch to Claude Branch
```bash
# 1. Stash current work on main
git stash push -m "Saving work before testing Claude branch"

# 2. Switch to Claude branch
git checkout claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp

# 3. Verify clean state
git status  # Should be clean

# You're now in isolation! Proceed with setup.
```

### Environment Setup
```bash
# 4. Create virtual environment
python -m venv venv

# 5. Activate (Linux/Mac)
source venv/bin/activate
# Windows: venv\Scripts\activate

# 6. Install dependencies (5-10 min)
pip install -r requirements.txt

# 7. Verify installation
python -c "import tensorflow as tf; print(tf.__version__)"
```

### Dataset Setup
```bash
# 8. Setup Kaggle credentials
mkdir -p ~/.kaggle
cp /path/to/kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json

# 9. Download dataset (10-30 min) ☕
python data/scripts/download_dataset.py

# 10. Preprocess (5-10 min)
python data/scripts/preprocess_data.py

# 11. Split dataset
python data/scripts/split_dataset.py
```

### Training Pipeline
```bash
# 12. Train model (2-6 hours CPU, 45-90 min GPU) ☕☕☕
python ml/training.py --architecture MobileNetV2 --epochs 50

# 13. Monitor (optional - separate terminal)
tensorboard --logdir ml/logs/tensorboard

# 14. Evaluate
python ml/evaluation.py --model ml/trained_models/final/*_final.h5

# 15. Test inference
python ml/inference.py \
    --model ml/trained_models/final/*_final.h5 \
    --image data/processed/test/*/sample.jpg
```

### Return to Main Branch
```bash
# 16. Switch back to main
git checkout main

# 17. Restore your work
git stash pop

# 18. Cleanup (optional)
deactivate
```

### Checklist
```
□ Branch switched successfully
□ Virtual environment created
□ Dependencies installed
□ Dataset downloaded (~54,000 images)
□ Data preprocessed
□ Model trained (accuracy >90%)
□ Model evaluated
□ Inference tested
□ Returned to main branch
□ Stashed changes restored
```

---

## 📊 Performance Comparison

| Metric | Google Colab (Free) | Local (CPU) | Local (GPU) |
|--------|---------------------|-------------|-------------|
| **Setup Time** | 5 min | 15-20 min | 15-20 min |
| **Dataset Download** | 10-30 min | 10-30 min | 10-30 min |
| **Preprocessing** | 5-10 min | 10-15 min | 10-15 min |
| **Training (50 epochs)** | 45-90 min | 4-6 hours | 45-90 min |
| **Total Time** | **2-3 hours** | **5-7 hours** | **2-3 hours** |
| **Cost** | FREE | FREE | FREE |
| **Reliability** | Medium (may disconnect) | High | High |
| **Storage** | Temporary | Persistent | Persistent |

**Recommendation:**
- **First-time training:** Use Google Colab (fastest, no setup)
- **Experimentation:** Use Local with GPU (if available)
- **Production training:** Use Local or cloud GPU

---

## 🎯 Expected Results

### Dataset Statistics
```
Total Images: 54,000+
Classes: 13 (10 tomato + 3 potato)
Train Set: ~37,800 images (70%)
Validation Set: ~10,800 images (20%)
Test Set: ~5,400 images (10%)
```

### Model Performance
```
MobileNetV2 (Recommended):
├── Accuracy: 92-95%
├── Precision: 92-94%
├── Recall: 92-94%
├── F1-Score: 92-94%
├── Training Time: 45-90 min (GPU)
├── Model Size: ~25 MB
└── TFLite Size: ~12 MB

EfficientNetB0 (Best Accuracy):
├── Accuracy: 95-97%
├── Precision: 95-96%
├── Recall: 95-96%
├── F1-Score: 95-96%
├── Training Time: 60-120 min (GPU)
├── Model Size: ~30 MB
└── TFLite Size: ~15 MB

Baseline CNN (Fast):
├── Accuracy: 85-90%
├── Precision: 85-89%
├── Recall: 85-89%
├── F1-Score: 85-89%
├── Training Time: 30-60 min (GPU)
├── Model Size: ~50 MB
└── TFLite Size: ~25 MB
```

---

## 🐛 Quick Troubleshooting

### Colab Issues
```
Problem: GPU not available
→ Runtime → Change runtime type → GPU → Save

Problem: Kaggle 403 error
→ Re-upload kaggle.json from https://www.kaggle.com/settings

Problem: Out of memory
→ --batch-size 16 or --batch-size 8

Problem: Disconnected during training
→ Keep tab active, use console script (see COLAB_SETUP.md)

Problem: Slow download
→ Wait or try different time of day
```

### Local Issues
```
Problem: ModuleNotFoundError
→ Activate venv: source venv/bin/activate
→ Reinstall: pip install -r requirements.txt

Problem: Git won't switch branches
→ Stash first: git stash push -m "saving work"

Problem: Out of disk space
→ Need 50GB free, clean up unnecessary files

Problem: Training too slow
→ Reduce epochs: --epochs 10
→ Use baseline: --architecture baseline

Problem: Can't find trained model
→ Check: ls ml/trained_models/final/
→ Use glob: ml/trained_models/final/*_final.h5
```

---

## 📁 Important File Locations

### Configuration Files
```
ml/config.yaml                  # ML hyperparameters
data/configs/data_config.yaml   # Dataset configuration
```

### Python Scripts
```
data/scripts/download_dataset.py   # Download from Kaggle
data/scripts/preprocess_data.py    # Preprocess images
data/scripts/split_dataset.py      # Train/val/test split

ml/models.py         # Model architectures
ml/training.py       # Training pipeline
ml/evaluation.py     # Model evaluation
ml/inference.py      # Predictions
ml/utils.py          # Helper functions
```

### Notebooks
```
ml/notebooks/colab_training.ipynb      # Google Colab notebook
ml/notebooks/data_exploration.ipynb    # EDA notebook
```

### Output Files
```
ml/trained_models/final/*.h5           # Trained models
ml/trained_models/final/*.tflite       # Mobile models
ml/logs/training/*.csv                 # Training logs
ml/logs/*.json                         # Evaluation reports
ml/logs/confusion_matrix.png           # Confusion matrix
```

---

## ⚡ One-Liner Commands

### Colab
```bash
# Run entire pipeline (after setup)
# Just click Runtime → Run all
```

### Local - Full Pipeline
```bash
# Complete setup and training
git stash push -m "saving" && \
git checkout claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp && \
python -m venv venv && \
source venv/bin/activate && \
pip install -r requirements.txt && \
python data/scripts/download_dataset.py && \
python data/scripts/preprocess_data.py && \
python data/scripts/split_dataset.py && \
python ml/training.py --architecture MobileNetV2 --epochs 50
```

### Local - Just Training (if data ready)
```bash
# Activate and train
source venv/bin/activate && \
python ml/training.py --architecture MobileNetV2 --epochs 50
```

### Local - Quick Test (5 epochs)
```bash
# Fast test run
source venv/bin/activate && \
python ml/training.py --architecture baseline --epochs 5 --batch-size 32
```

---

## 📋 Pre-Training Checklist

### Before Training (Both Colab & Local)
```
□ Dataset downloaded (~54,000 images)
□ Data preprocessed
□ Train/val/test split created
□ Configuration files verified
□ GPU available (optional but recommended)
□ Sufficient time allocated
□ Stable power/internet
```

### After Training
```
□ Training accuracy >90%
□ Validation accuracy >90%
□ Test accuracy >90%
□ Model saved successfully
□ Evaluation report generated
□ Confusion matrix created
□ Inference tested
□ TFLite model created (optional)
□ Results backed up
```

---

## 🎓 Next Steps After Successful Training

1. **Review Results**
   ```bash
   cat ml/logs/*_evaluation.txt
   ```

2. **Compare Architectures**
   - Train all three models
   - Compare accuracy vs speed vs size

3. **Fine-Tune Hyperparameters**
   - Adjust learning rate
   - Modify epochs
   - Change batch size

4. **Deploy Model**
   - Integrate TFLite into mobile app
   - Set up API backend
   - Test on real images

5. **Production Deployment**
   - Cloud deployment (AWS, GCP, Azure)
   - Mobile app integration
   - Monitoring and logging

---

## 📞 Getting Help

### Documentation
```
docs/COLAB_SETUP.md     # Detailed Colab guide
docs/LOCAL_SETUP.md     # Detailed local guide
Learn_documentation.md   # Project overview
README.md               # Project introduction
```

### Verify Setup
```bash
# Check all files present
ls -R

# Verify Python environment
python --version
pip list

# Test imports
python -c "import tensorflow, numpy, PIL; print('✓ Ready')"

# Check configurations
python -c "import yaml; yaml.safe_load(open('ml/config.yaml')); print('✓ Config OK')"
```

### Common Commands
```bash
# Check disk space
df -h

# Check RAM usage
free -h

# Monitor GPU (if available)
nvidia-smi

# Check running processes
ps aux | grep python

# Kill training (if needed)
pkill -f training.py
```

---

## 🏁 Success Criteria

### You're ready when:
```
✓ Dataset: 54,000+ images organized
✓ Training: Completes without errors
✓ Accuracy: Test accuracy >92%
✓ Model: Saved and loadable
✓ Inference: Works on new images
✓ Export: TFLite model <25MB
```

### Red Flags:
```
✗ Training accuracy <70% after 20 epochs
✗ Validation accuracy much lower than training (overfitting)
✗ Out of memory errors
✗ Model file corrupted or missing
✗ Predictions random/incorrect
```

---

**For detailed instructions:**
- **Google Colab:** See [COLAB_SETUP.md](COLAB_SETUP.md)
- **Local Setup:** See [LOCAL_SETUP.md](LOCAL_SETUP.md)
