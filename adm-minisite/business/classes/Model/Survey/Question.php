<?php

class Model_Survey_Question extends Model {

	// 单选
	const TYPE_RADIO = 1;
	// 多选
	const TYPE_CHECKBOX = 2;
	// 评分
	const TYPE_RATING = 3;
	// 文本
	const TYPE_TEXT = 4;

	private $_surveyQuestionOptions = array();

	public function getIsRadio() {
		return $this->type == self::TYPE_RADIO;
	}

	public function getIsCheckbox() {
		return $this->type == self::TYPE_CHECKBOX;
	}

	public function getIsRating() {
		return $this->type == self::TYPE_RATING;
	}

	public function getIsText() {
		return $this->type == self::TYPE_TEXT;
	}

	public function getSurveyQuestionOptions() {
		return $this->_surveyQuestionOptions;
	}

	public function setSurveyQuestionOptions($surveyQuestionOptions) {
		$this->_surveyQuestionOptions = $surveyQuestionOptions;
	}
}
