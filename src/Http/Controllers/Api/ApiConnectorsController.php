<?php

namespace Jounger\ApiConnector\Http\Controllers\Api;

use ProcessMaker\Http\Controllers\Controller;
use ProcessMaker\Http\Resources\ApiCollection;
use Jounger\ApiConnector\Models\ApiConnector;
use Jounger\ApiConnector\Http\Resources\ApiConnectors as ApiConnectorResource;

use Illuminate\Http\Request;

class ApiConnectorsController extends Controller
{
    /**
     * A whitelist of attributes that should not be
     * sanitized by our SanitizeInput middleware.
     *
     * @var array
     */
    public $doNotSanitize = [
        'value',
    ];

  /**
   * Fetch a collection of variables based on paged request and filter if provided
   *
   * @param Request $request
   *
   * @return ResponseFactory|Response A list of matched users and paging data
   *
   * @OA\Get(
   *     path="/api_connectors",
   *     summary="Returns all apiConnectors that the user has access to. For security, values are not included.",
   *     operationId="getApiConnectors",
   *     tags={"Api Connectors"},
   *     @OA\Parameter(ref="#/components/parameters/filter"),
   *     @OA\Parameter(ref="#/components/parameters/order_by"),
   *     @OA\Parameter(ref="#/components/parameters/order_direction"),
   *     @OA\Parameter(ref="#/components/parameters/per_page"),
   *     @OA\Parameter(ref="#/components/parameters/include"),
   *
   *     @OA\Response(
   *         response=200,
   *         description="list of apiConnectors",
   *         @OA\JsonContent(
   *             type="object",
   *             @OA\Property(
   *                 property="data",
   *                 type="array",
   *                 @OA\Items(ref="#/components/schemas/ApiConnector"),
   *             ),
   *             @OA\Property(
   *                 property="meta",
   *                 type="object",
   *                 @OA\Schema(ref="#/components/schemas/metadata"),
   *             ),
   *         ),
   *     ),
   * )
   */
  public function index(Request $request)
  {
      // Grab pagination data
      $perPage = $request->input('per_page', 10);
      // Filter
      $filter = $request->input('filter', null);
      $orderBy = $request->input('order_by', 'name');
      $orderDirection = $request->input('order_direction', 'asc');
      // Note, the current page is automatically handled by Laravel's pagination feature
      if($filter) {
          $filter = '%' . $filter . '%';
          $api_connectors = ApiConnector::where('name', 'like', $filter)
              ->orWhere('description', 'like', $filter)
              ->orderBy($orderBy, $orderDirection);
          $api_connectors = $api_connectors->paginate($perPage);
      } else {
          $api_connectors = ApiConnector::orderBy($orderBy, $orderDirection)->paginate($perPage);
      }
      // Return fractal representation of paged data
      return new ApiCollection($api_connectors);
  }

  /**
   * Creates a new global Api Connector in the system
   *
   *   @OA\Post(
   *     path="/api_connectors",
   *     summary="Create a new api connector",
   *     operationId="createApiConnector",
   *     tags={"Api Connectors"},
   *     @OA\RequestBody(
   *       required=true,
   *       @OA\JsonContent(ref="#/components/schemas/ApiConnectorEditable")
   *     ),
   *     @OA\Response(
   *         response=201,
   *         description="success",
   *         @OA\JsonContent(ref="#/components/schemas/ApiConnector")
   *     ),
   * )
   */
  public function store(Request $request)
  {
      $request->validate(ApiConnector::rules(), ApiConnector::messages());
      $api_connector = ApiConnector::create($request->all());

      return new ApiConnectorResource($api_connector);

  }
  /**
   * Return an api connector instance
   * Using implicit model binding, will automatically return 404 if variable now found
   *
   * @OA\Get(
   *     path="/api_connectors/{api_connector_id}",
   *     summary="Get an api connector by id. For security, the value is not included.",
   *     operationId="getApiConnectorById",
   *     tags={"Api Connectors"},
   *     @OA\Parameter(
   *         description="ID of api_connectors to return",
   *         in="path",
   *         name="api_connector_id",
   *         required=true,
   *         @OA\Schema(
   *           type="integer",
   *         )
   *     ),
   *     @OA\Response(
   *         response=201,
   *         description="success",
   *         @OA\JsonContent(ref="#/components/schemas/ApiConnector")
   *     ),
   * )
   */
  public function show(ApiConnector $api_connector)
  {
      return new ApiConnectorResource($api_connector);
  }
  /**
   * Update an api connector
   *
   * @OA\Put(
   *     path="/api_connectors/{api_connector_id}",
   *     summary="Update an api connector",
   *     operationId="updateApiConnector",
   *     tags={"Api Connectors"},
   *     @OA\Parameter(
   *         description="ID of api connectors to update",
   *         in="path",
   *         name="api_connector_id",
   *         required=true,
   *         @OA\Schema(
   *           type="integer",
   *         )
   *     ),
   *     @OA\RequestBody(
   *       required=true,
   *       @OA\JsonContent(ref="#/components/schemas/ApiConnectorEditable")
   *     ),
   *     @OA\Response(
   *         response=200,
   *         description="success",
   *         @OA\JsonContent(ref="#/components/schemas/ApiConnector")
   *     ),
   * )
   */
  public function update(ApiConnector $api_connector, Request $request)
  {
      // Validate the request, passing in the existing variable to tweak unique rule on name
      $request->validate(ApiConnector::rules($api_connector));
      $api_connector->fill($request->input());
      $api_connector->save();
      return new ApiConnectorResource($api_connector);
  }

  /**
   * @OA\Delete(
   *     path="/api_connectors/{api_connector_id}",
   *     summary="Delete an api connector",
   *     operationId="deleteApiConnector",
   *     tags={"Api Connectors"},
   *     @OA\Parameter(
   *         description="ID of api_connectors to return",
   *         in="path",
   *         name="api_connector_id",
   *         required=true,
   *         @OA\Schema(
   *           type="integer",
   *         )
   *     ),
   *     @OA\Response(
   *         response=200,
   *         description="success",
   *     ),
   * )
   */
  public function destroy(ApiConnector $api_connector)
  {
      $api_connector->delete();
      return response('',200);
  }
}
