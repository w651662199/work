<?php
/**
 * 发现中间页（话题）
 * @author baishen
 */
class Controller_Topic extends Controller_Render {	

	public function action_index() {

		$materialId = Arr::get($_GET, 'id', 0);
		$slotIds = (array) Kohana::$config->load('default')->get('slotIds');

		$cacheKey = "d_topic_" . $materialId;
		$data = Redisd::instance('awall')->get($cacheKey);
		if ($data !== FALSE) {
			$data = unserialize($data);
			$material = $data['material'];
			$topic = $data['topic'];

			$this->_layout->content = View::factory('topic/index')
				->set("material", $material)
				->set("topic", $topic)
				->set("slotIds", $slotIds);
		} else {
			try {
				$material = Business::factory('Material')->getMaterialByMaterialId($materialId);
				$flightId = $material->getFlightId();
				$topicId = $material->getPromotionId();
				$topic = Business::factory('Bs_Topic')->getTopicByTopicId($topicId);

				$data = array (
					'material' => $material,
					'topic' => $topic,
				);
				$data = serialize($data);
				Redisd::instance('awall')->set($cacheKey, $data, 60);

				$this->_layout->content = View::factory('topic/index')
						->set("material", $material)
						->set("topic", $topic)
						->set("slotIds", $slotIds);
			} catch (Business_Exception $e) {
				// @todo 404
				// echo $e->getMessage();
				// return;
				$this->_layout->content = View::factory('error/index');
			}
		}
	}
}
