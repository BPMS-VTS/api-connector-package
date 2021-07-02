<?php

Route::group(
    [
        'middleware' => ['auth:api', 'bindings'],
        'namespace' => 'Api',
        'as' => 'api.',
    ], function() {
    Route::get('api_connectors', 'ApiConnectorsController@index')->name('api_connectors.index')->middleware('can:view-api_connectors');
    Route::get('api_connectors/{api_connector}', 'ApiConnectorsController@show')->name('api_connectors.show')->middleware('can:view-api_connectors');
    Route::post('api_connectors', 'ApiConnectorsController@store')->name('api_connectors.store')->middleware('can:create-api_connectors');
    Route::put('api_connectors/{api_connector}', 'ApiConnectorsController@update')->name('api_connectors.update')->middleware('can:edit-api_connectors');
    Route::delete('api_connectors/{api_connector}', 'ApiConnectorsController@destroy')->name('api_connectors.destroy')->middleware('can:delete-api_connectors');
});
