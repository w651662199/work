<?php
defined('SYSPATH') OR die('No direct access allowed.');

return array (
	'default' => array (
		'type' => 'PDO',
		'connection' => array(
			'dsn' => 'mysql:host=meixin-mysql-one.dev.cloud.db;port=5309;dbname=ams_launch;charset=utf8',
			'username' => 'tester',
			'password' => 'Test_usEr',
			'persistent' => FALSE,
		),
		'table_prefix' => 'ams_',
		'charset' => 'utf8',
		'caching' => FALSE,
	),
	'mm' => array (
		'type' => 'PDO',
		'connection' => array(
			'dsn' => 'mysql:host=meixin-mysql-one.dev.cloud.db;port=5309;dbname=ams_launch;charset=utf8',
			'username' => 'tester',
			'password' => 'Test_usEr',
			'persistent' => FALSE,
		),
		'table_prefix' => '',
		'charset' => 'utf8',
		'caching' => FALSE,
	),
);
