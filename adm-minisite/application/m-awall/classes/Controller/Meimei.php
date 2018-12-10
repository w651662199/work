<?php
/**
 * 美媒小程序接口
 */
class Controller_Meimei extends Controller {	


	public function action_product() {

		$materialId = Arr::get($_GET, 'id', 0);
		$areaCode = Arr::get($_GET, 'districtId', '11000000');

		try {
			$material = Business::factory('Material')->getMaterialByMaterialId($materialId);
			$itemId = $material->getPromotionId();
			$flightId = $material->getFlightId();
			$extId = $material->getPromotionId();
			$extIdArray = explode(":", $extId);
			$productId = isset($extIdArray[0]) ? $extIdArray[0] : "";
			$skuId = isset($extIdArray[1]) ? $extIdArray[1] : "";

			$item = Business::factory('Gome_Item')->getItemByProductIdAndSkuId($productId, $skuId, $areaCode);
			$data = array (
				'material' => $material,
				'item' => $item,
			);

			$this->success($data);
		} catch (Business_Exception $e) {
			$this->failed(null, 'error');
		}
	}

	public function action_topic() {

		$materialId = Arr::get($_GET, 'id', 0);
		try {
			$material = Business::factory('Material')->getMaterialByMaterialId($materialId);
			$flightId = $material->getFlightId();
			$topicId = $material->getPromotionId();
			$topic = Business::factory('Bs_Topic')->getTopicByTopicId($topicId);

			$data = array (
				'material' => $material,
				'topic' => $topic,
			);
			$this->success($data);
		} catch (Business_Exception $e) {
			$this->failed(null, 'error');
		}
	}

	public function action_story() {
		$webpageId = Arr::get($_GET, 'id', 0);
		$this->_webpage($webpageId);
	}

	public function action_shop() {
		$webpageId = Arr::get($_GET, 'id', 0);
		$this->_webpage($webpageId);
	}

	public function action_item() {
		$webpageId = Arr::get($_GET, 'id', 0);
		$this->_webpage($webpageId);
	}

	public function action_video() {
		$webpageId = Arr::get($_GET, 'id', 0);
		$this->_webpage($webpageId);
	}

	private function _webpage($webpageId) {
		try {
			$webpage = Business::factory('Webpage')->getWebpageByWebpageId($webpageId);
			$webpageId = $webpage->getWebpageId();
			$items = Business::factory('Webpage')->getWebpageItemsByWebpageId($webpageId);
			$data = array (
				'webpage' => $webpage,
				'items' => $items,
			);
			$this->success($data);
		} catch (Business_Exception $e) {
			$this->failed(null, 'error');
			}
		}
	}

	/**
	 * 返回失败数据
	 */
	public function failed($data = array(), $msg = "failed") {
		header('Content-Type: application/json');
		header('Access-Control-Allow-Origin: *');
		$ret = array (
			"code" => 500,
			"data" => $data,
			"iserror" => 1,
			"msg" => $msg
		);

		echo json_encode($ret);
		exit();
	}

	/**
	 * 返回成功数据
	 */
	public function success($data = array(), $msg = "success") {
		header('Content-Type: application/json');
		header('Access-Control-Allow-Origin: *');
		$ret = array (
			"code" => 200,
			"data" => $data,
			"iserror" => 0,
			"msg" => $msg
		);

		echo json_encode($ret);
		exit();
	}
}
