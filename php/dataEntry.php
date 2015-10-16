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
			
			$fileName = '../data/dataInfo.json';
			
			require_once('../tool/file.tool.php');
			fileExists($fileName,"[[],[],[],[],[]]");
			
			$file = file_get_contents($fileName);
		
			$json = json_decode($file);
			
			$jsonS = $json[$select];
			
			$length = count($jsonS);
			
			$json[$select][$length] = array('key'=>$key,'value'=>$value); 
			
			$json2 = json_encode($json);
			
			file_put_contents($fileName, $json2);
			
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







