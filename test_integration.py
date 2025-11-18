"""
End-to-End Integration Test Script

Tests the complete prediction flow:
1. Register/Login user
2. Upload image for prediction
3. Verify response from ML service through Laravel backend
"""

import requests
import json
from PIL import Image
from io import BytesIO
import random

# Configuration
BACKEND_URL = "http://127.0.0.1:8006/api"
ML_SERVICE_URL = "http://localhost:8001"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
BLUE = '\033[94m'
YELLOW = '\033[93m'
RESET = '\033[0m'

def print_status(message, status="INFO"):
    colors = {"INFO": BLUE, "SUCCESS": GREEN, "ERROR": RED, "WARNING": YELLOW}
    color = colors.get(status, RESET)
    # Use safe encoding for Windows console
    try:
        print(f"{color}[{status}]{RESET} {message}")
    except UnicodeEncodeError:
        print(f"[{status}] {message}")


def create_test_image():
    """Create a simple test image (224x224 RGB)."""
    print_status("Creating test image (224x224)...", "INFO")

    # Create a simple colored image
    img = Image.new('RGB', (224, 224), color=(
        random.randint(100, 200),
        random.randint(100, 200),
        random.randint(50, 150)
    ))

    # Save to bytes
    img_bytes = BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)

    print_status(f"Test image created ({len(img_bytes.getvalue())} bytes)", "SUCCESS")
    return img_bytes


def test_ml_service_direct():
    """Test ML service directly."""
    print_status("\n=== Testing ML Service Directly ===", "INFO")

    # Test health
    try:
        response = requests.get(f"{ML_SERVICE_URL}/health")
        print_status(f"Health check: {response.status_code}", "SUCCESS" if response.status_code == 200 else "ERROR")
        print(f"  Response: {response.json()}")
    except Exception as e:
        print_status(f"Health check failed: {str(e)}", "ERROR")
        return False

    # Test model info
    try:
        response = requests.get(f"{ML_SERVICE_URL}/model-info")
        print_status(f"Model info: {response.status_code}", "SUCCESS" if response.status_code == 200 else "ERROR")
        model_info = response.json()
        print(f"  Model: {model_info.get('model_name')} v{model_info.get('model_version')}")
        print(f"  Classes: {model_info.get('num_classes')}")
    except Exception as e:
        print_status(f"Model info failed: {str(e)}", "ERROR")
        return False

    # Test prediction
    try:
        img_bytes = create_test_image()
        files = {'file': ('test.jpg', img_bytes, 'image/jpeg')}
        response = requests.post(f"{ML_SERVICE_URL}/predict", files=files)

        print_status(f"Prediction: {response.status_code}", "SUCCESS" if response.status_code == 200 else "ERROR")

        if response.status_code == 200:
            result = response.json()
            print(f"  Predicted: {result['predicted_class']}")
            print(f"  Confidence: {result['confidence']:.4f}")
            print(f"  Inference time: {result['inference_time']:.3f}s")
            print(f"  Total predictions: {len(result['all_predictions'])}")
            return True
        else:
            print(f"  Error: {response.text}")
            return False

    except Exception as e:
        print_status(f"Prediction failed: {str(e)}", "ERROR")
        return False


def test_backend_auth():
    """Test Laravel backend authentication."""
    print_status("\n=== Testing Laravel Backend Authentication ===", "INFO")

    # Generate unique email
    test_email = f"test_{random.randint(1000, 9999)}@test.com"

    # Register
    try:
        register_data = {
            "name": "Test User",
            "email": test_email,
            "password": "password123",
            "password_confirmation": "password123"
        }

        response = requests.post(
            f"{BACKEND_URL}/auth/register",
            json=register_data,
            headers={"Content-Type": "application/json", "Accept": "application/json"}
        )

        print_status(f"Registration: {response.status_code}", "SUCCESS" if response.status_code in [200, 201] else "ERROR")

        if response.status_code not in [200, 201]:
            print(f"  Error: {response.text}")
            return None, None

        result = response.json()
        token = result.get('token')
        user = result.get('data')

        print(f"  User: {user.get('name')} ({user.get('email')})")
        print(f"  Token: {token[:20]}..." if token else "  Token: None")

        return token, test_email

    except Exception as e:
        print_status(f"Registration failed: {str(e)}", "ERROR")
        return None, None


