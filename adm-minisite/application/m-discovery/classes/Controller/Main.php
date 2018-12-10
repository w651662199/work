<?php
/**
 * 探索频道
 * @author baishen
 */
class Controller_Main extends Controller_Render {

	protected $_layout = 'layouts/main';

	/**
	 * 首页
	 */
	public function action_index() {

		$this->_layout->content = View::factory('main/index');
	}
}
