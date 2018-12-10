<?php

class Model_Webpage extends Model {

	public function getTitle() {
		return HTML::chars($this->title);
	}

	public function getDescription() {
		return trim(HTML::chars($this->description));
	}

	public function getCardTitle() {
		return str_replace(array("\n", "\r\n"), "", HTML::chars($this->card_title));
	}

	public function getCardDescription() {
		return str_replace(array("\n", "\r\n"), "", HTML::chars($this->card_description));
	}

	public function getShopUrl() {
		$gomeHost = Kohana::$config->load('default.globalConfigs.gomeHost');
		return $gomeHost . "shop-" . $this->shop_id . ".html";
	}

	public function getImage() {
		return preg_replace('/^http:\/\//', 'https://', $this->image);
	}

	public function getPlatformAvatar() {
		return preg_replace('/^http:\/\//', 'https://', $this->platformAvatar);
	}
}
