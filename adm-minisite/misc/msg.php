<?php
require("../kohana/modules/curl/classes/Curl/Request.php");

date_default_timezone_set('Asia/Shanghai');
setlocale(LC_ALL, 'zh_CN.utf-8');

function sendMsg($mobile) {
    $smsConfig = array (
        'userName' => 15313729295,
        'password' => '3040D5ACE3A9C2EE25C46F42FB9C',
        'type' => 'pt',
        'smsUrl' => 'http://web.cr6868.com/asmx/smsservice.aspx',
    );

    $data = array(
        "name" => $smsConfig['userName'],
        "pwd" => $smsConfig['password'],
        //"content" => sprintf('【国美美媒】%d（国美美媒手机验证码，请在5分钟内完成验证）， 如非本人操作，请忽略本短信。', $random),
        "content" => "【国美营销平台】12月首次充值激励活动来啦！首充值500元就送500！！！立即参加→http://amp.gome.com.cn",
        "mobile" => $mobile,
        "type" => $smsConfig['type'],
    );

    echo $mobile . "\n";
    $curlInstance = new Curl_Request();
    $result = $curlInstance->post($smsConfig['smsUrl'], $data);
    echo $result . "\n";
}


function readData($name) {
	$handle = fopen($name, "r");
	$lines = array();
	if ($handle) {
		while (($line = fgets($handle)) !== false) {
			$lines[] = $line;
		}
		fclose($handle);
	}
	return $lines;
}

$lines = readData("./shop.txt");

$mobiles = array();
foreach ($lines as $line) {
	$line = trim($line, "\n");
	$data = explode("\t", $line);
    if (!is_numeric($data[4])) {
        continue;
    }
    $mobiles[] = $data[4];
}

$mobiles = array_unique($mobiles);

foreach ($mobiles as $mobile) {
    sendMsg($mobile);
}

