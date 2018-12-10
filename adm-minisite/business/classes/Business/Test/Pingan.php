<?php
/**
 * 用户业务逻辑
 * @author 吴宏玲
 */
class Business_Test_Pingan extends Business {

	/**
	 * 创建管家用户
	 * @param array $values
	 * @return array
	 */
	public function create(array $values) {
		$fields = array (
			//'name' => '',
			'mobile' => 0,
			'wechat_id' => '',
			'realname' => '',
			'sex' => 'F',
			'survey' => '',
			'brithday' => 0,
			'refer' => '',
			'is_sync' => 0,
			'ip' => '',
			'sync_result' => 0,
			'regdate' => date("Y-m-d H:i:s", time()),
			'create_time' => date("Y-m-d H:i:s", time()),
			'update_time' => date("Y-m-d H:i:s", time()),
		);

		$values = array_intersect_key($values, $fields);
		$values = $values + $fields;

		$errors = array();
		//if(!$values['name']) {
		//	$errors[] = '姓名不能为空';
		//}
		if(!$values['mobile']) {
			$errors[] = '手机号不能为空';
		}

		if($errors) {
			throw new Business_Exception(implode(',', $errors));
		}

		// 已经注册用户不再注册（按手机号排重）
		$smsUser = Dao::factory('Test_Pingan')->getByMobile($values['mobile'])->as_array();
		if (empty($smsUser)) {
			return Dao::factory('Test_Pingan')->insert($values);
		} else {
			// $values["pingan_id"] = $smsUser[0]["pingan_id"];
			// unset($values['create_time']);
			// Dao::factory('Test_Pingan')->update($values);
			return array (
				0 => $smsUser[0]["pingan_id"],
				1 => 2,
			);
		}
	}

	public function getCount() {
		return Dao::factory('Test_Pingan')->getCount();
	}

	public function getDataWithWechatId($wechatId) {
		$pingan = Dao::factory('Test_Pingan')->getByWechatId($wechatId)->current();
		return $pingan;
	}

	public function getUnsyncUsers() {
		return Dao::factory('Test_Pingan')->getUnsyncUsers();
	}


	public function batchUpdate($pinganUsers = array(), $syncResult = "") {
		return Dao::factory('Test_Pingan')->batchUpdate($pinganUsers, $syncResult);
	}
}
