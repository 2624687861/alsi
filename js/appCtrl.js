// angularJS

var ctrl = angular.module('appCtrl',[]); 

// index
ctrl.controller('indexCtrl',function($scope,HttpData){
	
	$scope.bill = {};
	$scope.bill.searchData = null;
	$scope.bill.searchWarning = null;
	
	$scope.service = HttpData;
	// 重写 alert
	window.alert = function(str){
		if(str){
			$scope.bill.searchWarning = str;
			jQuery('.alert').slideDown();
			return '';
		}
		jQuery('.alert').slideUp();
	}
	
	$scope.submitSearchData = function(){
		var a = $scope.bill.searchData;
		if(!a){
			alert('不可为空');
			return '';
		}
		var url = 'phpConSql/searchDataHandler.php';
		var json = {
			'searchArea': 9,
			'searchValue': a,
		};
		this.service.getAnsycData(url,json)
		.done(function(res,status,xhr){
			var f = JSON.parse(res)
			if(f.flag==1){
				$scope.service.searchResult = f.data_array;
				window.location.href = '#/searchResult';
			}else{
				alert('抱歉,服务器繁忙,请稍后再试!');
			}
		})
		.fail(function(xhr,errorTxt,errorStatus){
			alert('抱歉,数据库出错!');
			console.log(xhr,errorTxt,errorStatus);
		});
	}
	$scope.focusSearchData = function(){
		alert();
	}
	
});

// data entry
ctrl.controller('dataEntryCtrl',function($scope){
	
	// messages model 
	$scope.bill = {};
	
});

// extract entertainment
ctrl.controller('entertainmentCtrl',function($scope,$routeParams,HttpData,PageService){

	$scope.bill = {};
	$scope.service = HttpData;
	
	$scope.bill.data = [];  // 数据模型
	// 路由 获取参数
	$scope.bill.id = $routeParams['id'];    // 4为单词 显示
	// 显示分支
	$scope.bill.exists = false;
	
	// 页码
	$scope.page = {
		'total': 0, // 总页码
		'pages': null, // 实际分组
		'initial': 0, // 初始化 页码 1
		'sClass': ".page_href",  // 获取跳转页码的class
		'url': 'phpConSql/getData.php',   // 要发送目标的url地址
	};
	
	// 异步使用参数
	$scope.bill.url = 'phpConSql/getData.php';
	$scope.bill.json = {'data_select': $scope.bill.id,'data_page':$scope.page.initial};
	
	// 初始化数据 
	$scope.service.getAnsycData($scope.bill.url,$scope.bill.json)
	.done(function(res,status,xhr){
		var a = JSON.parse(res);
		if(!a.rows){
			$scope.bill.exists = true;
			$scope.$apply();
			return '';
		}
		
		var arr = [];
		for(var i in a.data){
			var obj1 = {};
			obj1.id = a.data[i].id;
			obj1.showName = a.data[i].name;
			obj1.showContent = a.data[i].content;
			arr.push(obj1);
		}
		
		$scope.bill.data = arr;
		$scope.bill.exists = false;
		$scope.page.total = Math.ceil(a.rows/30);
		$scope.page.initial = 1;
		$scope.$apply();
		
	})
	.fail(function(xhr,errText,errStatus){
		alert(errText+':'+errStatus);
	});
	
	// 跳转页数
	$scope.numPage = function(a){
		var iPage = PageService.numPage(a,$scope.page);
		if(!iPage){
			return '';
		}
		$scope.bill.json.data_page = (iPage-1);
		$scope.service.getAnsycData($scope.bill.url,$scope.bill.json)
		.done(function(res,status,xhr){
			console.log(res);
			var a = JSON.parse(res);
			console.log(a);
			var arr = [];
			for(var i in a.data){
				var obj1 = {};
				obj1.id = a.data[i].id;
				obj1.showName = a.data[i].name;
				obj1.showContent = a.data[i].content;
				arr.push(obj1);
			}
			
			$scope.bill.data = arr;
			$scope.page.initial = iPage;
			$scope.$apply();
			
		})
		.fail(function(xhr,errText,errStatus){
			alert(errText+':'+errStatus);
		});
	}
	
	// 挂 监听
	$scope.$watch('bill.data',function(newValue,old,scope){
		$scope.bill.data = newValue;
	});
	$scope.$watch('bill.exists',function(newValue,old,scope){
		$scope.bill.exists = newValue;
	});
	$scope.$watch('page.total',function(newValue,old,scope){
		$scope.page.total = newValue;
	});
	$scope.$watch('page.initial',function(newValue,old,scope){
		$scope.page.initial = newValue;
		// 拿到新页码 决定显示区域
		$scope.page.pages = PageService.changePages(newValue,$scope.page);
	});
	
});

