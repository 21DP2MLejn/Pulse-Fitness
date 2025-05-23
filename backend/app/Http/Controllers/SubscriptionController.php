<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
            $subscriptions = Subscription::whereNull('user_id')
                ->orWhere('user_id', 0)
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Subscriptions retrieved successfully',
                'data' => $subscriptions
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error fetching subscriptions: ' . $e->getMessage());
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
            if ($subscription->user_id && $subscription->user_id != 0) {
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
            \Log::error('Error fetching subscription: ' . $e->getMessage());
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
            $validator = Validator::make($request->all(), [
                'subscription_id' => 'required|exists:subscriptions,id',
                'start_date' => 'required|date',
                'status' => 'required|string'
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
            
            // Create a new user subscription
            $userSubscription = new Subscription();
            $userSubscription->user_id = Auth::id();
            $userSubscription->subscription_id = $request->subscription_id;
            $userSubscription->subscription_name = $subscriptionPlan->name;
            $userSubscription->name = $subscriptionPlan->name;
            $userSubscription->description = $subscriptionPlan->description;
            $userSubscription->price = $subscriptionPlan->price;
            $userSubscription->features = $subscriptionPlan->features;
            $userSubscription->specifications = $subscriptionPlan->specifications;
            $userSubscription->start_date = $request->start_date;
            $userSubscription->status = $request->status;
            $userSubscription->save();

            return response()->json([
                'status' => true,
                'message' => 'Successfully subscribed',
                'data' => $userSubscription
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating subscription: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to create subscription',
                'error' => $e->getMessage()
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
            \Log::error('Error checking subscription: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to check subscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
