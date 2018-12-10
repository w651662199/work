<?php
/**
 * 问卷中间页
 * @author baishen
 */
class Controller_Survey extends Controller_Render {	

	protected $_layout = 'layouts/main';

	/**
	 * 问卷页面
	 */
	public function action_index() {

		$surveyId = Arr::get($_GET, 'id', 0);

		try {
			$survey = Business::factory('Survey')->getSurveyBySurveyId($surveyId);

			$this->_layout->content = View::factory('survey/index')
					->set("survey", $survey);
		} catch (Business_Exception $e) {
			// @todo 404
			// echo $e->getMessage();
			// return;
			$this->_layout->content = View::factory('error/index');
		}

	}

	/**
	 * 保存问卷答案
	 */
    public function action_save() {
		$this->_contentType = 'application/json';

		$surveyId = Arr::get($_POST, 'survey_id', 0);
		$userId = Arr::get($_POST, 'user_id', 0);
		$answers = Arr::get($_POST, 'answers', array());

		try {
			$result = Business::factory('Survey')->create($surveyId, $userId, $answers);
			$this->success(array(), "答题完成");
		} catch (Business_Exception $e) {
		    $this->failed($e->getMessage());
		}
    }
}
