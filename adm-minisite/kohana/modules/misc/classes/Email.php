<?php
/**
 * 邮件发送类
 * @author baishen
 * host: 10.58.45.230 mail.gomeplus.com
 */
abstract class Email {

	public static function factory($type = '') {
		if($type == '') {
			$type = 'smtp';
		}
		if($type == 'smtp') {
			$config = array(
				'server' => "mail.gomeplus.com",
				'domain' => "mail.gomeplus.com",
				'port' => 25,
				'user' => "auto-digital",
				'from' => "auto-digital@gomeplus.com",
				'password' => "MSg4o,S#8lsS_D)'",
				'timeout' => 30,
			);
			return Email_Smtp::instance($config);
		}
		throw new Email_Exception("没有实现的邮件发送方式：{$type}");
	}

	abstract public function from($from = '');

	abstract public function to($to = array());

	abstract public function cc($cc = array());

	abstract public function bcc($bcc = array());

	abstract public function subject($subject = '');

	abstract public function content($content = '');

	abstract public function debug();

	abstract public function attachements($attachments = array());

	abstract public function type($type = 1);

	abstract public function execute();
}
