<?php

/**
 * 基础控制器
 * @package default
 * @author  qichangchun<qichangchun@gomeplus.com>
 * @date:   2016/6/20
 * @time:   11:10
 */
class Controller_Render extends Controller {
	
	protected $_layout = 'layouts/default';
	
	protected $_autoRender = TRUE;
	
	public function before() {
		parent::before();
		
		$globalConfigs = (array) Kohana::$config->load('default')->get('globalConfigs');
		if($this->_autoRender === TRUE) {
			$this->_layout = View::factory($this->_layout)
					->set("globalConfigs", $globalConfigs);
		}
	}
	
	public function after() {
		if($this->_autoRender === TRUE) {
			$this->response->headers('Content-type', "text/html");
			$this->response->body($this->_layout->render());
		}
		
		parent::after();
	}
}