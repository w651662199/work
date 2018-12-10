<?php
/**
 * 管家用户业务逻辑
 * @author baishen
 */
class Business_Steward_User extends Business {

	/**
	 * 创建管家用户
	 * @param array $values
	 * @return array
	 */
	public function create(array $values) {
		$fields = array (
			//'name' => '',
			'mobile' => 0,
			'shop_id' => 0,
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
		// 门店固定(7个门店)
		if($values['shop_id'] <= 0 || $values['shop_id'] >= 8) {
			$errors[] = '门店id错误';
		}

		if($errors) {
			throw new Business_Exception(implode(',', $errors));
		}

		// 已经注册用户不再注册（按手机号排重）
		$stewardUser = Dao::factory('Steward_User')->getByMobile($values['mobile'])->as_array();
		if (empty($stewardUser)) {
			return Dao::factory('Steward_User')->insert($values);
		} else {
			$values["steward_user_id"] = $stewardUser[0]["steward_user_id"];
			unset($values['create_time']);
			Dao::factory('Steward_User')->update($values);
			return array (
				0 => $stewardUser[0]["steward_user_id"],
				1 => 0,
			);
		}
	}
}
