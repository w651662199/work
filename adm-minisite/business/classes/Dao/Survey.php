<?php
/**
 * 问卷信息Dao
 * @author baishen
 */
class Dao_Survey extends Dao {

	protected $_tableName = "survey";
	protected $_primaryKey = "survey_id";
	protected $_modelName = "Model_Survey";

	/**
	 * 根据surveyId获取问卷
	 * @param $surveyId
	 */
	public function getSurveyBySurveyId($surveyId) {
		return	DB::select('*')
			->from($this->_tableName)
			->where($this->_primaryKey, "=", $surveyId)
			->as_object($this->_modelName)
			->execute($this->_db);
	}
}
