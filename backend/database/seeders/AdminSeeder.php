<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        // Create admin user if it doesn't exist
        if (!User::where('email', 'admin@pulsefitness.com')->exists()) {
            User::create([
                'name' => 'Admin',
                'lastname' => 'User',
                'email' => 'admin@pulsefitness.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'country' => 'Admin Country',
                'city' => 'Admin City',
                'address' => 'Admin Address',
                'postalcode' => '12345',
                'phone' => '123-456-7890',
            ]);
        }
        
        // Create sample products
        $this->createSampleProducts();
    }
    
    private function createSampleProducts()
    {
        $products = [
            [
                'name' => 'Premium Dumbbell Set',
                'description' => 'High-quality adjustable dumbbell set perfect for home workouts. Includes various weight plates for customization.',
                'price' => 129.99,
                'category' => 'Equipment',
                'stock' => 50,
                'rating' => 4.8,
                'images' => ['/images/products/dumbbells.jpg'],
                'features' => [
                    'Adjustable weights from 5-25kg per dumbbell',
                    'Durable cast iron construction',
                    'Comfortable grip handles',
                    'Compact storage design'
                ],
                'specifications' => [
                    'weight' => '50kg total',
                    'material' => 'Cast Iron with Rubber Coating',
                    'dimensions' => '40 x 20 x 20 cm per dumbbell'
                ]
            ],
            [
                'name' => 'Whey Protein Powder',
                'description' => 'Premium whey protein powder for muscle recovery and growth. Contains 25g of protein per serving with minimal fat and carbs.',
                'price' => 49.99,
                'category' => 'Supplements',
                'stock' => 100,
                'rating' => 4.7,
                'images' => ['/images/products/protein.jpg'],
                'features' => [
                    '25g protein per serving',
                    'Low in fat and carbohydrates',
                    'Mixes easily with water or milk',
                    'Great taste with no artificial sweeteners'
                ],
                'specifications' => [
                    'weight' => '1kg',
                    'servings' => '40',
                    'flavor' => 'Chocolate'
                ]
            ],
            [
                'name' => 'Performance Training Shirt',
                'description' => 'Moisture-wicking training shirt designed for maximum comfort during intense workouts. Features anti-odor technology.',
                'price' => 34.99,
                'category' => 'Apparel',
                'stock' => 75,
                'rating' => 4.5,
                'images' => ['/images/products/shirt.jpg'],
                'features' => [
                    'Moisture-wicking fabric',
                    'Anti-odor technology',
                    'Four-way stretch material',
                    'Flatlock seams to prevent chafing'
                ],
                'specifications' => [
                    'material' => '92% Polyester, 8% Elastane',
                    'care' => 'Machine wash cold',
                    'sizes' => 'S, M, L, XL, XXL'
                ]
            ],
            [
                'name' => 'Smart Fitness Tracker',
                'description' => 'Advanced fitness tracker with heart rate monitoring, sleep tracking, and workout detection. Waterproof and long battery life.',
                'price' => 89.99,
                'category' => 'Accessories',
                'stock' => 60,
                'rating' => 4.6,
                'images' => ['/images/products/tracker.jpg'],
                'features' => [
                    '24/7 heart rate monitoring',
                    'Sleep tracking',
                    'Automatic workout detection',
                    '7-day battery life',
                    'Waterproof up to 50m'
                ],
                'specifications' => [
                    'display' => '1.3" AMOLED',
                    'battery' => 'Lithium-ion, 7 days typical use',
                    'connectivity' => 'Bluetooth 5.0',
                    'compatibility' => 'iOS 12+ and Android 7+'
                ]
            ]
        ];
        
        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
