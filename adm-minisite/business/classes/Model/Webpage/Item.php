<?php

class Model_Webpage_Item extends Model {

	public function getTitle() {
		return HTML::chars($this->title);
	}

	public function getDescription() {
		return HTML::chars($this->description);
	}

	public function getItemUrl() {
		$gomeItemHost = Kohana::$config->load('default.globalConfigs.gomeItemHost');
		return $gomeItemHost . 'p-' . $this->getProductId() . '-' . $this->getSkuId() . '.html';
	}

	public function getShopUrl() {
		$gomeHost = Kohana::$config->load('default.globalConfigs.gomeHost');
		return $gomeHost . 'shop-' . $this->getShopId() . '.html';
	}

	public function getIsWords() {
		return $this->type == "rich_text";
	}

	public function getIsImage() {
		return $this->type == "image";
	}

	public function getImage() {
		return preg_replace('/^http:\/\//', 'https://', $this->image);
	}

	public function getIsProduct() {
		return $this->type == "product";
	}

	public function getIsVideo() {
		return $this->type == "video";
	}

	/**
	 * 文字（\r\n转为）
	 */
	public function getWords() {
		$words = str_replace(array("\r\n", "\n\n"), "<br>", $this->words);
		$words = str_replace('<div>', '<p class="tpc-para">', $words);
		$words = str_replace('<p>', '<p class="tpc-para">', $words);
		$words = str_replace('</div>', '</p>', $words);
		$words = str_replace('16px', '.32rem', $words);
		$words = str_replace('18px', '.36rem', $words);
		$emojis = Kohana::$config->load('Emoji')->as_array();
		foreach ($emojis as $emojiKey => $emojiIcon) {
			$words = str_replace($emojiKey, '<img src="/resource/images/emoji/' . $emojiIcon . '">', $words);
		}
		return $words;
	}

	/**
	 * 商品价格
	 */
	public function getPrice() {
		if ($this->type != "product") {
			return 0;
		}
		return sprintf("%01.2f", $this->price / 100);
	}
}