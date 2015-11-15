<?php
	// 只有当 php 当作页面使用时 才 添加 <meta charset='utf-8'/> 或者添加头信息.
	if(isset($_GET['data_select']) && isset($_GET['data_page'])){
		$data_select = $_GET['data_select'];
		$data_page = $_GET['data_page'];
	}else{
		die('<script>document.write("传输数据方式非法.");</script>;');
	}
	
	require_once('../tool/openSql.class.php');
	$sql = new SQL();
	
	$dataBase = $sql->sqlDivisionTable($data_select);
	// 第一次 0
	$data_page_start = $data_page*30;
	$statement = 'select * from '.$dataBase.' limit '."$data_page_start,30";
	$stateRows = 'select count(id) from '.$dataBase;
	if($data_page!=0){
		//die($statement);
	}
	
	$result = $sql->sqlDql($statement);
	$baseRows = $sql->sqlDql($stateRows);

	while($a = mysql_fetch_row($baseRows)){
		$base_rows = $a[0];
	}
	
	// 如果不存在数据 则 返回0
	if($base_rows==0){
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
	
	$resultArr = array('rows'=>$base_rows,'data'=>$arr);
	
	$c = json_encode($resultArr);
	
	$sql->sqlClose();
	
	echo $c;

?>	













