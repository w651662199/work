<?php
/**
 * 后台脚本运行框架
 * @name 入口文件
 *
 */
define('ROOTDIR', dirname(__FILE__).DIRECTORY_SEPARATOR);
require ROOTDIR.'init.php';

if(!is_dir(TASKDIR)) {
	echo "dir » ".TASKDIR." does not exist.\n";
	exit(1);
}

function find($dir = NULL) {
	static $tasks = array();

	$dir = is_null($dir) ? TASKDIR : $dir;
	if(!is_dir($dir)) {
		return array();
	}

	$fp = opendir($dir);
	while(FALSE !== ($file = readdir($fp))) {
		if($file == '.' || $file == '..' || substr($file, 0, 1) == '.') {
			continue;
		}

		$file = realpath($dir.DIRECTORY_SEPARATOR.$file);
		if(is_dir($file)) {
			find($file);
			continue;
		}

		$class = str_replace(array(TASKDIR, '.php', '/'), array('', '', '_'), $file);
		$mtime = filemtime($file);

		$tasks[] = array('name' => $class, 'file' => $file, 'lastTime' => $mtime);

	}
	closedir($fp);

	return $tasks;
}

$tasks = find();

$launcherFile = ROOTDIR.'launcher.php';
$commandText = "php $launcherFile --name=%s --file=%s >> ". ERRORLOG ." &";

foreach($tasks as $task) {
	$command = sprintf($commandText, $task['name'], $task['file']);

	$handler = popen($command, 'r');
	pclose($handler);
}
