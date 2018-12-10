<?php

$cmd1 = "cat /gomeo2o/logs/nginx/m-gome-discovery-access.log | grep '\"url\":\"http://m-discovery.gome.com.cn/hrebate'";
$cmd2 = " | awk -F'[:,]' '{print $14}'|sort | uniq -c | wc";

$aU = 0;
for($i = 1; $i <= 15; $i++) {

        $cmd = $cmd1 . ' | grep chl=' . $i . '\"' . $cmd2;
        //echo $cmd . "\n";
        $r = shell_exec($cmd);
        $arr = explode("    ", $r);
        $c1 = intval($arr[1]);
        $cmd = $cmd1 . ' | grep chl='. $i . '\&' . $cmd2;
        //echo $cmd . "\n";
        $r = shell_exec($cmd);
        $arr = explode("    ", $r);
        $c2 = intval($arr[1]);

        $c = $c1 + $c2;
        $aU += $c;
        echo $i . " => " . $c . "\n";

        $key = "High_Rebate_U_" . $i;
        Redisd::instance('awall')->incrBy($key, $c);
}

echo "au => " . $aU . "\n";

$key = "High_Rebate_UV";
Redisd::instance('awall')->incrBy($key, $aU);


$cmd1 = "cat /gomeo2o/logs/nginx/m-gome-discovery-access.log | grep '\"url\":\"http://m-discovery.gome.com.cn/hrebate'";
$cmd2 = " | wc";

$aP = 0;
for($i = 1; $i <= 15; $i++) {

        $cmd = $cmd1 . ' | grep chl=' . $i . '\"' . $cmd2;
        //echo $cmd . "\n";
        $r = shell_exec($cmd);
        $arr = explode("    ", $r);
        $c1 = intval($arr[1]);
        $cmd = $cmd1 . ' | grep chl='. $i . '\&' . $cmd2;
        //echo $cmd . "\n";
        $r = shell_exec($cmd);
        $arr = explode("    ", $r);
        $c2 = intval($arr[1]);

        $c = $c1 + $c2;
        $aP += $c;
        echo $i . " => " . $c . "\n";
        $key = "High_Rebate_P_" . $i;
        Redisd::instance('awall')->incrBy($key, $c);

}

echo "ap => " . $aP . "\n";

$key = "High_Rebate_PV";
Redisd::instance('awall')->incrBy($key, $aP);
