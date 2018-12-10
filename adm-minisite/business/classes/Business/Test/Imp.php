<?php
/**
 * 页面曝光逻辑
 * @author 吴宏玲
 */
class Business_Test_Imp extends Business {

	/**
	 * 创建管家用户
	 * @param array $values
	 * @return array
	 */
	public function create(array $values) {
		$fields = array (
			'wechat_id' => '',
			'refer' => '',
			'ip' => '',
			'time' => date("Y-m-d H:i:s", time()),
		);

		$values = array_intersect_key($values, $fields);
		$values = $values + $fields;

		return Dao::factory('Test_Imp')->insert($values);
	}
}
