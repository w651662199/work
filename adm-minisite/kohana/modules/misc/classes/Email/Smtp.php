<?php
/**
 * SMTP邮件发送类
 * @author baishen
 * host: 10.58.45.230 mail.gomeplus.com
 */
class Email_SMTP extends Email {

	/**
	 * SMTP Server IP或域名
	 * @var string
	 */
	public static $server = 'localhost';
	/**
	 * 端口
	 * @var number
	 */
	public static $port = 25;
	/**
	 * 向服务器标识用户身份，返回邮件服务器身份（域名）。
	 * @var string
	 */
	public static $domain = 'localhost';
	/**
	 * 认证用户名（base64）
	 * @var string
	 */
	public static $user = '';
	/**
	 * 认证密码（base64）
	 * @var string
	 */
	public static $password = '';
	/**
	 * 默认使用邮箱
	 * @var string
	 */
	public static $from = '';
	/**
	 * 超时
	 * @var number
	 */
	public static $timeout = 30;


	/**
	 * MIMES
	 * @var array
	 */
	protected static $_mimes = array();
	/**
	 * 自定义用户名
	 * @var string
	 */
	protected $_user = '';
	/**
	 * 密码
	 * @var string
	 */
	protected $_password = '';
	/**
	 * 发件人
	 * @var string
	 */
	protected $_from = '';
	/**
	 * 收件人
	 * @var array
	 */
	protected $_to = array();
	/**
	 * 抄送人
	 * @var array
	 */
	protected $_cc = array();
	/**
	 * 暗抄送
	 * @var array
	 */
	protected $_bcc = array();
	/**
	 * 标题
	 * @var string
	 */
	protected $_subject = '';
	/**
	 * 内容
	 * @var string
	 */
	protected $_content = '';
	/**
	 * 邮件类型(0TEXT/1HTML)
	 */
	protected $_type = 1;
	/**
	 * 调试
	 * @var boolean
	 */
	protected $_debug = FALSE;
	/**
	 * 附件
	 * @var array
	 */
	protected $_attachments = array();


	private static $_instance = NULL;

	private static $_smtpHandler = NULL;

	private $_boundary = '';

	private $_commands = array();

	public static function instance($config = array()) {
		if(self::$_instance === NULL) {
			self::$_instance = new self($config);
		}
		return self::$_instance;
	}

	public function __construct($config = array()) {
		//	self::$_mimes = Kohana::$config->load('mimes');

		self::$server = $config['server'];
		self::$domain = $config['domain'];
		self::$port = $config['port'];
		self::$user = base64_encode($config['user']);
		self::$password = base64_encode($config['password']);
		self::$from = $config['from'];
		self::$timeout = $config['timeout'];
	}

	public function user($user = '') {
		$this->_user = base64_encode($user);
		return $this;
	}

	public function password($password = '') {
		$this->_password = base64_encode($password);
		return $this;
	}

	public function from($from = '') {
		$this->_from = $from;
		return $this;
	}

	public function to($to = array()) {
		$this->_to = $to;
		return $this;
	}

	public function cc($cc = array()) {
		$this->_cc = $cc;
		return $this;
	}

	public function bcc($bcc = array()) {
		$this->_bcc = $bcc;
		return $this;
	}

	public function subject($subject = '') {
		$this->_subject = $subject;
		return $this;
	}

	public function content($content = '') {
		$this->_content = $content;
		return $this;
	}

	public function type($type = 1) {
		$this->_type = $type;
		return $this;
	}

	public function debug() {
		$this->_debug = TRUE;
		return $this;
	}

	public function attachements($attachments = array()) {
		$this->_attachments = $attachments;
		return $this;
	}

	public function execute() {
		set_time_limit(self::$timeout);

		$this->_before();
		$this->_send();
		$this->_after();
	}

