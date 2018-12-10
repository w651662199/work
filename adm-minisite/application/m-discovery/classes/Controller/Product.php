<?php
/**
 * 好物中间页（商品）
 * @author wuhongling
 */
class Controller_Product extends Controller_Render {

	public function action_index() {
		$materialId = Arr::get($_GET, 'id', 0);
		$areaCode = Arr::get($_GET, 'districtId', '11000000');

		$slotIds = (array) Kohana::$config->load('default')->get('slotIds');

		$cacheKey = "d_product_" . $materialId;
		$data = Redisd::instance('awall')->get($cacheKey);
		if ($data !== FALSE) {
			$data = unserialize($data);
			$material = $data['material'];
			$item = $data['item'];

			$this->_layout->content = View::factory('product/index')
					->set("material", $material)
					->set("item", $item)
					->set("slotIds", $slotIds);
		} else {
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
				$data = serialize($data);
				Redisd::instance('awall')->set($cacheKey, $data, 60);

				$this->_layout->content = View::factory('product/index')
					->set("material", $material)
					->set("item", $item)
					->set("slotIds", $slotIds);
			} catch (Business_Exception $e) {
				// @todo 404
				// echo $e->getMessage();
				// return;
				$this->_layout->content = View::factory('error/index');
			}
		}

	}
}
