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

class PinganTask {

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

	private $_ch = null;

	private $response_header = '';
	private $response_body = '';
	private $response_info = '';

	private $_tableName = 'ams_pingan';

	private $_impTableName = 'ams_pingan_imp';

	private $_users = array();

	//自然日曝光数据
	private $_impDatas = array();

	//自然日获客数据
	private $_dayUsers = array();

	private $_requestApi = 'https://www.yyang.net.cn/api/v1/';

	// private $_requestApi = 'https://www.yyang.net.cn/service/v1/';

	private $_appid = '92cc227532d17e56e07902b254dfad10';

	private $_appsecret = '104f235908f326361a3ab16891949b70';

	private $_mediaId = '1092_1200';

	private $_syncedCount = 0;

	private $_token = '';

	private $_uid = '';

	public function __construct() {
		$this->_mysqli = new mysqli($this->_dbConfig["host"], $this->_dbConfig["user"], $this->_dbConfig["password"], $this->_dbConfig["database"], $this->_dbConfig["port"]);
		if ($this->_mysqli->connect_error) {
			die("Connection failed: " . $this->_mysqli->connect_error);
		}

		$this->_ch = curl_init();
		curl_setopt($this->_ch, CURLOPT_HEADER, 1);
		curl_setopt($this->_ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($this->_ch, CURLOPT_ENCODING, 'gzip,deflate');
	}

	public function run() {

		$selectCountSynced = "SELECT COUNT(*) as count FROM $this->_tableName WHERE is_sync = 1";
		$syncedCount = $this->_getData($selectCountSynced);
		$count = $syncedCount[0]['count'];

		$this->_successLog("已推送的数据条数" . $count);

		if ($count  >= 5000) {
			return;
		}
		$limit = 1000;
		if ($count >= 4000) {
			$limit = 5000 - $count;
		}

		$selectSql = "SELECT * FROM $this->_tableName WHERE is_sync = 0 LIMIT " . $limit;

		$this->_successLog("查询未推送数据sql" . $selectSql);

		$this->_users = $this->_getData($selectSql);

		$this->_successLog("查询到的数据" . json_encode($this->_users));

		if (empty($this->_users)) {
			return;
		}

		$this->_getToken();
		if (empty($this->_token) || empty($this->_uid)) {
			return;
		}

		$successUserIds = array();
		$successUsers = array();
		foreach ($this->_users as $user) {
			$data = array (
				'mediaid' => $this->_mediaId,
				'mobile' => $user['mobile'],
				'realname' => $user['realname'],
				'sex' => $user['sex'],
				'birthday' => strtotime($user['brithday']),
				'regdate' => strtotime($user['regdate']),
				'ip' => $user['ip']
			);
			$survey = json_decode($user['survey'], true);
			foreach ($survey as $index => $question) {
				$i = $index + 1;
				$data['q' . $i] = isset($question['title']) ? $question['title'] : '';
				$data['a' . $i] = isset($question['value']) ? $question['value'] : '';
			}

			$businessData = array (
				'type' => 'insurance',
				'data' => json_encode($data),
				'token' => $this->_token,
				'uid' => $this->_uid,
			);
			$pinganApi = $this->_requestApi . 'financialbusiness/datahandler';

			$this->_successLog("推送数据" . json_encode($data));

			$result = $this->_postData($pinganApi, $businessData);
			$this->_successLog("返回数据" . json_encode($result));

            // 200 代表成功
            $result = json_decode($result, true);
			if ($result['status'] == 200) {
				$successUserIds[] = $user['pingan_id'];
				$successUsers[] = $user;
			}
		}

		$updateTime = date("Y-m-d H:i:s", time());
		$updateSql = "UPDATE $this->_tableName SET is_sync=1, sync_result='success', update_time='$updateTime' WHERE pingan_id IN (" . implode(",", $successUserIds) . ")";

		$this->_successLog("更新sql：" . $updateSql);

		$this->_mysqli->query($updateSql);

		//昨日时间
		$yesterday = date("Y-m-d",strtotime("-1 day"));
		$yesterdayBegin = $yesterday . " 00:00:00";
		$yesterdayEnd = $yesterday . " 23:59:59";

		//曝光数据
		// $beginYesterday = mktime(0, 0, 0, date('m'), date('d')-1, date('Y'));
		// $endYesterday = mktime(0, 0, 0, date('m'), date('d'), date('Y'))-1;

		$impSql = "SELECT COUNT(*) as count from $this->_impTableName WHERE time>='$yesterdayBegin' AND time<='$yesterdayEnd'";
		$this->_successLog("查询曝光sql：" . $impSql);

		$impCountResult = $this->_getData($impSql);
		$impCount = $impCountResult[0]['count'];

		$this->_successLog("曝光条数：" . json_encode($impCountResult));
		$this->_successLog("曝光条数：" . $impCount);

		//自然日内获客数据

		// $dayPattern = date("Y-m-d", strtotime("-1 day")) . '%';
		$dayUserSql = "SELECT * from $this->_tableName WHERE regdate>='$yesterdayBegin' AND regdate<='$yesterdayEnd'";

		$this->_successLog("查询昨日获客数据sql：" . $dayUserSql);

		$this->_dayUsers = $this->_getData($dayUserSql);
		$this->_mysqli->close();

		$this->_successLog("昨日获客：" . json_encode($this->_dayUsers));

		//不同渠道获客数据统计
		$cddCount = 0;
		$otherCount = 0;
		foreach ($this->_dayUsers as $user) {
			if (stristr($user['refer'], 'wacdd') != FALSE) {
				$cddCount += 1;
			} else {
				$otherCount += 1;
			}
		}

		// @todo 文案
		$subject = "平安获客落地页曝光数据统计邮件";
		$message = "<html><body><h2>落地页曝光数据统计如下</h2>";
		$message .= "<p>中间页曝光总数：" . $impCount . "</p>";
		$message .= "<p>充点电获获客数：" . $cddCount . "</p>";
		$message .= "<p>其他渠道获客数：" . $otherCount . "</p>";
		// foreach ($successUsers as $successUser) {
		// 	$message .= "<tr><td>" . $successUser['mobile'] . "</td><td>" . $successUser['realname'] . "</td><td> " . $successUser['sex'] . "</td>";
		// 	$message .= "<td>" . $successUser['birthday'] . "</td><td>" . $successUser['regdate'] . "</td><td></tr>";
		// }
		// $message .= "</tbody></table></body></html>";
		$message .= "</body></html>";
		$this->_mail($subject, $message);
	}

	private function _getToken() {
		$tokenApi = $this->_requestApi . 'user/gettoken';

		$tokenData = array (
			'appid' => $this->_appid,
			'appsecret' => $this->_appsecret,
		);

		$this->_successLog("获取token参数" . json_encode($tokenData));
		$tokenResult = $this->_postData($tokenApi, $tokenData);

		if ($tokenResult != FALSE) {
			$this->_successLog("获取token成功" . $tokenResult);
		} else {
			$this->_errorLog("获取token失败" . $tokenResult);
		}

		$tokenResult = json_decode($tokenResult, true);

		$this->_successLog("json_decode后token数据:" . $tokenResult['data']['token']);

		if (!empty($tokenResult) && $tokenResult['status'] == 200) {
			$this->_token = $tokenResult['data']['token'];
			$this->_uid = $tokenResult['data']['uid'];
		}
	}

	/**
	 * post请求
	 * $url
	 * $data
	 */
	private function _post($url, $data) {
		curl_setopt($this->_ch, CURLOPT_POST, 1);
		if (empty($data)) {
			$data = '';
		} elseif (is_array($data)) {
			$data = http_build_query($data);
		}
		curl_setopt($this->_ch, CURLOPT_POSTFIELDS, $data);
		curl_setopt($this->_ch, CURLOPT_HEADER, 1);
		curl_setopt($this->_ch, CURLOPT_URL, $url);

		$content = curl_exec($this->_ch);
		if (curl_errno($this->_ch)) {
			return FALSE;
		} else {
			$this->_successLog("curl返回info:" . $content);
			$info = explode("\r\n\r\n", $content, 3);
			$this->response_header = isset($info[1]) ? $info[1] : '';
			$this->response_body = isset($info[2]) ? $info[2] : '';
			$this->response_info = curl_getinfo($this->_ch);
			return $this->response_body;
			//return $info[1];
		}
	}
	
	private function _postData($url, $data) {
		curl_setopt($this->_ch, CURLOPT_POST, 1);
		if (empty($data)) {
			$data = '';
		} elseif (is_array($data)) {
			$data = http_build_query($data);
		}
		curl_setopt($this->_ch, CURLOPT_POSTFIELDS, $data);
		curl_setopt($this->_ch, CURLOPT_HEADER, 1);
		curl_setopt($this->_ch, CURLOPT_URL, $url);

		$content = curl_exec($this->_ch);
		if (curl_errno($this->_ch)) {
			return FALSE;
		} else {
			$this->_successLog("curl返回info:" . $content);
			$info = explode("\r\n\r\n", $content, 3);
			$this->response_header = isset($info[0]) ? $info[0] : '';
			$this->response_body = isset($info[1]) ? $info[1] : '';
			$this->response_info = curl_getinfo($this->_ch);
			return $this->response_body;
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
		$tos[] = 'jina-ds@gomeplus.com';

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

$pinganTask = new PinganTask();
$pinganTask->run();
