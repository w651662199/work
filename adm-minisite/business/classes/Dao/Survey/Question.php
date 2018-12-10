<?php
/**
 * 问卷问题Dao
 * @author baishen
 */
class Dao_Survey_Question extends Dao {

	protected $_tableName = "survey_question";
	protected $_primaryKey = "survey_question_id";
	protected $_modelName = "Model_Survey_Question";

	const STATUS_DELETE = -1;
	const STATUS_NORMAL = 0;

	/**
	 * 根据surveyId获取问卷问题
	 * @param $surveyId
	 */
	public function getSurveyQuestionsBySurveyId($surveyId) {
		return	DB::select('*')
			->from($this->_tableName)
			->where("survey_id", "=", $surveyId)
			->where("status", "=", self::STATUS_NORMAL)
			->order_by('sequence', 'ASC')
			->as_object($this->_modelName)
			->execute($this->_db);
	}

	/**
	 * 根据surveyQuestionId获取问卷问题
	 * @param $surveyQuestionId
	 */
	public function getSurveyQuestionBySurveyQuestionId($surveyQuestionId) {
		return	DB::select('*')
			->from($this->_tableName)
			->where("survey_question_id", "=", $surveyQuestionId)
			->where("status", "=", self::STATUS_NORMAL)
			->as_object($this->_modelName)
			->execute($this->_db);
	}
}
