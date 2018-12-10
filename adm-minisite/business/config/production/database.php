<?php
defined('SYSPATH') OR die('No direct access allowed.');

return array (
	'default' => array (
		'type' => 'PDO',
		'connection' => array(
			'dsn' => 'mysql:host=g1mysmv1.ad.pro.gomeplus.com;port=3306;dbname=ams_launch;charset=utf8',
			'username' => 'ams_user',
			'password' => 'H4w9H5Ym',
			'persistent' => FALSE,
		),
		'table_prefix' => 'ams_',
		'charset' => 'utf8',
		'caching' => FALSE,
	),
	'mm' => array (
		'type' => 'PDO',
		'connection' => array(
			'dsn' => 'mysql:host=g1mysmv1.ad.pro.gomeplus.com;port=3306;dbname=ams_launch;charset=utf8',
			'username' => 'ams_user',
			'password' => 'H4w9H5Ym',
			'persistent' => FALSE,
		),
		'table_prefix' => '',
		'charset' => 'utf8',
		'caching' => FALSE,
	),
);
