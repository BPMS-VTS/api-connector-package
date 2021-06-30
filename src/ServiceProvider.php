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
            __DIR__.'/../resources/views' => resource_path('views/vendor/api-connector'),
            __DIR__.'/../resources/js' => resource_path('js/vendor/api-connector'),
        ], 'api-connector');
    }

    public function register()
    {

    }
}