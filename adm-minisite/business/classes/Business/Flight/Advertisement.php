<?php
/**
 * 投放单元广告业务逻辑层
 *
 * @author baishen
 */
class Business_Flight_Advertisement extends Business {

	/**
	 * 根据投放单元id获取投放单元下的广告
	 *
	 * @param flightId
	 * @param advertisementId
	 */
	public function getFlightAdvertisementByFlightIdAdvertisementId($flightId, $advertisementId) {
		//if (!Valid::numeric($flightId)) {
		//	throw new Business_Exception('投放单元id参数错误！');
		//}
		$flightAdvertisement = Dao::factory("Flight_Advertisement")->getFlightAdvertisementByFlightIdAdvertisementId($flightId, $advertisementId)->current();
		//if ($flightAdvertisement == NULL) {
		//	throw new Business_Exception('投放单元广告不存在！');
		//}
		return $flightAdvertisement;
	}
}
