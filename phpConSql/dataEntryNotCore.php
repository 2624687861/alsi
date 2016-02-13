<!DOCTYPE >
<html>
	<head>
		<meta charset="utf-8" />
		<title>数据录入 - 商务</title>
	</head>
	<body>
		<?php
		
			require_once('../tool/openSql.class.php');
			
			if(isset($_GET['data_select']) && isset($_GET['data_name']) && isset($_GET['data_number'])){
				$select = $_GET['data_select'];	
				$key = $_GET['data_name'];
				$value = $_GET['data_number'];
			}else{
				die('<script>document.write("传输数据方式非法.");</script>;');
			}
			
			$sql = new SQL();
			
			// 记录当前日期
			$time = $sql->sqlGetCurrentDay();
			$dataBase = 'finance';
			// 编辑执行语句
			$statement = "insert into ".$dataBase."(title,money,moDate)"."values('".$key."','".$value."','".$time."')";
	
			$retrun_result = $sql->sqlDml($statement);
			// 关闭数据库连接
			$sql->sqlClose();
			
		?>	
		
		<h1>
			<?php 
				switch($retrun_result){
					case 0: echo '录入数据失败,';
					break;
					case 1: echo '数据录入中,';
					break;
					case 2: echo '服务器忙碌中,请稍后录入数据,';
					break;
				}
			 ?>
			<span id='show'>5秒后回到首页 </span>
		</h1>
		
		
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
				
				oShow.innerHTML = second+"秒后回到首页";
				
				setTimeout(arguments.callee,1000);
				
			},1000);
			
		</script>
		
	</body>
</html>



