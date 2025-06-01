<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\AdminSeeder;
use Database\Seeders\SubscribedUserSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create a test user with admin role
        User::factory()->create([
            'name' => 'Test',
            'lastname' => 'User',
            'email' => 'test@example.com',
            'role' => 'admin',
            'country' => 'United States',
            'city' => 'New York',
            'address' => '123 Test Street',
            'postalcode' => '10001',
            'phone' => '123-456-7890',
        ]);
        
        // Create a regular user
        User::factory()->create([
            'name' => 'Regular',
            'lastname' => 'User',
            'email' => 'user@example.com',
            'role' => 'user',
        ]);
        
        // Create some additional users
        User::factory(5)->create();
        
        // Call the admin seeder to create products and subscribed user
        $this->call([
            AdminSeeder::class,
            SubscribedUserSeeder::class,
        ]);
    }
}