def test_backend_prediction(token):
    """Test prediction through Laravel backend."""
    print_status("\n=== Testing Prediction Through Laravel Backend ===", "INFO")

    if not token:
        print_status("No token available, skipping backend prediction test", "WARNING")
        return False

    try:
        img_bytes = create_test_image()
        img_bytes.seek(0)

        files = {'image': ('test.jpg', img_bytes, 'image/jpeg')}
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/json"
        }

        response = requests.post(
            f"{BACKEND_URL}/predictions",
            files=files,
            headers=headers
        )

        print_status(f"Prediction: {response.status_code}", "SUCCESS" if response.status_code in [200, 201] else "ERROR")

        if response.status_code in [200, 201]:
            result = response.json()

            if 'data' in result:
                prediction = result['data']
                print(f"  Predicted: {prediction.get('predicted_class')}")
                conf = prediction.get('confidence')
                # Handle both float and string confidence values
                try:
                    print(f"  Confidence: {float(conf):.4f}")
                except (ValueError, TypeError):
                    print(f"  Confidence: {conf}")
                print(f"  User ID: {prediction.get('user_id')}")
                print(f"  Created: {prediction.get('created_at')}")

                # Check if ML predictions are included
                if 'ml_predictions' in prediction:
                    ml_preds = prediction['ml_predictions']
                    print(f"  ML Predictions: {len(ml_preds)} classes")
                    print(f"  Top 3:")
                    for pred in ml_preds[:3]:
                        print(f"    - {pred.get('class_name')}: {pred.get('confidence'):.4f}")

                return True
            else:
                print(f"  Response: {json.dumps(result, indent=2)}")
                return True
        else:
            print(f"  Error: {response.text}")
            return False

    except Exception as e:
        print_status(f"Backend prediction failed: {str(e)}", "ERROR")
        return False


def test_backend_get_predictions(token):
    """Test retrieving predictions list."""
    print_status("\n=== Testing Get Predictions List ===", "INFO")

    if not token:
        print_status("No token available, skipping", "WARNING")
        return False

    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/json"
        }

        response = requests.get(
            f"{BACKEND_URL}/predictions",
            headers=headers
        )

        print_status(f"Get predictions: {response.status_code}", "SUCCESS" if response.status_code == 200 else "ERROR")

        if response.status_code == 200:
            result = response.json()
            predictions = result.get('data', [])
            print(f"  Total predictions: {len(predictions)}")

            if predictions:
                print(f"  Latest prediction:")
                latest = predictions[0]
                print(f"    - Class: {latest.get('predicted_class')}")
                conf = latest.get('confidence')
                # Handle both float and string confidence values
                try:
                    print(f"    - Confidence: {float(conf):.4f}")
                except (ValueError, TypeError):
                    print(f"    - Confidence: {conf}")
                print(f"    - Created: {latest.get('created_at')}")

            return True
        else:
            print(f"  Error: {response.text}")
            return False

    except Exception as e:
        print_status(f"Get predictions failed: {str(e)}", "ERROR")
        return False


def main():
    """Run all integration tests."""
    print_status("=" * 60, "INFO")
    print_status("End-to-End Integration Test", "INFO")
    print_status("=" * 60, "INFO")

    results = {
        "ml_service": False,
        "backend_auth": False,
        "backend_prediction": False,
        "get_predictions": False
    }

    # Test 1: ML Service
    results["ml_service"] = test_ml_service_direct()

    # Test 2: Backend Auth
    token, email = test_backend_auth()
    results["backend_auth"] = token is not None

    # Test 3: Backend Prediction
    if token:
        results["backend_prediction"] = test_backend_prediction(token)
        results["get_predictions"] = test_backend_get_predictions(token)

    # Summary
    print_status("\n" + "=" * 60, "INFO")
    print_status("Test Summary", "INFO")
    print_status("=" * 60, "INFO")

    for test_name, passed in results.items():
        status = "SUCCESS" if passed else "ERROR"
        emoji = "[PASS]" if passed else "[FAIL]"
        print_status(f"{emoji} {test_name.replace('_', ' ').title()}", status)

    total_tests = len(results)
    passed_tests = sum(results.values())
    print_status(f"\nTotal: {passed_tests}/{total_tests} tests passed",
                "SUCCESS" if passed_tests == total_tests else "WARNING")

    if passed_tests == total_tests:
        print_status("\n[SUCCESS] All integration tests passed! Application is fully operational.", "SUCCESS")
    else:
        print_status("\n[WARNING] Some tests failed. Review errors above.", "WARNING")


if __name__ == "__main__":
    main()
