<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MLService
{
    /**
     * Predict disease from uploaded image.
     *
     * @param UploadedFile $image
     * @return array
     * @throws \Exception
     */
    public function predict(UploadedFile $image): array
    {
        $serviceUrl = config('ml.service_url');
        $endpoint = config('ml.endpoints.predict');
        $timeout = config('ml.timeout');

        try {
            Log::info('Sending image to ML service for prediction', [
                'service_url' => $serviceUrl,
                'image_name' => $image->getClientOriginalName(),
                'image_size' => $image->getSize(),
            ]);

            $response = Http::timeout($timeout)
                ->attach('file', file_get_contents($image->getRealPath()), $image->getClientOriginalName())
                ->post($serviceUrl . $endpoint);

            if (!$response->successful()) {
                Log::error('ML service returned error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new \Exception(
                    'ML service error: ' . ($response->json()['detail'] ?? 'Unknown error'),
                    $response->status()
                );
            }

            $result = $response->json();

            Log::info('Prediction received from ML service', [
                'predicted_class' => $result['predicted_class'] ?? 'unknown',
                'confidence' => $result['confidence'] ?? 0,
                'inference_time' => $result['inference_time'] ?? 0,
            ]);

            return $result;

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('Failed to connect to ML service', [
                'service_url' => $serviceUrl,
                'error' => $e->getMessage(),
            ]);

            throw new \Exception('ML service is unavailable. Please try again later.');

        } catch (\Exception $e) {
            Log::error('ML prediction failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    /**
     * Check if ML service is healthy.
     *
     * @return bool
     */
    public function isHealthy(): bool
    {
        try {
            $serviceUrl = config('ml.service_url');
            $endpoint = config('ml.endpoints.health');

            $response = Http::timeout(5)->get($serviceUrl . $endpoint);

            if ($response->successful()) {
                $health = $response->json();
                return $health['status'] === 'healthy' && $health['model_loaded'] === true;
            }

            return false;

        } catch (\Exception $e) {
            Log::warning('ML service health check failed', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Get ML model information.
     *
     * @return array|null
     */
    public function getModelInfo(): ?array
    {
        try {
            $serviceUrl = config('ml.service_url');
            $endpoint = config('ml.endpoints.model_info');

            $response = Http::timeout(5)->get($serviceUrl . $endpoint);

            if ($response->successful()) {
                return $response->json();
            }

            return null;

        } catch (\Exception $e) {
            Log::warning('Failed to get ML model info', ['error' => $e->getMessage()]);
            return null;
        }
    }
}
