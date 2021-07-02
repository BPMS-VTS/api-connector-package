<?php

Route::group(['middleware' => ['auth']], function () {
    Route::namespace('Process')->prefix('datasource')->group(function () {
        Route::get('api-connectors', 'ApiConnectorsController@index')->name('api-connectors.index')->middleware('can:view-api_connectors');
    });
});