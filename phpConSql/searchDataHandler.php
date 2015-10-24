<?php
	
	require_once('../tool/openSql.class.php');
	$Sql = new SQL();
	
	if(isset($_GET['searchArea'])&&isset($_GET['searchValue'])){
		$searchArea = $_GET['searchArea'];
		$searchValue = $_GET['searchValue'];
	}else{
		$goBack = array('flag'=>0);
		$goBack = json_encode($goBack);
		$time = $Sql->sqlGetCurrentTime();
		$timetamp = time();
		$message = "非法进入搜索,亚洲上海时间:".$time."UTC时间戳".$timetamp;
		error_log($message."\r\n",3,'../systemStatus/errorLog.txt');
		die($goBack);    // 返回为一个对象  {'flag':0};
	}
	
	$link = $Sql->sqlConnect();
	
	// 模糊搜索 过程！
	
	$Sql->sqlClose($link);
	
	$goBack = array('flag'=>1);
	
	$goBack = json_encode($goBack);
	
	echo $goBack;
	
?>	