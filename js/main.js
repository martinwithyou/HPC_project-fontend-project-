$(document).ready(function(){
	login_init(!(!!getCookie('username') && !!getCookie('X-CSRFToken')));
});

function login_init(bool){
	if(bool){
		$('#forget-password').click(function(){
			$('form[name="login"]').hide();
			$('form[name="forget"]').show();
		});
		$('#register-btn').click(function(){
			$('form[name="login"]').hide();
			$('form[name="sign"]').show();
		});
		$('#return_sign_login').click(function(){
			$('form[name="login"]').show();
			$('form[name="sign"]').hide();
		});
		$('#return_forget_login').click(function(){
			$('form[name="login"]').show();
			$('form[name="forget"]').hide();			
		});
		$('#btn_login').click(function(){
			var username=$('[name="userName"]').val(),
			    password=$('[name="password"]').val();

			username.length*password.length>0?login_validate(username,password):login_info('信息输入不完整');    
		});
		
	} else {
		// userInit(getCookie('username'));
		login_init(true);
		$.ajaxSetup({ 
				cache: false, 
				contentType : 'application/json',
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
				}
			});

	}
}

			function setCookie(c_name,value,expiredays){
				var exdate=new Date()
				exdate.setDate(exdate.getDate()+expiredays)
				document.cookie=c_name+ "=" +escape(value)+
				((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
			}

			function getCookie(c_name){
				if (document.cookie.length>0)
				  {
				  c_start=document.cookie.indexOf(c_name + "=")
				  if (c_start!=-1)
				    { 
				    c_start=c_start + c_name.length+1 
				    c_end=document.cookie.indexOf(";",c_start)
				    if (c_end==-1) c_end=document.cookie.length
				    return unescape(document.cookie.substring(c_start,c_end))
				    } 
				  }
				return ""
			}

function refreshTaskList(d) {
	$('#header_task_bar').html(_.template($('#userNavTaskTpl').html())(d));
}	

function login_info(str){
	$('[role="loginAlert"]').html(str).show();
}	

function login_validate(user,pass){
	$('[role="loginAlert"]').hide();
	$.ajax({
		type:'POST',
		url:'/api/login/',
		data:JSON.stringify({
			'user':user,
			'pass':pass
		}),
		success:function(data){
			data.role?adminInit(user):userInit(user);
			$.ajaxSetup({ 
				cache: false, 
				contentType : 'application/json',
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
				}
			});
			setCookie('username',user,1);
			setCookie("X-CSRFToken", getCookie('csrftoken'),1);
		},
		error:function(data){
			login_info(user+'出错了');
		}
	});
}	

var d={
		'datas':[]
	};

function userInit(username){
	$('[role="logout"]').unbind('click');
	$('[role="logout"]').click(function(){
		setCookie('username','',-1);
		setCookie('X-CSRFToken','',-1);
		$('#loginView').show();
		$('#userView').hide();
		login_init(true);
	});
	$('#loginView').hide();
	$('#userView').show();
	refreshTable('/api/file/');
	$('li[data-role]').click(function(){
		$('.working_area').hide();
		$('.working_area[role="'+$(this).data('role')+'"]').show();
	});
	$('#btn_upload').fileupload({
        url:'/api/file/',
        progressInterval:1000,
        add: function (e, data) {
        	$('#upload_files').empty();
        	$('<p/>').text(data.files[0].name).appendTo($('#upload_files'));
            data.context = $('<button/>',{text:'开始上传',name:data.files[0].name,class:'btn btn-primary'})
            	.appendTo($('#upload_files'))
                .click(function () {
                	var obj={
		        		'name':$(this).attr('name'),
		        		'percentage':'0%'
		        	};
		        	d.datas.push(obj);
                    $('#upload_files').empty();
                    data.submit();
                });
        },
        progress: function (e, data) {
	        var progress = parseInt(data.loaded / data.total * 100, 10);
	        d.datas[_.findIndex(d.datas,function(o){return o.name == data.context[0].name;})].percentage=progress+"%";
	        refreshTaskList(d);
	        if(progress >= 100){
	        	_.remove(d.datas,function(o){return o.name == data.context[0].name;});
	        	refreshTaskList(d);
	        }
	    },
        done: function (e, data) {
            $('<p/>').text('上传成功.').appendTo($('#upload_files'));
            refreshTable('/api/file/');
        }
    });
}

function refreshTable(url){
	$.ajaxSetup({ 
				cache: false, 
				contentType : 'application/json',
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
				}
			});
	$.ajax({
		url:url,
		type:'List',
		success:function(data){
			var showData=data.data;
			var tableData={'datas':[]};
			var url_file=url;
			showData.map(function(i){
				var obj={
					'name':i,
					'date':'2016-11-04',
					'size':Math.ceil(Math.random()*1000)+'KB',
					'url':url_file
				};
				tableData.datas.push(obj);
			});
			$('#fileTable').html(_.template($('#tableTpl').html())(tableData));
			$('.deleteFile').unbind('click');
			$('.deleteFile').click(function(){
				var name=$(this).data('file');
				deleteFile(name,url_file);
			});
		}
	});
}

