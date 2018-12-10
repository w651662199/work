<?php
/**
 * 外链中间页
 * @author wuhongling
 */

class Controller_Olink extends Controller_Render {

	public function action_index() {
		$materialId = Arr::get($_GET, 'id', 0);

		$slotIds = (array) Kohana::$config->load('default')->get('slotIds');

		$cacheKey = "d_olink_" . $materialId;
		$data = Redisd::instance('awall')->get($cacheKey);

		if ($data !== FALSE) {
			$data = unserialize($data);
			$material = $data['material'];

			$this->_layout->content = View::factory('olink/index')
					->set("material", $material)
					->set("slotIds", $slotIds);
		} else {
			try {
				$material = Business::factory('Material')->getMaterialByMaterialId($materialId);

				$data = array (
					'material' => $material
				);
				$data = serialize($data);
				Redisd::instance('awall')->set($cacheKey, $data, 60);

				$this->_layout->content = View::factory('olink/index')
					->set("material", $material)
					->set("slotIds", $slotIds);
			} catch (Business_Exception $e) {
				$this->_layout->content = View::factory('error/index');
			}
		}
	}
}