<?php
/**
 * 店铺信息业务逻辑层
 *
 * @author baishen
 */
class Business_Gome_Shop extends Business {

	/**
	 * 根据店铺id获取店铺
	 *
	 * @param shopId
	 */
	public function getShopByShopId($shopId) {

		// @todo 参数验证
		$apis = (array) Kohana::$config->load('gome')->get('apis');
		$shopApi = $apis['shopApi'];
		$shopApi .= '?shopId=' . $shopId;

		Log::instance()->add(Log::NOTICE, $shopApi);

		$curlInstance = new Curl_Request();
		$result = $curlInstance->get($shopApi);
		Log::instance()->add(Log::NOTICE, $result);

		$result = json_decode($result, true);
		$shopData = $result['data'];

		$shop = new Model_Gome_Shop($shopData);

		return $shop;
	}
}
