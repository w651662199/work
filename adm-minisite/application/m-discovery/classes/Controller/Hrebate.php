<?php
/**
 * 美媒榜 运营高返利活动
 * @author wuhongling
 */
class Controller_Hrebate extends Controller_Render {

	protected $_layout = 'layouts/main';

	public function action_index() {

		$date = date("Ymd");
		$pvKey = 'High_Rebate_PV_' . $date; //总pv
		$pvChlKey = 'High_Rebate_P_' . $date . '_'; //分渠道pv
		$uvKey = 'High_Rebate_UV_' . $date; //总uv
		$uvChlKey = 'High_Rebate_U_' . $date . '_'; //分渠道uv

		$chl = isset($_GET['chl']) ? intval($_GET['chl']) : 2;
		//默认微信渠道
		if ($chl <= 0) {
			$chl = 2;
		}

		$pvChlKey = $pvChlKey . $chl;
		$uvChlKey = $uvChlKey . $chl;

		$retPv = Redisd::instance('awall')->incr($pvKey);
		$retPvChl = Redisd::instance('awall')->incr($pvChlKey);

		if (!isset($_COOKIE['High_Rebate_UV'])) {
			setcookie($uvKey, 1);
			$retUv = Redisd::instance('awall')->incr($uvKey);
			$retUvChl = Redisd::instance('awall')->incr($uvChlKey);
			Log::instance()->add(Log::INFO, "uv:" . $retUv . ' uvChl:'. $uvChlKey . "=" . $retUvChl);
		}
		Log::instance()->add(Log::INFO, "pv:" . $retPv . ' pvChl:'. $pvChlKey . "=" . $retPvChl);

		$this->_layout->content = View::factory('hrebate/index');
	}
}
