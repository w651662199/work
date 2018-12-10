<?php

class Model_Survey extends Model {

	private $_surveyQuestions = array();

	public function getSurveyQuestions() {
		return $this->_surveyQuestions;
	}

	public function setSurveyQuestions($surveyQuestions) {
		$this->_surveyQuestions = $surveyQuestions;
	}
}
