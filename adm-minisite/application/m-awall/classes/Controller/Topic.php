<?php

/**
 * 广告频道话题页
 * @package default
 * @author  baishen
 */
class Controller_Topic extends Controller_Render {

	/**
	 * 广告频道话题详情页
	 * @param id
	 */
	public function action_detail() {
		$materialId = Arr::get($_GET, 'id', 0);
		$slotIds = (array) Kohana::$config->load('default')->get('slotIds');
		$itemSlotId = isset($slotIds['activeH5']) ? $slotIds['activeH5'] : 0;
		$cacheKey = "TOPIC_" . $materialId;
		$data = Redisd::instance('awall')->get($cacheKey);
		if ($data !== FALSE) {
			$data = unserialize($data);
			$material = $data['material'];
			$topic = $data['topic'];
			$h5FlightAdvertisement = $data['h5FlightAdvertisement'];
			$wapFlightAdvertisement = $data['wapFlightAdvertisement'];
		} else {
			try {
				$material = Business::factory('Material')->getMaterialByMaterialId($materialId);
				$flightId = $material->getFlightId();
				$topicId = $material->getPromotionId();
				$topic = Business::factory('Bs_Topic')->getTopicByTopicId($topicId);
				$advertisementIds = (array) Kohana::$config->load('default')->get('advertisementIds');
				$h5WebpageAdvertisementId = isset($advertisementIds['h5WebpageAdvertisementId']) ? $advertisementIds['h5WebpageAdvertisementId'] : 0;
				$wapWebpageAdvertisementId = isset($advertisementIds['wapWebpageAdvertisementId']) ? $advertisementIds['wapWebpageAdvertisementId'] : 0;

				$h5FlightAdvertisement = Business::factory('Flight_Advertisement')->getFlightAdvertisementByFlightIdAdvertisementId($flightId, $h5WebpageAdvertisementId);
				$wapFlightAdvertisement = Business::factory('Flight_Advertisement')->getFlightAdvertisementByFlightIdAdvertisementId($flightId, $wapWebpageAdvertisementId);
				$data = array (
					'material' => $material,
					'topic' => $topic,
					'h5FlightAdvertisement' => $h5FlightAdvertisement,
					'wapFlightAdvertisement' => $wapFlightAdvertisement,
				);
				$data = serialize($data);
				Redisd::instance('awall')->set($cacheKey, $data, 3600);
			} catch (Business_Exception $e) {
				// @todo 404
				echo $e->getMessage();
				return;
			}
		}

		$this->_layout->content = View::factory('topic/detail')
			->set("material", $material)
			->set("topic", $topic)
			->set("h5FlightAdvertisement", $h5FlightAdvertisement)
			->set("wapFlightAdvertisement", $wapFlightAdvertisement)
			->set("itemSlotId", $itemSlotId);
	}
}