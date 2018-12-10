<?php
/**
 * 美媒引擎接口定时检测
 * @author baishen
 */
class MeimeiFlightApi extends Task {

	public $subject = '美媒引擎接口定时检测';

	public $author = 'baishen@gomeplus.com';

	public $mutex = FALSE;

	public $minute = '5';

	public $hour = '*';

	public $day = '*';

	public $month = '*';

	public $week = '*';

	private $_flightApi = "https://flight.gomeplus.com/flight";

	private $_slotIds = array (
		"topicSlotId" => 10070,
		"wapTopicSlotId" => 10071,
		"shopSlotId" => 10064,
		"wapShopSlotId" => 10065,
		"itemSlotId" => 10068,
		"wapItemSlotId" => 10069,
		"videoSlotId" => 10066,
		"wapVideoSlotId" => 10067,
		"productSlotId" => 10083,
		"wapProductSlotId" => 10084,
	);

	private $_errors = array();

	private $_to = array (
		"baishen@gomeplus.com",
		"wuhongling@gomeplus.com"
	);

	public function before() {
	}

	/**
	 * @todo 返回数据格式检查，接口响应时长检查
	 */
	public function execute() {
		$curlInstance = new Curl_Request();
		foreach ($this->_slotIds as $key => $slotId) {
			$flightApi = $this->_flightApi . "?slotId=" . $slotId . "&requestType=3&count=20&callback=__jp0";

			$result = $curlInstance->get($flightApi);
			if (empty($result)) {
				file_put_contents(SUCCESSLOG, sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'SUCCESS', __FILE__, 0, "接口数据为空: " . $slotId), FILE_APPEND);
				$this->_errors[$key] = "广告位id: " . $slotId . "数据为空";
			}
		}
	}

	/**
	 * @todo 短信消息提醒，频次控制
	 */
	public function after() {
		if (empty($this->_errors)) {
			return;
		}

		file_put_contents(SUCCESSLOG, sprintf(LOGFORMAT, date('Y-m-d H:i:s', time()), 'SUCCESS', __FILE__, 0, "发送报警邮件:" . implode("<br>", $this->_errors)), FILE_APPEND);

		$email = Email::factory();
		$email->to($this->_to)
				->subject("美媒flightApi接口报警")
				->content(implode("<br>", $this->_errors))
				->execute();
	}
}
