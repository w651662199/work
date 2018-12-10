<?php

/**
 * 管家活动接口(临时需求)
 * @package default
 * @author  baishen
 */
class Controller_Steward extends Controller {

	/**
	 * 获取短信验证码
	 */
	public function action_getcode() {

		$mobile = isset($_GET['mobile']) ? $_GET['mobile'] : 0;

		// @todo 获取短信验证码

		$this->success();
	}

	/**
	 * 用户注册
	 */
	public function action_register() {

		//$name = isset($_POST['name']) ? $_POST['name'] : "";
		$mobile = isset($_POST['mobile']) ? $_POST['mobile'] : 0;
		$shopId = isset($_POST['shop_id']) ? $_POST['shop_id'] : 0;
		//$verifyCode = isset($_POST['verify_code']) ? $_POST['verify_code'] : 0;

		// @todo 验证码

		$data = array (
			//"name" => $name,
			"mobile" => $mobile,
			"shop_id" => $shopId,
		);

		// 注册顺序号码
		$number = 0;
		try {
			$return = Business::factory('Steward_User')->create($data);
			$number = isset($return[0]) ? $return[0] : 0;

		} catch (Exception $e) {
			$this->failed($e->getMessage());
		}

		if ($number == 0) {
			$this->failed();
		}

		$returnData = array (
			"number" => $number,
		);

		$this->success($returnData);
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
