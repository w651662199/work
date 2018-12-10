<?php
/**
 * 用户Dao
 */
class Dao_Test_Pingan extends Dao {

	protected $_tableName = "pingan_test";
	protected $_primaryKey = "pingan_id";
	protected $_modelName = "Model_Test_Pingan";

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

	/**
	 * 修改用户
	 * @param array $values
	 * @return array
	 */
	public function update(array $values) {
		return DB::update($this->_tableName)
				->set($values)
				->where('pingan_id', '=', $values['pingan_id'])
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

	/**
	 * 根据微信号号获取用户
	 * @param integer $weChatId
	 * @return array
	 */
	public function getByWechatId($weChatId) {
		return DB::select('*')
				->from($this->_tableName)
				->where('wechat_id', '=', $weChatId)
				->as_object($this->_modelName)
				->execute($this->_db);
	}

	/**
	 * 获取未同步的用户
	 * @return array
	 */
	public function getUnsyncUsers() {
		return DB::select('*')
				->from($this->_tableName)
				->where('is_sync', '=', 0)
				->limit(1000)
				->as_array()
				->execute($this->_db);
	}

	/**
	 * 批量更新
	 *
	 */
	public function batchUpdate($pinganUsers = array(), $syncResult = "") {
		if(empty($pinganUsers)) {
			return;
		}
		$pinganIds = array();
		foreach ($pinganUsers as $pinganUser) {
			$pinganIds[] = $pinganUser['pingan_id'];
		}

		$values = array (
			"is_sync" => 1,
			"sync_result" => $syncResult,
			"update_time" => date("Y-m-d H:i:s", time()),
		);

		return DB::update($this->_tableName)
			->set($values)
			->where('pingan_id', 'in', $pinganIds)
			->execute($this->_db);
	}

	/**
	 * 获取数据总数
	 */
	public function getCount() {
		return DB::select(DB::expr('COUNT(*) AS recordCount'))
			->from($this->_tableName)
			->execute($this->_db)
			->get('recordCount');
	}
}
