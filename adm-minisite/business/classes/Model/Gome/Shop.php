<?php

class Model_Gome_Shop extends Model {

	private $_shopData = array();

    /**
	{
	 "message":"成功",
	 "data":{
		"icon":"http://img10.atguat.net.cn/image/bbcimg/2013/3/14/302/730/1363254150805.png",
		"id":"80000338",
		"name":"一二三单说的发松岛枫撒旦法刚撒旦法分撒旦刚的份上是上电股份梵蒂冈",
		"shopCollectionQuantity":5
	}
	}
    */
	public function __construct($shopData) {
		$this->_shopData = $shopData;
	}

	/**
	 * 获取店铺id
	 */
	public function getShopId() {
		return $this->_shopData["id"];
	}

	/**
	 * 获取店铺名称
	 */
	public function getName() {
		return $this->_shopData["name"];
	}

	/**
	 * 获取icon
	 */
	public function getIcon() {
		return $this->_shopData["icon"];
	}

	/**
	 * 获取收藏数
	 */
	public function getCollectionQuantity() {
		return $this->_shopData["shopCollectionQuantity"];
	}
}
