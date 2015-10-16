<?php
	
	// 服务器端对前端传输数据的效验 ？
	
	$upData = $_POST['upData'];
	$data_select = $_POST['data_select'];
	
	require_once('../tool/openSql.class.php');
	$sql = new SQL();
	// 打开链接
	$link = $sql->sqlConnect();
	// 选择数据库
	$sql->sqlSelectDB('alsi',$link);
	// 选择 数据表
	$dataBase = $sql->sqlDivisionTable($data_select);
	
	foreach($upData as $value){
		$array = explode(',',$value);
		$id = $array[0];
		$name = $array[1];
		$content = $array[2];
		$query = 'update '.$dataBase.' set dataName="'.$name.'",dataContent="'.$content.'" where id='.$id;
		mysql_query($query);
		$rows = mysql_affected_rows();
		if($rows==-1){
			$sql->sqlClose($link);
			die(-1);
		}
	}
	// -1失败 1成功
	echo 1;
	
	$sql->sqlClose($link);
	
?>	
	