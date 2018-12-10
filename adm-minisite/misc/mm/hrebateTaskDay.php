<?php
/**
 */
date_default_timezone_set('Asia/Shanghai');
setlocale(LC_ALL, 'zh_CN.utf-8');
ini_set('display_errors', 1);
error_reporting(E_ALL);
require("/gomeo2o/data/minisite/misc/mm/Email.php");


define('LOGFORMAT', "[%s]\t[%s]\t%s %s: %s\n");
// define('LOGDIR', '/gomeo2o/logs/cron');
define('LOGDIR', '/gomeo2o/logs/cron');
define('ERRORLOG', LOGDIR  .DIRECTORY_SEPARATOR. date('Ymd') .'-error.log');
define('SUCCESSLOG', LOGDIR  .DIRECTORY_SEPARATOR. date('Ymd') .'-success.log');

class HighRebateTask {

	private $_dbConfig = array (
		'host' => 'g1mysmv1.ad.pro.gomeplus.com',
		'port' => '3306',
		'user' => 'ams_user',
		'password' => 'H4w9H5Ym',
		'database' => 'ams_launch',
	);

	/**
	private $_dbConfig = array (
		'host' => 'meixin-mysql-one.dev.cloud.db',
		'port' => '5309',
		'user' => 'dev_ams_uall',
		'password' => 'Hg6imn7AFjhJ',
		'database' => 'ams_launch',
	);
	*/

	private $_channel = array(
		1 => '国美APP',
		2 => '微信',
		3 => '物料、电子屏',
		4 => '国美APP-默认搜索',
		5 => '国美PC-快讯',
		6 => '国美APP-会员中心-Banner',
		7 => '国美PC-会员中心-Banner',
		8 => '国美APP-发现-信息流',
		9 => '国美APP-发现-圈子首焦第2帧',
		10 => '国美APP-发现-话题评论上方',
		11 => '国美APP-美店频道页-首页第2帧',
		12 => '国美APP-美店频道页-vip好货推荐频道第2帧',
		13 => '线下会员短信-北京',
		14 => '14',
		15 => '15',
		16 => '16',
		17 => '17',
		18 => '18',
	);

	private $_userDateFile = "/gomeo2o/data/minisite/misc/mm/userData.txt";

	private $_mysqli = null;

	private $_tableName = 'mm_new_user';

	private $_gomeUserTableName = 'ad_gome_user';

	private $_users = array();


	public function __construct() {
		$this->_mysqli = new mysqli($this->_dbConfig["host"], $this->_dbConfig["user"], $this->_dbConfig["password"], $this->_dbConfig["database"], $this->_dbConfig["port"]);
		if ($this->_mysqli->connect_error) {
			die("Connection failed: " . $this->_mysqli->connect_error);
		}
	}

