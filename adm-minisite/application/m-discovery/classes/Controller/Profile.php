<?php
/**
 * 美媒榜 我的
 * @author wuhongling
 */
class Controller_Profile extends Controller_Render {

	protected $_layout = 'layouts/main';

	/**
	 * 首页
	 */
	public function action_index() {

		$this->_layout->content = View::factory('profile/index');
	}
}
