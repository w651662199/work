<?php
/**
 * 美媒榜 榜单
 * @author wuhongling
 */
class Controller_Mmb extends Controller_Render {

	protected $_layout = 'layouts/main';

	/**
	 * 首页
	 */
	public function action_index() {

		$this->_layout->content = View::factory('mmb/index');
	}
}
