<?php
/**
 * 话题信息业务逻辑层
 *
 * @author baishen
 */
class Business_Bs_Topic extends Business {

	/**
	 * 根据话题id获取话题
	 *
	 * @param topicId
	 */
	public function getTopicByTopicId($topicId) {
		if (!Valid::not_empty($topicId)) {
			throw new Business_Exception('商品id参数错误！');
		}
		
		$apis = (array) Kohana::$config->load('bs')->get('apis');
		$topicApi = $apis['topicApi'];
		$topicApi .= '?id=' . $topicId . '&showRichText=true';
		Log::instance()->add(Log::NOTICE, $topicApi);

		$curlInstance = new Curl_Request();
		$result = $curlInstance->get($topicApi);
		$code = $curlInstance->code();
		if ($code !== 200) {
			Log::instance()->add(Log::ERROR, "get topic failed topicId: " + $topicId);
			throw new Business_Exception("状态异常 " . $code);
		}
		Log::instance()->add(Log::NOTICE, $result);

		$result = json_decode($result, true);
		if (!$result || $result['message'] != '') {
			Log::instance()->add(Log::ERROR, "get topic failed topicId: " + $topicId);
			throw new Business_Exception("话题不存在");
		}
		$data = $result['data'];
		$user = isset($data['user']) ? $data['user'] : array();
		$components = isset($data['components']) ? $data['components'] : array();

		$topicUser = new Model_Bs_Topic_User($user);
		$topicComponents = array();
		foreach ($components as $component) {
			$topicComponent = new Model_Bs_Topic_Component($component);
			$topicComponents[] = $topicComponent;
		}

		$topic = new Model_Bs_Topic($data);
		$topic->setTopicUser($topicUser);
		$topic->setTopicComponents($topicComponents);

		return $topic;
	}
}
