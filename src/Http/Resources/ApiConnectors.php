<?php

namespace Jounger\ApiConnector\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class ApiConnectors extends JsonResource
{
    /**
     * Generic resource for outputting models
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */

    static $wrap = null;

    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