// dataOperate
ctrl.controller('dataOperateCtrl',function($scope,HttpData){
	
	// 查询  -> 子类改/删
	$scope.search = {};
	
	$scope.search.hide = true;
	
	// 删除/修改 bill
	$scope.bill = {};
	$scope.service = HttpData;
	// 从服务继承模型
	if(!HttpData.removeData){
		$scope.bill.remove_model = HttpData.removeData = $scope.service.getLocalhostData('.operate_data');
	}else{
		$scope.bill.remove_model = HttpData.removeData;
	}
	
	// 判定当前模式 remove/upData/searchData 0/1/2
	$scope.bill.currentModel = 0;
	
	// 初始化 更新数据 模型
	$scope.bill.upData_model = null;
	
	// 记录选中数量
	$scope.bill.removeLength = 0;
	// 记录当前分类
	$scope.bill.removeType = 0;
	
	// 搜索数据 全选记录
	$scope.search.selected = false;
	$scope.search.error = false;
	$scope.search.onload = false;
	
	// 切换大分类
	$scope.bill.selectTypeStyle = function(i){
		if($scope.bill.currentModel==i){
			return '';
		}
		// search hide 切换
		if(i == 2){
			$scope.search.hide = false;
		}else{
			$scope.search.hide = true;
		}
		// 切换 选中清空
		jQuery('[data-index]').removeAttr('data-label-remove');
		jQuery('input[type=checkbox]').attr('checked',false);
		$scope.bill.removeLength = 0;
		$scope.bill.currentModel = i;
	}
	
	// 切换详细分类
	$scope.bill.selectType = function(i){
		if(i==$scope.bill.removeType){
			return '';
		}
		var url = 'phpConSql/removeData.php';
		var json = {
			'data_select': i,
		};
		HttpData.getAnsycData(url,json)
		.done(function(res,status,xhr){
			
			// 如果没有数据提前终结  (有待测试)
			if(res==0){
				$scope.bill.remove_model = 0;
				$scope.$apply('bill.remove_model');
				return '';
			}
			
			// 成功后的数据回调 替换数据模型
			var f = JSON.parse(res);
			
			var arr = [];
			for(var j in f){
				var obj1 = {};
				obj1.id = f[j].id;
				obj1.name = f[j].name;
				obj1.content = f[j].content;
				arr.push(obj1);
			}
			
			$scope.bill.remove_model = arr;
			$scope.bill.removeType = i;
			$scope.$apply();

		})
		.fail(function(xhr,errorTxt,errorStatus){
			alert('抱歉,服务器错误,请稍后再试！');
			console.log(xhr,errorTxt,errorStatus);
		});
	}
	
	// 数字与类型
	$scope.search.numType = function(a){
		var sNumType = '';
		switch(a){
			case '0': sNumType = '学习';
			break;
			case '1': sNumType = '娱乐';
			break;
			case '2': sNumType = '动漫';
			break;
			case '3': sNumType = '资料';
			break;
			case '4': sNumType = '单词';
			break;
		}
		return sNumType;
	}
	
	// 挂监听 删除 更新类
	$scope.$watch('bill.remove_model',function(n,o,scope){
		$scope.bill.remove_model = n;
	});
	$scope.$watch('bill.removeType',function(n,o,scope){
		$scope.bill.removeType = n;
	});
	$scope.$watch('bill.upData_model',function(n,o,scope){
		$scope.bill.upData_model = n;
	});
	$scope.$watch('bill.removeLength',function(n,o,scope){
		$scope.bill.removeLength = n;
	});
	
});

