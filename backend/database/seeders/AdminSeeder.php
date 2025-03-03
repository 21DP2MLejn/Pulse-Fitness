<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin',
            'lastname' => 'User',
            'email' => 'admin@pulsefitness.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'city' => 'Admin City',
            'address' => 'Admin Address',
            'postalcode' => '12345',
        ]);
    }
}
