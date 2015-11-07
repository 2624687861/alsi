<?php
	
	date_default_timezone_set('Asia/ShangHai');
	$time = time();
	
	$filename = "../data/record.json";
	
	require_once('../tool/file.tool.php');
	fileExists($filename,'[{"datetime":0}]');
	
    $json_string = file_get_contents($filename);
	
	$json2 = json_decode($json_string,true);
	
	$a = $json2[0]['datetime'];
	
	$b = $a - $time;
	
	$c = 'false';
	
	if($b<-86400){
	
		$json2[0]['datetime'] = $time;
		
		$json = json_encode($json2);
		file_put_contents($filename, $json);
		
		$c = 'true';
	}else{
		
		$d = date('Ymd',$time);
		$f = date('Ymd',$a);
		$e = $f - $d;
		if($e<0){
			
			$json2[0]['datetime'] = $time;
		
			$json = json_encode($json2);
			file_put_contents($filename, $json);
			
			$c = 'true';
		}
		
	}

	echo $c;

	
?>	

