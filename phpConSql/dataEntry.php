<!DOCTYPE >
<html>
	<head>
		<meta charset="utf-8" />
		<title>数据录入</title>
	</head>
	<body>
		<?php
			
			$select = $_GET['data_select'];	
			$key = $_GET['data_key'];
			$value = $_GET['data_value'];
			
			$dataBase = null;
			switch($select){
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
			
			// 打开数据库连接
			$link = mysql_connect('localhost', 'root', 'zydxiana');
			if(!$link){
				echo '抱歉请检查网络是否可用！';
				return '';
			}
			
			// 设置 字符编码
			mysql_query('set names utf8');
			
			// 选择数据库
			mysql_select_db('alsi',$link);
			
			// 编辑执行语句
			$statement = "insert into ".$dataBase."(dataName,DataContent)"."values('".$key."','".$value."')";
	
			// 实际解析执行
			mysql_query($statement);
			
			// 关闭数据库连接
			mysql_close($link);
			
		?>	
		
		
		<h1 id='show'>数据录入中,5秒后回到首页 </h1>
		
		<script>
			
			var oShow = document.getElementById('show');
			var count = 0;
			
			setTimeout(function(){
				
				count++;
				if(count>=5){
					window.location.href='/ALSI/index.html';
				}
				
				var num = 5;
				var second = num - count;
				
				oShow.innerHTML = "数据录入中,"+second+"秒后回到首页";
				
				setTimeout(arguments.callee,1000);
				
			},1000);
			
		</script>
		
	</body>
</html>



