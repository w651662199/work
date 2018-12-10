<?php
/**
* 活动信息数据访问
*/
class Dao_Webpage_Item extends Dao {

	protected $_tableName = "webpage_item";
	protected $_primaryKey = "webpage_id";
	protected $_modelName = "Model_Webpage_Item";

	public function getWebpageItemsByWebpageId($webpageId) {
		return DB::select("*")
			->from($this->_tableName)
			->where($this->_primaryKey, "=", $webpageId)
			->where("sku_status", "=", 1)
			->as_object($this->_modelName)
			->execute($this->_db);
	}
}