<?php
/**
 * 投放单元广告数据访问层
 *
 * @author baishen
 */
class Dao_Flight_Advertisement extends Dao {

	protected $_tableName = 'flight_advertisement';
	protected $_primaryKey = 'flight_advertisement_id';
	protected $_modelName = 'Model_Flight_Advertisement';

	const STATUS_DELETE = -1;
	
	const STATUS_NORMAL = 0;

	/**
	 * 根据投放单元id获取投放单元下的广告
	 *
	 * @param flightId
	 * @param advertisementId
	 */
	public function getFlightAdvertisementByFlightIdAdvertisementId($flightId, $advertisementId) {
		return DB::select('*')
			->from($this->_tableName)
			->where("flight_id", "=", $flightId)
			->where("advertisement_id", "=", $advertisementId)
			->and_where("status", "=", self::STATUS_NORMAL)
			->as_object($this->_modelName)
			->execute($this->_db);
	}
}
