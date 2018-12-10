<?php
/**
 * 素材信息数据访问层
 *
 * @author baishen
 */
class Dao_Material extends Dao {

	protected $_tableName = 'material';
	protected $_primaryKey = 'material_id';
	protected $_modelName = 'Model_Material';

	/**
	 * 根据素材id获取素材
	 *
	 * @param materialId
	 */
	public function getMaterialByMaterialId($materialId) {
		return DB::select('*')
			->from($this->_tableName)
			->where($this->_primaryKey, "=", $materialId)
			->where("sku_status", "=", 1)
			->as_object($this->_modelName)
			->execute($this->_db);
	}

	/**
	 * 根据adId获取素材
	 *
	 * @param adId
	 */
	public function getMaterialByAdId($adId) {
		return DB::select('*')
			->from($this->_tableName)
			->where("dsp_material_id", "=", $adId)
			->where("sku_status", "=", 1)
			->as_object($this->_modelName)
			->execute($this->_db);
	}

}
