<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Define your model-policy mappings here if needed
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Register the default abilities
        Gate::define('viewAny', function ($user) {
            return true; // Allow all authenticated users for now
        });
        
        Gate::define('view', function ($user, $model) {
            return true; // Allow all authenticated users for now
        });
        
        Gate::define('create', function ($user) {
            return true; // Allow all authenticated users for now
        });
        
        Gate::define('update', function ($user, $model) {
            return true; // Allow all authenticated users for now
        });
        
        Gate::define('delete', function ($user, $model) {
            return true; // Allow all authenticated users for now
        });
    }
}
