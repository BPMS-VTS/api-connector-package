<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Artisan::command('api-connector:install', function () {
    // create api_connectors if doesn't exist
    if (!Schema::hasTable('api_connectors')) {
        Schema::create('api_connectors', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('description')->nullable();
            $table->json('config')->nullable();
            $table->string('component')->default('Datasource');
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
        });
    }
    // add api_config column in screens table
    if (Schema::hasTable('screens')) {
        Schema::table('screens', function (Blueprint $table) {
            $table->json('api_config')->default('[]');
        });
    }
    Artisan::call('vendor:publish', [
        '--tag' => 'api-connector',
        '--force' => true
    ]);

    $this->info('Package API Connector has been installed');
})->describe('Installs the required js files and table in DB');
