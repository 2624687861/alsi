<?php
	
	
	function fileExists($filename,$str){
		if(!file_exists($filename)){
			$file = fopen($filename,'w');
			$json3 = $str;
			fwrite($file, $json3);
			fclose($file);
		}
	}
	
	
	
	
?>	