<?php

namespace Jounger\ApiConnector\Http\Controllers\Api;

use ProcessMaker\Http\Controllers\Controller;

use Illuminate\Http\Request;

class ConnectionsController extends Controller
{
    public function database()
    {
        $connections = \Config::get('database.connections');
        $databases = array();
        foreach ($connections as $key => $val) {
            array_push($databases, $key);
        }
        return $databases;
    }

    public function table(Request $request, $connection = null)
    {
        $verbose = $request->input('verbose', false);
        if ($verbose) {
            return \DB::connection($connection)->table('INFORMATION_SCHEMA.TABLES')
                ->select('*')
                ->where('TABLE_SCHEMA', '=', $connection)
                ->get();
        } else {
            return collect(\DB::connection($connection)->select('show tables'))->map(function ($val) {
                foreach ($val as $key => $tbl) {
                    return $tbl;
                }
            });
        }
    }

    public function column(Request $request, $connection = null, $table = null)
    {
        $verbose = $request->input('verbose', false);
        if ($verbose) {
            return \DB::connection($connection)->table('INFORMATION_SCHEMA.COLUMNS')
                ->select('*')
                ->where('TABLE_SCHEMA', '=', $connection)
                ->where('TABLE_NAME', '=', $table)
                ->get();
        } else {
            return \DB::connection($connection)->getSchemaBuilder()->getColumnListing($table);
        }
    }
}
