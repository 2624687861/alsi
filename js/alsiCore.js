// javascript

jQuery.noConflict();

(function($){
	
	var obj = {};
	
	function ALSI(){
		
		// 开启
		this.startAlsi = function(){
			$('.alsi_wrap').removeClass('hide');
			$('.alsi_modal_bg').removeClass('hide');

			this.speakWay('欢迎您，我的主人，请问有什么可以为您服务的吗?',this.showSelect);
			
		}
		// 关闭
		this.closeAlsi = function(){
			$('.alsi_wrap').addClass('hide');
			$('.alsi_modal_bg').addClass('hide');
			$('.alsi_speaking').text('');
		}
		
		// 说话的方法
		this.speakWay = function(str,fnEnd){
			var iNum = 0;
			var iLength = str.length;
			var timer = setTimeout(function (){
				
				if(iNum>iLength){
					clearTimeout(timer);
					timer = null;
					if(fnEnd){
						fnEnd();
					}
					return '';
				}
				
				$('.alsi_speaking').text(function(){
					return str.substring(0,iNum);
				});
				iNum++;
				timer = setTimeout(arguments.callee,50);
				
			},50);
		}
		// 选项出现
		this.showSelect = function(){
			$('.alsi_select').removeClass('hide');
		}
		// 选项消失
		this.hideSelect = function(){
			$('.alsi_select').addClass('hide');
		}
		// alsi 挂机模式
		this.goToOther = function(){
			$('.alsi_modal_bg').fadeOut(500);
			$('.alsi_session').fadeOut(500);
			$('.alsi_core').css('right','0%');
			$('.alsi_wrap').css({
				'height': 'auto',
				'width': '500px',
				'bottom': '8%',
				'right': '2%'
			});
		}
		// alsi 功能模式
		this.serviceModal = function(){
			
		}
		
		// 功能的调用
		
		// 日期的访问
		
	}
	
	var ALSI = new ALSI();
	
	$(function(){
		
		fnStartAlsi();
		fnCloseAlsi();
		fnNothingClick();
		fnServiceModal();
		
		
	});
	
	// 开启  ALSI
	function fnStartAlsi(){
		$('#alsi').on('click',function(){
			ALSI.startAlsi();
		});
	}
	// 关闭  ALSI
	function fnCloseAlsi(){
		$('.close').on('click',function(){
			ALSI.closeAlsi();
		});
	}
	// 选择 nothing
	function fnNothingClick(){
		$('.btn_nothing').on('click',function(){
			ALSI.hideSelect();
			ALSI.goToOther();
		});
	}
	// 选择 serviceModal
	function fnServiceModal(){
		$('.btn_serviceModal').on('click',function(){
			alert('a');
		});
	}
	
	
	
})(jQuery);

















