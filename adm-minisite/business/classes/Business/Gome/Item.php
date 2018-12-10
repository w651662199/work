<?php
/**
 * 商品信息业务逻辑层
 *
 * @author baishen
 */
class Business_Gome_Item extends Business {

	/**
	 * 根据商品id获取商品
	 *
	 * @param productId
	 * @param skuId
	 */
	public function getItemByProductIdAndSkuId($productId, $skuId, $areaCode) {

		// @todo 参数验证
		$apis = (array) Kohana::$config->load('gome')->get('apis');
		$itemPriceApi = $apis['itemPriceApi'];
		$itemAppraisalApi = $apis['itemAppraisalApi'];

		// @todo areaCode
		// siteId: 1 pc; 2 无线
		$itemPriceApi .= '?params=' . $productId . '-' . $skuId . '&siteId=2&areaCode=' . $areaCode;
		Log::instance()->add(Log::NOTICE, $itemPriceApi);

		$curlInstance = new Curl_Request();
		$result = $curlInstance->get($itemPriceApi);
		Log::instance()->add(Log::NOTICE, $result);

		$result = json_decode($result, true);
		$priceData = $result['data'][0];

		$itemAppraisalApi .= '?params=' . $productId . ':' . $skuId;
		Log::instance()->add(Log::NOTICE, $itemAppraisalApi);

		$appraisalResult = $curlInstance->get($itemAppraisalApi);
		Log::instance()->add(Log::NOTICE, $appraisalResult);

		$appraisalResult = json_decode($appraisalResult, true);
		$appraisalData = $appraisalResult['data'][0];

		$item = new Model_Gome_Item($priceData, $appraisalData);

		return $item;
	}

	public function getPricesByProductIdAndSkuId($proSkuIds, $areaCode) {
		$apis = (array) Kohana::$config->load('gome')->get('apis');
		$itemPriceApi = $apis['itemPriceApi'];

		$itemPriceApi .= '?params=' . $proSkuIds . '&siteId=2&areaCode=' . $areaCode;
		Log::instance()->add(Log::NOTICE, $itemPriceApi);

		$curlInstance = new Curl_Request();
		$result = $curlInstance->get($itemPriceApi);
		Log::instance()->add(Log::NOTICE, $result);

		$result = json_decode($result, true);

		return $result['data'];
	}

	/**
	 * 批量获取评论数
	 * @param  [string] $proSkuIds productid:skuid,productid:skuid
	 */
	public function getItemsByProductIdAndSkuId($proSkuIds) {
		$apis = (array) Kohana::$config->load('gome')->get('apis');
		$itemAppraisalApi = $apis['itemAppraisalApi'];

		$itemAppraisalApi .= '?params=' . $proSkuIds;
		Log::instance()->add(Log::NOTICE, $itemAppraisalApi);

		$curlInstance = new Curl_Request();
		$appraisalResult = $curlInstance->get($itemAppraisalApi);
		Log::instance()->add(Log::NOTICE, $appraisalResult);

		$appraisalResult = json_decode($appraisalResult, true);

		return $appraisalResult['data'];
	}
}
