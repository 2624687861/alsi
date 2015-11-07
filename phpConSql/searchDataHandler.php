<?php
	
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
	
	require_once('../tool/openSql.class.php');
	$sql = new SQL();
	
	// 9=数据库  判定值是几个
	$search_arr = explode(',', $searchArea);

	if(count($search_arr)==1){
		$search_table = $sql->sqlDivisionTable($searchArea);
	}else{
		// 非一张表的情况下
		$search_table = array();
		foreach($search_arr as $value){
			$search_item = $sql->sqlDivisionTable($value);
			array_push($search_table,$search_item);
		};
	}
	// 表之间并没有任何关联 不能使用多表连接查询 
	$backArr = array();
	for($i=0;$i<count($search_table);$i++){
		$search_dataTable = "select id,dataName,dataContent,dataDate,dataType from $search_table[$i] where dataName like '%$searchValue%' or dataContent like '%$searchValue%'";
		$fetch = $sql->sqlDql($search_dataTable);
		if(mysql_affected_rows()!=-1){
			while($b = mysql_fetch_array($fetch)){
				$a = array();
				$a['id']=$b['id'];
				$a['name']=$b['dataName'];
				$a['content']=$b['dataContent'];
				$a['date']=$b['dataDate'];
				$a['type']=$b['dataType'];
				array_push($backArr,$a);
			};
		}
	}
	
	$sql->sqlClose();
	
	$goBack = array('flag'=>1,'data_array'=>$backArr);
	
	$goBack = json_encode($goBack);
	
	echo $goBack;
	
?>	