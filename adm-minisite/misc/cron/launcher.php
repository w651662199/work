<?php
/**
 * 后台脚本运行框架
 * @name 寻找  - 执行后台任务
 *
 */
define('ROOTDIR', dirname(__FILE__).DIRECTORY_SEPARATOR);
require ROOTDIR.'init.php';

$_GET = array();

for($i = 1; $i < $_SERVER['argc']; $i++) {
	if ( ! isset($_SERVER['argv'][$i])) {
		break;
	}

	$opt = $_SERVER['argv'][$i];

	if(substr($opt, 0, 2) !== '--') {
		$_GET[] = $opt;
		continue;
	}

	$opt = substr($opt, 2);

	if(strpos($opt, '=')) {
		list ($opt, $value) = explode('=', $opt, 2);
	} else {
		$value = NULL;
	}

	$_GET[$opt] = $value;
}

$class = isset($_GET['name']) ? trim($_GET['name']) : NULL;
$file = isset($_GET['file']) ? trim($_GET['file']) : NULL;

if(is_null($class) || !is_file($file)) {
	echo sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'Exception', $file, 0, 'Incomplete Arguments.');
	exit(1);
}

require $file;
if(!class_exists($class)) {
	echo sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'Exception', $file, 0, "Class '$class' does't exists.");
	exit(1);
}
try {
	$instance = new $class();
	if(!$instance instanceof Task) {
		echo sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'Exception', $file, 0, "Class '$class' is not instance of Task.");
		exit(1);
	}
	if(!$instance->runable()) {
		exit(0);
	}

	$instance->before();
	$result = $instance->execute();
	$instance->after();

	$now = date('Y-m-d H:i:s');
	file_put_contents(SUCCESSLOG, "[$now]\t{$instance->getSubject()} ({$instance->getAuthor()})\t{$file}\t{$result}\n", FILE_APPEND);
} catch(Exception $e) {
	echo sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'Exception', $e->getFile(), $e->getLine(), $e->getMessage());
}
exit(0);
