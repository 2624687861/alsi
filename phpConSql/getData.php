<?php
	// 只有当 php 当作页面使用时 才 添加 <meta charset='utf-8'/> 或者添加头信息.
	if(isset($_GET['data_select'])){
		$data_select = $_GET['data_select'];
	}else{
		die('<script>document.write("传输数据方式非法.");</script>;');
	}
	
	require_once('../tool/openSql.class.php');
	$sql = new SQL();
	
	$dataBase = $sql->sqlDivisionTable($data_select);
	
	$statement = "select * from ".$dataBase;

	$result = $sql->sqlDql($statement);
	
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
	
	$sql->sqlClose();
	
	echo $c;

?>	













