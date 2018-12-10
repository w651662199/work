<?php
/**
 * 用户任务
 */
class Controller_Huodong extends Controller_Render {

	protected $_layout = 'layouts/huodong';

	/**
	 * 首页
	 */
	public function action_yidongtuiguang() {
	    $slotIds = (array) Kohana::$config->load('default')->get('slotIds');
	    $globalConfigs = (array) Kohana::$config->load('default')->get('configs');
		$this->_layout->content = View::factory('huodong/yidongtuiguang')
		->set("slotIds", $slotIds)
		->set("globalConfigs", $globalConfigs);
	}
}
