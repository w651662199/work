<?php
/**
 * 商品信息业务逻辑层
 *
 * @author baishen
 */
class Business_Bs_Item extends Business {

	/**
	 * 根据商品id获取商品
	 *
	 * @param itemId
	 */
	public function getItemByItemId($itemId) {
		if (!Valid::numeric($itemId)) {
			throw new Business_Exception('商品id参数错误！');
		}

		$apis = (array) Kohana::$config->load('bs')->get('apis');
		$itemComboApi = $apis['itemComboApi'];
		$itemComboApi .= '?itemId=' . $itemId;
		Log::instance()->add(Log::NOTICE, $itemComboApi);

		$curlInstance = new Curl_Request();
		$result = $curlInstance->get($itemComboApi);
		Log::instance()->add(Log::NOTICE, $result);

		$result = json_decode($result, true);
		if (!$result || $result['message'] != '') {
			Log::instance()->add(Log::ERROR, "get item failed itemId: " + $itemId);
			throw new Business_Exception("商品不存在");
		}
		$data = $result['data'];

		$item = new Model_Bs_Item($data);

		return $item;
	}
}
