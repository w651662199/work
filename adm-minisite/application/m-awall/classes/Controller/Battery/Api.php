<?php

/**
 * 短信验证码
 * @package default
 * @author  wuhongling
 */
class Controller_Battery_Api extends Controller {

	/**
	 * 获取短信验证码
	 */
	public function action_getcode() {

		$mobile = isset($_GET['mobile']) ? $_GET['mobile'] : 0;

		if (preg_match("/^1\d{10}$/", $mobile)) {
			try {
				$cacheCountKey = "WAP_SMS_C_" . $mobile;
				$isSend = Redisd::instance('sms')->get($cacheCountKey);
				if ($isSend != FALSE) {
					$this->failed(null, '请不要重复获取');
				} else {
					$cacheKey = "WAP_SMS_" . $mobile;
					$smsConfig = (array) Kohana::$config->load('default')->get('sms');
					$random = rand(100000, 999999);
					$data = array(
						"name" => $smsConfig['userName'],
						"pwd" => $smsConfig['password'],
						"content" => sprintf('【国美美媒】%d（国美美媒手机验证码，请在5分钟内完成验证）， 如非本人操作，请忽略本短信。', $random),
						"mobile" => $mobile,
						"type" => $smsConfig['type'],
					);
					$curlInstance = new Curl_Request();
					$result = $curlInstance->post($smsConfig['smsUrl'], $data);
					$result = explode(',', $result);
					if ($result[0] == '0') {
						Redisd::instance('sms')->set($cacheKey, $random, 5 * 60);
						Redisd::instance('sms')->set($cacheCountKey, $random, 60);
						$this->success();
					} else {
						$this->failed(null, '验证码发送失败');
					}
				}
			} catch (Exception $e) {
				$this->failed(null, $e->getMessage());
			}
		} else {
			$this->failed(null, '手机号格式不正确');
		}
	}

	/**
	 * 用户注册
	 */
	public function action_register() {

		$name = isset($_POST['name']) ? $_POST['name'] : "";
		$mobile = isset($_POST['mobile']) ? $_POST['mobile'] : 0;
		$gender = isset($_POST['gender']) ? $_POST['gender'] : 0;
		$birthday = isset($_POST['birthday']) ? $_POST['birthday'] : 0;
		$verifyCode = isset($_POST['verify_code']) ? $_POST['verify_code'] : 0;
		$survey = isset($_POST['survey']) ? $_POST['survey'] : 0;

		try {
			$cacheKey = "WAP_SMS_" . $mobile;
			$redisVerifyCode = Redisd::instance('sms')->get($cacheKey);

			if ($redisVerifyCode != FALSE && $redisVerifyCode == $verifyCode) {
				$data = array (
					"name" => $name,
					"mobile" => $mobile,
					"gender" => $gender,
					"birthday" => $birthday,
					"survey" => $survey
				);
				try {
					$return = Business::factory('Battery_Pingan')->create($data);
					$number = isset($return[0]) ? $return[0] : 0;

				} catch (Exception $e) {
					$this->failed(null, $e->getMessage());
				}
				$this->success();
			} else {
				$this->failed(null, '验证码不正确');
			}
		} catch (Exception $e) {
			$this->failed(null, $e->getMessage());
		}
	}

	public function action_exist() {
		$wechatId = isset($_GET['wechatId']) ? $_GET['wechatId'] : 0;

		if ($wechatId != 0) {
			$smsConfig = (array) Kohana::$config->load('default')->get('sms');
			$pingan = Business::factory('Battery_Pingan')->getDataWithWechatId($wechatId);

			$data = array(
				'isExist' => 0
			);

			if ($pingan != NULL) {
				$data['isExist'] = 1;
			} else {
				$data['title'] = $smsConfig['title'];
				$data['landingPage'] = $smsConfig['landingPage'];
			}

			$this->success($data);
		} else {
			$this->failed(null, '缺少必要参数');
		}
	}

	/**
	 * 返回失败数据
	 */
	public function failed($data = array(), $msg = "failed") {
		header('Content-Type: application/json');
		header('Access-Control-Allow-Origin: *');
		$ret = array (
			"code" => 500,
			"data" => $data,
			"iserror" => 1,
			"msg" => $msg
		);

		echo json_encode($ret);
		exit();
	}

	/**
	 * 返回成功数据
	 */
	public function success($data = array(), $msg = "success") {
		header('Content-Type: application/json');
		header('Access-Control-Allow-Origin: *');
		$ret = array (
			"code" => 200,
			"data" => $data,
			"iserror" => 0,
			"msg" => $msg
		);

		echo json_encode($ret);
		exit();
	}
}
