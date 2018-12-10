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
		$itemSlotId = isset($slotIds['wapItemSlotId']) ? $slotIds['wapItemSlotId'] : 0;
		$activeSlotId = isset($slotIds['activeWap']) ? $slotIds['activeWap'] : 0;

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
		$areaCode = isset($_COOKIE["gps_provinceid"]) ? $_COOKIE["gps_provinceid"] : '11000000';

		$cacheKey = "WAP_ITEM_" . $materialId;
		$data = Redisd::instance('awall')->get($cacheKey);
		if ($data !== FALSE) {
			$data = unserialize($data);
			$material = $data['material'];
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

				if (is_numeric($itemId) && $itemId > 0) {
					$item = Business::factory('Bs_Item')->getItemByItemId($itemId);
				} else {
					$item = Business::factory('Gome_Item')->getItemByProductIdAndSkuId($productId, $skuId, $areaCode);
				}

				$data = array (
					'material' => $material,
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
		$itemSlotId = isset($slotIds['wapItemSlotId']) ? $slotIds['wapItemSlotId'] : 0;

		//微信内容
		$share = array();
		$share['share_title'] = $material->getTitle();
		$share['share_desc'] = $material->getDescription();
		$share['share_link'] = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];;
		$share['share_imgurl'] = $material->getImage();
		$wxContent = Business::factory('WxBase')->renderShareContent($share);

		$this->_layout->content = View::factory('item/detail')
			->set("material", $material)
			->set("item", $item)
			->set("wx_content",$wxContent)
			->set("itemSlotId", $itemSlotId);
	}
}
