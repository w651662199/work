<?php
/**
 * 问卷问题选项Dao
 * @author baishen
 */
class Dao_Survey_Question_Option extends Dao {

	protected $_tableName = "survey_question_option";
	protected $_primaryKey = "survey_question_option_id";
	protected $_modelName = "Model_Survey_Question_Option";

	const STATUS_DELETE = -1;
	const STATUS_NORMAL = 0;

	/**
	 * 根据surveyQuestionId获取问卷问题选项
	 * @param $surveyQuestionId
	 */
	public function getSurveyQuestionOptionsBySurveyQuestionId($surveyQuestionId) {
		return	DB::select('*')
			->from($this->_tableName)
			->where("survey_question_id", "=", $surveyQuestionId)
			->where("status", "=", self::STATUS_NORMAL)
			->order_by('sequence', 'ASC')
			->as_object($this->_modelName)
			->execute($this->_db);
	}
}
