<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use ProcessMaker\Models\Group;
use ProcessMaker\Models\Permission;

class ApiConnectorGroupSeeder extends Seeder
{
    public $defaults = [];

    public function setDefaults()
    {
        $this->defaults[] = [
            'name' => __('Process Designers'),
            'description' => __('Users can design processes.'),
            'permissions' => [
                'create-api_connectors',
                'edit-api_connectors',
                'delete-api_connectors',
                'view-api_connectors',
            ],
        ];
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->setDefaults();

        foreach ($this->defaults as $defaultGroup) {
            // Create the group
            $createdGroup = factory(Group::class)->create([
                'name' => $defaultGroup['name'],
                'description' => $defaultGroup['description'],
                'status' => 'ACTIVE'
            ]);

            //Retrieve permission IDs
            $permissions = Permission::byName($defaultGroup['permissions'])->pluck('id');

            //Attach permissions to this group
            $createdGroup->permissions()->attach($permissions);
        }

    }
}
