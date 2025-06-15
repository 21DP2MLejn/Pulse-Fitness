<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DynamicApiController extends Controller
{
    // Handle dynamic GET, POST, PUT, DELETE for resources
    public function handle(Request $request, $resource, $id = null)
    {
        // List of allowed resources (tables)
        $allowed = ['orders', 'users', 'products', 'subscriptions'];
        if (!in_array($resource, $allowed)) {
            return response()->json(['error' => 'Resource not allowed'], 403);
        }

        $table = $resource;
        $method = $request->method();

        switch ($method) {
            case 'GET':
                if ($id) {
                    $item = DB::table($table)->find($id);
                    return $item ? response()->json($item) : response()->json(['error' => 'Not found'], 404);
                } else {
                    return response()->json(DB::table($table)->get());
                }
            case 'POST':
                $data = $request->all();
                $newId = DB::table($table)->insertGetId($data);
                return response()->json(['id' => $newId], 201);
            case 'PUT':
            case 'PATCH':
                if (!$id) return response()->json(['error' => 'ID required'], 400);
                $data = $request->all();
                DB::table($table)->where('id', $id)->update($data);
                return response()->json(['success' => true]);
            case 'DELETE':
                if (!$id) return response()->json(['error' => 'ID required'], 400);
                DB::table($table)->where('id', $id)->delete();
                return response()->json(['success' => true]);
            default:
                return response()->json(['error' => 'Method not allowed'], 405);
        }
    }
}
