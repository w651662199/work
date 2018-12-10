<?php

class Model_Flight_Advertisement extends Model {

	public function getRealRebateBid() {
		return number_format($this->rebate_bid / 100, 2);
	}

	public function getRealAdBid() {
		return number_format($this->ad_bid / 100, 2);
	}
}
