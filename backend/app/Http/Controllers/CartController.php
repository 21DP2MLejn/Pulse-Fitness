<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
public function index(Request $request)
{
    $cart = $this->getOrCreateCart($request->user()->id);
    $cartItems = $cart->items()->with('product')->get();

    // Flatten product data into cart items
    $cartItems = $cartItems->map(function($cartItem) {
        return [
            'id' => $cartItem->id,
            'quantity' => $cartItem->quantity,
            'product_id' => $cartItem->product->id,
            'name' => $cartItem->product->name,
            'price' => $cartItem->product->price,
            'image' => $cartItem->product->image,
        ];
    });

    return response()->json([
        'status' => true,
        'data' => $cartItems,
    ]);
}



    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getOrCreateCart($request->user()->id);
        $product = Product::findOrFail($request->product_id);

        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            $cartItem = new CartItem([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
            ]);
            $cart->items()->save($cartItem);
        }

        return response()->json([
            'status' => true,
            'message' => 'Product added to cart successfully.',
            'data' => $cartItem,
        ]);
    }

    public function updateCartItem(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::findOrFail($id);
        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json([
            'status' => true,
            'message' => 'Cart item updated successfully.',
            'data' => $cartItem,
        ]);
    }

    public function removeFromCart($id)
    {
        $cartItem = CartItem::findOrFail($id);
        $cartItem->delete();

        return response()->json([
            'status' => true,
            'message' => 'Item removed from cart successfully.',
        ]);
    }

    private function getOrCreateCart($userId)
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }
}