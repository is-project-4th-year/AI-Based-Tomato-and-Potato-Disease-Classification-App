<?php

return [

    /*
    |--------------------------------------------------------------------------
    | ML Service Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the FastAPI ML service that handles disease prediction.
    |
    */

    'service_url' => env('ML_SERVICE_URL', 'http://localhost:8000'),

    'timeout' => env('ML_SERVICE_TIMEOUT', 30),

    'endpoints' => [
        'predict' => '/predict',
        'health' => '/health',
        'model_info' => '/model-info',
    ],

    'retry' => [
        'times' => env('ML_SERVICE_RETRY_TIMES', 2),
        'sleep' => env('ML_SERVICE_RETRY_SLEEP', 1000), // milliseconds
    ],

];
