<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subscription;

class SubscriptionPlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear existing subscription plans (not user subscriptions)
        Subscription::whereNull('user_id')->orWhere('user_id', 0)->delete();
        
        // Create Basic Plan
        Subscription::create([
            'user_id' => 0, // 0 indicates this is a plan, not a user subscription
            'name' => 'Basic Plan',
            'subscription_name' => 'Basic Plan',
            'description' => 'Perfect for beginners who want to start their fitness journey',
            'price' => 29.99,
            'features' => json_encode([
                'Access to gym facilities',
                'Basic fitness assessment',
                '2 group classes per week',
                'Locker access'
            ]),
            'specifications' => json_encode([
                'duration' => '1 month',
                'access_hours' => 'Standard (6am-10pm)',
                'trainer_sessions' => '0'
            ]),
            'start_date' => now(),
            'status' => 'active'
        ]);
        
        // Create Premium Plan
        Subscription::create([
            'user_id' => 0,
            'name' => 'Premium Plan',
            'subscription_name' => 'Premium Plan',
            'description' => 'Our most popular plan with a perfect balance of features',
            'price' => 49.99,
            'features' => json_encode([
                'Access to gym facilities',
                'Comprehensive fitness assessment',
                'Unlimited group classes',
                'Locker access',
                'Nutritional guidance',
                '1 personal training session per month'
            ]),
            'specifications' => json_encode([
                'duration' => '1 month',
                'access_hours' => 'Extended (5am-11pm)',
                'trainer_sessions' => '1'
            ]),
            'start_date' => now(),
            'status' => 'active'
        ]);
        
        // Create Elite Plan
        Subscription::create([
            'user_id' => 0,
            'name' => 'Elite Plan',
            'subscription_name' => 'Elite Plan',
            'description' => 'The ultimate fitness experience with premium services',
            'price' => 89.99,
            'features' => json_encode([
                'Access to gym facilities',
                'Advanced fitness assessment',
                'Unlimited group classes',
                'Premium locker access',
                'Personalized nutrition plan',
                '4 personal training sessions per month',
                'Spa access',
                'Towel service',
                'Fitness app premium subscription'
            ]),
            'specifications' => json_encode([
                'duration' => '1 month',
                'access_hours' => '24/7 access',
                'trainer_sessions' => '4'
            ]),
            'start_date' => now(),
            'status' => 'active'
        ]);
    }
}
