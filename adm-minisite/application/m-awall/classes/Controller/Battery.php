<?php

class Controller_Battery extends Controller_Render {

	protected $_layout = 'layouts/main';

	public function action_index() {

		$this->_contentType = 'text/html';

		$wechatId = isset($_GET['wechatId']) ? $_GET['wechatId'] : '';
		$refer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
		// $ip = Request::$client_ip;
		$ip = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : '';

		Log::instance()->add(Log::NOTICE, "页面曝光：\twechatId:$wechatId\trefer: $refer\tip:$ip");

		$data = array(
			'refer' => $refer,
			'wechat_id' => $wechatId,
			'ip' => $ip
		);

		$insertResult = Business::factory('Battery_Imp')->create($data);

		Log::instance()->add(Log::NOTICE, '页面曝光入库结果：' . json_encode($insertResult));

		$this->_layout->content = View::factory('battery/index')
			->set('refer', $refer);
	}

	/**
	 * 获取短信验证码
	 */
	public function action_getcode() {

		$this->_contentType = 'application/json';

		$mobile = isset($_GET['mobile']) ? $_GET['mobile'] : 0;

		if (preg_match("/^1\d{10}$/", $mobile)) {
			try {
				$cacheCountKey = "WAP_CODE_C_" . $mobile;
				$isSend = Redisd::instance('awall')->get($cacheCountKey);
				if ($isSend != FALSE) {
					$this->failed('请不要重复获取');
				} else {
					$cacheKey = "WAP_CODE_" . $mobile;
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
						Redisd::instance('awall')->set($cacheKey, $random, 5 * 60);
						Redisd::instance('awall')->set($cacheCountKey, $random, 60);
						$this->success($result, 'success');
					} else {
						$this->failed('获取验证码失败');
					}
				}
			} catch (Exception $e) {
				$this->failed($e->getMessage());
			}
		} else {
			$this->failed('手机号格式不正确');
		}
	}

	/**
	 * 验证手机号是否参与过
	 * @return [type] [description]
	 */
	public function action_check() {

		$this->_contentType = 'application/json';

		$mobile = isset($_GET['mobile']) ? $_GET['mobile'] : 0;

		Log::instance()->add(Log::NOTICE, $mobile);

		if (preg_match("/^1\d{10}$/", $mobile)) {
			$mobileKey = "WAP_PINGAN_MOBILE_" . $mobile;

			try {
				$isMobileExist = Redisd::instance('awall')->get($mobileKey);

				$data = array('exist' => 0);

				if ($isMobileExist != false) {
					$data['exist'] = 1;
				}
				$this->success($data, 'success');
			} catch (Exception $e) {
				$this->failed($e->getMessage());
			}
		} else {
			$this->failed('手机号格式不正确');
		}

	}

	/**
	 * 用户注册
	 */
	public function action_register() {

		$this->_contentType = 'application/json';

		$postData = file_get_contents('php://input');
		$postData = (array)json_decode($postData);

		$name = isset($postData['name']) ? $postData['name'] : '';
		$mobile = isset($postData['mobile']) ? $postData['mobile'] : '';
		$sex = isset($postData['sex']) ? $postData['sex'] : '';
		$wechatId = isset($postData['wechatId']) ? $postData['wechatId'] : '';
		$birthday = isset($postData['birthday']) ? $postData['birthday'] : '';
		$verifyCode = isset($postData['verifyCode']) ? $postData['verifyCode'] : '';
		$survey = isset($postData['survey']) ? $postData['survey'] : '';
		$refer = isset($postData['refer']) ? $postData['refer'] : '';

		try {
			$cacheKey = "WAP_CODE_" . $mobile;
			$perDateKey = "WAP_PINGAN_" . date("Y-m-d");
			$mobileKey = "WAP_PINGAN_MOBILE_" . $mobile;
			$wechatKey = "WAP_PINGAN_WECHAT_" . $wechatId;
			$totalKey = "WAP_PINGAN_TOTAL_COUNT";

			// $ip = Request::$client_ip;
			$ip = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : '';

			$redisVerifyCode = Redisd::instance('awall')->get($cacheKey);

			$count = Redisd::instance('awall')->incrBy($perDateKey, 0);
			Log::instance()->add(Log::NOTICE, '当天参与用户数：' . $count);

			if ($redisVerifyCode != FALSE && $redisVerifyCode == $verifyCode) {
				$data = array (
					"realname" => $name,
					"mobile" => $mobile,
					"sex" => $sex,
					"brithday" => date("Y-m-d", $birthday),
					"survey" => $survey,
					"refer" => $refer,
					"wechat_id" => $wechatId,
					"ip" => $ip
				);
				Log::instance()->add(Log::NOTICE, json_encode($data));
				try {
					$insertResult = Business::factory('Battery_Pingan')->create($data);
					$number = isset($insertResult[0]) ? $insertResult[0] : 0;

					Log::instance()->add(Log::NOTICE, $insertResult);

					if (!is_array($insertResult) || $insertResult[1] != 1) {
						$this->failed('请重新提交信息');
					} else if ($insertResult[1] == 2) {
						$this->failed('该手机号已参与过赠险活动');
					} else {
						Redisd::instance('awall')->incr($perDateKey);
						Redisd::instance('awall')->incr($totalKey);
						Redisd::instance('awall')->set($mobileKey, $mobile);
						Redisd::instance('awall')->set($wechatKey, $wechatId);
						$this->success($insertResult);
					}

				} catch (Exception $e) {
					$this->failed($e->getMessage());
				}
			} else {
				$this->failed('验证码不正确', 501);
			}
		} catch (Exception $e) {
			$this->failed($e->getMessage());
		}
	}

	/**
	 * 验证微信id是否参与过与当天数据是否超过1000条
	 * @return [type] [description]
	 */
	public function action_entry() {

		$this->_contentType = 'application/json';

		$wechatId = isset($_GET['wechatId']) ? $_GET['wechatId'] : '';
		$callback = isset($_GET['callback']) ? $_GET['callback'] : null;

		if ($wechatId != '') {
			try {
				$wechatKey = "WAP_PINGAN_WECHAT_" . $wechatId;
				$perDateKey = "WAP_PINGAN_" . date("Y-m-d");
				$totalKey = "WAP_PINGAN_TOTAL_COUNT";

				$wechatId = Redisd::instance('awall')->get($wechatKey);
				$perDayCount = Redisd::instance('awall')->incrBy($perDateKey, 0);
				$totalCount = Redisd::instance('awall')->incrBy($totalKey, 0);

				$startTime = 1506787200;
				$endTIme = 1508083199;

				$isExpire = time() < $startTime || time() > $endTIme;

				$data = array(
					'isExist' => 0
				);
				if ($wechatId != false || $perDayCount >= 1000 || $totalCount >= 5000 || $isExpire) {
					$data['isExist'] = 1;
				} else {
					$smsConfig = (array) Kohana::$config->load('default')->get('sms');
					$data['title'] = $smsConfig['title'];
					$data['landingPage'] = $smsConfig['landingPage'];
				}

				Log::instance()->add(Log::NOTICE, json_encode($data));

				$this->success($data, 'success', $callback);
			} catch (Exception $e) {
				$this->failed($e->getMessage());
			}
		} else {
			$this->failed('缺少必要参数', 500, $callback);
		}
	}
}
