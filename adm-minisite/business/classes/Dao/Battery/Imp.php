<?php
/**
 * 页面曝光Dao
 */
class Dao_Battery_Imp extends Dao {

	protected $_tableName = "pingan_imp";
	protected $_primaryKey = "pingan_imp_id";
	protected $_modelName = "Model_Battery_Imp";

	/**
	 * 创建用户
	 * @param array $values
	 * @return array
	 */
	public function insert(array $values) {
		return DB::insert($this->_tableName)
				->columns(array_keys($values))
				->values(array_values($values))
				->execute($this->_db);
	}
}
