// angularJs

var app = angular.module('myApp',['ngRoute','ngMessages','appCtrl','appDirective']);

app.config(function($routeProvider){
	
	$routeProvider.when('/',{
		
		templateUrl: 'tpls/index.html',
		controller: 'indexCtrl'
		
	}).when('/present',{
		
		templateUrl: 'tpls/present.html',
		
	}).when('/dataEntry',{
		
		templateUrl: 'tpls/dataEntry.html',
		controller: 'dataEntryCtrl'
		
	}).when('/extractEntertainment/:id',{
		
		templateUrl: 'tpls/extractEntertainment.html',
		controller: 'entertainmentCtrl'
		
	}).when('/dataOperate',{
		
		templateUrl: 'tpls/dataOperate.php',
		controller: 'dataOperateCtrl'
		
	}).when('/searchResult',{
		
		templateUrl: 'tpls/searchResult.html',
		controller: 'searchResultCtrl'
		
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
	
	// 储存空间 用于给search result 使用
	httpData.searchResult = null;
	
	return httpData;
	
});

// 过滤器 字符限制
app.filter('limitToStr',function(){
	return function(input,val){
		if(input.length>val){
			var input = input.substr(0,val)+'……';
		}
		return input;
	}
});
app.filter('limitToStr2',function(){
	return function(input,val){
		if(input.length>val){
			var input = input.substr(0,val);
		}
		return input;
	}
});

// 页码服务
app.factory('PageService',function(){
	
	var pageService = {};

	// 总页数
	pageService.createPages = function(num){
		var arr = [];
		if(num<=7){
			for(var i=0;i<num;i++){
				arr.push(i+1);
			}
		}else{
			arr = [1,2,3,4,5,6,7];
		}
		return arr;
	}
	// 页数跳转
	pageService.numPage = function(a,obj2){
		if(a==obj2.initial){
			return '';
		}
		var iPage = null;
		switch(a){
			case 'add':
				iPage = obj2.initial + 1;
				if(iPage>obj2.total){
					return '';
				}
			;break;
			case 'sign':
				iPage = obj2.initial - 1;
				if(iPage<1){
					return '';
				}
			;break;
			case 'jump':
				iPage = Number(jQuery.trim(jQuery(obj2.sClass).text()));
				if(iPage>obj2.total||iPage<1){
					alert('输入值无效.');
					return '';
				}
			;break;
			default:
				iPage = a;
			;break;
		}
		return iPage;
	}
	
	
	return pageService;
	
});




