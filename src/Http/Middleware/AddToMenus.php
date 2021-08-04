<?php

namespace Jounger\ApiConnector\Http\Middleware;

use Closure;
use Lavary\Menu\Facade as Menu;


class AddToMenus
{

    public function handle($request, Closure $next)
    {

        // Add a menu option to the top to point to our page
        $sidebar_menu = config('theme.sidebar_name', 'sidebar_processes');
        $menu = Menu::get($sidebar_menu);
        $submenu = $menu->get('sidebar_extension');
        if (is_null($submenu)) {
            $submenu = $menu->add('Tính năng mở rộng')->nickname('sidebar_extension');
        }

        // Add our menu item to the top nav
        $submenu->add('API Connectors', [
            'route' => 'api-connectors.index',
            'icon' => 'fa-database',
            'id' => 'process-api'
        ]);

        return $next($request);
    }
}