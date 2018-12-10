<?php
/**
 * 定时推送平安数据
 * @author baishen
 */
date_default_timezone_set('Asia/Shanghai');
setlocale(LC_ALL, 'zh_CN.utf-8');

define('LOGFORMAT', "[%s]\t[%s]\t%s %s: %s\n");
// define('LOGDIR', '/gomeo2o/logs/cron');
define('LOGDIR', '/gomeo2o/logs/cron');
define('ERRORLOG', LOGDIR  .DIRECTORY_SEPARATOR. date('Ymd') .'-error.log');
define('SUCCESSLOG', LOGDIR  .DIRECTORY_SEPARATOR. date('Ymd') .'-success.log');

class PinganStatTask {

	private $_dbConfig = array (
		'host' => 'g1mysmv1.ad.pro.gomeplus.com',
		'port' => '3306',
		'user' => 'ams_user',
		'password' => 'H4w9H5Ym',
		'database' => 'ams_launch',
	);

	/**
	private $_dbConfig = array (
		'host' => '127.0.0.1',
		'port' => '3306',
		'user' => 'root',
		'password' => '',
		'database' => 'ams_launch',
	);
	*/
	/**
	private $_dbConfig = array (
		'host' => 'meixin-mysql-one.dev.cloud.db',
		'port' => '5309',
		'user' => 'dev_ams_uall',
		'password' => 'Hg6imn7AFjhJ',
		'database' => 'ams_launch',
	);*/

	private $_mysqli = null;

	private $_tableName = 'ams_pingan';

	private $_users = array();

	public function __construct() {
		$this->_mysqli = new mysqli($this->_dbConfig["host"], $this->_dbConfig["user"], $this->_dbConfig["password"], $this->_dbConfig["database"], $this->_dbConfig["port"]);
		if ($this->_mysqli->connect_error) {
			die("Connection failed: " . $this->_mysqli->connect_error);
		}
	}

	public function run() {

		$cddCountSql = "SELECT COUNT(*) as count FROM $this->_tableName WHERE refer like '%wacdd%'";
		$cddCount = $this->_getData($cddCountSql);
		$cddCount = $cddCount[0]['count'];

        $allCountSql = "SELECT COUNT(*) as count FROM $this->_tableName";
		$allCount = $this->_getData($allCountSql);
		$allCount = $allCount[0]['count'];

        $otherCount = $allCount - $cddCount;

		$this->_successLog("allCount: " . $allCount . " cddCount: " . $cddCount . " otherCount: " . $otherCount);

		// @todo 文案
		$subject = "平安获客落地页曝光数据统计邮件";
		$message = "<html><body><h2>落地页曝光数据统计如下</h2>";
		$message .= "<p>充点电获获客数：" . $cddCount . "</p>";
		$message .= "<p>其他渠道获客数：" . $otherCount . "</p>";
		$message .= "</body></html>";
		$this->_mail($subject, $message);
	}

	/**
	 * 从表中读取数据
	 * $sql
	 */
	private function _getData($sql) {
		$data = array();
		if ($result = $this->_mysqli->query($sql, MYSQLI_USE_RESULT)) {
			while ($row = $result->fetch_array()) {
				$data[] = $row;
			}
			$result->close();
		}
		return $data;
	}

	/**
	 * 发送邮件
	 * $subject
	 * $message
	 */
	private function _mail($subject, $message) {
		echo $message . "\n";
		$tos[] = 'jinqiuping@gomeplus.com';
		$tos[] = 'dengshuyuan@gomeplus.com';
		$tos[] = 'lipeng@gomeplus.com';
		$tos[] = 'wuxuefei@gomeplus.com';
		$tos[] = 'wuhongling@gomeplus.com';
		$tos[] = 'baishen@gomeplus.com';

		$headers[] = 'MIME-Version: 1.0';
		$headers[] = 'Content-type: text/html; charset=utf-8';
		$ret = mail(implode(",", $tos), $subject, $message, implode("\r\n", $headers));
	}

	private function _successLog($log) {
		file_put_contents(SUCCESSLOG, sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'SUCCESS', __FILE__, 0, $log), FILE_APPEND);
	}

	private function _errorLog($log) {
		file_put_contents(ERRORLOG, sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'ERROR', __FILE__, 0, $log), FILE_APPEND);
	}
}

$pinganStatTask = new PinganStatTask();
$pinganStatTask->run();
