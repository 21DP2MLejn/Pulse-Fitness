<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Subscription;
use Illuminate\Support\Facades\Hash;

// Create a test user
$user = User::where('email', 'testuser@example.com')->first();

if (!$user) {
    $user = new User();
    $user->name = 'Test';
    $user->lastname = 'User';
    $user->email = 'testuser@example.com';
    $user->password = Hash::make('password123');
    $user->subscription_name = 'Premium';
    $user->save();
    
    echo "Created new user with ID: " . $user->id . "\n";
} else {
    echo "Using existing user with ID: " . $user->id . "\n";
}

// Create a subscription for the user
$subscription = Subscription::where('user_id', $user->id)->first();

if (!$subscription) {
    $subscription = new Subscription();
    $subscription->user_id = $user->id;
    $subscription->name = 'Premium Plan';
    $subscription->subscription_name = 'Premium';
    $subscription->subscription_id = 'sub_' . uniqid();
    $subscription->start_date = now();
    $subscription->end_date = now()->addYear();
    $subscription->status = 'active';
    $subscription->price = 99.99;
    $subscription->features = json_encode(['Unlimited access', 'Personal trainer', 'Reservation priority']);
    $subscription->save();
    
    echo "Created new subscription with ID: " . $subscription->id . "\n";
} else {
    echo "User already has subscription with ID: " . $subscription->id . "\n";
}

// Update the user with the subscription ID
$user->subscription_id = $subscription->id;
$user->save();

echo "Updated user with subscription ID: " . $subscription->id . "\n";
echo "Login credentials: testuser@example.com / password123\n";