	public function run() {

		$today = date("Y-m-d");
		$todayBegin = $today . " 00:00:00";
		$todayEnd = $today . " 23:59:59";

		$totalNewUserSql = "SELECT COUNT(*) as count FROM $this->_tableName WHERE create_time>='2018-08-29 00:00:00'";

		$totalUserCount = $this->_getData($totalNewUserSql);
		$totalCount = $totalUserCount[0]['count'];
		$this->_successLog("00 get total mobil count=" . $totalCount);

		//活动当天收集到的手机号数
		$newUserCountSql = "SELECT COUNT(*) as count FROM $this->_tableName WHERE create_time>='$todayBegin' AND create_time<='$todayEnd'";

		$newUserCount = $this->_getData($newUserCountSql);
		$userCount = $newUserCount[0]['count'];

		$this->_successLog("01 get today mobil count=" . $userCount);

		// 新增用户数，昨日数据记录到文件
		$userData = $this->_read($this->_userDateFile);
		$yesterday = date("Y-m-d", strtotime("-1 day"));
		$yesterdayUserCount = $userData[$yesterday];

		$newGomeUserCountSql = "SELECT COUNT(*) as count FROM $this->_gomeUserTableName";
		$newGomeUserCount = $this->_getData($newGomeUserCountSql);
		$todayUserCount = $newGomeUserCount[0]['count'];

		$incrUserCount = $todayUserCount - $yesterdayUserCount;

		$this->_successLog("02 incr user count yesterday=" . $yesterdayUserCount . " today=" . $todayUserCount . " incr=" . $incrUserCount);

		$pvKey = 'High_Rebate_PV_' . date("Ymd");
		$pv = Redisd::instance('awall')->get($pvKey);
		$uvKey = 'High_Rebate_UV_' . date("Ymd");
		$uv = Redisd::instance('awall')->get($uvKey);

		$allData = $this->getAllStat('High_Rebate_PV_', 'High_Rebate_UV_');

		$pvAll = $allData['pv'];
		$uvAll = $allData['uv'];

		//按钮点击数总数
		$submitC = Redisd::instance('awall')->get("H_R_B_1");
		$downC = Redisd::instance('awall')->get("H_R_B_2");

		// @todo 文案
		$subject = "运营高返利拉新活动统计数据";
		$message = "<html><body><h2>运营高返利拉新活动统计数据如下</h2>";
		$message .= "<p>" . date("Y-m-d") . " PV:" . $pv . "</p>";
		$message .= "<p>" . date("Y-m-d") . " UV:" . $uv . "</p>";
		$message .= "<p>总PV:" . $pvAll . "</p>";
		$message .= "<p>总UV:" . $uvAll . "</p>";
		$message .= "<p>领钱按钮点击数:" . $submitC . "</p>";
		$message .= "<p>查看红包按钮点击数:" . $downC . "</p>";
		$message .= "<p>当天注册用户数:" . $userCount . "</p>";
		$message .= "<p>总注册用户数:" . $totalCount . "</p>";
		$message .= "<p>APP内新登录用户数:" . $incrUserCount . "</p>";

		$message .= "<table><thead><th>日期</th><th>渠道</th><th>新增PV</th><th>新增UV</th><th>新增注册数</th><th>领钱按钮点击数</th><th>查看红包按钮点击数</th></thead><tbody>";
		for ($i = 1; $i <= 20; $i++) {
			$pvKey = 'High_Rebate_P_' . date("Ymd") . '_' . $i;
			$pv = Redisd::instance('awall')->get($pvKey);
			$uvKey = 'High_Rebate_U_' . date("Ymd") . '_' . $i;
			$uv = Redisd::instance('awall')->get($uvKey);

			$allData = $this->getAllStat('High_Rebate_P_', 'High_Rebate_U_', $i);
			$pvAll = $allData['pv'];
			$uvAll = $allData['uv'];

			//分渠道统计注册数
			$chlUserCountSql = "SELECT COUNT(*) as count FROM $this->_tableName WHERE channel='$i' AND create_time>='$todayBegin' AND create_time<='$todayEnd'";
			$chlUserCount = $this->_getData($chlUserCountSql);
			$chlCount = $chlUserCount[0]['count'];

			//按钮点击数
			$sBCount = Redisd::instance('awall')->get("H_R_B_" . date("Ymd") . '_' . $i . "_1");
			$dBCount = Redisd::instance('awall')->get("H_R_B_" . date("Ymd") . '_' . $i . "_2");

			$message .= "<tr><td>" . date("Y-m-d") . "</td><td>" . $i . "</td><td>" . intval($pv) . "</td><td>" . intval($uv) . "</td><td>" . intval($chlCount) . "</td><td>" . intval($sBCount) . "</td><td>" . intval($dBCount) . "</td></tr>";

			/**

			$message .= "<p>" . date("Y-m-d") . " 渠道 " . $i . " PV: " . intval($pv) . "</p>";
			$message .= "<p>" . date("Y-m-d") . " 渠道 " . $i . " UV: " . intval($uv) . "</p>";
			$message .= "<p>" . " 渠道 " . $i . " 总PV: " . $pvAll . "</p>";
			$message .= "<p>" . " 渠道 " . $i . " 总UV: " . $uvAll . "</p>";
			*/
		}

		$message .= "</tbody></table></body></html>";

		$this->_successLog($message);

		$this->_mail($subject, $message);
	}

