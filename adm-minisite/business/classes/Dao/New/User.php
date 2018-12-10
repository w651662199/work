<?php

/**
 * 运营活动 手机号记录dao
 */
class Dao_New_User extends Dao {

	protected $_db = 'mm';
	protected $_tableName = "mm_new_user";
	protected $_primaryKey = "id";
	protected $_modelName = "Model_New_User";

	public function getUserByMobile($mobile) {
		return DB::select('*')
			->from($this->_tableName)
			->where('mobile', '=', $mobile)
			->execute($this->_db);
	}

	public function insert($values) {
		return DB::insert($this->_tableName)
			->columns(array_keys($values))
			->values(array_values($values))
			->execute($this->_db);
	}
}