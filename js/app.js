// angularJs

var app = angular.module('myApp',['ngRoute','ngMessages','appCtrl','appDirective']);

app.config(function($routeProvider){
	
	$routeProvider.when('/',{
		
		templateUrl: 'tpls/index.html',
		controller: 'indexCtrl'
		
	}).when('/dataEntry',{
		
		templateUrl: 'tpls/dataEntry.html',
		controller: 'dataEntryCtrl'
		
	}).when('/extractEntertainment/:id',{
		
		templateUrl: 'tpls/extractEntertainment.html',
		controller: 'entertainmentCtrl'
		
	}).when('/dataOperate',{
		
		templateUrl: 'tpls/dataOperate.php',
		controller: 'dataOperateCtrl'
		
	}).otherwise({
		
		redirectTo: '/'
		
	});
	
});



// 公共服务部分
app.factory('HttpData',function($http){
	
	var httpData = {};
	
	// 返回 jqXHR 对象  获取方案
	httpData.getAnsycData = function(url,json){
		return jQuery.ajax({
			'url': url,
			'type': 'GET',
			'data': json
		});
	}
	// 返回 jqXHR 对象  修改方案
	httpData.postAnsycData = function(url,json){
		return jQuery.ajax({
			'url': url,
			'type': 'POST',
			'data': json
		});
	}
	
	// 拿取数据方案 返回 数据对象
	httpData.getLocalhostData = function(sClass){
		var aClass = jQuery(sClass);
		if(aClass.length==0){
			alert('抱歉,目前没有数据！');
			return 0;
		}
		var arr = [];
		for(var i=0;i<aClass.length;i++){
			var obj1 = {};
			var a = aClass.eq(i);
			obj1.id = a.attr('data-id');
			obj1.name = a.attr('data-name');
			obj1.content = a.attr('data-content');
			arr.push(obj1);
		}

		return arr;
	}
	// 开辟空间 储存数据  一开始 .operate_data 不存在拿不到数据 所以 实际页面也换为 null.
	httpData.removeData = null;
	//httpData.getLocalhostData('.operate_data');
	
	
	return httpData;
	
});

// 过滤器 字符限制
app.filter('limitToStr',function(){
	return function(input,val){
		if(val){
			var input = input.substr(0,val)+'……';
		}
		return input;
	}
});