function adminInit(username){
	$('[role="logout"]').unbind('click');
	$('[role="logout"]').click(function(){
		setCookie('username','',-1);
		setCookie('X-CSRFToken','',-1);
		$('#loginView').show();
		$('#adminView').hide();
		login_init(true);
	});
	$('#loginView').hide();
	$('#adminView').show();	
	hostUsed();
	$('#storage').click(function(){
		hostUsed();
	});
	$('#health').click(function(){
		status();
	});
	$('#pool').click(function(){
		osd();
	});
	$('#user').click(function(){
		user();
	});
	$('.dashList li').click(function(){
		$('.dashList li').removeClass('active');
		$(this).addClass('active');
		$('.dashboardItem').hide();
		$('.'+$(this).data('target')).show();
	});
}

function deleteFile(name,url){
	$('#info').html("确认删除:"+name+"?");
	$('#confirm').unbind('click');
	$('#confirm').click(function(){
		$('#confirm').button('loading');
		$.ajax({
			url:url+name,
			type:'DELETE',
			success:function(){
				$('#confirm').button('reset');
				$('#info').html("删除"+name+"成功.");
				var url_folder=url.split('file')[0]+'files'+url.split('file')[1];
				refreshTable('/api/file/');
			}
		});
	});
	$('#check').modal('show');
}

function hostUsed(){
	var myChart = echarts.init(document.getElementById('hostUsed'));
	var option = {
	    title : {
	        text: '存储空间占用情况'
	    },
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        },
	        formatter: function (params){
	            return params[0].name + '<br/>'
	                   + params[0].seriesName + ' : ' + params[0].value + '<br/>'
	                   + params[1].seriesName + ' : ' + (params[1].value + params[0].value);
	        }
	    },
	    legend: {
	        selectedMode:false,
	        data:['已用', '总共']
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : ['Host1','Host2','Host3','Host4','Host5','Host6']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            boundaryGap: [0, 0.1]
	        }
	    ],
	    series : [
	        {
	            name:'已用',
	            type:'bar',
	            stack: 'sum',
	            barCategoryGap: '50%',
	            itemStyle: {
	                normal: {
	                    color: '#359bfb',
	                    barBorderColor: '#359bfb',
	                    barBorderWidth: 6,
	                    barBorderRadius:0,
	                    label : {
	                        formatter:function(p){
	                          return p.value+'GB';
	                        },
	                        show: true, position: 'insideTop'
	                    }
	                }
	            },
	            data:[260, 200, 220, 120, 100, 80]
	        },
	        {
	            name:'总共',
	            type:'bar',
	            stack: 'sum',
	            itemStyle: {
	                normal: {
	                    color: '#fff',
	                    barBorderColor: '#359bfb',
	                    barBorderWidth: 6,
	                    barBorderRadius:0,
	                    label : {
	                        show: true, 
	                        position: 'top',
	                        formatter: function (params) {
	                            for (var i = 0, l = option.xAxis[0].data.length; i < l; i++) {
	                                if (option.xAxis[0].data[i] == params.name) {
	                                    return option.series[0].data[i] + params.value+'GB';
	                                }
	                            }
	                        },
	                        textStyle: {
	                            color: 'tomato'
	                        }
	                    }
	                }
	            },
	            data:[40, 80, 50, 80,80, 70]
	        }
	    ]
	};
	myChart.setOption(option);
                 
}

