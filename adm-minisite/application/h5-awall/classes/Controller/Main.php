<?php

/**
 * 广告频道首页
 * @author qichangchun
 * @date 2016-06-30 14:00:12
 * @email qichangchun@gomeplus.com
 */
class Controller_Main extends Controller_Render {

	/**
	 * @todo 广告频道app内嵌首页
	 */
	public function action_index() {
		HTTP::redirect('item/list');
	}
}
