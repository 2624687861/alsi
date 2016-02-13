// angular directive

var ctrl = angular.module('appDirective',[]);

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
							if(res==2){
								alert('服务器繁忙,请稍后再试!');
							}else{
								alert('抱歉,服务器出错！');
							}
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
				// 允许出现法非字符 .
				//var regName = //;
				//var regValue = //;
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
					var f = JSON.parse(res);
					if(f.flag==1){
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
						
					}else if(f.flag==2){
						alert('抱歉，服务器繁忙，请稍后再试！');
					}else{
						alert('服务器挂了！');
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
// 更新 搜索结果 修改数据
ctrl.directive('updataAjax2',function(){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs){
			jQuery(ele[0]).on('click',function(){
				var url = 'phpConSql/upData.php';
				
				var a = scope.search.upData_model[0];
				var arr = [a.id+','+a.name+','+a.content];
				var iTypeNum = a.type;
				
				var json = {
					'upData': arr,
					'data_select': iTypeNum
				}
				// ajax 前后端 数据更新
				scope.service.postAnsycData(url,json)
				.done(function(res,status,xhr){
					// 问题 如果修改失败了，那么如何将双向数据绑定自动更新的数值更回去.
					var f = JSON.parse(res);
					if(f.flag==1){
						alert('修改成功!');
						a.date = f.time;
						scope.$apply('scope.search.dataResult');
					}else if(f.flag==2){
						alert('抱歉，服务器繁忙，请稍后再试！');
					}else{
						alert('服务器挂了！');
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
						for(var i=0;i<f.data_array.length;i++){
							var oData = f.data_array[i];
							oData.typeString = scope.search.numType(oData.type);
						}
						// 利用angularJs单页面优势,更新DataHttp公共服务
						scope.service.searchResult = f.data_array;
						window.location.href='#/searchResult';
						
						/*fnSearchGoBack();
						scope.search.onload = false;
						//scope.$apply('scope.search.onload');
						*/
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
// window.history.back
ctrl.directive('goBack',function(){
	return {
		restrict: 'A',
		link: function(scope,ele,attrs){
			jQuery(ele[0]).on('click',function(){
				window.history.back();
			});
		}
	}
});


// 指令

//html块,函数过程,基类指令做拓展.  参数
ctrl.directive('hz',function(){
	return {
		restrict: 'E',
		require: '^ngModel',
		scope: {
			page: '=ngModel',
		},
		controller: function($scope){
			this.numPage = function(a,obj2){
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
			};
			/* 这部分 重写.
			this.numPage2 = function(a){
				if(!iPage){
					return '';
				}
				$scope.bill.json.data_page = (iPage-1);
				$scope.service.getAnsycData($scope.bill.url,$scope.bill.json)
				.done(function(res,status,xhr){
					var a = JSON.parse(res);
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
			}*/
		},
		replace: false,
		templateUrl:"module_directive/hz_pagation.html",
	}
});
ctrl.directive('hzA',function(){
	return {
		restrict: 'A',
		require: '^hz',
		link: function(scope,ele,attrs,hzCtrl){
			jQuery(ele).on('click',function(){
				var a = attrs['hzA'];
				var b = hzCtrl.numPage(a,scope.page);
				//hzCtrl.numPage2(b);  重写区域
			});
		}
	}
});

/*
ctrl.directive('hz',function(){
	return {
		restrict: 'E',
		scope: {},
		controller: function($scope){
			// 得到要向后台发送的页码
			$scope.numPage = function(a,obj2){
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
			};
		},
		templateUrl: 'module_directive/hz_pagation.html',
		replace: true,
	}
});
ctrl.directive('hz-pagation',function(){
	return {
		restrict: 'A',
		require: '^hz',
		link: function(scope,ele,attrs,hz){
			
		}
	}
});*/






