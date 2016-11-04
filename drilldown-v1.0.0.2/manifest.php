<?php
$manifest = array (
    'acceptable_sugar_versions' =>  array (
        '7.*',
    ),
    'acceptable_sugar_flavors' =>  array (  
		'PRO', 'ULT', 'ENT'
    ),
    'author' => 'SugarCRM, Inc.',
    'description' => 'Beta report drill down',
    'icon' => '',
    'is_uninstallable' => 'true',
    'name' => 'Report Drill Down',
    'published_date' => '2016-29-09 10:55:56',
    'type' => 'module',
    'version' => '1.0.0.2',
);

$installdefs = array (
    'id' => 'ReportDrillDown',
    'copy' => array (
      0 =>
          array (
            'from' => '<basepath>/custom/clients/base/fields/chart/chart.js',
            'to' => 'custom/clients/base/fields/chart/chart.js',
          ),
        1 =>
          array (
            'from' => '<basepath>/custom/clients/base/fields/chart/detail.hbs',
            'to' => 'custom/clients/base/fields/chart/detail.hbs',
          ),
        2 =>
          array (
            'from' => '<basepath>/custom/clients/base/views/saved-reports-chart/saved-reports-chart.hbs',
            'to' => 'custom/clients/base/views/saved-reports-chart/saved-reports-chart.hbs',
          ),
        3 =>
          array (
            'from' => '<basepath>/custom/clients/base/views/saved-reports-chart/saved-reports-chart.js',
            'to' => 'custom/clients/base/views/saved-reports-chart/saved-reports-chart.js',
          ),
        4 =>
          array (
            'from' => '<basepath>/custom/clients/base/views/saved-reports-chart/saved-reports-chart.php',
            'to' => 'custom/clients/base/views/saved-reports-chart/saved-reports-chart.php',
          ),
        5 =>
            array (
                'from' => '<basepath>/custom/clients/base/api/CustomCacheApi.php',
                'to' => 'custom/clients/base/api/CustomCacheApi.php',
            ),
        6 =>
            array (
                'from' => '<basepath>/custom/clients/base/api/CustomFilterApi.php',
                'to' => 'custom/clients/base/api/CustomFilterApi.php',
            ),
        7 =>
            array (
                'from' => '<basepath>/custom/include/SugarObjects/templates/basic/clients/base/filters/basic/basic.php',
                'to' => 'custom/include/SugarObjects/templates/basic/clients/base/filters/basic/basic.php',
            ),
    ),
);
?>
