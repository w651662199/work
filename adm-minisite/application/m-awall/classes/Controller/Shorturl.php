<?php

/**
 * 短链服务接口
 * @author	baishen
 */
class Controller_Shorturl extends Controller {

	const SALT = "lessismore";
	const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	/**
	 * 获取短链地址
	 */
	public function action_get() {

		$url = Arr::get($_POST, "url", "");

		$urlhash = md5(self::SALT . $url);
		$length = strlen($urlhash);

		// @todo 验证url合法性

		for ($i = 0; $i < 4; $i++) {
			$urlhashPiece = substr($urlhash, $i * $length / 4, $length / 4);
			$hex = hexdec($urlhashPiece) & 0x3fffffff;

			$urlKey = "";
			for ($j = 0; $j < 6; $j++) {
				$urlKey .= self::CHARSET[$hex & 0x0000003d];
				$hex = $hex >> 5;
			}

			$urlKeys[] = $urlKey;
		}

		foreach ($urlKeys as $urlKey) {
			$cacheKey = "s_" . $urlKey;
			$cacheUrl = Redisd::instance('awall')->get($cacheKey);
			if ($cacheUrl == false) {
				Redisd::instance('awall')->set($cacheKey, $url);
				break;
			} elseif ($cacheUrl === $url) {
				break;
			}
		}

		Log::instance()->add(Log::INFO, "getShortUrl: " . $urlKey . " ==> " . $url);

		$hosts = (array) Kohana::$config->load('url')->get('hosts');

		header('Access-Control-Allow-Origin: *');
		echo $hosts['m-awall'] . '/s/' . $urlKey;
		exit();
	}

	/**
	 * 由短链跳转链接地址
	 */
	public function action_redirect() {
		$key = Arr::get($_GET, "key", "");

		$cacheKey = "s_" . $key;
		$url = Redisd::instance('awall')->get($cacheKey);

		Log::instance()->add(Log::INFO, "redirectUrl: " . $key . " ==> " . $url);

		header('Location: '.$url);
		exit();
	}
}
