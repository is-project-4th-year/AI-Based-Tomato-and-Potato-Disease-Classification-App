# ML Models Directory

## Required Model File

Place the trained MobileNetV2 model in this directory:

**Filename:** `MobileNetV2_20251027_200458_final.h5`

### Model Specifications
- **Architecture:** MobileNetV2
- **Input Shape:** (224, 224, 3)
- **Number of Classes:** 13
- **Format:** Keras H5
- **Size:** ~25 MB

### How to Obtain the Model

The trained model is stored on Google Drive. Download it and place it in this directory.

**Google Drive Location:** [To be provided]

### Alternative: TFLite Model

You can also use the TensorFlow Lite version for faster inference:

**Filename:** `MobileNetV2_20251027_200458_final.tflite`

Update the `MODEL_PATH` in `.env` to use the TFLite model.

### Class Labels

The class labels are defined in `class_labels.json`:

1. Tomato___Bacterial_spot
2. Tomato___Early_blight
3. Tomato___Late_blight
4. Tomato___Leaf_Mold
5. Tomato___Septoria_leaf_spot
6. Tomato___Spider_mites Two-spotted_spider_mite
7. Tomato___Target_Spot
8. Tomato___Tomato_Yellow_Leaf_Curl_Virus
9. Tomato___Tomato_mosaic_virus
10. Tomato___healthy
11. Potato___Early_blight
12. Potato___Late_blight
13. Potato___healthy

### Verification

After placing the model, verify it loads correctly:

```bash
python -c "import tensorflow as tf; model = tf.keras.models.load_model('models/MobileNetV2_20251027_200458_final.h5'); print(model.summary())"
```

## DO NOT COMMIT MODEL FILES

Model files (*.h5, *.tflite) are excluded from git via .gitignore due to their size.
Store models on Google Drive or cloud storage for deployment.
