<?php
defined('SYSPATH') OR die('No direct access allowed.');

return array (
	'default' => array (
		'type' => 'PDO',
		'connection' => array(
			'dsn' => 'mysql:host=meixin-mysql-one.pre.cloud.db;port=5309;dbname=ams_launch;charset=utf8',
			'username' => 'ams_user',
			'password' => 'SCi9kH8A',
			'persistent' => FALSE,
		),
		'table_prefix' => 'ams_',
		'charset' => 'utf8',
		'caching' => FALSE,
	),
	'mm' => array (
		'type' => 'PDO',
		'connection' => array(
			'dsn' => 'mysql:host=meixin-mysql-one.pre.cloud.db;port=5309;dbname=ams_launch;charset=utf8',
			'username' => 'ams_user',
			'password' => 'SCi9kH8A',
			'persistent' => FALSE,
		),
		'table_prefix' => '',
		'charset' => 'utf8',
		'caching' => FALSE,
	),
);
