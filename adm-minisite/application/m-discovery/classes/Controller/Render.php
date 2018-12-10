<?php

/**
 * 基础控制器
 * @author  baishen
 */
class Controller_Render extends Controller {
	
	protected $_layout = 'layouts/default';
	
	// text/html, text/xml, application/json
	protected $_contentType = 'text/html';

	protected $_autoRender = TRUE;

	protected $_code = 200;
	protected $_data = array();
	protected $_iserror = 0;
	protected $_msg = "";

	public function before() {
		parent::before();

		// @todo check login

		$globalConfigs = (array) Kohana::$config->load('default')->get('configs');
		$slotIds = (array) Kohana::$config->load('default')->get('slotIds');

		if($this->_autoRender === TRUE) {
			if($this->_contentType == 'text/html') {
				$this->_layout = View::factory($this->_layout)
					->set("globalConfigs", $globalConfigs)
					->set("slotIds", $slotIds);
			}
		}
	}
	
	public function after() {
		if($this->_autoRender === TRUE) {
			$this->response->headers('Content-type', $this->_contentType);
			$body = array(
				'code' => $this->_code,
				'data' => $this->_data,
				'iserror' => $this->_iserror,
				'msg' => $this->_msg,
			);

			if($this->_contentType == 'text/html') {
				$body = $this->_layout->render();
			} elseif($this->_contentType == 'application/json') {
				if($this->_callback) {
					$body = $this->_callback .'('. json_encode($body) .');';
				} else {
					$body = json_encode($body);
				}
			}
			$this->response->body($body);
		}
		
		parent::after();
	}

	/**
	 * 执行成功返回
	 *
	 * @param array $data
	 * @param string $message
	 * @param string $callback
     */
	public function success($data = array(), $msg = "success", $callback = "") {
		$this->_data = $data;
		$this->_msg = $msg;
		$this->_code = 200;
		$this->_iserror = 0;
		$this->_callback = $callback;
	}

	/**
	 * 执行失败返回
	 *
	 * @param array $data
	 * @param string $message
	 * @param string $callback
     */
	public function failed($msg = "failed", $callback = "") {
		$this->_data = array();
		$this->_msg = $msg;
		$this->_code = 500;
		$this->_iserror = 1;
		$this->_callback = $callback;
	}
}