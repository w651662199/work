<?php
/**
 * 平安数据统计
 * @author baishen
 */
date_default_timezone_set('Asia/Shanghai');
setlocale(LC_ALL, 'zh_CN.utf-8');
ini_set('memory_limit', '-1');

define('LOGFORMAT', "[%s]\t[%s]\t%s %s: %s\n");
// define('LOGDIR', '/gomeo2o/logs/cron');
define('LOGDIR', '/gomeo2o/logs/cron');
define('ERRORLOG', LOGDIR  .DIRECTORY_SEPARATOR. date('Ymd') .'-error.log');
define('SUCCESSLOG', LOGDIR  .DIRECTORY_SEPARATOR. date('Ymd') .'-success.log');

class PinganStat {
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
	private $_dbConfig = array (
		'host' => 'meixin-mysql-one.dev.cloud.db',
		'port' => '5309',
		'user' => 'dev_ams_uall',
		'password' => 'Hg6imn7AFjhJ',
		'database' => 'ams_launch',
	);
	*/

	private $_mysqli = null;

	private $_tableName = 'ams_pingan';
	
	private $_ips = array();

	private $_users = array();

	public function __construct() {
		$this->_mysqli = new mysqli($this->_dbConfig["host"], $this->_dbConfig["user"], $this->_dbConfig["password"], $this->_dbConfig["database"], $this->_dbConfig["port"]);
		if ($this->_mysqli->connect_error) {
			die("Connection failed: " . $this->_mysqli->connect_error);
		}

		$lines = $this->_readData("/gomeo2o/data/ip.txt");
		foreach ($lines as $line) {
			$arr = explode("\t", $line);
			$ip['begin'] = ip2long(trim($arr[0], " "));
			$ip['end'] = ip2long(trim($arr[1], " "));
			$ip['address'] = trim($arr[2], " ");

			$this->_ips[] = $ip;
		}
	}

	public function run() {

		$sql = "SELECT * FROM $this->_tableName WHERE create_time<='2017-10-08 23:59:59'";
		$pingans = $this->_getData($sql);

		// @todo 文案
		$subject = "平安获客落地页曝光数据统计邮件";
		$message = "<html><body><h2>落地页曝光数据统计如下</h2>";
		$message .= "<table><thead><tr><th>姓名</th><th>投放地域</th><th>IP</th><th>获客时间</th><th>性别</th><th>年龄</th><th>一年旅游次数</th><th>月收入</th></tr></thead><tbody>";

		foreach($pingans as $pingan) {
			$survey = json_decode($pingan['survey'], true);
			$message .= "<tr>"; 
			$message .= "<td>" . $pingan['realname'] . "</td>"; 
			$message .= "<td>" . $this->_getRegion($pingan['ip']) . "</td>"; 
			$message .= "<td>" . $pingan['ip'] . "</td>"; 
			$message .= "<td>" . $pingan['regdate'] . "</td>"; 
			$message .= "<td>" . $this->_getSex($pingan['sex']) . "</td>"; 
			$message .= "<td>" . $this->_getAge($pingan['brithday']) . "</td>"; 
			$message .= "<td>" . $this->_getQ1($survey) . "</td>"; 
			$message .= "<td>" . $this->_getQ2($survey) . "</td>"; 
			$message .= "</tr>"; 
		}

		$message .= "</tbody></table></body></html>";
		$this->_mail($subject, $message);
	}

	private function _getRegion($ip) {
		$longIp = ip2long($ip);
		foreach ($this->_ips as $ip) {
			$begin = $ip['begin'];
			$end = $ip['end'];
			$address = $ip['address'];

			if ($longIp >= $begin && $longIp <= $end) {
				return $address;
			}
		}
		return "未知";
	}

	private function _getSex($sex) {
		if ($sex == "M") {
			return "男";
		} elseif ($sex == "F") {
			return "女";
		} else {
			return "未知";
		}
	}

	private function _getAge($birthday) {
		$arr = explode("-", $birthday);
		$year = $arr[0];
		return 2017 - $year;
	}

	private function _getQ1($survey) {
		return $survey[0]['value'];
	}

	private function _getQ2($survey) {
		return $survey[1]['value'];
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
	 * 从文件读取数据
	 */
	private function _readData($name) {
		$handle = fopen($name, "r");
		$lines = array();
		if ($handle) {
			while (($line = fgets($handle)) !== false) {
				$line = trim($line, "\n");
				$lines[] = $line;
			}
			fclose($handle);
		}
		return $lines;
	}


	/**
	 * 发送邮件
	 * $subject
	 * $message
	 */
	private function _mail($subject, $message) {
		echo $message . "\n";
		//$tos[] = 'jinqiuping@gomeplus.com';
		//$tos[] = 'dengshuyuan@gomeplus.com';
		//$tos[] = 'lipeng@gomeplus.com';
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

$pinganStat = new PinganStat();
$pinganStat->run();
