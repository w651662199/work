<?php

/**
 * 美媒榜用户 dao
 */
class Dao_Gome_User extends Dao {

	protected $_db = 'mm';
	protected $_tableName = "ad_gome_user";
	protected $_primaryKey = "gome_user_id";
	protected $_modelName = "Model_Gome_User";

	public function getUserByMobile($mobile) {
		return DB::select('*')
			->from($this->_tableName)
			->where('mobile', '=', $mobile)
			->execute($this->_db);
	}
}