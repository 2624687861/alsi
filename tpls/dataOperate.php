<?php
	
	$link = mysql_connect('localhost','root','zydxiana');
	if(!$link){
		echo '请检查网络是否正常连接！';
	}
	mysql_query('set names utf8');
	mysql_select_db('alsi');
	
	$select_studing = mysql_query('select * from studing');
	
	while($a = mysql_fetch_array($select_studing)){
		$b = array();
		$b['id'] = $a['id'];
		$b['name'] = $a['dataName'];
		$b['content'] = $a['dataContent'];
		
		echo '<div class="operate_data" data-id='.$b['id'].' data-name='.$b['name'].' data-content='.$b['content'].'></div>';
	}
	
	mysql_close($link);
	
?>	

<div class='container'>
	
	<header class='navbar navbar-default'>
		
		<ul class='navbar-nav nav'>
			<li>
				<a class='navbar-brand' href='javascript:void(0);'>sySteam</a>
			</li>
		</ul>
		
		<ul class='navbar-nav nav'>
			<li ng-class='{active:bill.currentModel==0}' ng-click='bill.selectTypeStyle(0)'>
				<a href='javascript:void(0);'>RemoveData</a>
			</li>
			<li ng-class='{active:bill.currentModel==1}' ng-click='bill.selectTypeStyle(1)'>
				<a href='javascript:void(0);'>UpData</a>
			</li>
			<li ng-class='{active:bill.currentModel==2}' ng-click='bill.selectTypeStyle(2)'>
				<a href='javascript:void(0);'>SearchData</a>
			</li>
		</ul>
		<ul class='navbar-nav nav navbar-right'  ng-hide='!search.hide'>
			<li ng-class='{active:bill.removeType==0}'>
				<a href='javascript:void(0)' ng-click='bill.selectType(0)'>学习</a>
			</li>
			<li ng-class='{active:bill.removeType==1}'>
				<a href='javascript:void(0)' ng-click='bill.selectType(1)'>娱乐</a>
			</li>
			<li ng-class='{active:bill.removeType==2}'>
				<a href='javascript:void(0)' ng-click='bill.selectType(2)'>动漫</a>
			</li>
			<li ng-class='{active:bill.removeType==3}'>
				<a href='javascript:void(0)' ng-click='bill.selectType(3)'>资料</a>
			</li>
			<li class='mar_r_20' ng-class='{active:bill.removeType==4}'>
				<a href='javascript:void(0)' ng-click='bill.selectType(4)'>单词</a>
			</li>
		</ul>
		
	</header>
	<!-- 内容 -->
	<div ng-hide='!search.hide'>
		<div ng-if='bill.remove_model'>
				<form class='form-horizontal'>
				<!-- checkbox 模板 -->
				<div class='checkbox col-md-3 col-xs-6' ng-repeat='item in bill.remove_model'>
					<label data-id='{{item.id}}' data-index='{{$index}}'>
						<input type='checkbox' click-select/>
						<span ng-bind='item.name' title='{{item.content}}'></span>
					</label>
				</div>
				<div class='form-group' ng-show='bill.currentModel==0'>
					<li class='col-xs-12 mar_t_10 mar_b_60'>
						<a class='btn btn-default pull-right' click-remove>Remove</a>
					</li>
				</div>
				<div class='form-group' ng-show='bill.currentModel==1'>
					<li class='col-xs-12 mar_t_10 mar_b_60'>
						<a class='btn btn-default pull-right' data-toggle="modal" data-target="#myModal" click-updata>upData</a>
					</li>
				</div>
			</form>
		</div>
		<div  ng-if='!bill.remove_model' class='text-muted'>
			抱歉,当前没有数据！
		</div>	
	</div>
	
	<!-- searchData -->
	<div ng-hide='search.hide'>
		<h2 class='font_w_b c_blank_1 t_shadow_1'>搜索数据</h2>
		<form class='form-horizontal col-md-10 col-md-offset-1 col-xs-12'>
			
			<div class='checkbox'>
				<label class='font_18'>
					<input type='checkbox' value='database' />
					<span class='text-muted h_hover a_cursor'>数据库</span>
				</label>
			</div>
			<div class='checkbox dis_in_bl pad_r_5'>
				<label class='font_18'>
					<input type='checkbox' value='studing' />
					<span class='text-muted h_hover a_cursor'>学习</span>
				</label>
			</div>
			<div class='checkbox dis_in_bl pad_lr_5'>
				<label class='font_18'>
					<input type='checkbox' value='entertainment' />
					<span class='text-muted h_hover a_cursor'>娱乐</span>
				</label>
			</div>
			<div class='checkbox dis_in_bl pad_lr_5'>
				<label class='font_18'>
					<input type='checkbox' value='animation' />
					<span class='text-muted h_hover a_cursor'>动漫</span>
				</label>
			</div>
			<div class='checkbox dis_in_bl pad_lr_5'>
				<label class='font_18'>
					<input type='checkbox' value='means' />
					<span class='text-muted h_hover a_cursor'>资料</span>
				</label>
			</div>
			<div class='checkbox dis_in_bl pad_lr_5'>
				<label class='font_18'>
					<input type='checkbox' value='word' />
					<span class='text-muted h_hover a_cursor'>单词</span>
				</label>
			</div>
			<br />
			<br />
			<br />
			<div class='form-group form-group-lg'>
				<label class='sr-only'>关键字搜索</label>
				<section class='input-group'>
					<span class='input-group-addon font_18'>
						<i  class='glyphicon glyphicon-search' aria-hidden='true'></i>
					</span>
					<input class='form-control' type='search' placeholder='请输入关键字' />
					<span class='input-group-addon font_18'>
						<a href='javascript:void(0);' class='text-muted fam'>点击搜索</a>
					</span>
				</section>
			</div>
		</form>
	</div>
	
</div>

<!-- Modal -->
<div class="modal fade" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        	<span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title" id="myModalLabel">UpData</h4>
      </div>
      <div class="modal-body">
      	<!-- 更新模板 --><!-- 缺少效验过程 -->
      	<section class='operate_updata_model' ng-repeat='item in bill.upData_model'>
      		<div class='form-group has-feedback'>
	       		<label class='sr-only'>数据名</label>
	       		<input type='text' ng-model='item.name' required="required" maxlength="24" class='form-control' />
	       	</div>
	       	<div class='form-group'>
	       		<label class='sr-only'>数据值</label>
	       		<input type='text' ng-model='item.content' required="required" maxlength="120" class='form-control' />
	       	</div>
      	</section>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" updata-ajax>Save changes</button>
      </div>
    </div>
  </div>
</div>



