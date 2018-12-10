<?php
abstract class Task {
	
	/**
	 * 解析域
	 * @param string $domain
	 * @param number $rangeStart
	 * @param number $rangeOver
	 * @throws Task_Exception
	 * @return array
	 */
	static public function explain($domain, $rangeStart = 0, $rangeOver = 0) {
		$units = array();
		$universal = range($rangeStart, $rangeOver);
		
		if($domain == '*') {
			return $universal;
		}
		
		if(preg_match('@[^0-9\-\/\,\*]+@', $domain, $matches)) {
			throw new Task_Exception('语法错误');
		}
		
		$items = explode(',', $domain);
		foreach($items as $item) {
			$start = NULL;
			$over = NULL;
			$skip = NULL;
			
			$pairs = explode('/', $item);
			if(isset($pairs[1])) {
				$skip = intval($pairs[1]);
				$skip = $skip ? $skip : NULL;
			}
			$remainder = $pairs[0];
			
			$pairs = explode('-', $remainder);
			$over = isset($pairs[1]) ? intval($pairs[1]) : NULL;
			$start = $pairs[0];
			
			if($start == '*') {
				$start = $rangeStart;
				$over = $rangeOver;
			} else {
				$start = intval($pairs[0]);
			}
			

			if(!is_numeric($over)) {
				$units[] = $start;
				continue;
			}
			
			if($start < $rangeStart || $start > $rangeOver) {
				throw new Task_Exception("解析错误，范围 {$rangeStart} ~ {$rangeOver}");
			}
			
			if($over < $rangeStart || $over > $rangeOver) {
				throw new Task_Exception("解析错误，范围 {$rangeStart} ~ {$rangeOver}");
			}
			
			if($over < $start) {
				throw new Task_Exception("({$start}-{$over}) 是空集");
			}
			
			$numerators = range($start, $over);
			$count = count($numerators);
			if($skip) {
				for($i = 0; $i < $count; $i++) {
					if($i % $skip != 0) {
						unset($numerators[$i]);
					}
				}
			}
			$units = array_merge($units, $numerators);
		}
		
		return $units;
	}
	
	/**
	 * 任务标题
	 * @var string
	 */
	public $subject = NULL;
	
	/**
	 * 作者
	 * @var string
	 */
	public $author = NULL;
	
	/**
	 * 进程互斥
	 * @var boolean
	 */
	public $mutex = TRUE;
	
	/**
	 * 分
	 * @var string
	 */
	public $minute = '*';
	
	/**
	 * 时
	 * @var string
	 */
	public $hour = '*';

	/**
	 * 日
	 * @var string
	 */
	public $day = '*';
	
	/**
	 * 月
	 * @var string
	 */
	public $month = '*';
	
	/**
	 * 周
	 * @var string
	 */
	public $week = '*';
	
	/**
	 *  是否可以执行
	 * @var unknown
	 */
	protected $_runable = FALSE;
	
	/**
	 * 分
	 * @var array
	 */
	protected $_minutes = array();
	
	/**
	 * 时
	 * @var array
	 */
	protected $_hours = array();
	
	/**
	 * 日
	 * @var array
	 */
	protected $_days = array();
	
	/**
	 * 月
	 * @var array
	 */
	protected $_months = array();
	
	/**
	 * 周
	 * @var array
	 */
	protected $_weeks = array();
	
	public function __construct() {
		
		$className = get_class($this);
		
		//处理进程互斥
		if($this->mutex) {
			$command = "ps -ef | grep $className | wc -l";
			$count = exec($command);
			
			if($count > 3) {
				return $this->_runable = FALSE;
			}
		}

		try {
			$this->_minutes = Task::explain($this->minute, 0, 59);
		} catch(Exception $e) {
			throw new Task_Exception("{$className}::minute » {$this->minute} {$e->getMessage()}");
		}
		
		try {
			$this->_hours = Task::explain($this->hour, 0, 23);
		} catch(Exception $e) {
			throw new Task_Exception("{$className}::hour » {$this->hour} {$e->getMessage()}");
		}
		
		try {
			$this->_days = Task::explain($this->day, 1, 31);
		} catch(Exception $e) {
			throw new Task_Exception("{$className}::day » {$this->day} {$e->getMessage()}");
		}
		
		try {
			$this->_months = Task::explain($this->month, 1, 12);
		} catch(Exception $e) {
			throw new Task_Exception("{$className}::month » {$this->mounth} {$e->getMessage()}");
		}
		
		try {
			$this->_weeks = Task::explain($this->week, 0, 6);
		} catch(Exception $e) {
			throw new Task_Exception("{$className}::week » {$this->week} {$e->getMessage()}");
		}
		

		$now = time();
		$minute = date('i', $now);
		$hour = date('H', $now);
		$day = date('d', $now);
		$month = date('m', $now);
		$week = date('w', $now);
		
		if(in_array($minute, $this->_minutes) && in_array($hour, $this->_hours)	&& in_array($day, $this->_days) && in_array($month, $this->_months)	&& in_array($week, $this->_weeks)) {
			$this->_runable = TRUE;
		}
	}
	
	final public function getSubject() {
		return $this->subject;
	}
	
	final public function getAuthor() {
		return $this->author;
	}

	final public function getMinute() {
		return $this->minute;
	}

	final public function getHour() {
		return $this->hour;
	}
	
	final public function getDay() {
		return $this->day;
	}
	
	final public function getMonth() {
		return $this->month;
	}
	
	final public function getWeek() {
		return $this->week;
	}
	
	public function getMinutes() {
		return $this->_minutes;
	}

	public function getHours() {
		return $this->_hours;
	}
	
	public function getDays() {
		return $this->_days;
	}
	
	public function getMonths() {
		return $this->_months;
	}
	
	public function getWeeks() {
		return $this->_weeks;
	}
	
	public function runable() {
		return $this->_runable;
	}
	
	abstract public function before();
	
	abstract public function execute();
	
	abstract public function after();
}