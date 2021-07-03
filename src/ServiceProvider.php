<?php
namespace Jounger\ApiConnector;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider as Provider;
use ProcessMaker\Package\Packages\Events\PackageEvent;
use Jounger\ApiConnector\Http\Middleware\AddToMenus;
use Jounger\ApiConnector\Listeners\PackageListener;

// TEST
use Illuminate\Support\Facades\Event;
use ProcessMaker\Events\ScreenBuilderStarting;

class ServiceProvider extends Provider
{
    // Assign the default namespace for our controllers
    protected $namespace = 'Jounger\ApiConnector\Http\Controllers';

    /**
     * If your plugin will provide any services, you can register them here.
     * See: https://laravel.com/docs/5.6/providers#the-register-method
     */
    public function register()
    {
        // Nothing is registered at this time
    }

    /**
     * After all service provider's register methods have been called, your boot method 
     * will be called. You can perform any initialization code that is dependent on 
     * other service providers at this time.  We've included some example behavior 
     * to get you started.
     * 
     * See: https://laravel.com/docs/5.6/providers#the-boot-method
     */
    public function boot()
    {
        // Load our views
        $this->loadViewsFrom(__DIR__.'/../resources/views/', 'api-connector-plugin');

        // Load our translations
        $this->loadTranslationsFrom(__DIR__.'/../lang', 'api-connector-plugin');

        // load migrations
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        // Menus for BPM are done through middleware. 
        Route::pushMiddlewareToGroup('web', AddToMenus::class);

        // Assigning to the web middleware will ensure all other middleware assigned to 'web'
        // will execute. If you wish to extend the user interface, you'll use the web middleware
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(__DIR__ . '/../routes/web.php');
        
        // If you wish to extend the api, be sure to utilize the api middleware. In your api 
        // Routes file, you should prefix your routes with api/1.0
        Route::middleware('api')
            ->namespace($this->namespace)
            ->prefix('api/1.0')
            ->group(__DIR__ . '/../routes/api.php');

        // TEST
        Event::listen(ScreenBuilderStarting::class, function($event) {
            $event->manager->addScript(mix('js/screen-extend.js', 'vendor/api-connector'));
        });

        $this->publishes([
            __DIR__.'/../public' => public_path('vendor/api-connector'),

            __DIR__.'/../resources/js/mixins' => resource_path('js/vendor/api-connector/mixins'),
            __DIR__.'/../resources/js/processes/screen-builder' => resource_path('js/processes/screen-builder'),
        ], 'api-connector-plugin');

        $this->app['events']->listen(PackageEvent::class, PackageListener::class);
    }
}