<?php

class Model_Bs_Topic extends Model_Bs {

	private $_topicUser = array();
	
	private $_topicComponents = array();

	//获取话题id
	public function getTopicId() {
		return $this->id;
	}
	//获取话题标题
	public function getName() {
		return $this->name;
	}

	public function getGroupId() {
		return $this->groupId;
	}

	public function getUserNickname() {
		return $this->user['nickname'];
	}

	public function getGroupIcon() {
		return $this->group['icon'];
	}

	//获取第一段文字，前90个字。
	public function getComponentsOneText() {
		foreach ($this->components as $component) {
			if(isset($component['text'])){
				return mb_substr(str_replace(array("\r\n", "\n\n"), "", $component['text']), 0, 20);
			}
		}
	}

	//获取第一张图片。
	public function getComponentsOneUrl() {
		foreach ($this->components as $component) {
			if($component['type'] == 'image' && isset($component['url'])){
				return $component['url'];
			}else if($component['type'] == 'video' && isset($component['coverImage'])){
				return $component['coverImage'];
			}
		}
	}

	public function setTopicUser($topicUser) {
		$this->_topicUser = $topicUser;
	}

	public function getTopicUser() {
		return $this->_topicUser;
	}

	public function setTopicComponents($topicComponents) {
		$this->_topicComponents = $topicComponents;
	}

	public function getTopicComponents() {
		return $this->_topicComponents;
	}
}
