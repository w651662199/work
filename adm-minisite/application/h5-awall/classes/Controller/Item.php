<?php

/**
 * 广告频道商品页
 * @package default
 * @author  qichangchun<qichangchun@gomeplus.com>
 * @date:   2016/11/14
 * @time:   16:27
 */
class Controller_Item extends Controller_Render {

	/**
	 * 广告频道商品列表页
	 * 调用ads接口获取商品列表
	 */
	public function action_list() {
		$slotIds = (array) Kohana::$config->load('default')->get('slotIds');
		$itemSlotId = isset($slotIds['h5ItemSlotId']) ? $slotIds['h5ItemSlotId'] : 0;
		$activeSlotId = isset($slotIds['activeH5']) ? $slotIds['activeH5'] : 0;

		$this->_layout->content = View::factory('item/list')
			->set("itemSlotId", $itemSlotId)
			->set("activeSlotId", $activeSlotId);
	}

	/**
	 * 广告频道商品详情页
	 * @param id
	 */
	public function action_detail() {
		$materialId = Arr::get($_GET, 'id', 0);
		$areaCode = Arr::get($_GET, 'districtId', '11000000');

		$cacheKey = "ITEM_" . $materialId;
		$data = Redisd::instance('awall')->get($cacheKey);
		if ($data !== FALSE) {
			$data = unserialize($data);
			$material = $data['material'];
			$flightAdvertisement = $data['flightAdvertisement'];
			$item = $data['item'];
		} else {
			try {
				$material = Business::factory('Material')->getMaterialByMaterialId($materialId);
				$itemId = $material->getPromotionId();
				$flightId = $material->getFlightId();
				$extId = $material->getPromotionId();
				$extIdArray = explode(":", $extId);
				$productId = isset($extIdArray[0]) ? $extIdArray[0] : "";
				$skuId = isset($extIdArray[1]) ? $extIdArray[1] : "";

				$advertisementIds = (array) Kohana::$config->load('default')->get('advertisementIds');
				$h5ItemAdvertisementId = isset($advertisementIds['h5ItemAdvertisementId']) ? $advertisementIds['h5ItemAdvertisementId'] : 0;

				$flightAdvertisement = Business::factory('Flight_Advertisement')->getFlightAdvertisementByFlightIdAdvertisementId($flightId, $h5ItemAdvertisementId);
				if (is_numeric($itemId) && $itemId > 0) {
					$item = Business::factory('Bs_Item')->getItemByItemId($itemId);
				} else {
					$item = Business::factory('Gome_Item')->getItemByProductIdAndSkuId($productId, $skuId, $areaCode);
				}

				$data = array (
					'material' => $material,
					'flightAdvertisement' => $flightAdvertisement,
					'item' => $item,
				);
				$data = serialize($data);
				Redisd::instance('awall')->set($cacheKey, $data, 60);
			} catch (Business_Exception $e) {
				// @todo 404
				echo $e->getMessage();
				return;
			}
		}

		$slotIds = (array) Kohana::$config->load('default')->get('slotIds');
		$itemSlotId = isset($slotIds['h5ItemSlotId']) ? $slotIds['h5ItemSlotId'] : 0;

		$this->_layout->content = View::factory('item/detail')
			->set("material", $material)
			->set("flightAdvertisement", $flightAdvertisement)
			->set("item", $item)
			->set("itemSlotId", $itemSlotId);
	}

	/**
	 * 广告频道返利规则页
	 */
	public function action_rebate() {
		$this->_layout->content = View::factory('item/rebate');
	}

	/**
	 * 服务营销协议页
	 */
	public function action_protocol() {
		$this->_layout->content = View::factory('item/protocol');
	}
}
