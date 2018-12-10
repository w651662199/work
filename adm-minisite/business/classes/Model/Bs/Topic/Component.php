<?php

class Model_Bs_Topic_Component extends Model_Bs {

	public function getIsText() {
		return $this->type == "text";
	}

	public function getIsImage() {
		return $this->type == "image";
	}

	public function getIsItem() {
		return $this->type == "item";
	}

	public function getIsVideo() {
		return $this->type == "video";
	}

	/**
	 * 文字（\r\n转为）
	 */
	public function getText() {
		return str_replace(array("\r\n", "\n\n"), "<br>", $this->text);
	}

	/**
	 * 商品地址
	 */
	public function getItemUrl() {
		if ($this->type != "item") {
			return "";
		}
		$gomeItemHost = Kohana::$config->load('default.globalConfigs.gomeItemHost');
		return $gomeItemHost . 'product-' . $this->outProductId . '.html';
	}

	/**
	 * 商品图片
	 */
	public function getItemImage() {
		if ($this->type != "item") {
			return "";
		}
		return preg_replace('/^http:\/\//', 'https://', $this->item['mainImage']);
	}

	public function getUrl() {
		if ($this->type != "image") {
			return "";
		}
		return preg_replace('/^http:\/\//', 'https://', $this->url);
	}
	/**
	 * 商品名称
	 */
	public function getItemName() {
		if ($this->type != "item") {
			return "";
		}
		return $this->item['name'];
	}

	/**
	 * 商品价格
	 */
	public function getItemSalePrice() {
		if ($this->type != "item") {
			return 0;
		}
		return sprintf("%01.2f", $this->item['salePrice'] / 100);
	}

	/**
	 * 视频id
	 */
	public function getVideoId() {
		if ($this->type != "video") {
			return 0;
		}
		return $this->id;
	}

	/**
	 * 视频图片
	 */
	public function getVideoImage() {
		if ($this->type != "video") {
			return "";
		}
		return $this->coverImage;
	}

}
