<?php


class Controller_Api extends Controller {
	/**
	 * 活动页面(获取首页头部)
	 *//*
	public function action_header() {
		$curlInstance = new Curl_Request();
		$result = $curlInstance->get('http://www.atguat.com.cn/n/common/a55/head.html');
		$this->success($result);
	}
	*//**
	 * 活动页面(获取首页尾部)
	 *//*
	public function action_footer() {
		$curlInstance = new Curl_Request();
		$result = $curlInstance->get('http://www.atguat.com.cn/n/common/a55/foot.html');
		$this->success($result);
	}
	*//**
	 * 活动页面(获取首页样式文件)
	 *//*
	public function action_style() {
		$curlInstance = new Curl_Request();
		$result = $curlInstance->get('http://www.atguat.com.cn/n/common/a55/style.html');
		$this->success($result);
	}
	*//**
	 * 活动页面(获取首页js文件)
	 *//*
	public function action_script() {
		$curlInstance = new Curl_Request();
		$result = $curlInstance->get('http://www.atguat.com.cn/n/common/a55/script.html');
		$this->success($result);
	}
	*//**
	 * 活动页面(获取首页global)
	 *//*
	public function action_global() {
		$curlInstance = new Curl_Request();
		$result = $curlInstance->get('http://www.atguat.com.cn/n/common/a55/global.html');
		$this->success($result);
	}
*/
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