	public function runYest() {

		$today = date("Y-m-d", strtotime("-1 day"));
		$todayBegin = $today . " 00:00:00";
		$todayEnd = $today . " 23:59:59";

		$keyDate = date("Ymd", strtotime("-1 day"));

		$totalNewUserSql = "SELECT COUNT(*) as count FROM $this->_tableName WHERE create_time>='2018-08-29 00:00:00'";

		$totalUserCount = $this->_getData($totalNewUserSql);
		$totalCount = $totalUserCount[0]['count'];
		$this->_successLog("00 get total mobil count=" . $totalCount);

		//活动当天收集到的手机号数
		$newUserCountSql = "SELECT COUNT(*) as count FROM $this->_tableName WHERE create_time>='$todayBegin' AND create_time<='$todayEnd'";

		$newUserCount = $this->_getData($newUserCountSql);
		$userCount = $newUserCount[0]['count'];

		$this->_successLog("01 get today mobil count=" . $userCount);

		$newGomeUserCountSql = "SELECT COUNT(*) as count FROM $this->_gomeUserTableName WHERE create_time>='$todayBegin' AND create_time<='$todayEnd'";
		$newGomeUserCount = $this->_getData($newGomeUserCountSql);
		$incrUserCount = $newGomeUserCount[0]['count'];


		$this->_successLog("02 incr user count incr=" . $incrUserCount);

		$totalAppUserSql = "SELECT COUNT(*) as count FROM $this->_gomeUserTableName WHERE create_time>='2018-08-29 00:00:00'";
		$totalAppCount = $this->_getData($totalAppUserSql);
		$appIncrCount = $totalAppCount[0]['count'];

		$pvKey = 'High_Rebate_PV_' . $keyDate;
		$pv = Redisd::instance('awall')->get($pvKey);
		$uvKey = 'High_Rebate_UV_' . $keyDate;
		$uv = Redisd::instance('awall')->get($uvKey);

		$allData = $this->getAllStat('High_Rebate_PV_', 'High_Rebate_UV_');

		$pvAll = $allData['pv'];
		$uvAll = $allData['uv'];

		//按钮点击数总数
		$submitC = Redisd::instance('awall')->get("H_R_B_1");
		$downC = Redisd::instance('awall')->get("H_R_B_2");

		// @todo 文案
		$subject = $today . "运营高返利拉新活动统计数据";
		$message = "<html><body><h2>运营高返利拉新活动统计数据如下</h2>";
		$message .= "<p>" . $today . " PV:" . $pv . "</p>";
		$message .= "<p>" . $today . " UV:" . $uv . "</p>";
		$message .= "<p>总PV:" . $pvAll . "</p>";
		$message .= "<p>总UV:" . $uvAll . "</p>";
		$message .= "<p>注册用户数:" . $userCount . "</p>";
		$message .= "<p>总注册用户数:" . $totalCount . "</p>";
		$message .= "<p>APP内新登录用户数:" . $incrUserCount . "</p>";
		$message .= "<p>总APP内新登录用户数:" . $appIncrCount . "</p>";
		$message .= "<p>领钱按钮点击总数:" . $submitC . "</p>";
		$message .= "<p>查看红包按钮点击总数:" . $downC . "</p>";

		$message .= "<table><thead><th>日期</th><th>渠道</th><th>新增PV</th><th>新增UV</th><th>新增注册数</th><th>领钱按钮点击数</th><th>查看红包按钮点击数</th></thead><tbody>";
		for ($i = 1; $i <= 20; $i++) {
			$pvKey = 'High_Rebate_P_' . $keyDate . '_' . $i;
			$pv = Redisd::instance('awall')->get($pvKey);
			$uvKey = 'High_Rebate_U_' . $keyDate . '_' . $i;
			$uv = Redisd::instance('awall')->get($uvKey);

			//分渠道统计注册数
			$chlUserCountSql = "SELECT COUNT(*) as count FROM $this->_tableName WHERE channel='$i' AND create_time>='$todayBegin' AND create_time<='$todayEnd'";
			$chlUserCount = $this->_getData($chlUserCountSql);
			$chlCount = $chlUserCount[0]['count'];

			//按钮点击数
			$sBCount = Redisd::instance('awall')->get("H_R_B_" . $keyDate . '_' . $i . "_1");
			$dBCount = Redisd::instance('awall')->get("H_R_B_" . $keyDate . '_' . $i . "_2");

			$message .= "<tr><td>" . $today . "</td><td>" . $i . "</td><td>" . intval($pv) . "</td><td>" . intval($uv) . "</td><td>" . intval($chlCount) . "</td><td>" . intval($sBCount) . "</td><td>" . intval($dBCount) . "</td></tr>";

			/**

			$message .= "<p>" . date("Y-m-d") . " 渠道 " . $i . " PV: " . intval($pv) . "</p>";
			$message .= "<p>" . date("Y-m-d") . " 渠道 " . $i . " UV: " . intval($uv) . "</p>";
			$message .= "<p>" . " 渠道 " . $i . " 总PV: " . $pvAll . "</p>";
			$message .= "<p>" . " 渠道 " . $i . " 总UV: " . $uvAll . "</p>";
			*/
		}

		$message .= "</tbody></table></body></html>";

		$this->_successLog($message);

		$this->_mail($subject, $message);
	}

