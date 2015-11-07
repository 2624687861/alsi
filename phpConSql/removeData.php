<?php
	
	if(isset($_GET['data_select'])){
		$data_select = $_GET['data_select'];
	}else{
		die('<script>document.write("传输数据方式非法.");</script>;');
	}

	require_once('../tool/openSql.class.php');
	
	// sql 对象
	$sql = new SQL();
	// 分类过滤
	$dataBase = $sql->sqlDivisionTable($data_select);
	
	// 实际操作
	$sql_expressment = 'select * from '.$dataBase;
	// 返回影响数据表行数
	$result = $sql->sqlDql($sql_expressment);
	
	$rows = mysql_affected_rows();
	
	if(!$rows>0){
		echo 0;
		$sql->sqlClose($link);
		return '';
	}
	
	$arr = array();
	while($a = mysql_fetch_array($result)){
		$b = array();
		$b['id'] = $a['id'];
		$b['name'] = $a['dataName'];
		$b['content'] = $a['dataContent'];
		array_push($arr,$b);
	}
	
	$json = json_encode($arr);
	
	echo $json;
	
	$sql->sqlClose();
	
	
?>	