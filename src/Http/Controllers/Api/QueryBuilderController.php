<?php

namespace Jounger\ApiConnector\Http\Controllers\Api;

use ProcessMaker\Http\Controllers\Controller;
use Illuminate\Http\Request;

class QueryBuilderController extends Controller
{

    /**
     * Build query and return result base on json data was sent from client
     *
     * @param Request $request
     */
    public function index(Request $request)
    {
        // convert json to object
        $data = json_decode($request->getContent(), true);
        $method = $data['method'];
        $table = $data['table'];
        // QUERY INIT
        $query = \DB::table($table);
        // SELECT clause
        $select = $data['select'];

        if ($method == 'GET' && count($select) > 0) {
            $query->select($select);
        }
        // JOIN clause
        $join = $data['join'];
        foreach ($join as $val) {
            $table = $val['table'];
            $left = $val['left'];
            $right = $val['right'];
            $query->join($table, $left, '=', $right);
        }
        // WHERE clause
        $where = $data['where'];
        if (count($where['rules']) > 0) {
            $clause = 'where';
            $this->queryBuilder($query, $clause, $where);
        }
        // GROUP BY clause
        $groupby = $data['groupby'];
        if (count($groupby) > 0) {
            $query->groupBy($groupby);
            // HAVING clause
            // TODO: resolve having clause like as where clause
            $having = $data['having'];
            foreach ($having as $val) {
                $clause = 'having';
                $this->queryOperatorDictionary($query, $clause, $val);
            }
        }
        // ORDER BY clause
        $orderby = $data['orderby'];
        foreach ($orderby as $val) {
            $column = $val['column'];
            $direction = $val['direction'];
            $query->orderBy($column, $direction);
        }
        // QUERY RESULT
        // return $query->toSql(); // only for testing
        $result = $query->get();
        return $result;
    }

    /**
     * Use for Where and Having clause
     * defined type of clause
     *
     * @param $query
     * @param $clause
     * @param $item
     */
    public function queryBuilder(&$query, $clause, $item)
    {
        if (isset($item['condition']) && count($item['rules']) > 0) {
            switch ($item['condition']) {
                case 'AND':
                    $this->queryNestedBuilder($query, $clause, $item);
                    break;
                case 'OR':
                    $clause = 'or' . ucfirst($clause);
                    $this->queryNestedBuilder($query, $clause, $item);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Use for Where and Having clause
     * traverse all nested items and build query base on conditions
     *
     * @param $query
     * @param $clause
     * @param $item
     */
    public function queryNestedBuilder(&$query, $clause, $item)
    {
        $query->{$clause}(function ($query) use ($clause, $item) {
            $rules = $item['rules'];
            foreach ($rules as $rule) {
                if (isset($rule['condition'])) {
                    $this->queryBuilder($query, $clause, $rule);
                } else {
                    $this->queryOperatorDictionary($query, $clause, $rule);
                }
            }
        });
    }

    /**
     * Use for Where and Having clause
     * to build query base on operators
     *
     * @param $query
     * @param $clause
     * @param $item
     */
    public function queryOperatorDictionary(&$query, $clause, $item)
    {
        $column = $item['column'];
        $operator = $item['operator'];
        $value = null;
        if (isset($item['value'])) {
            $value = $item['value'];
        }
        // having clause
        if ($clause == 'having' && isset($val['aggregation'])) {
            $aggregation = $val['aggregation'];
            $column = $aggregation . '(' . $column . ')';
        }
        $like = 'like';
        $not_like = 'not like';
        switch ($operator) {
            case 'equal':
                $query->{$clause}($column, '=', $value);
                break;
            case 'not_equal':
                $query->{$clause}($column, '!=', $value);
                break;
            case 'in':
                $query->{$clause . 'In'}($column, $value);
                break;
            case 'not_in':
                $query->{$clause . 'NotIn'}($column, $value);
                break;
            case 'less':
                $query->{$clause}($column, '<', $value);
                break;
            case 'less_or_equal':
                $query->{$clause}($column, '<=', $value);
                break;
            case 'greater':
                $query->{$clause}($column, '>', $value);
                break;
            case 'greater_or_equal':
                $query->{$clause}($column, '>=', $value);
                break;
            case 'between':
                $query->{$clause . 'Between'}($column, $value);
                break;
            case 'not_between':
                $query->{$clause . 'NotBetween'}($column, $value);
                break;
            case 'begins_with':
                $query->{$clause}($column, $like, $value . '%');
                break;
            case 'not_begins_with':
                $query->{$clause}($column, $not_like, $value . '%');
                break;
            case 'contains':
                $query->{$clause}($column, $like, '%' . $value . '%');
                break;
            case 'not_contains':
                $query->{$clause}($column, $not_like, '%' . $value . '%');
                break;
            case 'ends_with':
                $query->{$clause}($column, $like, '%' . $value);
                break;
            case 'not_ends_with':
                $query->{$clause}($column, $not_like, '%' . $value);
                break;
            case 'is_empty':
                $query->{$clause}($column, '=', '');
                break;
            case 'is_not_empty':
                $query->{$clause}($column, '!=', '');
                break;
            case 'is_null':
                $query->{$clause . 'Null'}($column);
                break;
            case 'is_not_null':
                $query->{$clause . 'NotNull'}($column);
                break;
            default:
                $query->{$clause}($column, '=', $value);
                break;
        }
    }
}