	public function runDay() {
		$startdate = "2018-08-29";
		$today = date("Y-m-d");

		$stimestamp = strtotime($startdate);
		$etimestamp = strtotime($today);

		// 计算日期段内有多少天
		$days = ($etimestamp-$stimestamp)/86400+1;

		$message = '<table><thead><th>日期</th><th>渠道</th><th>pv</th><th>uv</th><th>注册数</th></thead>';
		for($i = 0; $i < $days; $i++) {
			$date = date('Ymd', $stimestamp + (86400 * $i));
			$fdate = date('Y-m-d', $stimestamp + (86400 * $i));
			$sDate = $fdate . ' 00:00:00';
			$eDate = $fdate . ' 23:59:59';
			for ($j = 1; $j <= 25; $j++) {
				$message .= '<tr><td>' . $date . '</td><td>' . $j . '</td>';
				$pvkey = 'High_Rebate_P_' . $date . '_' . $j;
				$pv = Redisd::instance('awall')->get($pvkey);
				$pv = intval($pv);
				$message .= '<td>' . $pv . '</td>';

				$uvkey = 'High_Rebate_U_' . $date . '_' . $j;
				$uv = Redisd::instance('awall')->get($uvkey);
				$uv = intval($uv);
				$message .= '<td>' . $uv . '</td>';

				//活动当天收集到的手机号数
				$newUserCountSql = "SELECT COUNT(*) as count FROM $this->_tableName WHERE create_time>='$sDate' AND create_time<='$eDate' AND channel = $j";

				$newUserCount = $this->_getData($newUserCountSql);
				$userCount = $newUserCount[0]['count'];
				$message .= '<td>' . $userCount . '</td></tr>';
			}
		}
		$message .= '</table>';
		echo $message;
	}

	private function getAllStat($pvKey, $uvKey, $j = NULL) {

		$startdate = "2018-08-29";
		$today = date("Y-m-d");

		$stimestamp = strtotime($startdate);
		$etimestamp = strtotime($today);

		// 计算日期段内有多少天
		$days = ($etimestamp-$stimestamp)/86400+1;

		$allPv = 0;
		$allUv = 0;
		for($i = 0; $i < $days; $i++) {
			$date = date('Ymd', $stimestamp + (86400 * $i));

			$pvKey1 = $pvKey . $date;
			if ($j != NULL) {
				$pvKey1 = $pvKey1 . '_' . $j;
			}
			$pv = Redisd::instance('awall')->get($pvKey1);
			$pv = intval($pv);
			$this->_successLog("pvkey: " . $pvKey1 . "=" . $pv);
			$allPv += $pv;

			$uvKey1 = $uvKey . $date;
			if ($j != NULL) {
				$uvKey1 = $uvKey1 . '_' . $j;
			}
			$uv = Redisd::instance('awall')->get($uvKey1);
			$uv = intval($uv);
			$this->_successLog("uvkey: " . $uvKey1 . "=" . $uv);
			$allUv += $uv;
		}

		$data = array (
			'pv' => intval($allPv),
			'uv' => intval($allUv),
		);
		return $data;
	}


