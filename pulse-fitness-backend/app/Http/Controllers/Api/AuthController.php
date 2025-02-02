<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
   public function register(Request $request)
       {
           try {
               $validateUser = Validator::make($request->all(),
               [
                   'name' => 'required',
                   'lastname' => 'required',
                   'email' => 'required|email|unique:users,email',
                   'password' => 'required|min:8|confirmed',
                   'country' => 'required',
                   'phone' => 'required',
                   'city' => 'required',
                   'address' => 'required',
                   'postalcode' => 'required',
               ]);

               if($validateUser->fails()){
                   return response()->json([
                       'status' => false,
                       'message' => 'validation error',
                       'errors' => $validateUser->errors()
                   ], 401);
               }

               $user = User::create([
                   'name' => $request->name,
                   'lastname' => $request->lastname,
                   'email' => $request->email,
                   'password' => Hash::make($request->password),
                   'country' => $request->country,
                   'phone' => $request->phone,
                   'city' => $request->city,
                   'address' => $request->address,
                   'postalcode' => $request->postalcode,
               ]);

               return response()->json([
                   'status' => true,
                   'message' => 'User Created Successfully',
                   'token' => $user->createToken("API TOKEN")->plainTextToken
               ], 200);

           } catch (\Throwable $th) {
               return response()->json([
                   'status' => false,
                   'message' => $th->getMessage()
               ], 500);
           }
       }

    public function login(Request $request){
        try {
            $validateUser = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required'
            ]);

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            if (!Auth::attempt($request->only(['email', 'password']))) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email & Password do not match our records.',
                ], 401);
            }

            $user = User::where('email', $request->email)->first();

            return response()->json([
                'status' => true,
                'message' => 'User Logged In Successfully',
                'token' => $user->createToken("authToken")->plainTextToken
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

        public function logout(Request $request)
        {
            try {
                $request->user()->tokens()->delete();

                return response()->json([
                    'status' => true,
                    'message' => 'User Logged Out Successfully'
                ], 200);

            } catch (\Throwable $th) {
                return response()->json([
                    'status' => false,
                    'message' => $th->getMessage()
                ], 500);
            }
        }

        public function userProfile(Request $request)
    {
        try {
            $user = $request->user();

            return response()->json([
                'status' => true,
                'message' => 'User Profile Fetched Successfully',
                'data' => [
                    'name' => $user->name,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'country' => $user->country,
                    'city' => $user->city,
                    'postalcode' => $user->postalcode,
                    'address' => $user->address,
                    'is_admin' => $user->is_admin,
                ]
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function editprofile(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found',
                ], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'lastname' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            ]);

            if (isset($validated['name'])) {
                $user->name = $validated['name'];
            }

            if (isset($validated['lastname'])) {
                $user->lastname = $validated['lastname'];
            }

            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }

            $user->save();

            return response()->json([
                'status' => true,
                'message' => 'User Profile Updated Successfully',
                'data' => [
                    'name' => $user->name,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                ]
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }


    public function deleteprofile(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found',
                ], 404);
            }

            $user->delete();

            return response()->json([
                'status' => true,
                'message' => 'User Profile Deleted Successfully',
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}