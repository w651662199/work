<?php

/**
 * 运营活动 登记手机号
 */
class Business_New_User extends Business {

	public function getDataByMobile($mobile) {
		$data = Dao::factory('New_User')->getUserByMobile($mobile)->current();
		return $data;
	}

	public function addNewMobile($data) {
		$fields = array(
			'mobile' => $data['mobile'],
			'channel' => $data['channel'],
			'ufpd' => $data['ufpd'],
			'create_time' => date("Y-m-d H:i:s", time()),
			'update_time' => date("Y-m-d H:i:s", time()),
		);
		return Dao::factory('New_User')->insert($fields);
	}
}