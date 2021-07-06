<?php

namespace Jounger\ApiConnector\Http\Controllers\Process;

use ProcessMaker\Http\Controllers\Controller;

class ApiConnectorsController extends Controller
{
    /**
     * Get the list of api connector
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        return view('api-connector::index');
    }
}
