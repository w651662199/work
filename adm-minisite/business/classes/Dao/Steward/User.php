<?php
/**
 * 管家用户Dao
 */
class Dao_Steward_User extends Dao {

	protected $_tableName = "steward_user";
	protected $_primaryKey = "steward_user_id";

	/**
	 * 创建管家用户
	 * @param array $values
	 * @return array
	 */
	public function insert(array $values) {
		return DB::insert($this->_tableName)
				->columns(array_keys($values))
				->values(array_values($values))
				->execute($this->_db);
	}

	/**
	 * 修改管家用户
	 * @param array $values
	 * @return array
	 */
	public function update(array $values) {
		return DB::update($this->_tableName)
				->set($values)
				->where('steward_user_id', '=', $values['steward_user_id'])
				->execute($this->_db);
	}

	/**
	 * 根据手机号获取用户
	 * @param integer $mobile
	 * @return array
	 */
	public function getByMobile($mobile) {
		return DB::select('*')
				->from($this->_tableName)
				->where('mobile', '=', $mobile)
				->execute($this->_db);
	}
}
