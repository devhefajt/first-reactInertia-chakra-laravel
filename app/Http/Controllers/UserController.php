<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Admin;

class UserController extends Controller
{
    public function index(): Response
    {

        return Inertia::render('Admin/User');
    }


    public function create(): Response
    {
        return Inertia::render('Admin/Create');
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email',
            'image' => 'nullable|image|mimes:jpg,png,jpeg,gif|max:2048',
        ]);
    

        $userData = $request->only(['name', 'email']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $destinationPath = public_path('images');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move($destinationPath, $fileName);

            $userData['image'] = 'images/' . $fileName;
        }

        // Simulate saving user data (replace with actual save logic)
        Admin::create($userData);

        return response()->json([
            'message' => 'User created successfully!',
            'data' => $userData, 
        ]);
    }
}