	public function stat() {

		// 记录数据
		$newGomeUserCountSql = "SELECT COUNT(*) as count FROM $this->_gomeUserTableName";
		$newGomeUserCount = $this->_getData($newGomeUserCountSql);
		$todayUserCount = $newGomeUserCount[0]['count'];

		$yesterday = date("Y-m-d", strtotime("-1 day"));
		$data = $yesterday . "\t" . $todayUserCount . "\n";

		file_put_contents($this->_userDateFile, $data, FILE_APPEND);
	}


	public function show() {

		$startdate = "2018-08-29";
		$today = date("Y-m-d");

		$stimestamp = strtotime($startdate);
		$etimestamp = strtotime($today);

		// 计算日期段内有多少天
		$days = ($etimestamp-$stimestamp)/86400+1;

		for($i = 0; $i < $days; $i++) {
			$date = date('Ymd', $stimestamp + (86400 * $i));

			$pvKey = 'High_Rebate_PV_' . $date;
			$pv = Redisd::instance('awall')->get($pvKey);
			$uvKey = 'High_Rebate_UV_' . $date;
			$uv = Redisd::instance('awall')->get($uvKey);

			echo $pvKey . " = " . $pv . " " . $uvKey . " = " . $uv . "\n";
		}

		for($i = 0; $i < $days; $i++) {
			$date = date('Ymd', $stimestamp + (86400 * $i));
			for ($j = 1; $j <= 15; $j++) {
				$pvKey = 'High_Rebate_P_' . $date . '_' . $j;
				$pv = Redisd::instance('awall')->get($pvKey);
				$uvKey = 'High_Rebate_U_' . $date . '_' . $j;
				$uv = Redisd::instance('awall')->get($uvKey);
				echo $pvKey . " = " . $pv . " " . $uvKey . " = " . $uv . "\n";
			}
		}
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

	private function _read($fileName) {

		$handle = fopen($fileName, "r");
		$lines = array();
		if ($handle) {
			while (($line = fgets($handle)) !== false) {
				$lines[] = trim($line, "\n");
			}
			fclose($handle);
		}
		$datas = array();
		foreach($lines as $line) {
			$arr = explode("\t", $line);
			$key = $arr[0];
			$val = $arr[1];
			$datas[$key] = $val;
		}

		return $datas;
	}

	/**
	 * 发送邮件
	 * $subject
	 * $message
	 */
	public function _mail($subject, $message) {
		echo $subject . "\n";
		echo $message . "\n";
		$tos[] = 'miaoyang-ds@gome.com.cn';
		$tos[] = 'zhoubin-ds@gome.com.cn';
		$tos[] = 'huotengyue@gome.com.cn';
		$tos[] = 'caoyu@gomeplus.com';
		$tos[] = 'zhangbing-ds1@gome.com.cn';
		$tos[] = 'wuhongling@gome.com.cn';
		$tos[] = 'baishen@gome.com.cn';

		$headers[] = 'MIME-Version: 1.0';
		$headers[] = 'Content-type: text/html; charset=utf-8';
		//$ret = mail(implode(",", $tos), $subject, $message, implode("\r\n", $headers));

		$mail = Email::instance();
		$mail->to($tos);
		$mail->subject($subject);
		$mail->content($message);
		$mail->execute();
	}

	private function _successLog($log) {
		file_put_contents(SUCCESSLOG, sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'SUCCESS', __FILE__, 0, $log), FILE_APPEND);
	}

	private function _errorLog($log) {
		file_put_contents(ERRORLOG, sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'ERROR', __FILE__, 0, $log), FILE_APPEND);
	}
}





class Redisd {

	protected static $_instance = NULL, $driver = '';
	protected static $_instanceSelf = null;

	/*
	 * @return Redisd
	 */

	public static function instance($type, $force = false) {
		if (self::$_instanceSelf === NULL || $force) {
			self::$_instanceSelf = new Redisd($type, $force);
		}
		return self::$_instanceSelf;
	}

