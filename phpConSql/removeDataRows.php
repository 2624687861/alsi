<?php
	
	$str = $_GET['deleteStr'];
	$data_select = $_GET['data_select'];
	
	require_once('../tool/openSql.class.php');
	$sql = new SQL();
	$link = $sql->sqlConnect();
	
	$sql->sqlSelectDB('alsi',$link);
	
	$dataBase = $sql->sqlDivisionTable($data_select);
	
	$remove_expressment = 'delete from '.$dataBase.' where id in ('.$str.')';
	
	$remove_execute = mysql_query($remove_expressment);

	$rows = mysql_affected_rows();
	
	// 返回值	
	echo 1;
		
	$sql->sqlClose($link);
	
?>	