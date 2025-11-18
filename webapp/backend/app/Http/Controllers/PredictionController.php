<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use App\Models\Prediction;
use App\Services\MLService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PredictionController extends Controller
{
    /**
     * Display a listing of predictions for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $predictions = $request->user()->predictions()
            ->with('disease')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'data' => $predictions->items(),
            'meta' => [
                'current_page' => $predictions->currentPage(),
                'last_page' => $predictions->lastPage(),
                'per_page' => $predictions->perPage(),
                'total' => $predictions->total(),
            ],
        ]);
    }

    /**
     * Store a newly created prediction in storage.
     *
     * Uploads image, calls ML service for prediction, and stores result.
     */
    public function store(Request $request, MLService $mlService): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png|max:10240', // 10MB max
            'plant_type' => 'nullable|in:tomato,potato',
        ]);

        // Store the uploaded image
        $imagePath = $request->file('image')->store('predictions', 'public');

        try {
            // Call ML service for prediction
            $mlResult = $mlService->predict($request->file('image'));

            // Extract plant type from predicted class
            $plantType = $this->extractPlantType($mlResult['predicted_class']);

            // Find or create disease record
            $disease = $this->findDiseaseByClass($mlResult['predicted_class'], $plantType);

            // Create prediction record
            $prediction = $request->user()->predictions()->create([
                'image_path' => $imagePath,
                'predicted_class' => $mlResult['predicted_class'],
                'confidence' => $mlResult['confidence'],
                'plant_type' => $plantType,
                'disease_id' => $disease?->id,
                'all_predictions' => $mlResult['all_predictions'] ?? [],
                'inference_time' => $mlResult['inference_time'] ?? null,
            ]);

            Log::info('Prediction created successfully', [
                'prediction_id' => $prediction->id,
                'predicted_class' => $prediction->predicted_class,
                'confidence' => $prediction->confidence,
            ]);

            return response()->json([
                'data' => $prediction->load('disease'),
                'message' => 'Prediction completed successfully',
            ], 201);

        } catch (\Exception $e) {
            // If ML service fails, clean up the uploaded image
            if (Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            Log::error('Prediction failed', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id,
            ]);

            return response()->json([
                'message' => 'Prediction failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Extract plant type from predicted class name.
     *
     * @param string $predictedClass
     * @return string
     */
    private function extractPlantType(string $predictedClass): string
    {
        if (str_starts_with($predictedClass, 'Tomato')) {
            return 'tomato';
        } elseif (str_starts_with($predictedClass, 'Potato')) {
            return 'potato';
        }

        return 'tomato'; // Default fallback
    }

    /**
     * Find disease by predicted class name and plant type.
     *
     * Attempts to match the disease name from the predicted class.
     *
     * @param string $predictedClass
     * @param string $plantType
     * @return Disease|null
     */
    private function findDiseaseByClass(string $predictedClass, string $plantType): ?Disease
    {
        // Extract disease name from class (e.g., "Tomato___Late_blight" -> "Late Blight")
        $parts = explode('___', $predictedClass);
        if (count($parts) < 2) {
            return null;
        }

        $diseaseName = str_replace('_', ' ', $parts[1]);

        // Try to find matching disease in database
        return Disease::where('plant_type', $plantType)
            ->where(function ($query) use ($diseaseName) {
                $query->where('name', 'LIKE', '%' . $diseaseName . '%')
                    ->orWhere('name', 'LIKE', '%' . strtolower($diseaseName) . '%');
            })
            ->where('is_active', true)
            ->first();
    }

    /**
     * Display the specified prediction.
     */
    public function show(Request $request, Prediction $prediction): JsonResponse
    {
        // Ensure the prediction belongs to the authenticated user
        if ($prediction->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'data' => $prediction->load('disease'),
        ]);
    }

    /**
     * Remove the specified prediction from storage.
     */
    public function destroy(Request $request, Prediction $prediction): JsonResponse
    {
        // Ensure the prediction belongs to the authenticated user
        if ($prediction->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Delete the image file
        if (Storage::disk('public')->exists($prediction->image_path)) {
            Storage::disk('public')->delete($prediction->image_path);
        }

        $prediction->delete();

        return response()->json([
            'message' => 'Prediction deleted successfully',
        ]);
    }
}
