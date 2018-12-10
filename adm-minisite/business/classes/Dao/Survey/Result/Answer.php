<?php
/**
 * 问卷结果答案Dao
 * @author baishen
 */
class Dao_Survey_Result_Answer extends Dao {

	protected $_tableName = "survey_result_answer";
	protected $_primaryKey = "survey_result_answer_id";
	protected $_modelName = "Model_Survey_Result_Answer";

	/**
	 * 创建问卷结果答案
	 * @param $values
	 */
	public function insert($surveyResultId, array $values) {
		$values['survey_result_id'] = $surveyResultId;

		return DB::insert($this->_tableName)
			->columns(array_keys($values))
			->values(array_values($values))
			->execute($this->_db);
	}
}
