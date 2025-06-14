<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Mail\OrderConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders
     */
    public function index()
    {
        $orders = Order::with('items')->where('user_id', Auth::id())->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Store a new order
     */
    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'customer.firstName' => 'required|string|max:255',
            'customer.lastName' => 'required|string|max:255',
            'customer.email' => 'required|email|max:255',
            'customer.phone' => 'required|string|max:20',
            'customer.address' => 'required|string|max:500',
            'customer.city' => 'required|string|max:100',
            'customer.state' => 'required|string|max:100',
            'customer.zipCode' => 'required|string|max:20',
            'customer.country' => 'required|string|max:100',
            'customer.notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.name' => 'required|string|max:255',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.total' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'shipping' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Generate order number
            $orderNumber = 'ORD-' . strtoupper(Str::random(8));

            // Get the authenticated user ID
            $userId = null;
            if ($request->bearerToken()) {
                $user = Auth::guard('sanctum')->user();
                if ($user) {
                    $userId = $user->id;
                }
            }

            // Create the order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $userId,
                'customer_first_name' => $request->customer['firstName'],
                'customer_last_name' => $request->customer['lastName'],
                'customer_email' => $request->customer['email'],
                'customer_phone' => $request->customer['phone'],
                'shipping_address' => $request->customer['address'],
                'shipping_city' => $request->customer['city'],
                'shipping_state' => $request->customer['state'],
                'shipping_zip_code' => $request->customer['zipCode'],
                'shipping_country' => $request->customer['country'],
                'notes' => $request->customer['notes'] ?? null,
                'subtotal' => $request->subtotal,
                'shipping_cost' => $request->shipping,
                'total' => $request->total,
                'status' => 'pending',
                'payment_method' => $request->payment_method ?? null,
                'payment_id' => $request->payment_id ?? null,
            ]);

            // Create order items
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['name'],
                    'product_price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'total' => $item['total'],
                ]);
            }

            // Send confirmation email
            try {
                Mail::to($request->customer['email'])->send(new OrderConfirmation($order));
            } catch (\Exception $e) {
                // Log email error but don't fail the order
                \Log::error('Failed to send order confirmation email: ' . $e->getMessage());
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => [
                    'order_number' => $orderNumber,
                    'order_id' => $order->id,
                    'total' => $order->total,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get order details
     */
    public function show($id)
    {
        try {
            $order = Order::with('items')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }
    }

    /**
     * Get orders by email
     */
    public function getByEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $orders = Order::with('items')
            ->where('customer_email', $request->email)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $order = Order::findOrFail($id);
            $order->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }
    }
}