<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of available subscriptions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Get subscriptions that are meant to be publicly visible
            // These would typically be subscription plans, not user subscriptions
            $subscriptions = Subscription::where('user_id', 1) // Use admin user (ID 1) for subscription plans
                ->whereNull('subscription_id') // Plans don't have a subscription_id
                ->get();
            
            // If no subscription plans exist, create default ones
            if ($subscriptions->isEmpty()) {
                
                // Create Basic Plan
                $basicPlan = new Subscription();
                $basicPlan->user_id = 1; // Use admin user ID
                $basicPlan->name = 'Basic Plan';
                $basicPlan->subscription_name = 'Basic Plan';
                $basicPlan->description = 'Perfect for beginners who want to start their fitness journey';
                $basicPlan->price = 29.99;
                $basicPlan->features = [
                    'Access to gym facilities',
                    'Basic fitness assessment',
                    '2 group classes per week',
                    'Locker access'
                ];
                $basicPlan->specifications = [
                    'duration' => '1 month',
                    'access_hours' => 'Standard (6am-10pm)',
                    'trainer_sessions' => '0'
                ];
                $basicPlan->start_date = now();
                $basicPlan->status = 'active';
                $basicPlan->save();
                
                // Create Premium Plan
                $premiumPlan = new Subscription();
                $premiumPlan->user_id = 1; // Use admin user ID
                $premiumPlan->name = 'Premium Plan';
                $premiumPlan->subscription_name = 'Premium Plan';
                $premiumPlan->description = 'Our most popular plan with a perfect balance of features';
                $premiumPlan->price = 49.99;
                $premiumPlan->features = [
                    'Access to gym facilities',
                    'Comprehensive fitness assessment',
                    'Unlimited group classes',
                    'Locker access',
                    'Nutritional guidance',
                    '1 personal training session per month'
                ];
                $premiumPlan->specifications = [
                    'duration' => '1 month',
                    'access_hours' => 'Extended (5am-11pm)',
                    'trainer_sessions' => '1'
                ];
                $premiumPlan->start_date = now();
                $premiumPlan->status = 'active';
                $premiumPlan->save();
                
                // Create Elite Plan
                $elitePlan = new Subscription();
                $elitePlan->user_id = 1; // Use admin user ID
                $elitePlan->name = 'Elite Plan';
                $elitePlan->subscription_name = 'Elite Plan';
                $elitePlan->description = 'The ultimate fitness experience with premium services';
                $elitePlan->price = 89.99;
                $elitePlan->features = [
                    'Access to gym facilities',
                    'Advanced fitness assessment',
                    'Unlimited group classes',
                    'Premium locker access',
                    'Personalized nutrition plan',
                    '4 personal training sessions per month',
                    'Spa access',
                    'Towel service',
                    'Fitness app premium subscription'
                ];
                $elitePlan->specifications = [
                    'duration' => '1 month',
                    'access_hours' => '24/7 access',
                    'trainer_sessions' => '4'
                ];
                $elitePlan->start_date = now();
                $elitePlan->status = 'active';
                $elitePlan->save();
                
                // Fetch the newly created plans
                $subscriptions = Subscription::where('user_id', 1)
                    ->whereNull('subscription_id')
                    ->get();
                    
                Log::info('Created default subscription plans: ' . $subscriptions->count());
            }

            return response()->json([
                'status' => true,
                'message' => 'Subscriptions retrieved successfully',
                'data' => $subscriptions
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching subscriptions: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch subscriptions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified subscription.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $subscription = Subscription::findOrFail($id);
            
            // If this is a user-specific subscription, check if the user has access
            if ($subscription->user_id && $subscription->user_id != 1) {
                $user = Auth::user();
                if (!$user || $user->id != $subscription->user_id) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Unauthorized access to subscription'
                    ], 403);
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Subscription retrieved successfully',
                'data' => $subscription
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching subscription: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch subscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Subscribe a user to a subscription plan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function subscribe(Request $request)
    {
        try {
            // Check if user is authenticated
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'subscription_id' => 'required|integer|exists:subscriptions,id',
                'start_date' => 'required|date',
                'status' => 'required|string|in:active,inactive,cancelled'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get the subscription plan
            $subscriptionPlan = Subscription::findOrFail($request->subscription_id);
            
            // This is a valid subscription plan, we can proceed
            
            // Check if user already has an active subscription to this plan
            $existingSubscription = Subscription::where('user_id', Auth::id())
                ->where('subscription_id', $request->subscription_id)
                ->where('status', 'active')
                ->first();
                
            if ($existingSubscription) {
                return response()->json([
                    'status' => false,
                    'message' => 'You already have an active subscription to this plan',
                    'data' => $existingSubscription
                ], 400);
            }
            
            // Calculate end date (1 month from start date)
            $startDate = \Carbon\Carbon::parse($request->start_date);
            $endDate = $startDate->copy()->addMonth();
            
            // Create a new user subscription
            $userSubscription = Subscription::create([
                'user_id' => Auth::id(),
                'subscription_id' => $request->subscription_id,
                'subscription_name' => $subscriptionPlan->name,
                'name' => $subscriptionPlan->name,
                'description' => $subscriptionPlan->description,
                'price' => $subscriptionPlan->price,
                'features' => $subscriptionPlan->features,
                'specifications' => $subscriptionPlan->specifications,
                'start_date' => $request->start_date,
                'end_date' => $endDate,
                'status' => $request->status
            ]);
            
            // Update the user's record with subscription information
            $user = Auth::user();
            $user->subscription_id = $request->subscription_id;
            $user->subscription_name = $subscriptionPlan->name;
            $user->save();

            Log::info('User subscribed successfully', [
                'user_id' => Auth::id(),
                'subscription_id' => $request->subscription_id,
                'user_subscription_id' => $userSubscription->id
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Successfully subscribed to ' . $subscriptionPlan->name,
                'data' => $userSubscription
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Error creating subscription: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => false,
                'message' => 'Failed to create subscription',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Check if a user has a specific subscription.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkSubscription($id)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            $user = Auth::user();
            $subscription = Subscription::where('user_id', $user->id)
                ->where('subscription_id', $id)
                ->where('status', 'active')
                ->first();

            if ($subscription) {
                return response()->json([
                    'status' => true,
                    'message' => 'User has active subscription',
                    'data' => $subscription
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'User does not have this subscription'
                ], 200);
            }
        } catch (\Exception $e) {
            Log::error('Error checking subscription: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to check subscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's active subscriptions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserSubscriptions()
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            $subscriptions = Subscription::where('user_id', Auth::id())
                ->whereNotNull('subscription_id') // Only user subscriptions, not plans
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'User subscriptions retrieved successfully',
                'data' => $subscriptions
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error fetching user subscriptions: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch user subscriptions',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}