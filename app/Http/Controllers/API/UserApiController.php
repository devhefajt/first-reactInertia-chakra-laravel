<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;


class UserApiController extends Controller
{
    public function index()
    {
        $users = Admin::paginate(5);
        return response()->json($users);
    }

}
