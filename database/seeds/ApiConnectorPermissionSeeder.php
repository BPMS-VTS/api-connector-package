<?php

use Illuminate\Database\Seeder;
use ProcessMaker\Models\User;
use ProcessMaker\Models\Group;
use ProcessMaker\Models\GroupMember;
use ProcessMaker\Models\Permission;

class ApiConnectorPermissionSeeder extends Seeder
{
    private $permissionGroups = [
        'API Connectors' => [
            'create-api_connectors',
            'delete-api_connectors',
            'edit-api_connectors',
            'view-api_connectors',
        ],
    ];

    public function run($seedUser = null)
    {
        foreach ($this->permissionGroups as $groupName => $permissions) {
            foreach ($permissions as $permissionString) {
                Permission::updateOrCreate([
                    'name' => $permissionString,
                ],[
                    'title' => ucwords(preg_replace('/(\-|_)/', ' ', $permissionString)),
                    'group' => $groupName,
                ]);
            }
        }

        $permissions = Permission::all()->pluck('id');

        if ($seedUser) {
            $seedUser->permissions()->attach($permissions);
            $seedUser->save();
        }
    }
}
