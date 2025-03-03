<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class ProductController extends Controller
{
    public function index()
    {
        $products = Product::withCount('reviews')->latest()->paginate(10);
        return response()->json($products);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Incoming product creation request:', $request->all());
            
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'category' => 'required|string',
                'stock' => 'required|integer|min:0',
                'features' => 'required|array',
                'features.*' => 'required|string',
                'specifications' => 'nullable|array',
                'images' => 'required|array|min:1',
                'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);
    
            if ($validator->fails()) {
                \Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json(['errors' => $validator->errors()], 422);
            }
    
            \Log::info('Validation passed, processing images');
            
            $imageUrls = [];
            foreach ($request->file('images') as $image) {
                \Log::info('Processing image:', ['name' => $image->getClientOriginalName()]);
                $path = $image->store('products', 'public');
                $imageUrls[] = Storage::url($path);
            }
    
            \Log::info('Creating product with data:', [
                'name' => $request->name,
                'category' => $request->category,
                'imageCount' => count($imageUrls)
            ]);
    
            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'category' => $request->category,
                'stock' => $request->stock,
                'features' => $request->features,
                'specifications' => $request->specifications,
                'images' => $imageUrls,
            ]);
    
            return response()->json($product, 201);
    
        } catch (\Exception $e) {
            \Log::error('Error creating product:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error creating product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Product $product)
    {
        $product->load('reviews.user');
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'stock' => 'required|integer|min:0',
            'features' => 'required|array',
            'features.*' => 'required|string',
            'specifications' => 'nullable|array',
            'new_images' => 'nullable|array',
            'new_images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'remove_images' => 'nullable|array',
            'remove_images.*' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imageUrls = $product->images;

        // Remove selected images
        if ($request->remove_images) {
            $imageUrls = array_diff($imageUrls, $request->remove_images);
            foreach ($request->remove_images as $imageUrl) {
                $path = str_replace('/storage/', '', $imageUrl);
                Storage::disk('public')->delete($path);
            }
        }

        // Add new images
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $path = $image->store('products', 'public');
                $imageUrls[] = Storage::url($path);
            }
        }

        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category' => $request->category,
            'stock' => $request->stock,
            'features' => $request->features,
            'specifications' => $request->specifications,
            'images' => array_values($imageUrls),
        ]);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        foreach ($product->images as $imageUrl) {
            $path = str_replace('/storage/', '', $imageUrl);
            Storage::disk('public')->delete($path);
        }

        $product->delete();
        return response()->json(null, 204);
    }
}
