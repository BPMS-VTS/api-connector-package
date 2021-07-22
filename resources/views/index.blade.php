@extends('layouts.layout')

@section('title')
    {{__('API Connector')}}
@endsection

@section('sidebar')
    @include('layouts.sidebar', ['sidebar'=> Menu::get('sidebar_processes')])
@endsection

@section('breadcrumbs')
    @include('shared.breadcrumbs', ['routes' => [
        __('Designer') => route('processes.index'),
        __('API Connector') => null,
    ]])
@endsection
@section('content')
    <div class="px-3 page-content" id="process-connectors-listing">
        <div id="search-bar" class="search mb-3" vcloak>
            <div class="d-flex flex-column flex-md-row">
                <div class="flex-grow-1">
                    <div id="search" class="mb-3 mb-md-0">
                        <div class="input-group w-100">
                            <input v-model="filter" class="form-control" placeholder="{{__('Search')}}">
                            <div class="input-group-append">
                                <button type="button" class="btn btn-primary" data-original-title="Search"><i class="fas fa-search"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                @can('create-api_connectors')
                    <div class="d-flex ml-md-2 flex-column flex-md-row">
                        <button type="button" class="btn btn-secondary" @click="openApiBuilder">
                            <i class="fas fa-plus"></i> {{__('API Connector')}}
                        </button>
                    </div>
                @endcan
            </div>
        </div>
        <connectors-listing ref="listConnector" :filter="filter"
                           :permission="{{ \Auth::user()->hasPermissionsFor('api_connectors') }}"
                           @delete="deleteConnector"></connectors-listing>
        @can('create-api_connectors')
        <custom-modal title="API Builder" id="api-builder-modal" ref="apiBuilderModal">
            <template slot-scope="{ data }">
                <api-builder
                    :data="data" 
                    :datasource="datasource"
                    :filter="connectionFilter"
                    @update="updateConnector"
                ></api-builder>
            </template>
        </custom-modal>
        @endcan
    </div>
@endsection

@section('js')
    <script src="{{mix('js/package.js', 'vendor/api-connector')}}"></script>
@endsection
