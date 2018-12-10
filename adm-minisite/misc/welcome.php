<?php
require("../kohana/modules/misc/classes/Email.php");
require("../kohana/modules/misc/classes/Email/Smtp.php");
require("../kohana/modules/misc/classes/Email/Exception.php");

date_default_timezone_set('Asia/Shanghai');
setlocale(LC_ALL, 'zh_CN.utf-8');

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

$lines = readData("./uu.txt");

$i = 0;
$emails = array();
foreach ($lines as $line) {
	$line = trim($line, "\n");
	$data = explode("\t", $line);

	if(strpos($data[4], '@') == 0) {
		continue;
	}

	$email = $data[4];
	$index = floor($i / 500);
	echo $email . "\n";

	$emails[$index][] = $email;
	$i++;
}
exit();

$subject = "国美营销平台11月充值消费返利啦！！！";

$content = 
'<!DOCTYPE html><html><head><meta charset="UTF-8"><title></title></head><body style="font-size: 16px;margin: 0;padding: 0;"><div style="width:820px;padding: 20px 0;"><div class="head"><h2 style="margin-bottom: 50px;">尊敬的国美商家：</h2><p style="margin: 20px 0;">11月大促临近，为了鼓励商家使用国美的营销推广服务。</p><p style="margin: 20px 0;">使店铺达到更高的销售量，特此推出11月充值消费激励活动！</p><span style="padding: 5px 0;background: #ffff00;"><span style="color: red;font-weight: bold;">营销平台地址：</span><a href="https://amp.gome.com.cn" style="color: #0070c0;font-weight: bold;" target="_blank">amp.gome.com.cn</a></span></div><div class="activity" style="margin-top: 20px;"><h2 style="margin-bottom: 15px;color: #d50000;font-weight: bold;">活动一：首次充值活动</h2><span style="padding: 3px 0;height:35px;line-height: 35px;background: #ffff00;">即日起至2017年11月15日止，从未在国美营销平台充值过的商家，活动期间内首次充值不少于500元（包含500元）国美补贴500元虚拟金到商家账户中，虚拟金的使用期限为15天。</span></div><div class="activity" style="margin-top: 50px;"><h2 style="color: #d50000;font-weight: bold;">活动二：一次性充值活动</h2><p style="margin: 20px 0;"><span style="padding: 3px 0;color: red;background: #ffff00;">即日起到11月15日止 ，</span>凡在活动日期内在国美营销平台一次性充值达到标准的商家，均可参与充值返虚拟金活动。</p><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;"><thead><tr align="center" height="40"><th colspan="4" style="font-size: 20px;border: 1px solid #333333;">国美营销平台-11月一次性充值激励活动</th></tr><tr align="center" height="40"><th colspan="4" style="font-size: 15px;border: 1px solid #333333;">活动期间在国美营销平台一次性现金充值达到以下条件，即可获得相对应的虚拟金</th></tr><tr align="center" height="40" style="font-size: 15px;"><th style="border: 1px solid #333333;">一次性充值金额</th><th style="border: 1px solid #333333;">1000＜金额≤2000元</th><th style="border: 1px solid #333333;">12000＜金额≤3000元</th><th style="border: 1px solid #333333;">3000＜金额</th></tr></thead><tbody><tr align="center" height="40"><td style="font-weight: bold;border: 1px solid #333333;">返“虚拟金”金额（元）</td><td style="border: 1px solid #333333;">500元（500元X1张）</td><td style="border: 1px solid #333333;">1200元（600元X2张）</td><td style="border: 1px solid #333333;">2000元（500元X4张）</td></tr><tr align="center" height="40"><td style="font-weight: bold;border: 1px solid #333333;">虚拟金有效期（天）</td><td style="border: 1px solid #333333;">15（每张15天）</td><td style="border: 1px solid #333333;">30（每张15天）</td><td style="border: 1px solid #333333;">60（每张15天）</td></tr></tbody></table></div><div class="activity" style="margin-top: 50px;"><h2 style="color: #d50000;font-weight: bold;">活动三：累计消费活动</h2><p style="margin: 20px 0;"><span style="padding: 3px 0;color: red;background: #ffff00;">即日起到11月15日，</span>针对活动期内累计现金消费达到标准的，奖励重磅营销资源。</p><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;"><thead><tr align="center" height="40"><th colspan="4" style="font-size: 20px;border: 1px solid #333333;">国美营销平台-11月累计消费激励活动</th></tr><tr align="center" height="40"><th colspan="4" style="font-size: 15px;border: 1px solid #333333;">活动期间在国美营销平台累计现金花费达到以下条件，即可获得相应资源位奖励</th></tr><tr align="center" height="40" style="font-size: 15px;"><th style="border: 1px solid #333333;">累计花费现金</th><th style="border: 1px solid #333333;">1000元＜金额≤2000元</th><th style="border: 1px solid #333333;">3000元＜金额</th></tr></thead><tbody><tr align="center" height="40"><td style="font-weight: bold;border: 1px solid #333333;width:130px;">赠送资源坑位</td><td style="border: 1px solid #333333;width:370px;">PC端搜索结果页底部通栏+PC活动页面首焦</td><td style="border: 1px solid #333333;height:25px;line-height: 25px;">PC搜索结果页底部通栏+PC活动页面首焦+PC列表页底部通栏</td></tr><tr align="center" height="40"><td style="font-weight: bold;border: 1px solid #333333;">赠送天数</td><td style="border: 1px solid #333333;">1天（全流量）</td><td style="border: 1px solid #333333;">1天（全流量）</td></tr></tbody></table><p style="width:580px;line-height: 30px;">资源位价值：PC端搜索结果页底部通栏=2500/天 &nbsp;PC端列表页底部通栏=2500/天 PC活动页面首焦=1000元/天</p></div><div class="footer"><a style="font-size: 25px;padding: 5px 0;font-weight: bold;color: red;background: #ffff00;" href="https://amp.gome.com.cn" target="_blank">点此，立即参与》》》</a><h2 style="font-weight: bold;margin-top: 60px;color: #333333;">联系我们：</h2><p style="margin: 20px 0;">QQ群：614562692</p><p style="margin: 20px 0;">邮箱：<a href="mailto:ad-service@gomeplus.com">ad-service@gomeplus.com</a></p></div></div></body></html>';	  
	

foreach($emails as $index => $tos) {
	$t = microtime();
	echo $index . "\t" . $t . "\n";
	send($subject, $content, $tos);
}

function send($subject, $content, $tos) {
	$ccs = array();
	$ccs[] = "baishen@gomeplus.com";
	$ccs[] = "limengchen@gomeplus.com";
	$ccs[] = "wangyong-ds3@gomeplus.com";

	$email = Email::factory();
	$email->to($tos);
	$email->cc($ccs);
	$email->subject($subject);
	$email->content($content);

	$email->execute();
}
