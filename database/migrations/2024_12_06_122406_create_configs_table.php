<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('configs', function (Blueprint $table) {
            $table->id(); // Creates an unsigned BIGINT primary key with auto-increment
            $table->string('key', 200); // Config key
            $table->text('value')->nullable(); // Config value
            $table->longText('meta')
                ->nullable()
                ->charset('utf8mb4')
                ->collation('utf8mb4_bin')
                ->comment('Extra information about the configuration'); // Config metadata
            $table->boolean('status')
                ->default(1)
                ->comment('1: Active, 0: Inactive'); // Status field
            $table->timestamps(); // Created_at and updated_at columns
        });

        // Adding a JSON validation constraint for the `meta` field
        DB::statement('ALTER TABLE configs ADD CONSTRAINT CHECK (json_valid(`meta`))');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configs');
    }
};
