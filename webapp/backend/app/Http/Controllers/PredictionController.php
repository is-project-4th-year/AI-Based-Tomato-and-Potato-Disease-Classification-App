<?php

namespace App\Http\Controllers;

use App\Models\Prediction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
     * NOTE: This is a simplified version for base functionality.
     * Full implementation will integrate with ML service.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png|max:10240', // 10MB max
            'plant_type' => 'nullable|in:tomato,potato',
        ]);

        // Store the uploaded image
        $imagePath = $request->file('image')->store('predictions', 'public');

        // TODO: Call ML service for prediction
        // For now, create a placeholder prediction
        $prediction = $request->user()->predictions()->create([
            'image_path' => $imagePath,
            'predicted_class' => 'Pending Analysis', // Will be updated by ML service
            'confidence' => 0.0000,
            'plant_type' => $validated['plant_type'] ?? 'tomato',
        ]);

        return response()->json([
            'data' => $prediction->load('disease'),
            'message' => 'Image uploaded successfully. Prediction pending.',
        ], 201);
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
