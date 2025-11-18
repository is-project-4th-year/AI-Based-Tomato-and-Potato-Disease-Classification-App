<?php

namespace Database\Seeders;

use App\Models\Disease;
use Illuminate\Database\Seeder;

class DiseaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $diseases = [
            // Tomato Diseases
            [
                'name' => 'Late Blight',
                'scientific_name' => 'Phytophthora infestans',
                'plant_type' => 'tomato',
                'description' => 'Late blight is a devastating disease that affects tomato plants. It is caused by the water mold Phytophthora infestans and can quickly destroy entire crops if left untreated.',
                'symptoms' => 'Water-soaked spots on leaves that turn brown and dry out. White fungal growth may appear on the underside of leaves. Stems may develop dark streaks, and fruit develops firm brown lesions.',
                'treatment' => 'Remove and destroy infected plants immediately. Apply copper-based fungicides or other approved fungicides. Ensure good air circulation and avoid overhead watering. Plant resistant varieties when possible.',
                'prevention' => 'Use certified disease-free seeds and transplants. Avoid planting in areas where late blight occurred previously. Space plants adequately for air circulation. Water at the base of plants in the morning. Remove plant debris promptly.',
                'severity' => 'high',
                'is_active' => true,
            ],
            [
                'name' => 'Early Blight',
                'scientific_name' => 'Alternaria solani',
                'plant_type' => 'tomato',
                'description' => 'Early blight is a common tomato disease caused by the fungus Alternaria solani. It typically affects older plants and can cause significant yield loss if not managed.',
                'symptoms' => 'Dark brown spots with concentric rings (target-like pattern) on older lower leaves. Leaves may yellow and drop. Stems may develop lesions. Fruit may show dark, leathery spots near the stem end.',
                'treatment' => 'Remove affected leaves and destroy them. Apply fungicides containing chlorothalonil, copper, or mancozeb. Stake and prune plants for better air circulation. Mulch around plants to prevent soil splash.',
                'prevention' => 'Rotate crops on a 3-year cycle. Use disease-free seeds and transplants. Space plants adequately. Apply mulch to prevent soil-borne spores from splashing onto leaves. Water at the base of plants.',
                'severity' => 'medium',
                'is_active' => true,
            ],
            [
                'name' => 'Healthy',
                'scientific_name' => null,
                'plant_type' => 'tomato',
                'description' => 'The plant appears healthy with no visible signs of disease or pest damage.',
                'symptoms' => 'Green, vibrant foliage with no spots or discoloration. Normal growth pattern. No wilting or unusual leaf patterns.',
                'treatment' => 'Continue regular care and maintenance. Monitor plants regularly for any signs of disease or pests.',
                'prevention' => 'Maintain proper watering, fertilization, and spacing. Practice crop rotation. Inspect plants regularly. Remove dead plant material promptly.',
                'severity' => 'low',
                'is_active' => true,
            ],

            // Potato Diseases
            [
                'name' => 'Late Blight',
                'scientific_name' => 'Phytophthora infestans',
                'plant_type' => 'potato',
                'description' => 'Late blight is one of the most serious diseases of potato, capable of destroying entire fields in a matter of days under favorable conditions. It is the same pathogen that caused the Irish Potato Famine.',
                'symptoms' => 'Water-soaked spots on leaves that quickly enlarge and turn brown or black. White fungal growth appears on the underside of leaves in humid conditions. Tubers develop firm, dry, brown to purplish rot.',
                'treatment' => 'Remove and destroy infected plants and tubers. Apply protective fungicides before disease appears and continue at regular intervals. Harvest tubers promptly when mature. Cure and store properly.',
                'prevention' => 'Plant certified disease-free seed potatoes. Space plants adequately for air circulation. Avoid overhead irrigation. Hill potatoes deeply to protect tubers. Remove volunteer potatoes and cull piles. Use resistant varieties.',
                'severity' => 'high',
                'is_active' => true,
            ],
            [
                'name' => 'Early Blight',
                'scientific_name' => 'Alternaria solani',
                'plant_type' => 'potato',
                'description' => 'Early blight is a common potato disease that primarily affects foliage but can also impact tubers. It typically appears in mid to late season and can reduce yields significantly.',
                'symptoms' => 'Brown to black spots with concentric rings (target pattern) on older leaves. Leaves turn yellow and drop prematurely. Stems may have dark, slightly sunken lesions. Tubers may show dark, corky lesions.',
                'treatment' => 'Remove and destroy affected foliage. Apply fungicides as needed. Maintain plant vigor through proper nutrition and watering. Harvest tubers when mature and allow proper curing.',
                'prevention' => 'Use certified disease-free seed potatoes. Practice 3-4 year crop rotation. Maintain adequate plant spacing. Avoid overhead watering or water early in the day. Remove plant debris after harvest. Apply mulch.',
                'severity' => 'medium',
                'is_active' => true,
            ],
            [
                'name' => 'Healthy',
                'scientific_name' => null,
                'plant_type' => 'potato',
                'description' => 'The plant shows no signs of disease and appears to be growing normally with healthy foliage.',
                'symptoms' => 'Green, healthy foliage. Normal growth and development. No spots, discoloration, or wilting.',
                'treatment' => 'Continue regular maintenance and monitoring. Ensure proper nutrition and watering.',
                'prevention' => 'Practice crop rotation. Use certified seed potatoes. Maintain proper spacing and avoid overwatering. Remove plant debris. Monitor regularly for pests and diseases.',
                'severity' => 'low',
                'is_active' => true,
            ],
        ];

        foreach ($diseases as $disease) {
            Disease::create($disease);
        }
    }
}
