## Development
If you need to modify package run the following commands:

```
git clone https://github.com/BPMS-VTS/api-connector-package.git
cd api-connector-package
composer install
npm install
npm run dev
```

## Installation
* Use `composer require jounger/api-connector` to install the package.
* Use `php artisan api-connector:install` to install generate the dependencies.
* Use `php artisan vendor:publish --tag=api-connector --force` to publish all resources.

## Uninstall
* Use `php artisan api-connector:uninstall` to uninstall the package
* Use `composer remove jounger/api-connector` to remove the package completely
