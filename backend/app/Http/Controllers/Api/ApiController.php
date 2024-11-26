<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
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

        $verificationToken = Str::random(10);

        $user = User::create([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'phone' => $request->phone,
            'birthdate' => $request->birthdate,
            'gender' => $request->gender,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verification_token' => $verificationToken,
        ]);
        
        Mail::to($user->email)->send(new EmailVerificationMail($verificationToken));
        
        return response()->json([
            'message' => 'User registered successfully, please check your email for verification.',
            'user' => $user,
        ], 201);
        
    }

    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
    
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $request->session()->regenerate();
    
            return response()->json([
                'message' => 'Login successful',
                'user' => auth()->user(),
            ], 200);
        }
    
        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }
    

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json([
            'message' => 'Successfully logged out',
        ], 200);
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