	public function __construct($type, $force) {
		//$config = Kohana::$config->load('redisd.' . $type);

		$config = array (
			'type' => 'cluster',
			'cluster' => array (
				'g1rdsc01.ad.pro.gomeplus.com:7002',
				'g1rdsc02.ad.pro.gomeplus.com:7002',
				'g1rdsc03.ad.pro.gomeplus.com:7002',
				'g1rdsc04.ad.pro.gomeplus.com:7002',
				'g1rdsc05.ad.pro.gomeplus.com:7002',
				'g1rdsc06.ad.pro.gomeplus.com:7002',
			)
		);

		if (empty($config)) {
			throw new Exception('redisd config group [ ' . $type . ' ] not found');
		}
		if ($config['type'] == 'redis') {
			self::$driver = 'redis';
		} elseif ($config['type'] == 'cluster') {
			self::$driver = class_exists('RedisCluster', false) ? 'cluster' : 'redis';
		}
		switch (self::$driver) {
			case 'cluster':
				if (self::$_instance === NULL || $force) {
					self::$_instance = new RedisCluster(null, $config['cluster']);
				}
				break;
			case 'redis':
				if (self::$_instance === NULL || $force) {
					$redis = new Redis();
					$server = $config['redis'];
					if ($server['persistent']) {
						$redis->pconnect($server['host'], $server['port'], $server['timeout']);
					} else {

						$redis->connect($server['host'], $server['port'], $server['timeout']);
					}
					if ($server['password'] !== NULL) {
						$result = $redis->auth($server['password']);
						if (strtolower($result) != true && strtolower($result) != 'ok') {
							throw new Exception("Invaild redis [ " . $type . " ] password: {$server['password']}");
						}
					}
					self::$_instance = $redis;
				}
				break;
			default:
				break;
		}
	}

	public function get($key) {
		$data = self::$_instance->get($key);
		//return @unserialize($data);
		return $data;
	}

	public function delete($key) {
		return self::$driver == 'redis' ? self::$_instance->delete($key) : self::$_instance->del($key);
	}

	public function set($key, $value, $expire = 0) {
		//$value = @serialize($value);
		if ($expire) {
			return self::$_instance->setex($key, $expire, $value);
		} else {
			return self::$_instance->set($key, $value);
		}
	}

	public function lpush($key,$value){
		return self::$_instance->lPush($key, $value);
	}
	public function exists($key) {
		return self::$_instance->exists($key);
	}

	public function incr($key) {
		return self::$_instance->incr($key);
	}

	public function incrBy($key, $value) {
		return self::$_instance->incrBy($key, $value);
	}

	public function decr($key) {
		return self::$_instance->decr($key);
	}

	public function decrBy($key, $value) {
		return self::$_instance->decrBy($key, $value);
	}
}

$isRun = false;
$isRunYes = false;
$isStat = false;
$isShow = false;
$isRunDay = false;

for($i = 1; $i < $_SERVER['argc']; $i++) {
	if (!isset($_SERVER['argv'][$i])) {
		break;
	}
	$opt = $_SERVER['argv'][$i];
	if ($opt == "--run") {
		$isRun = true;
		break;
	}
	if ($opt == "--stat") {
		$isStat = true;
		break;
	}
	if ($opt == "--show") {
		$isShow = true;
		break;
	}
	if ($opt == "--y") {
		$isRunYes = true;
		break;
	}
	if ($opt == "--d") {
		$isRunDay = true;
		break;
	}
}

if ($isRun) {
	$highRebateTask = new HighRebateTask();
	$highRebateTask->run();
}

if ($isRunYes) {
	$highRebateTask = new HighRebateTask();
	$highRebateTask->runYest();
}

if ($isRunDay) {
	$highRebateTask = new HighRebateTask();
	$highRebateTask->runDay();
}

if ($isStat) {
	$highRebateTask = new HighRebateTask();
	$highRebateTask->stat();
}
if ($isShow) {
	$highRebateTask = new HighRebateTask();
	$highRebateTask->show();
}



/**
/usr/local/php/bin/php hrebateTask.php --run
/usr/local/php/bin/php hrebateTask.php --stat
/usr/local/php/bin/php hrebateTask.php --show

1 0 * * * /usr/local/php/bin/php /gomeo2o/data/minisite/misc/mm/hrebateTask.php --stat
0 10,14,18 * * * /usr/local/php/bin/php /gomeo2o/data/minisite/misc/mm/hrebateTask.php --run
*/
