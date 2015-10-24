// angularJS

var ctrl = angular.module('appCtrl',[]); 

// index
ctrl.controller('indexCtrl',function($scope){
	
});

// data entry
ctrl.controller('dataEntryCtrl',function($scope){
	
	// messages model 
	$scope.bill = {};
	
});

// extract entertainment
ctrl.controller('entertainmentCtrl',function($scope,$routeParams,HttpData){

	$scope.bill = {};
	$scope.service = HttpData;
	
	$scope.bill.data = [];  // 数据模型
	// 路由 获取参数
	$scope.bill.id = $routeParams['id'];    // 4为单词 显示
	// 显示分支
	$scope.bill.exists = false;
	// 异步使用参数
	$scope.bill.url = 'phpConSql/getData.php';
	$scope.bill.json = {'data_select': $scope.bill.id};
	
	$scope.service.getAnsycData($scope.bill.url,$scope.bill.json)
	.done(function(res,status,xhr){
		var a = JSON.parse(res);

		if(!a){
			$scope.bill.exists = true;
			$scope.$apply();
			return '';
		}
		
		for(var i in a){
			a[i].showName = a[i].name;
			a[i].showContent = a[i].content;
		}
		
		$scope.bill.data = a;
		$scope.bill.exists = false;
		$scope.$apply();
		
	})
	.fail(function(xhr,errText,errStatus){
		alert(errText+':'+errStatus);
	});
	
	// 挂 监听
	$scope.$watch('bill.data',function(newValue,old,scope){
		$scope.bill.data = newValue;
	});
	$scope.$watch('bill.exists',function(newValue,old,scope){
		$scope.bill.exists = newValue;
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
	// 监听 搜索类
	
	
});
// 记录选中
ctrl.directive('clickSelect',function(){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs){
			jQuery(ele[0]).on('click',function(){
				var _this = jQuery(this);
				
				if(_this.prop('checked')){
					_this.parent().attr('data-label-remove',true);
					scope.bill.removeLength++;
				}else{
					_this.parent().removeAttr('data-label-remove');
					scope.bill.removeLength--;
				}
				
				scope.$apply();
			});
		}
	}
});
// 提交数据
ctrl.directive('clickRemove',function(){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs){
			jQuery(ele[0]).on('click',function(){

				if(scope.bill.removeLength){
					
					var bConfirm = window.confirm('确认删除');
					
					if(!bConfirm){
						return '';
					}
					
					var aRemove = jQuery('[data-label-remove]');
					var str = '';
					var aStr = [];
					for(var i=0;i<aRemove.length;i++){
						var a = aRemove.eq(i);
						if(!str){
							str += a.attr('data-id');
							aStr.push(a.attr('data-id'));
							continue;
						}
						str += (',' + a.attr('data-id'));
						aStr.push(a.attr('data-id'));
					}

					var url = 'phpConSql/removeDataRows.php';
					var json = {
						'deleteStr': str,
						'data_select': scope.bill.removeType
					};
					// 删除实际操作
					scope.service.getAnsycData(url,json)
					.done(function(res,status,xhr){
						if(res==1){
							// 数据模型的刷新 
							var aModel = scope.bill.remove_model;
							for(var i=0;i<aModel.length;i++){
								var oModel = aModel[i].id;
								for(var j=0;j<aStr.length;j++){
									var oStr = aStr[j];
									if(oStr == oModel){
										scope.bill.remove_model.splice(i,1);
										// 清空一开始 php 传入的数据
										if(!scope.bill.removeType){
											jQuery('.operate_data').eq(i).remove();
										}
										break;
									}
								}
							}
							scope.$apply('bill.remove_model');
						}else{
							alert('抱歉,服务器出错！');
							console.log(res);
						}
					})
					.fail(function(xhr,errorTxt,errorStatus){
						alert('抱歉,数据库出错!');
						console.log(xhr,errorTxt,errorStatus);
					});
					
				}else{
					alert('请选择需要删除项!');
				}
				
			});
		}
	}
});
// 更新数据 进更新层
ctrl.directive('clickUpdata',function(){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs){
			jQuery(ele[0]).on('click',function(e){
				if(scope.bill.removeLength){
					var aRemove = jQuery('[data-label-remove]');
					var arr = [];
					for(var i=0;i<aRemove.length;i++){
						var obj1 = {};
						var a = aRemove.eq(i).children('span');
						obj1.id = aRemove.eq(i).attr('data-id');
						obj1.index = aRemove.eq(i).attr('data-index');
						obj1.name = a.text();
						obj1.content = a.attr('title');
						arr.push(obj1);
					}
					// 更新 更新模型
					scope.bill.upData_model = arr;
					scope.$apply('bill.upData_model');
					
				}else{
					alert('请选择更新项!');
					e.preventDefault();
					return false;
				}
			});
		}
	}
});
// 提交更新数据
ctrl.directive('updataAjax',function(){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs){
			jQuery(ele[0]).on('click',function(){
				
				var url = 'phpConSql/upData.php';
				//var json = angular.toJson(scope.bill.upData_model);
				var a = scope.bill.upData_model;
				var arr = [];
				var aIndex = [];
				for(var i in a){
					var str = '';
					var b = a[i];
					// 为空情况判定
					if(!b.name||!b.content){
						alert('抱歉！数据不可为空！');
						return '';
					}
					str = b.id+','+b.name+','+b.content;
					arr.push(str);
					// 记录传递的各个节点索引
					aIndex.push(b.index);
				}
				var json = {
					'upData': arr,
					'data_select': scope.bill.removeType
				}
				
				scope.service.postAnsycData(url,json)
				.done(function(res,status,xhr){
					
					if(res){
						// 节点更新
						var aRemove = jQuery('[data-label-remove]');
						for(var i in aRemove){
							var a = aRemove.eq(i);
							a.removeAttr('data-label-remove')
							.children('input').removeAttr('checked');
						}
						alert('修改成功!');
						// 模型同步 数据更新
						for(var i=0;i<aIndex.length;i++){
							// 主模型中记录的第0个[3,4,5] = 更新模型的第0个 [0,1,2] 数据选中与节点选中的数据更替
							scope.bill.remove_model[aIndex[i]].name = scope.bill.upData_model[i].name;
							scope.bill.remove_model[aIndex[i]].content = scope.bill.upData_model[i].content;
						}
						// 清空 更新模型  清空记录数量
						scope.bill.upData_model = null;
						scope.bill.removeLength = 0;
						scope.$apply();
						
					}else if(res==-1){
						alert('抱歉，服务器繁忙，请稍后再试！');
					}else{
						alert('服务器挂了！');
						console.log(res);
					}
				})
				.fail(function(xhr,errorTxt,errorStatus){
					alert('抱歉,数据库出错!');
					console.log(xhr,errorTxt,errorStatus);
				});
				
				jQuery('.close').trigger('click');
			});
		}
	}
});
// 搜索 数据库 全选
ctrl.directive('searchClickdata',function(){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs){
			jQuery(ele[0]).on('click',function(){
				var _this = jQuery(ele[0]).get(0);
				var aSearch = jQuery('.search_clickdata').get();
				if(_this.checked){
					for(var i=0;i<aSearch.length;i++){
						aSearch[i].checked = true;
					}
					scope.search.selected = true;
				}else{
					for(var i=0;i<aSearch.length;i++){
						aSearch[i].checked = false;
					}
					scope.search.selected = false;
				}
				scope.$apply('scope.search.selected');
			});
		}
	}
});
// 搜索 单个 选中
ctrl.directive('searchClickitem',function(){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs){
			jQuery(ele[0]).on('click',function(){
				var _this = jQuery(ele[0]).get(0);
				if(_this.checked){
					var aSearch = jQuery('.search_clickdata').get();
					for(var i=0;i<aSearch.length;i++){
						if(!aSearch[i].checked){
							return '';
						}
					}
					// 如果所有的判定都为真的情况下 执行. 否则打断.
					var oDataBase = jQuery('.search_clickitem').get(0);
					oDataBase.checked = true;
					scope.search.selected = true;
					scope.$apply('scope.search.selected');
				}else{
					if(scope.search.selected){
						var oDataBase = jQuery('.search_clickitem').get(0);
						oDataBase.checked = false;
						scope.search.selected = false;
						scope.$apply('scope.search.selected');
					}
				}
			});
		}
	}
});
// 点击搜索
ctrl.directive('searchClickbtn',function(){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs){
			jQuery(ele[0]).on('click',function(){
				if(scope.search.onload){
					return '';
				}
				var oValue = jQuery('.search_keyword');
				if(!oValue.val()){
					fnSearchValidate('请输入搜索相关');
					return '';
				}
				var reg = /[<>\*\|\/\?\:\"\"\;\'\'\-\+\~\!\@\#\$\%\^\&\*\(\)\}\{\]\[\,]/gi;
				if(reg.test(oValue.val())){
					fnSearchValidate('所输入的格式有误,请勿包含<>~!@#$%^&*()_+{}|[]\/等非法字符');
					return '';
				}
				var arr = [];
				if(!scope.search.selected){
					var aSearch = jQuery('.search_clickdata').get();
					var bSelect = false;
					for(var i=0;i<aSearch.length;i++){
						if(aSearch[i].checked){
							bSelect = true;
							arr.push(i);
						}
					}
					if(!bSelect){
						fnSearchValidate('请选择搜索范围');
						return '';
					}
				}
				
				// 获取参数
				if(scope.search.selected){
					var searchArea = 9;   // 数据库
				}else{
					var searchArea = arr.join(','); //0:学习,1:娱乐,2:动漫,3:资料,4:单词
				}
				var url = 'phpConSql/searchDataHandler.php',
					json = {
						'searchArea': searchArea,
						'searchValue': oValue.val(),
					};
				
				// 成功后修改 scope 的值
				scope.service.getAnsycData(url,json)
				.done(function(res,status,xhr){
					var f = JSON.parse(res);
					if(f.flag){
						
						// 实际获取数据之后 切换显示.
						alert('OK');
						
						fnSearchGoBack();
						scope.search.onload = false;
						scope.$apply('scope.search.onload');
					}else{
						alert('抱歉,网路繁忙,请稍后再试.');
					}
				})
				.fail(function(xhr,errorText,errorStatus){
					console.log(errorText,errorStatus);
				});
				
				// 所有的return都没有执行,则执行.
				fnSearchValidate('加载数据中，请稍等……');
				scope.search.onload = true;
				scope.$apply('scope.search.onload');
				
			});
			// 判定执行封装 出错
			function fnSearchValidate(str){
				var oTitle = jQuery('.search_error_title'),
					oError = jQuery('.search_error');
				oTitle.text(str);
				oError.stop().animate({
					'left': '0px',
					'opacity': '1',
					'filter': 'alpha(opacity: 100)',
				});
				scope.search.error = true;
				scope.$apply('scope.search.error');
			}
			// 判定执行封装 归位
			function fnSearchGoBack(){
				var oError = jQuery('.search_error');
				oError.stop().animate({
					'left': '-200px',
					'opacity': '0',
					'filter': 'alpha(opacity: 0)',
				});
				scope.search.error = false;
				scope.$apply('scope.search.error');
			}
		}
	}
});
// 用户输入
ctrl.directive('searchKeyword',function(){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs){
			jQuery(ele[0]).on('focus',function(){
				if(scope.search.onload){
					return '';
				}
				if(scope.search.error){
					jQuery('.search_error').stop().animate({
						'left': '-100px',
						'opacity': '0',
						'filter': 'alpha(opacity: 0)',
					});
					scope.search.error = false;
					scope.$apply('scope.search.error');
				}
			});
		}
	}
});










