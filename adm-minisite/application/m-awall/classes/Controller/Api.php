<?php
/**
* 逛逛获取广告频道入口类
*/
class Controller_Api extends Controller{

	protected $_autoRender = false;

	public function action_index() {
		exit;
	}

	/**
	 * wap端
	 */
	public function action_entry() {
		$this->contentType = 'application/json';
		$entry = (array) Kohana::$config->load('default')->get('entry');
		$this->response->body(json_encode($entry['wap']));
	}

	/**
	 * 自建活动页批量获取价格 jsonp 格式
	 */
	public function action_prices() {
		$proSkuIds = Arr::get($_GET, 'ids', 0);
		$areaCode = Arr::get($_GET, 'areaCode', 0);
		$callBack = Arr::get($_GET, 'callback', 0);

		$result = Business::factory('Gome_Item')->getPricesByProductIdAndSkuId($proSkuIds, $areaCode);

		echo $callBack . '(' . json_encode($result) . ');';
	}

	public function action_weixin() {
		$callBack = Arr::get($_GET, 'callback', 0);
		$shareUrl = urldecode(Arr::get($_GET, 'shareUrl', ''));
		$shareUrl = str_replace(' ', '+', $shareUrl);
		$isGj = Arr::get($_GET, 'isGj', false);
		$wxConfing = Business::factory('WxBase')->getWeiXinConfigInfo($shareUrl, $isGj);

		echo $callBack . '(' . json_encode($wxConfing) . ');';
	}
}