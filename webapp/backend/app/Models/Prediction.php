<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prediction extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'image_path',
        'predicted_class',
        'confidence',
        'plant_type',
        'disease_id',
        'all_predictions',
        'inference_time',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'confidence' => 'decimal:4',
            'all_predictions' => 'array',
            'inference_time' => 'decimal:3',
        ];
    }

    /**
     * Get the user that owns the prediction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the disease associated with the prediction.
     */
    public function disease(): BelongsTo
    {
        return $this->belongsTo(Disease::class);
    }
}
