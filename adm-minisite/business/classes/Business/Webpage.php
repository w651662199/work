<?php
/**
* 自建活动信息
*/
class Business_Webpage extends Business {

	public function getWebpageByWebpageId($webpageId) {
		$webpage = Dao::factory("Webpage")->getWebpageByWebpageId($webpageId)->current();
		if ($webpage == NULL) {
			throw new Business_Exception("活动不存在！");
		} else if ($webpage->getStatus() != 1) {
			throw new Business_Exception("活动还没发布");
		}
		return $webpage;
	}

	public function getWebpageItemsByWebpageId($webpageId) {
		$webpageItems = Dao::factory("Webpage_Item")->getWebpageItemsByWebpageId($webpageId);
		if ($webpageItems == NULL) {
			throw new Business_Exception("活动商品不存在！");
		}
		return $webpageItems;
	}
}