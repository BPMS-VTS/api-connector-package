<?php
namespace Jounger\ApiConnector;

use Illuminate\Support\ServiceProvider as Provider;

class ServiceProvider extends Provider
{
    public function boot()
    {
        // Load our routes
        $this->loadRoutesFrom(__DIR__.'/../routes/api.php', 'api-connector');
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php', 'api-connector');

        // Load our views
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'api-connector');

        // Load our translations
        // $this->loadTranslationsFrom(__DIR__.'/../lang', 'api-connector');

        // load migrations
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        $this->publishes([
            __DIR__.'/../resources/views/index.blade.php' => base_path('resources/views/vendor/api-connector/index.blade.php'),
            __DIR__.'/../resources/views/tasks' => resource_path('views/tasks'),

            __DIR__.'/../resources/js/index.js' => base_path('resources/js/vendor/api-connector/index.js'),
            __DIR__.'/../resources/js/components' => resource_path('js/vendor/api-connector/components'),
            __DIR__.'/../resources/js/mixins' => resource_path('js/vendor/api-connector/mixins'),
            __DIR__.'/../resources/js/tasks' => resource_path('js/tasks'),
            __DIR__.'/../resources/js/processes/screen-builder' => resource_path('js/processes/screen-builder'),
        ], 'api-connector');
    }

    public function register()
    {
        $this->app->make('Jounger\ApiConnector\Http\Controllers\Process\ApiConnectorsController');
    }
}