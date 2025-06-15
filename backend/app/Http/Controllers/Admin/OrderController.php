<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of all orders.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $orders = Order::with(['user:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'user_id' => $order->user_id,
                    'total_amount' => (float) $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'user' => [
                        'name' => $order->user ? $order->user->name : $order->customer_first_name . ' ' . $order->customer_last_name,
                        'email' => $order->user ? $order->user->email : $order->customer_email
                    ]
                ];
            });
        
        return response()->json([
            'status' => true,
            'data' => $orders
        ]);
    }

    /**
     * Get the total count of orders.
     *
     * @return \Illuminate\Http\Response
     */
    public function count()
    {
        $totalOrders = Order::count();
        
        return response()->json([
            'status' => true,
            'data' => [
                'total_orders' => $totalOrders
            ]
        ]);
    }
} 