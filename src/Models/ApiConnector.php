<?php

namespace Jounger\ApiConnector\Models;
use Illuminate\Validation\Rule;

use Illuminate\Database\Eloquent\Model;

class ApiConnector extends Model
{
    protected $table = 'api_connectors';

    protected $fillable = [
        'name',
        'description',
        'config',
    ];

    public static function rules($existing = null)
    {
        $unique = Rule::unique('api_connectors')->ignore($existing);
        $validVariableName = '/^[a-zA-Z][a-zA-Z_$0-9]*$/';

        return [
            'description' => 'nullable',
            'name' => ['required', "regex:${validVariableName}", $unique],
        ];
    }

    public static function messages()
    {
        return [
            'name.regex' => trans('environmentVariables.validation.name.invalid_variable_name'),
        ];
    }
}
