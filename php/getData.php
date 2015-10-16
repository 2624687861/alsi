<?php
	
	$select = $_GET['data_select'];
	
	$fileName = '../data/dataInfo.json';
	
	$file = file_get_contents($fileName);
	
	$json = json_decode($file);
	
	$jsonS = $json[$select];
	
	$json2 = json_encode($jsonS);
	
	echo $json2;
	
	
?>	