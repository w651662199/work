<?php
/**
* 自建活动信息
*/
class Controller_Webpage extends Controller_Render {	

	public function action_detail() {
		$webpageId = Arr::get($_GET, 'id', 0);
		$flightId = Arr::get($_GET, 'flightId', 0);
		$slotIds = (array) Kohana::$config->load('default')->get('slotIds');
		$itemSlotId = isset($slotIds['activeH5']) ? $slotIds['activeH5'] : 0;

		$cacheKey = "webpage_" . $webpageId;
		$data = Redisd::instance('awall')->get($cacheKey);
		if ($data !== FALSE) {
			$data = unserialize($data);
			$webpage = $data['webpage'];
			$items = $data['items'];
			$h5FlightAdvertisement = $data['h5FlightAdvertisement'];
			$wapFlightAdvertisement = $data['wapFlightAdvertisement'];
		} else {
			try {
				$webpage = Business::factory('Webpage')->getWebpageByWebpageId($webpageId);
				$webpageId = $webpage->getWebpageId();
				$items = Business::factory('Webpage')->getWebpageItemsByWebpageId($webpageId);

				$advertisementIds = (array) Kohana::$config->load('default')->get('advertisementIds');
				$h5WebpageAdvertisementId = isset($advertisementIds['h5WebpageAdvertisementId']) ? $advertisementIds['h5WebpageAdvertisementId'] : 0;
				$wapWebpageAdvertisementId = isset($advertisementIds['wapWebpageAdvertisementId']) ? $advertisementIds['wapWebpageAdvertisementId'] : 0;

				$h5FlightAdvertisement = Business::factory('Flight_Advertisement')->getFlightAdvertisementByFlightIdAdvertisementId($flightId, $h5WebpageAdvertisementId);
				$wapFlightAdvertisement = Business::factory('Flight_Advertisement')->getFlightAdvertisementByFlightIdAdvertisementId($flightId, $wapWebpageAdvertisementId);

				$data = array (
					'webpage' => $webpage,
					'items' => $items,
					'h5FlightAdvertisement' => $h5FlightAdvertisement,
					'wapFlightAdvertisement' => $wapFlightAdvertisement,
				);
				$data = serialize($data);
				Redisd::instance('awall')->set($cacheKey, $data, 60);
			} catch (Business_Exception $e) {
				// @todo 404
				echo $e->getMessage();
				return;
			}
		}
		// echo $webpage;
		$this->_layout->content = View::factory('webpage/detail')
			->set("webpage", $webpage)
			->set("items", $items)
			->set("h5FlightAdvertisement", $h5FlightAdvertisement)
			->set("wapFlightAdvertisement", $wapFlightAdvertisement)
			->set("itemSlotId", $itemSlotId);

	}
}