// search result
ctrl.controller('searchResultCtrl',function($scope,HttpData){
	
	$scope.service = HttpData;
	
	$scope.search = {};
	
	$scope.search.dataResult = $scope.service.searchResult;
	
	// 是否查询到结果.
	$scope.search.hide = null;
	$scope.search.hide = $scope.search.dataResult&&$scope.search.dataResult.length?true:false;
	
	// 更新 搜索结果 数据
	$scope.search.upData_model = null;
	$scope.searchShow = function(oItem){
		$scope.search.upData_model = [];
		$scope.search.upData_model.push(oItem);
	}
	
	// 删除 搜索结果 数据
	$scope.searchRemove = function(index,oItem){
		var bConfirm = confirm('确认删除?');
		if(bConfirm){
			var url = 'phpConSql/removeDataRows.php';
			var json = {'deleteStr':oItem.id,'data_select':oItem.type};
			$scope.service.getAnsycData(url,json)
			.done(function(res,status,xhr){
				var f = JSON.parse(res);
				if(f==1){
					alert('删除成功!');
					$scope.search.dataResult.splice(index,1);
					$scope.$apply('scope.search.dataResult');
				}else if(f==2){
					alert('抱歉，服务器繁忙，请稍后再试！');
				}else{
					alert('服务器挂了！');
				}
			})
			.fail(function(xhr,errorTxt,errorStatus){
				alert('抱歉,数据库出错!');
				console.log(xhr,errorTxt,errorStatus);
			});
		}
	}
	
	// 挂监听
	$scope.$watch('search.dataResult',function(n,o,scope){
		$scope.search.dataResult = n;
	});
	
});

// finance
ctrl.controller('financeCtrl',function($scope,HttpData){
	
	$scope.bill = {
		'row': null,									// 一共有多少条数据
		'aData': [],
		'data_page': 0,
	};
	
	
	// 有待 优化 getData / addData 合并公共部分
	$scope.getData = function(){
		
		$scope.fnData();
		
	}
	
	$scope.addData = function(){
		++$scope.bill.data_page;
		
		$scope.fnData();
		
	}
	
	$scope.fnData = function(){
		
		var url = "phpConSql/getDataNotCore.php",
		json = {"data_page":$scope.bill.data_page,"data_select":0};
		var a = HttpData.getAnsycData(url,json)
		a.done(function(res,status,xhr){
			var c = JSON.parse(res);
			$scope.bill.row = c.rows;
			
			if(c.data.length==0){
				alert('没有数据了');
				return '';
			}
			
			for(var i in c.data){
				$scope.bill.aData.push(c.data[i]);
			}

			$scope.$apply($scope.bill.aData);
		})
		.fail(function(xhr,errorText,errorStatus){
			console.log(errorText,errorStatus);
		});
		
	}
	
	$scope.getData();
	
//  挂监听                                                 
//	$scope.$watch('bill.aData',function(n,o,scope){
//		$scope.bill.aData = n;
//	});
	
	// $watch 监听针对的是$scope下的数据模型发生变化，从而产生的大规模数据计算变化，监听数据模型,回调执行函数,进行其他运算
	// $apply 强制针对指令中没有及时更新的相对数据的视图，异步没能及时更新的相对数据的视图,强制刷新一次数据模型相对的视图
	
});

// commercial
ctrl.controller('commercialCtrl',function($scope){
	
	$scope.bill = {};
	
	$scope.bill.name = null;
	$scope.bill.number = null;
	
	$scope.bill.bool = null;
	
	//  不基于 message add_data.data_number.$pristine||add_data.data_number.$valid 手动判定
	$scope.observeNum = function(){
		var reg = /\d+/;
		if(reg.test($scope.bill.number)&&$scope.bill.number>0){
			$scope.bill.bool =  false;
		}else{
			$scope.bill.bool =  true;
		}
	}
	
});



































