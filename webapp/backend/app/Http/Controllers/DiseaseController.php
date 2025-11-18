<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DiseaseController extends Controller
{
    /**
     * Display a listing of diseases.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Disease::query()->where('is_active', true);

        // Filter by plant type if provided
        if ($request->has('plant_type')) {
            $query->where('plant_type', $request->plant_type);
        }

        // Search by name if provided
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $diseases = $query->orderBy('name')->get();

        return response()->json([
            'data' => $diseases,
        ]);
    }

    /**
     * Display the specified disease.
     */
    public function show(Disease $disease): JsonResponse
    {
        if (!$disease->is_active) {
            return response()->json([
                'message' => 'Disease not found',
            ], 404);
        }

        return response()->json([
            'data' => $disease,
        ]);
    }
}
