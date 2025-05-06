<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{

    public function store(Request $request)
    {
        try{
            \Log::info('Incoming a new subscription creation')
            
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'features' => 'nullable|array',
                'features.*' => 'nullable|string',
                'specifications' => 'nullable|array',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error creating subscription:', $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to create subscription',
                'error' => $e->getMessage()
            ], 500);
        }

        if ($validator->fails()) {
            \Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        \Log::info('Validation passed, processing subscription data');
        
        $subscription = new Product();
        $subscription->name = $request->name;
        $subscription->description = $request->description;
        $subscription->price = $request->price;
        $subscription->features = $request->features ?? [];
        $subscription->specifications = $request->specifications ?? [];
        $subscription->save();
        
        \Log::info('Subscription created successfully', ['subscription_id' => $subscription->id]);
        
        return response()->json([
            'status' => true,
            'message' => 'Subscription created successfully',
            'data' => $subscription
        ], 201);
    }

    public function update(Request $request, $id)
    {
        try {
            \Log::info('Incoming subscription update request', ['id' => $id]);
            
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'features' => 'nullable|array',
                'features.*' => 'nullable|string',
                'specifications' => 'nullable|array',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating subscription:', $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to update subscription',
                'error' => $e->getMessage()
            ], 500);
        }
        
        if ($validator->fails()) {
            \Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        \Log::info('Validation passed, processing subscription data');
        
        $subscription = Product::findOrFail($id);
        $subscription->name = $request->name;
        $subscription->description = $request->description;
        $subscription->price = $request->price;
        $subscription->features = $request->features ?? [];
        $subscription->specifications = $request->specifications ?? [];
        $subscription->save();
        
        \Log::info('Subscription updated successfully', ['subscription_id' => $subscription->id]);
        
        return response()->json([
            'status' => true,
            'message' => 'Subscription updated successfully',
            'data' => $subscription
        ], 200);
    }

    public function destroy($id)
    {
        try {
            \Log::info('Incoming subscription delete request', ['id' => $id]);
            
            $subscription = Product::findOrFail($id);
            $subscription->delete();
            
            \Log::info('Subscription deleted successfully', ['subscription_id' => $subscription->id]);
            
            return response()->json([
                'status' => true,
                'message' => 'Subscription deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error deleting subscription:', $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete subscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id){
        $subscription = Product::findOrFail($id);
        return response()->json([
            'status' => true,
            'message' => 'Subscription retrieved successfully',
            'data' => $subscription
        ], 200);
    }
}