	private function _before() {

		//打开SMTP服务器连接
		self::$_smtpHandler = fsockopen(self::$server, self::$port, $errno, $errstr, self::$timeout);
		if(!self::$_smtpHandler) {
			$message = "邮件服务器连接不成功 &raquo; {$errno}:{$errstr}";
			throw new Email_Exception($message);
		}
		//确定分割线
		$hash = sha1(microtime(TRUE));
		$this->_boundary = "----=_NEXT{$hash}_=----";

		$header = '';
		if($this->_from) {
			$header .= "From: <{$this->_from}>\r\n";
		} else {
			$header .= "From: <". self::$from .">\r\n";
		}
		//header部分，用于邮件正文头部信息显示，确定多附件分割等；
		$header .= "To:<".implode('>,<', $this->_to).">\r\n";
		if($this->_cc) {
			$header .= "Cc:<".implode('>,<', $this->_cc).">\r\n";
		}
		if($this->_bcc) {
			$header .= "Bcc:<".implode('>,<', $this->_bcc).">\r\n";
		}
		$header .= "Subject:". self::convert($this->_subject) ."\r\n";
		$header .= "Date: ". date('r') . "\r\n";
		$header .= "Message-ID: {$hash}\r\n";
		$header .= "Mime-Version: 1.0\r\n";
		$header .= "X-Mailer: Sina Video(VMS)\r\n";
		$header .= "Content-Type: multipart/related; boundary=\"{$this->_boundary}\"\r\n";
		$header .= "This is a multi-part message in MIME format.\r\n";

		//邮件正文，包含附件部分
		$encoding = mb_detect_encoding($this->_content);
		$body = '';
		$body .= "\r\n--{$this->_boundary}\r\n";
		if($this->_type == 1) {
			$body .= "Content-Type: text/html;charset=\"$encoding\"\r\n";
		}
		$body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
		$body .= quoted_printable_encode($this->_content);

		//附件
		foreach($this->_attachments as $attachment) {
			if(!file_exists($attachment)) {
				continue;
			}

			$basename = basename($attachment);
			$encoding = mb_detect_encoding($basename);
			$basename = self::convert($basename);
			$info = pathinfo($attachment);
			$extension = $info['extension'];
			$mime = isset(self::$_mimes[$extension]) ? self::$_mimes[$extension][0] : 'application/octet-stream';
			$file = file_get_contents($attachment);
			$file = base64_encode($file);

			$body .= "\r\n--{$this->_boundary}\r\n";
			$body .= "Content-Type: $mime;\r\n";
			$body .= "Content-Disposition: attachment;filename=\"{$basename}\"\r\n";
			$body .= "Content-Transfer-Encoding: base64\r\n\r\n";
			$body .= $file;
		}
		$body .= "\r\n.\r\n";

		$this->_commands = array();
		$this->_commands[] = array('HELO', self::$domain);
		$this->_commands[] = array('AUTH LOGIN', '');
		if($this->_user) {
			$this->_commands[] = array($this->_user, '');
			$this->_commands[] = array($this->_password, '');
		} else {
			$this->_commands[] = array(self::$user, '');
			$this->_commands[] = array(self::$password, '');
		}
		if($this->_from) {
			$this->_commands[] = array('MAIL', 'FROM:'.$this->_from);
		} else {
			$this->_commands[] = array('MAIL', 'FROM:'.self::$from);
		}

		$rcptTos = array_merge($this->_to, $this->_cc, $this->_bcc);
		foreach($rcptTos as $to) {
			$this->_commands[] = array('RCPT', "TO:<{$to}>");
		}

		$this->_commands[] = array('DATA', '');
		$this->_commands[] = array('', $header);
		$this->_commands[] = array('', $body);
	}

	private function _send() {
		foreach($this->_commands as $pairs) {
			$timer = microtime(TRUE);

			$command = $pairs[0];
			$args = $pairs[1];

			$commandText = '';
			if($command) {
				$commandText .= $command;
			}
			if($args) {
				$commandText .= ' '. $args;
			}

			fputs(self::$_smtpHandler, $commandText ."\r\n");

			$response = fgets(self::$_smtpHandler, 256);

			if($this->_debug) {
				echo $commandText ."\r\n";
				echo $response ."\r\n\r\n";
			}

			$code = substr($response, 0, 1);
			if($code != 2 && $code != 3) {
				throw new Email_Exception("邮件发送失败 &raquo; {$response}");
			}
		}
	}

	private function _after() {
		fclose(self::$_smtpHandler);
	}

	public static function convert($string = '') {
		$encoding = mb_detect_encoding($string);
		$string = base64_encode($string);
		$string = "=?{$encoding}?B?{$string}?=";
		return $string;
	}
}
