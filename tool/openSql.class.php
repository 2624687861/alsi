<?php
	
	class SQL{
		
		// 连接数据库
		function sqlConnect(){
			$link = mysql_connect('localhost','root','zydxiana');
			return $link;
		}
		// 选择数据库  设置字符编码
		function sqlSelectDB($a,$b){
			mysql_select_db($a,$b);
			mysql_query('set names utf8');
		}
		// 关闭数据库
		function sqlClose($a){
			mysql_close($a);
		}
		// 数据表区分
		function sqlDivisionTable($a){
			$dataBase = null;
			switch($a){
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
			return $dataBase;
		}
		// 获取当前时间
		function sqlGetCurrentTime(){
			$time = time();
			date_default_timezone_set('Asia/Shanghai');
			$time = date('Y-m-d H:m:s');
			return $time;
		}
		
	}
	
	
	
?>	