function status(){
	var option = {
	    title: {
	        text: '集群状态'
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            boundaryGap : false,
	            data : ['周一','周二','周三','周四','周五','周六','周日']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'CPU',
	            type:'line',
	            stack: '总量',
	            areaStyle: {normal: {}},
	            data:[12, 32, 10, 34, 90, 23, 70]
	        },
	        {
	            name:'MEM',
	            type:'line',
	            stack: '总量',
	            areaStyle: {normal: {}},
	            data:[20, 82, 91, 34, 90, 30, 10]
	        },
	        {
	            name:'NET',
	            type:'line',
	            stack: '总量',
	            areaStyle: {normal: {}},
	            data:[150, 232, 201, 154, 190, 330, 410]
	        }
	    ]
	};

	var myChart = echarts.init(document.getElementById('hostUsed'));
	myChart.setOption(option);
}

function osd(){
	var myChart = echarts.init(document.getElementById('hostUsed'));
	var option = {
	    title : {
	        text: 'OSD空间占用情况'
	    },
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        },
	        formatter: function (params){
	            return params[0].name + '<br/>'
	                   + params[0].seriesName + ' : ' + params[0].value + '<br/>'
	                   + params[1].seriesName + ' : ' + (params[1].value + params[0].value);
	        }
	    },
	    legend: {
	        selectedMode:false,
	        data:['已用', '总共']
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : ['OSD1','OSD2','OSD3','OSD4','OSD5','OSD6']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            boundaryGap: [0, 0.1]
	        }
	    ],
	    series : [
	        {
	            name:'已用',
	            type:'bar',
	            stack: 'sum',
	            barCategoryGap: '50%',
	            itemStyle: {
	                normal: {
	                    color: '#359bfb',
	                    barBorderColor: '#359bfb',
	                    barBorderWidth: 6,
	                    barBorderRadius:0,
	                    label : {
	                        formatter:function(p){
	                          return p.value+'GB';
	                        },
	                        show: true, position: 'insideTop'
	                    }
	                }
	            },
	            data:[260, 200, 220, 120, 100, 80]
	        },
	        {
	            name:'总共',
	            type:'bar',
	            stack: 'sum',
	            itemStyle: {
	                normal: {
	                    color: '#fff',
	                    barBorderColor: '#359bfb',
	                    barBorderWidth: 6,
	                    barBorderRadius:0,
	                    label : {
	                        show: true, 
	                        position: 'top',
	                        formatter: function (params) {
	                            for (var i = 0, l = option.xAxis[0].data.length; i < l; i++) {
	                                if (option.xAxis[0].data[i] == params.name) {
	                                    return option.series[0].data[i] + params.value+'GB';
	                                }
	                            }
	                        },
	                        textStyle: {
	                            color: 'tomato'
	                        }
	                    }
	                }
	            },
	            data:[40, 80, 50, 80,80, 70]
	        }
	    ]
	};
	myChart.setOption(option);
                 
}

function user(){
	var html='<table class="table table-bordered"><tr><th>用户名</th><th>存储使用</th><th>角色</th></tr><tr><td>guest</td><td><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="2" aria-valuemin="0" aria-valuemax="100" style="width: 2%;">2%</div></div></td><td>用户</td></tr></table>';
	$('#hostUsed').html(html);			
}