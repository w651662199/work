<?php
/**
 * 后台脚本运行框架
 * @name 初始化运行环境
 *
 */
$application = '../../application';
$modules = '../../kohana/modules';
$system = '../../kohana/system';
$business = '../../business';

define('EXT', '.php');

error_reporting(E_ALL | E_STRICT);

define('DOCROOT', realpath(dirname(__FILE__)).DIRECTORY_SEPARATOR);
define('APPPATH', realpath($application).DIRECTORY_SEPARATOR);
define('MODPATH', realpath($modules).DIRECTORY_SEPARATOR);
define('SYSPATH', realpath($system).DIRECTORY_SEPARATOR);
define('BIZPATH', realpath($business).DIRECTORY_SEPARATOR);

unset($application, $modules, $system, $business);

define('TASKDIR', ROOTDIR.'tasks'.DIRECTORY_SEPARATOR);
define('FILEDIR', '/var/tmp/');

require SYSPATH . 'classes/Kohana/Core' . EXT;
require SYSPATH . 'classes/Kohana' . EXT;

date_default_timezone_set('Asia/Shanghai');
setlocale(LC_ALL, 'zh_CN.utf-8');
spl_autoload_register(array('Kohana', 'auto_load'));

ini_set('unserialize_callback_func', 'spl_autoload_call');
mb_substitute_character('none');


//日志格式 [时间]\t[错误类型]\t文件 行号: 描述\n
define('LOGFORMAT', "[%s]\t[%s]\t%s %s: %s\n");
define('LOGDIR', '/gomeo2o/logs/cron'.DIRECTORY_SEPARATOR. date('Y') .DIRECTORY_SEPARATOR. date('m'));
define('ERRORLOG', LOGDIR  .DIRECTORY_SEPARATOR. date('d') .'-error.log');
define('SUCCESSLOG', LOGDIR  .DIRECTORY_SEPARATOR. date('d') .'-success.log');


//Kohana::$config->attach(new Config_File);
//Kohana::$config->attach(new Config_File('config/' . strtolower($_SERVER['ENVIRONMENT'])));

Kohana::modules(array(
    'redisd' => MODPATH . 'redisd',
    'curl' => MODPATH . 'curl',
    'misc' => MODPATH . 'misc',
    'biz' => BIZPATH,
));

error_reporting(E_ALL);

ob_start();

if(!is_dir(LOGDIR)) {
	mkdir(LOGDIR, 0777, TRUE);
}


function errorHandler($code, $message, $file = NULL, $line = NULL) {
	file_put_contents(ERRORLOG, sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'Error', $file, $line, $message), FILE_APPEND);
	ob_end_clean();
	exit(1);
}

function shutdownHandler() {

	$error = error_get_last();

	if(!$error) {
		return TRUE;
	}

	$code = $error['type'];
	$message = $error['message'];
	$file = $error['file'];
	$line = $error['line'];

	file_put_contents(ERRORLOG, sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'Shutdown Error', $file, $line, $message), FILE_APPEND);
	ob_end_clean();
	exit(1);
}

//spl_autoload_register('autoLoad');

set_error_handler('errorHandler');
register_shutdown_function('shutdownHandler');
