<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        
        return response()->json([
            'status' => true,
            'data' => $users
        ]);
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        
        return response()->json([
            'status' => true,
            'data' => $user
        ]);
    }

    /**
     * Update the specified user's role.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string|in:user,admin'
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();
        
        return response()->json([
            'status' => true,
            'message' => 'User role updated successfully',
            'data' => $user
        ]);
    }
    
    /**
     * Get basic statistics for the admin dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function stats()
    {
        $userCount = User::count();
        $adminCount = User::where('role', 'admin')->count();
        $userStats = [
            'total' => $userCount,
            'admins' => $adminCount,
            'customers' => $userCount - $adminCount
        ];
        
        return response()->json([
            'status' => true,
            'data' => $userStats
        ]);
    }
}
