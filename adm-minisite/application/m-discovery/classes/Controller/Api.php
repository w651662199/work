<?php
/**
 * 探索频道接口
 * @author baishen
 */
class Controller_Api extends Controller_Render {

	protected $_contentType = 'application/json';

	/**
	 * 自建活动页批量获取价格 jsonp 格式
	 */
	public function action_prices() {
		$proSkuIds = Arr::get($_GET, 'ids', 0);
		$areaCode = Arr::get($_GET, 'areaCode', 0);
		$callback = Arr::get($_GET, 'callback', "");

		$data = Business::factory('Gome_Item')->getPricesByProductIdAndSkuId($proSkuIds, $areaCode);

		// @todo 错误处理

		$this->success($data, "success", $callback);
	}

	/**
	 * 获取店铺信息
	 */
	public function action_shop() {

		$shopId = Arr::get($_GET, 'id', 0);
		$callback = Arr::get($_GET, 'callback', "");

		$shop = Business::factory('Gome_Shop')->getShopByShopId($shopId);

		$data = array (
			"shopId" => $shop->getShopId(),
			"name" => $shop->getName(),
			"icon" => $shop->getIcon(),
			"collectionQuantity" => $shop->getCollectionQuantity(),
		);

		// @todo 错误处理

		$this->success($data, "success", $callback);
	}

	/**
	 * 获取分享卡信息
	 */
	public function action_card() {
		$adId = Arr::get($_GET, 'adId', 0);
		$callback = Arr::get($_GET, 'callback', '');
		$material = Business::factory('Material')->getMaterialByAdId($adId);

		$cacheKey = "d_card_" . $adId;
		$data = Redisd::instance('awall')->get($cacheKey);

		if ($data !== FALSE) {
			$data = unserialize($data);
			$card = $data['card'];
		} else {
			try {
				$webpageId = $material->getWebpageId();
				$promotionId = $material->getPromotionId();
				if ($webpageId != 0) {
					$webpage = Business::factory('Webpage')->getWebpageByWebpageId($webpageId);

					$card = array(
						'cardTitle' => $webpage->getCardTitle(),
						'cardDescription' => $webpage->getCardDescription(),
						'cardImage' => $webpage->getCardImage(),
					);
				} else if (strlen($promotionId) == 24) { // 好物与话题均没有webpageid，暂时使用话题id长度限制
					$topicId = $material->getPromotionId();
					$topic = Business::factory('Bs_Topic')->getTopicByTopicId($topicId);

					$card = array(
						'cardTitle' => $topic->getName(),
						'cardDescription' => $material->getDescription(),
						'cardImage' => $material->getImage(),
					);
				} else {
					$card = array(
						'cardTitle' => $material->getTitle(),
						'cardDescription' => $material->getDescription(),
						'cardImage' => $material->getImage(),
					);
				}
				$data = Array(
					'card' => $card
				);
				$data = serialize($data);
				Redisd::instance('awall')->set($cacheKey, $data, 60);
			} catch (Business_Exception $e) {
				// @todo 404
				echo $e->getMessage();
				return;
			}
		}

		$this->success($card, "success", $callback);
	}

	/**
	 * 获取微信配置信息
	 */
	public function action_weixin() {
		$callBack = Arr::get($_GET, 'callback', 0);
		$code = Arr::get($_GET, 'code', 0);
		$shareUrl = urldecode(Arr::get($_GET, 'shareUrl', ''));
		$isGj = Arr::get($_GET, 'isGj', false);
		$wxConfig = Business::factory('WxBase')->getWeiXinConfigInfo($shareUrl, $isGj);
		if (isset($_COOKIE['USER_OPENID'])) {
			$wxConfig["openId"] = $_COOKIE['USER_OPENID'];
		} else if ($code != 0) {
			$openId = Business::factory('WxBase')->getWeiXinOpenId($code);
			$wxConfig["openId"] = $openId;
			if ($openId != '') {
				setcookie('USER_OPENID', $openId);
			}
		}
		$this->success($wxConfig, "success", $callBack);
	}

	/**
	 * 批量获取商品评论数 商品数最多10个
	 */
	public function action_comments() {
		$proSkuIds = Arr::get($_GET, 'ids', 0);
		$callback = Arr::get($_GET, 'callback', '');

		$data = Business::factory('Gome_Item')->getItemsByProductIdAndSkuId($proSkuIds);

		$this->success($data, "success", $callback);
	}

	/**
	 * 高返利活动 保存手机号
	 */
	public function action_addMobile() {
		$mobile = Arr::get($_GET, 'mobile', 0);
		$channel = Arr::get($_GET, 'channel', ''); // 1国美App 2 微信 3下线推广

		if ($mobile != 0) {
			$result = Array(
				'code' => 0
			);
			try {
				$data = Business::factory('New_User')->getDataByMobile($mobile);
				if ($data != null) {
					$result['code'] = 1001; //已经登记过手机号
				} else {
					$user = Business::factory('Gome_User')->getUserByMobile($mobile);
					if ($user != null) {
						$result['code'] = 1002; //已经注册，老用户
					} else {
						$saveData = array(
							'mobile' => $mobile,
							'channel' => $channel,
							'ufpd' => ''
						);
						if (isset($_COOKIE['ufpd'])) {
							$saveData['ufpd'] = $_COOKIE['ufpd'];
						}
						$return = Business::factory('New_User')->addNewMobile($saveData);
						$result['code'] = 200;
					}
				}
				echo json_encode($result);
				exit();
			} catch (Exception $e) {
				Log::instance()->add(Log::NOTICE, $e->getMessage());
				$result['code'] = 500;
				echo json_encode($result);
				exit();
			}
		}
	}

	public function action_yyc() {
		$type = Arr::get($_GET, 'type', 0);
		$chl = isset($_GET['chl']) ? intval($_GET['chl']) : 2;

		if ($chl <= 0) {
			$chl = 2;
		}

		if ($type == 1 || $type == 2) {
			$date = date("Ymd");
			//总数key
			$tKey = "H_R_B_" . $type;
			//按天渠道key
			$chKey = "H_R_B_" . $date . '_' . $chl . "_" . $type;
			$cCount = Redisd::instance('awall')->incr($chKey);
			$tCount = Redisd::instance('awall')->incr($tKey);
			Log::instance()->add(Log::INFO, "btn count:" . $tKey . "=" . $tCount . ";" . $chKey . "=" . $cCount);
		}
		$result = Array(
			'msg' => 'success'
		);
		echo json_encode($result);
		exit();
	}
}
