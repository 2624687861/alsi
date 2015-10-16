// javascript

jQuery.noConflict();

(function($){
	
	// ALSI 类
	function CreateALSI(){
		
		this.open = function(){
			$('.alsi').removeClass('hide');
			info.show = true;
			info.count++;
		}
		this.close = function(){
			$('.alsi').addClass('hide');
			info.show = false;
		}
		this.speaking = function(tell){
			$('.alsi_speakArea').removeClass('hide');
			var s = tell;
			var i = 0;
			var timer = null,timer2 = null;
			timer = setTimeout(function(){
				$('.alsi_speak1').text(function(){
					var iS = s.slice(0,i);
					i++;
					
					return iS;
				});
				if(i>s.length){
					clearTimeout(timer);
					clearTimeout(timer2);
					timer = null;
					timer2 = null;
					return '';
				}
				var timer2 = setTimeout(arguments.callee,30);
			},200);
		}
		this.speakEnd = function(){
			$('.alsi_speakArea').addClass('hide');
			$('.alsi_speak1').text('');
		}
		
	}
	
	var ALSI = new CreateALSI();
	
	$(function(){
		
		fnOff();
		fnALSIOpen();
		fnALSIClose();
		
	});
	
	// 关闭 退出网页
	function fnOff(){
		$('#window_off').on('click',function(){
			var a = window.confirm("exit,是否退出？");
			if(a){
				window.close();
				console.log('a');
			}
		});
	}
	// 打开 ALSI
	function fnALSIOpen(){
		$('#alsi').on('click',function(){
			if(info.show){
				return '';
			}
			if(info.dateNew && info.count>2){
				fnDateOld();
				if(!info.date){
					return '';
				}
				info.date = false;
				info.count = 1;
			}else{
				fnDateNew();
			}
			
			if(info.count!=0){
				ALSI.open();
				setTimeout(function(){
					ALSI.speaking(tells['three']);
				},500);
				return '';
			}
			$.post('php/recordData.php',function(responseText,status,xhr){
				var s = $.trim(responseText);
				ALSI.open();
				setTimeout(function(){
					if(s=='true'){
						ALSI.speaking(tells['initial']);
					}else{
						ALSI.speaking(tells['primary']);
					}
				},500);
			}).error(function(xhr,status,err){
				alert(xhr.status+':'+status+':'+err);
			});
		});
	}
	// 关闭 ALSI
	function fnALSIClose(){
		$('.alsi_close').on('click',function(){
			ALSI.close();
			ALSI.speakEnd();
		});
	}
	
	
	// 记录基本信息
	var info = {
		'count': 0,
		'show': false,
		'dateNew': null,
		'dateOld': null,
		'dateValue': null,
		'date':false,
	}
	
	// 回复  之后抽离 单独 json
	var tells = {
		'initial': '欢迎您,我的主人……',
		'primary': '欢迎回来,我的主人……',
		'three': '主人,叫我有什么事呢？',
		'four': '啊啊啊啊啊,主人，到底叫什么有什么事！',
	}
	
	// 封装tool
	var fn = {
		'numTen': fnToolNumTen,
	}
	
	function fnToolNumTen(a){
		if(a<10){
			return '0'+a;
		}else{
			return a;
		}
	}
	
	// 封装函数主体
	function fnDateNew(){
		var oDate = new Date();
		var iDate = fn.numTen(oDate.getHours())+''+fn.numTen(oDate.getMinutes())
		+fn.numTen(oDate.getSeconds());
		info.dateNew = iDate;
	}
	function fnDateOld(){
		info.dateOld = info.dateNew;
		fnDateNew();
		info.dateValue = info.dateNew - info.dateOld;
		if(info.dateValue<1000){
			ALSI.open();
			setTimeout(function(){
				ALSI.speaking(tells['four']);
			},500);
		}else{
			info.date = true;
		}
		
	}
	
	
	
	
	
	
})(jQuery);



