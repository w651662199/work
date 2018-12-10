<?php
/**
 * 问卷结果Dao
 * @author baishen
 */
class Dao_Survey_Result extends Dao {

	protected $_tableName = "survey_result";
	protected $_primaryKey = "survey_result_id";
	protected $_modelName = "Model_Survey_Result";

	/**
	 * 创建问卷结果
	 * @param $values
	 */
	public function insert(array $values) {
		return DB::insert($this->_tableName)
			->columns(array_keys($values))
			->values(array_values($values))
			->execute($this->_db);
	}

	/**
	 * 根据问卷id和用户id获取问卷答案
	 * @param $surveyId
	 * @param $userId
	 */
	public function getSurveyResultBySurveyIdAndUserId($surveyId, $userId) {
		return DB::select('*')
			->from($this->_tableName)
			->where("survey_id", "=", $surveyId)
			->and_where("platform_user_id", "=", $userId)
			->as_object($this->_modelName)
			->execute($this->_db);
	}
}
