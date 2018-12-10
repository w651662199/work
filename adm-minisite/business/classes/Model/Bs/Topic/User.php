<?php

class Model_Bs_Topic_User extends Model_Bs {

	public function getFacePicUrl() {
		return preg_replace('/^http:\/\//', 'https://', $this->facePicUrl);
	}

}
