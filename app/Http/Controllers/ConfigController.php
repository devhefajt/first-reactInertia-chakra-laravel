<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Models\Config;
use App\Services\ConfigService;

class ConfigController extends Controller
{

    public function show(): Response
    {
        return Inertia::render('Admin/Config');
    }


    protected $configService;

    public function __construct(ConfigService $configService)
    {
        $this->configService = $configService;
    }

    public function index()
    {
        $configs = $this->configService->getList();
        return response()->json($configs, 200);
    }

    public function update(Request $request)
    {
        
        $data = $request->all();
        $this->configService->update($data);

        return response()->json([
            'message' => 'Configurations updated successfully!'
        ], 200);
    }

}
