<?php
/**
 * 美媒榜用户
 */
class Business_Gome_User extends Business {

	public function getUserByMobile($mobile) {
		$user = Dao::factory('Gome_User')->getUserByMobile($mobile)->current();
		return $user;
	}
}