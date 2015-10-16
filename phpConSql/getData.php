<?php
	// 只有当 php 当作页面使用时 才 添加 <meta charset='utf-8'/> 或者添加头信息.
	$data_select = $_GET['data_select'];
	
	$dataBase = null;
	switch($data_select){
				case 0: $dataBase = 'studing';
				break;
				case 1: $dataBase = 'entertainment';
				break;
				case 2: $dataBase = 'animation';
				break;
				case 3: $dataBase = 'means';
				break;
				case 4: $dataBase = 'word';
				break;
			}
	
	$link = mysql_connect('localhost','root','zydxiana');
	if(!$link){
		echo '请检查网络是否正常连接！';
	}
	
	mysql_query('set names utf8');
	mysql_select_db('alsi',$link);
	
	$statement = "select * from ".$dataBase;

	$result = mysql_query($statement);
	
	$rows = mysql_affected_rows();
	
	// 如果不存在数据 则 返回0
	if(!$rows>0){
		echo 0;
		mysql_close($link);
		return '';
	}
	
	$arr = array();
	
	while($a = mysql_fetch_array($result)){
		$b = array();
		$b['id'] = $a['id'];
		$b['name'] = $a['dataName'];
		$b['content'] = $a['dataContent'];
		$arr[] = $b;
	}
	
	$c = json_encode($arr);
	
	mysql_close($link);
	
	echo $c;

?>	













