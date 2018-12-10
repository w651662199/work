<?php

abstract class Model_Bs {


	private $_properties = array();
	
	public function __construct($data = array()) {
		if($data) {
			$this->_properties = $data;
		}
	}
	
	public function __set($item, $value) {
		if(is_string($item)) {
			$this->_properties[$item] = $value;
		}
		return $this;
	}
	
	public function __get($item) {
		return isset($this->_properties[$item]) ? $this->_properties[$item] : NULL;
	}
	
	public function __call($method, $arguments) {
		if(substr($method, 0, 3) == 'get') {
			$method = substr($method, 3, strlen($method));
			$key = lcfirst($method);
			return isset($this->_properties[$key]) ? $this->_properties[$key] : NULL;
		}
		return NULL;
	}
}
