<?php

Route::group([
    'middleware' => ['web', 'auth', 'sanitize', 'external.connection'],
    'namespace' => 'Jounger\ApiConnector\Http\Controllers',
], function () {


    Route::namespace('Process')->prefix('designer')->group(function () {
        Route::get('api-connectors', 'ApiConnectorsController@index')->name('api-connectors.index')->middleware('can:view-api_connectors');
    });
});
