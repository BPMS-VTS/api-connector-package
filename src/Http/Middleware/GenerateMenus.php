<?php

namespace Jounger\ApiConnector\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Lavary\Menu\Facade as Menu;
use ProcessMaker\Models\Setting;

class GenerateMenus
{
    /**
     * Generate the core menus that are used in web requests for our application
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        Menu::make('sidebar_processes', function ($menu) {
            $submenu = $menu->add(__('Designer'));
            if (\Auth::check() && \Auth::user()->can('view-api_connectors')) {
                $submenu->add(__('API Connectors'), [
                    'route' => 'api-connectors.index',
                    'icon' => 'fa-database',
                    'id' => 'process-api'
                ]);
            }
        });
        return $next($request);
    }
}
