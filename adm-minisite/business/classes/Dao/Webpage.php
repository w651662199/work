<?php
/**
 * 活动信息数据访问
 */
class Dao_Webpage extends Dao {

	protected $_tableName = "webpage";
	protected $_primaryKey = "webpage_id";
	protected $_modelName = "Model_Webpage";

	/**
	 * 根据webpageId获取自建页面
	 * 兼容按hash获取
	 * @param $webpageId
	 */
	public function getWebpageByWebpageId($webpageId) {
		$select = DB::select('*')
			->from($this->_tableName);
		// 支持按hash获取自建页面
		if (is_numeric($webpageId)) {
			$select->where($this->_primaryKey, "=", $webpageId);
		} else {
			$select->where("hash", "=", $webpageId);
		}
		return $select->as_object($this->_modelName)
			->execute($this->_db);
	}
}