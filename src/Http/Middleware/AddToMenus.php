<?php
namespace Jounger\ApiConnector\Http\Middleware;

use Closure;
use Lavary\Menu\Facade as Menu;


class AddToMenus 
{

    public function handle($request, Closure $next)
    {

        // Add a menu option to the top to point to our page
        $menu = Menu::get('sidebar_processes');
        $submenu = $menu->add('Datasource');

        // Add our menu item to the top nav
        $submenu->add('API Connectors', [
            'route' => 'api-connectors.index',
            'icon' => 'fa-database',
            'id' => 'process-api'
        ]);

        return $next($request);
    }
    
}