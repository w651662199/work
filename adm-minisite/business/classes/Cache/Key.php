<?php
class Cache_Key {
	//access_token
	public static function accessToken() {
		return  'wx_access_token';
	}
	public static function jsAccessToken() {
		return  'wx_js_access_token';
	}

	public static function authAccessToken() {
		return  'wx_auth_access_token';
	}
}
