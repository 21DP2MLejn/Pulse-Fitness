<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Subscription;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class SubscribedUserSeeder extends Seeder
{
    /**
     * Run the seeder to create a user with an active subscription.
     */
    public function run(): void
    {
        // Create a new user
        $user = User::create([
            'name' => 'Member',
            'lastname' => 'User',
            'email' => 'member@example.com',
            'password' => Hash::make('password'),
            'country' => 'United States',
            'city' => 'New York',
            'address' => '123 Fitness Street',
            'postalcode' => '10001',
            'phone' => '123-456-7890',
            'role' => 'user',
        ]);

        // Create a subscription for the user
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'subscription_name' => 'Premium Membership',
            'subscription_id' => 'sub_' . uniqid(),
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addYear(),
            'status' => 'active',
            'price' => 99.99,
            'features' => json_encode(['Unlimited Classes', 'Personal Trainer', 'Nutrition Plan']),
            'specifications' => json_encode(['Duration: 12 months', 'Access: 24/7']),
        ]);

        // Update the user with the subscription ID
        $user->update([
            'subscription_id' => $subscription->id,
            'subscription_name' => $subscription->subscription_name,
        ]);

        $this->command->info('Created user with active subscription: ' . $user->email);
    }
}
