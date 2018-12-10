<?php
/**
 * 问卷业务逻辑
 * @author baishen
 */
class Business_Survey extends Business {

	/**
	 * 根据问卷id获取问卷
	 * @param Integer $surveyId
	 */
	public function getSurveyBySurveyId($surveyId) {
		if (!Valid::numeric($surveyId)) {
			throw new Business_Exception('问卷id参数错误！');
		}
		$survey = Dao::factory("Survey")->getSurveyBySurveyId($surveyId)->current();
		if ($survey == NULL || $survey->getStatus() != 1 || $survey->getApproveStatus() != 1) {
			throw new Business_Exception('问卷不存在！');
		}
		$surveyQuestions = Dao::factory("Survey_Question")->getSurveyQuestionsBySurveyId($surveyId);
		foreach($surveyQuestions as $surveyQuestion) {
			$surveyQuestionId = $surveyQuestion->getSurveyQuestionId();
			$surveyQuestionOptions = Dao::factory("Survey_Question_Option")->getSurveyQuestionOptionsBySurveyQuestionId($surveyQuestionId);

			$surveyQuestion->setSurveyQuestionOptions($surveyQuestionOptions);
		}
		$survey->setSurveyQuestions($surveyQuestions);

		return $survey;
	}

	/**
	 * 创建问卷答案
	 * @param integer $surveyId
	 * @param integer $userId
	 * @param array $values
	 * @return array
	 */
	public function create($surveyId, $userId, array $answers) {

		if (!Valid::numeric($surveyId)) {
			throw new Business_Exception('问卷id参数错误');
		}
		if (!Valid::numeric($userId) || $userId <= 0) {
			throw new Business_Exception('用户id参数错误');
		}
		$survey = Dao::factory("Survey")->getSurveyBySurveyId($surveyId)->current();
		if ($survey == NULL || $survey->getStatus() != 1 || $survey->getApproveStatus() != 1) {
			throw new Business_Exception('问卷不存在');
		}

		$surveyResult = Dao::factory("Survey_Result")->getSurveyResultBySurveyIdAndUserId($surveyId, $userId)->current();
		if ($surveyResult !== NULL) {
			throw new Business_Exception('您已参与过此次调研');
		}

		$errors = array();
		$answerValues = array();

		// @todo 代码优化
		$surveyQuestions = Dao::factory("Survey_Question")->getSurveyQuestionsBySurveyId($surveyId);
		foreach($surveyQuestions as $surveyQuestion) {
			$surveyQuestionId = $surveyQuestion->getSurveyQuestionId();

			$hasAnswer = false;
			foreach ($answers as $answer) {
				if ($surveyQuestionId == $answer['survey_question_id']) {
					$hasAnswer = true;

					// @todo 判断option是否存在
					// $surveyQuestionOptions = Dao::factory("Survey_Question_Option")->getSurveyQuestionOptionsBySurveyQuestionId($surveyQuestionId);
					// 多选返回多个选项
					if ($surveyQuestion->getIsCheckbox()) {
						$contents = explode(",", $answer["content"]);
						if (!is_array($contents)) {
							$errors[] = "多选答案格式不正确";
						} else {
							foreach ($contents as $content) {
								$answerValue = array (
									"survey_question_id" => $surveyQuestionId,
									"content" => $content,
									"create_time" => date("Y-m-d H:i:s", time()),
								);
								$answerValues[] = $answerValue;
							}
						}
					} else {
						$answerValue = array (
							"survey_question_id" => $surveyQuestionId,
							"content" => $answer['content'],
							"create_time" => date("Y-m-d H:i:s", time()),
						);
						$answerValues[] = $answerValue;
					}
				}
			}
			// @todo 判断必答题是否回答
		}

		if ($errors) {
			throw new Business_Exception(implode(' ', $errors));
		}

		// @todo 获取用户id
		$resultValue = array (
			"survey_id" => $surveyId,
			"platform_user_id" => $userId,
			"status" => 0,
			"create_time" => date("Y-m-d H:i:s", time()),
		);

		$surveyResult = Dao::factory("Survey_Result")->insert($resultValue);
		$surveyResultId = isset($surveyResult[0]) ? $surveyResult[0] : 0;
		if ($surveyResultId == 0) {
			throw new Business_Exception("创建答案失败");
		}

		foreach ($answerValues as $answerValue) {
			$surveyResultAnswer = Dao::factory("Survey_Result_Answer")->insert($surveyResultId, $answerValue);
			// @todo checkou result
		}

		return 1;
	}
}
