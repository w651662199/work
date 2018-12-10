<?php
/**
* 逛逛获取广告频道入口类
*/
class Controller_Api extends Controller{

	protected $_autoRender = false;

	public function action_index(){
		exit;
	}

	/**
	 * app端
	 */
	public function action_entry(){
		$this->contentType = 'application/json';
		$entry = (array) Kohana::$config->load('default')->get('entry');
		$this->response->body(json_encode($entry['h5']));
	}
}