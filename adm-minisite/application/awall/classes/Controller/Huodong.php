<?php
/**
 * 活动页面
 */
class Controller_Huodong extends Controller_Render {

	protected $_layout = 'layouts/default';

	/**
	 * 首页
	 */
    public function action_tuiguang() {
		$slotIds = (array) Kohana::$config->load('default')->get('slotIds');
	    $globalConfigs = (array) Kohana::$config->load('default')->get('configs');


		$this->_layout->content = View::factory('huodong/tuiguang')
			->set("slotIds", $slotIds)
			->set("globalConfigs", $globalConfigs);
	}

}
