<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Mail\EmailVerificationMail;
use Illuminate\Support\Facades\Mail;



class ApiController extends Controller
{
    public function register(Request $request) {
        $request->validate([
            'name' => 'required|string',
            'lastname' => 'required|string',
            'phone' => 'required|string|regex:/^(\+\d{1,3}[- ]?)?\d{10}$/',
            'birthdate' => 'required|date|before:today|after:-120 years',
            'gender' => 'required|string',
            'email' => 'required|email|unique:users|max:255',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'phone' => $request->phone,
            'birthdate' => $request->birthdate,
            'gender' => $request->gender,
            'email' => $request->email,
            'password' => Hash::make($request->password),

        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
        
        
        return response()->json([
            'message' => 'User registered successfully, please check your email for verification.',
            'user' => $user,
        ], 201);
        
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    
    
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function verifyEmail(Request $request)
    {
        // Only allow unauthenticated users to verify emails
        if (Auth::check()) {
            return response()->json([
                'message' => 'You are already logged in.',
            ], 400);
        }
    
        // Validate the incoming request data (email and token)
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
        ]);
    
        // Retrieve the user by email
        $user = User::where('email', $request->email)->first();
    
        // Check if the user exists
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }
    
        // Check if the email verification token matches
        if ($user->email_verification_token !== $request->token) {
            return response()->json([
                'message' => 'Invalid or expired token',
            ], 400);
        }
    
        // Update the user's email verification status
        $user->email_verified_at = now();
        $user->email_verification_token = null; // Clear the token after successful verification
        $user->save();
    
        // Return a success response
        return response()->json([
            'message' => 'User email verified successfully',
            'user' => $user,
        ], 200);
    }    
}