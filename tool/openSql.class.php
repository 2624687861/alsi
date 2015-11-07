<?php
	
	class SQL{
		
		private $host = 'localhost';
		private $userName = 'root';
		private $userPassword = 'zydxiana';
		private $db = 'alsi';
		private $link;
		
		// 构造函数 链接数据库管理器 选择数据库 设置编码
		function SQL(){
			$this->link = mysql_connect($this->host,$this->userName,$this->userPassword);
			if(!$this->link){
				die('error:'.mysql_error());
			}
			mysql_select_db($this->db,$this->link);
			mysql_query('set names utf8');
		}
		// 关闭数据库  暂时不手动释放资源
		function sqlClose(){
			mysql_close($this->link);
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
				case 9: $dataBase = array('studing','entertainment','animation','means','word');
				break;
			}
			return $dataBase;
		}
		// 获取当前时间
		function sqlGetCurrentTime(){
			$time = time();
			date_default_timezone_set('Asia/Shanghai');
			$time = date('Y-m-d H:i:s');
			return $time;
		}
		// 执行dml语句  操作数据语句
		function sqlDml($sql){
			$b = mysql_query($sql,$this->link);
			if(!$b){
				return 0; // 失败
			}else{
				if(mysql_affected_rows($this->link)>0){
					return 1; // 成功
				}else{
					return 2; // 没有影响行数
				}
			}
		}
		// 执行dql语句  搜索语句
		function sqlDql($sql){
			$res = mysql_query($sql,$this->link);
			return $res;
		}
		
	}
	
	
	
?>	