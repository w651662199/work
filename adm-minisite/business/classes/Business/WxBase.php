<?php

class Business_WxBase extends Business {
	private $_timestamp;
	private $_noncestr;
	private $_jsapiTicket;
	private $_url;
	private $_appid;
	private $_signature;
	private $_isGuanJia;

	private function _getTimestamp() {
		$this->_timestamp = time();
	}

	private function _getAppid() {
		$this->_appid = $this->_isGuanJia ? Kohana::$config->load('default.wx.gj_appid') : Kohana::$config->load('default.wx.appid');
	}

	private function _getNoncestr() {
		$this->_noncestr = "Wm3WZYTPz0wzccnW";
	}

	private function _getJsticket() {
		$this->_jsapiTicket = $this->_getJsTicketToken();
	}

	private function _getShareUrl($shareUrl) {
		$protocol = 'http';
		if (isset($_SERVER['ENVIRONMENT']) && $_SERVER['ENVIRONMENT'] == 'PRODUCTION') {
			$protocol = 'https';
		}
		$this->_url = strlen($shareUrl) > 0 ? $shareUrl : $protocol . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
		return $this->_url;
	}

	private function _getSignature($shareUrl) {
		$this->_getAppid();
		$this->_getJsticket();
		$this->_getNoncestr();
		$this->_getShareUrl($shareUrl);
		$this->_getTimestamp();
		$signStr = "jsapi_ticket={$this->_jsapiTicket}&noncestr={$this->_noncestr}&timestamp={$this->_timestamp}&url={$this->_url}";
		Log::instance()->add(Log::NOTICE, $signStr);
		$afterSha1 = sha1($signStr);
		return $afterSha1;
	}

	private function _getAccessToken($force = false) {
		$appid = $this->_isGuanJia ? Kohana::$config->load('default.wx.gj_appid') : Kohana::$config->load('default.wx.appid');
		$secret = $this->_isGuanJia ? Kohana::$config->load('default.wx.gj_app_secret') : Kohana::$config->load('default.wx.app_secret');;
		$target = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={$appid}&secret={$secret}";
		$cacheKey = Cache_Key::accessToken();
		$accessTokenJson = Redisd::instance('awall')->get($cacheKey);
		$accessToken = json_decode($accessTokenJson, true);
		if ($force || !$accessToken || time() >= ($accessToken['expire'] + $accessToken['update_time'])) {
			$curlInstance = new Curl_Request();
			$result = $curlInstance->get($target);
			if ($result) {
				$result = $this->_parseWXData($result);
				$saveData = array();
				$accessToken = $saveData['access_token'] = $result['access_token'];
				$saveData['expire'] = 3600;
				$saveData['update_time'] = time();
				Redisd::instance('awall')->set($cacheKey, json_encode($saveData));
			} else {
				return false;
			}
		} else {
			$accessToken = $accessToken['access_token'];
		}
		return $accessToken;
	}

	private function _getJsTicketToken($force = false) {
		$accessToken = $this->_getAccessToken();
		$target = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token={$accessToken}&type=jsapi";
		//获取缓存
		$cacheKey = Cache_Key::jsAccessToken();
		$jsAccessTokenJson = Redisd::instance('awall')->get($cacheKey);
		$jsAccessToken = json_decode($jsAccessTokenJson, true);
		if ($force || !$jsAccessToken || time() >= ($jsAccessToken['expire'] + $jsAccessToken['update_time'])) {
			$curlInstance = new Curl_Request();
			$result = $curlInstance->get($target);
			$result = $this->_parseWXData($result);
			if (isset($result['errcode']) && $result['errcode'] != 40001) {
				$saveData = array();
				$ticket = $saveData['js_access_token'] = $result['ticket'];
				$saveData['expire'] = $result['expires_in'];
				$saveData['update_time'] = time();
				Redisd::instance('awall')->set($cacheKey, json_encode($saveData));
			} else if ($result['errcode'] == 40001) {
				//重新获取
				$this->_getAccessToken(true);
				return $this->_getJsTicketToken(true);
			}
		} else {
			$ticket = $jsAccessToken['js_access_token'];
		}
		return $ticket;
	}

	private function _parseWXData($jsonStr) {
		return json_decode($jsonStr, true);
	}

	private function _renderJsConfig() {
		$this->_signature = $this->_getSignature('');
		$shareView = View::factory("item/shareJs");
		$shareView->set("wx_noncestr", $this->_noncestr)
			->set("wx_appid", $this->_appid)
			->set("wx_signature", $this->_signature)
			->set("wx_timestamp", $this->_timestamp);
		return $shareView;
	}

	/**
	 * 初始化分享内容
	 * @param $share
	 */
	public function renderShareContent($share) {
		$shareView = $this->_renderJsConfig();
		//返回页面内容
		$shareHtmlContent = $shareView->set("share_title", $share['share_title'])
			->set("share_desc", $share['share_desc'])
			->set("share_link", $share['share_link'])
			->set("share_imgurl", $share['share_imgurl'])
			->render();
		return $shareHtmlContent;
	}

	public function getWeiXinConfigInfo($shareUrl, $isGj) {
		$this->_isGuanJia = $isGj;
		$this->_signature = $this->_getSignature($shareUrl);
		$result = array(
			"wx_noncestr" => $this->_noncestr,
			"wx_appid" => $this->_appid,
			"wx_signature" => $this->_signature,
			"wx_timestamp" => $this->_timestamp,
		);
		$logData = array(
			"wx_appid" => $this->_appid,
			"wx_noncestr" => $this->_noncestr,
			"wx_timestamp" => $this->_timestamp,
			"wx_signature" => $this->_signature,
			"wx_url" => $this->_url,
			"wx_jsapiTicket" => $this->_jsapiTicket,
		);
		Log::instance()->add(Log::NOTICE, json_encode($logData));
		return $result;
	}

	public function getWeiXinOpenId($code) {
		Log::instance()->add(Log::NOTICE, 'weixin openId: -----------');
		$appid = Kohana::$config->load('default.wx.appid');
		$secret = Kohana::$config->load('default.wx.app_secret');
		$target = "https://api.weixin.qq.com/sns/oauth2/access_token?appid={$appid}&secret={$secret}&code={$code}&grant_type=authorization_code";

		$curlInstance = new Curl_Request();
		$result = $curlInstance->get($target);
		Log::instance()->add(Log::NOTICE, $result);
		$result = $this->_parseWXData($result);
		if (isset($result['openid'])) {
			return $result['openid'];
		} else {
			return '';
		}
	}
}
