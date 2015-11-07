<?php
	
	if(isset($_GET['deleteStr']) && isset($_GET['data_select'])){
		$str = $_GET['deleteStr'];
		$data_select = $_GET['data_select'];
	}else{
		die('<script>document.write("传输数据方式非法.");</script>;');
	}
	
	require_once('../tool/openSql.class.php');
	$sql = new SQL();
	
	$dataBase = $sql->sqlDivisionTable($data_select);
	
	$remove_expressment = 'delete from '.$dataBase.' where id in ('.$str.')';
	
	$remove_execute = $sql->sqlDml($remove_expressment);
	
	// 返回值	
	echo $remove_execute;
		
	$sql->sqlClose();
	
?>	