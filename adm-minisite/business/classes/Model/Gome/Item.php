<?php

class Model_Gome_Item extends Model {

	private $_priceData = array();
	private $_appraisalData = array();

    /**
        {
          "message": "成功",
          "data": [
            {
              "appraisal": 0,
              "productId": "9200001123",
              "skuId": "1000087706",
              "stauts": 1
            }
          ]
        }

        {
          "message": "成功",
          "data": [
            {
              "originalPrice": 111,
              "price": 111,
              "priceType": "GOMEPRICE",
              "salePrice": 111,
              "skuId": "pop8003758022"
            }
          ]
        }
    */
	public function __construct($priceData, $appraisalData) {
		$this->_priceData = $priceData;
		$this->_appraisalData = $appraisalData;
	}

	/**
	 * 获取真实价格（单位为元）
	 */
	public function getRealSalePrice() {
		return $this->_priceData["price"];
	}

	/**
	 * 获取收藏数
	 */
	public function getCollectionQuantity() {
		return 0;
	}

	/**
	 * 获取评论数
	 */
	public function getCommentQuantity() {
		if ($this->_appraisalData["appraisal"] > 10000) {
			return number_format($this->_appraisalData["appraisal"] / 10000, 1) . 'w';
		}
		if ($this->_appraisalData["appraisal"] == 0) {
			return '';
		}
		return $this->_appraisalData["appraisal"];
	}

	/**
	 * 获取售卖量
	 */
	public function getSaleQuantity() {
		return 0;
	}

	/**
	 * 获取商品id
	 */
	public function getId() {
		//@todo id
		return 1;
		// return $this->item['skuId'];
		//return $this->item['id'];
	}

	/**
	 * 获取店铺id
	 */
	public function getShopId() {
		//@todo shop id
		return 1;
		//return $this->item['shopId'];
	}


	/**
	 * 获取app内嵌商品详情页地址
	 */
	public function getH5Url() {
		$gomeItemHost = Kohana::$config->load('default.globalConfigs.gomeItemHost');
		return $gomeItemHost . 'p-' . $this->_appraisalData['productId'] . '-' . $this->_appraisalData['skuId'] . '.html';
	}

	/**
	 * 获取wap商品详情页地址
	 */
	public function getWapUrl() {
		$gomeItemHost = Kohana::$config->load('default.globalConfigs.gomeItemHost');
		return $gomeItemHost . 'p-' . $this->_appraisalData['productId'] . '-' . $this->_appraisalData['skuId'] . '.html';
	}
}
