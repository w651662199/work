<?php

class Model_Bs_Item extends Model_Bs {

	/**
	 * 获取真实价格（分转为元）
	 */
	public function getRealSalePrice() {
		$salePrice = $this->item['salePrice'];
		$skuHighestSalePrice = $this->item['skuHighestSalePrice'];

		if ($skuHighestSalePrice > $salePrice) {
			return sprintf("%01.2f - %01.2f", $salePrice / 100, $skuHighestSalePrice / 100);
		} else {
			return sprintf("%01.2f", $salePrice / 100);
		}
	}

	/**
	 * 获取收藏数
	 */
	public function getCollectionQuantity() {
		return $this->itemCollectQuantity['quantity'];
	}

	/**
	 * 获取评论数
	 */
	public function getCommentQuantity() {
		return $this->itemCommentQuantity['count'];
	}

	/**
	 * 获取售卖量
	 */
	public function getSaleQuantity() {
		return $this->item['saleQuantity'];
	}

	/**
	 * 获取商品id
	 */
	public function getId() {
		return $this->item['id'];
	}

	/**
	 * 获取店铺id
	 */
	public function getShopId() {
		return $this->item['shopId'];
	}

	/**
	 * 获取app内嵌商品详情页地址
	 */
	public function getH5Url() {
		return "gomeplus://product/detail?itemId=" . $this->item['id'] . "&shopId=" . $this->item['shopId'];
	}

	/**
	 * 获取wap商品详情页地址
	 */
	public function getWapUrl() {

		$wapHost = Kohana::$config->load('default.globalConfigs.wapHost');
		return $wapHost . "?itemId=" . $this->item['id'] . "&shopId=" . $this->item['shopId'];
	}
}