<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test user
        $user = User::create([
            'name' => 'Test',
            'lastname' => 'User',
            'email' => 'testuser@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        // Create an active subscription for the user
        Subscription::create([
            'user_id' => $user->id,
            'name' => 'Premium Membership',
            'description' => 'Full access to all gym facilities and classes',
            'price' => 39.99,
            'features' => json_encode(['Unlimited access to gym', 'Access to all classes', 'Personal trainer consultation']),
            'specifications' => json_encode(['Valid for 30 days', '24/7 access']),
            'subscription_name' => 'Monthly Premium',
            'subscription_id' => 'premium-monthly',
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addDays(30),
            'status' => 'active',
        ]);
    }
}