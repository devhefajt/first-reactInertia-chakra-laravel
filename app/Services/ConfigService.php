<?php

namespace App\Services;

use App\Models\Config;
use Illuminate\Support\Facades\DB;

class ConfigService
{
    public function getList()
    {
        $configs = Config::select('key', 'value', 'meta')->get();
        return [
            'configs' => $configs
        ];
    }

    public function update($data)
    {

        // dd($data);

        if (!empty($data) && is_array($data)) {
            foreach ($data as $key => $item) {

                $status = (isset($item['value']) && $item['value'] != 0)  ? 1 : 0;
                $updatedData = ['value' => $item['value'], 'status' => $status];

                if (!blank($item['meta'])) {
                    $meta = explode(',', $item['meta']);
                    $updatedData['meta'] = json_encode(array_map('trim', $meta));
                }else{
                    $updatedData['meta'] = null;
                }
                DB::table('configs')->whereKey($key)->update($updatedData);
            }
        }
        return true;
    }

}