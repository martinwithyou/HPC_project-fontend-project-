/*
 * © Copyright Lenovo 2015.
 *
 * LIMITED AND RESTRICTED RIGHTS NOTICE:
 *
 * If data or software is delivered pursuant a General Services Administration
 * "GSA" contract, use, reproduction, or disclosure is subject to
 * restrictions set forth in Contract No. GS-35F-05925.
*/
define([
	'marionette',
	'bootstrap',
	'echartjs',
	'plotly',
	'datatables',
	'datatables_bootstrap',
	'dataTables_tableTools',
	'utils/constants/urlConstants',
	'utils/constants/constants',
	'utils/eventBus',
	'customUI/monitor/widgets/singleNodeDetails/nodeInfo/nodeInfoView',
	'customUI/monitor/widgets/listView/weight/modal/modalView',
	'text!./templates/rackViewTmpl.mustache',
	'i18n!./nls/rack',
	'css!./style/rack.css'
	],function(Marionette ,bootstrap, echartsjs,plotly, datatables, datatables_bootstrap, dataTables_tableTools, urlConstants, constants, eventBus,nodeInfoView, modelView,template, nls){
		return Marionette.ItemView.extend({
			template:template,
			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			onDestroy: function(){
		    	$("body").css("background-color", "#F6F6F4");
		  	},

            onRender:function(){
				var data_;
				var energy_key = true;
				var $table = $("#contrast_table");
				var physical_3d_key = false;
				var name=this.options.name;
				var id=this.options.id;
				var nodes_rack_coordinate = [0,0,22,45,66,88,111,132,153,176,197,219,241,264,287,310,331,354,378,400,423,446,468,492,516,538,561,584,605,627,651,673,696,720,742,766,790,810,832,854,877,899,922];
				var nodes_chassis_coordinate = [0,6,6,34,34,63,63,91,91,120,120,148,148,177,177];
				var nodes_status_modes = new modelView({el:$("#nodes_status_model")});
				nodes_status_modes.render();
				// wtt
				var top=($(window).height()-622)/2+"px";
				$(".modal-dialog").css({"top":top});
				// wtt---end
				$("#header").css("min-width","1310px");
				$("#footer").css("min-width","1310px");
				App.router.navigate('#admin/monitor/physical/'+id);
				//---------------面包屑
		        $("#physicals-physical-name").text(nls.crumbs_name + name);
		        //---------------面包屑 物理视图按钮 返回所有机架页面
		        $("#physicals-view").on("click",function(){
		        	App.router.navigate('#admin/monitor/physical',true);
		        	$("#monitor_physical_view").trigger('click');
		        });
				//---------------按钮组
				$("#physicals_body>.btn-group>.btn").on("click",function(){
					//---------------机架图片和颜色的切换
					if($(this).attr("node_display") == "default"){
						$(".nodes img").css('display',"block");
						$(".nodes .node_status").css('display',"block");
						$("#color_model").css('display',"none");
						physical_3d_fun(false);
					}else {
						$(".nodes img").css('display',"none");
						if($(".contrast_table").css("display")=="block"){
							if ($(this).attr("node_display") != "cpu_core_used" && (myBrowser() == "Chrome" || myBrowser() == "FF" || myBrowser() == "Opera" || myBrowser() == "Safari" || myBrowser() == "IE10版本以上")) {
									physical_3d_fun(true);
							} else {
								physical_3d_fun(false);
							}
						}
						$(".nodes .node_status").css('display',"none");
						$("#color_model").css('display',"block");
					}
					//----------------能耗趋势图显示与否的切换
					if($(this).attr("node_display") == "energy"){
						$("#rack_information_right").css("visibility","inherit");
					}else {
						$("#rack_information_right").css("visibility","hidden");
					}
					$("#physicals_body>.btn-group>.btn").removeClass('active');
					$(this).addClass('active')
					$("#rack_content").attr("node_display",$(this).attr("node_display"));
					rack_color();
					table();
					console.log($(this).attr("node_display")+nls.console_text);

				});
				//----------------视图按钮
				$("#physical_rack").click(function(){
					$("#physical_content .physical-title>.physical-title-tab").removeClass('active');
					$(this).addClass('active');
					$(".monitor_rack").css('display','block');
					$(".contrast_table").css('display','none');
				});
				//----------------数据按钮
				$("#physical_data").click(function(){
					$("#physical_content .physical-title>.physical-title-tab").removeClass('active');
					$(this).addClass('active');
					$(".contrast_table").css('display','block');
					$(".monitor_rack").css('display','none');
					if($("#rack_content").attr("node_display") == "default" || $("#rack_content").attr("node_display") == "cpu_core_used"){
						physical_3d_fun(false);
					}else {
						if (myBrowser() == "Chrome" || myBrowser() == "FF" || myBrowser() == "Opera" || myBrowser() == "Safari" || myBrowser() == "IE10版本以上") {
								physical_3d_fun(true);
						} else {
							physical_3d_fun(false);
						}
					}
					table();
				});
				//---------------------3D按钮状态切换
				function physical_3d_fun(key){
					if(key){
						$("#physical_3d").addClass("physicals_content_btn_action");
						$("#physical_3d").css("cursor","default");
					}else {
						$("#physical_3d").removeClass("physicals_content_btn_action");
						$("#physical_3d").css("cursor","no-drop");
					}
					physical_3d_key = key;
				}
				//------------------3d视图及按钮点击
				function plotly_url(){
					var plotly_url_end  = "";
					switch ($("#rack_content").attr("node_display")){
						case "default":
							plotly_url_end  = "";
							break;
						case "temperature":
							plotly_url_end  = "/tendency/hour/temperature/";
							break;
						case "energy":
							plotly_url_end  = "/tendency/hour/energy/";
							break;
						case "cpu_usage":
							plotly_url_end  = "/tendency/hour/cpu/";
							break;
						case "load":
							plotly_url_end  = "/tendency/hour/load/";
							break;
						case "memory_usage":
							plotly_url_end  = "/tendency/hour/memory/";
							break;
						case "disk_usage":
							plotly_url_end  = "/tendency/hour/disk/";
							break;
						case 'network':
							plotly_url_end  = "/tendency/hour/network/";
							break;
						case "cpu_core_used":
							plotly_url_end  = "/runningjobs/";
							break;

						default:
							plotly_url_end  = "";
							break;
					}
					return plotly_url_end;
				}
				function refreshPlotly() {
					var node_array=[];
					var _compare=$('#contrast_table').DataTable().rows('.selected').data();
					$.each(_compare,function(index,item){
						var user={id:item.id,name:item.hostname}
						node_array.push(user);
					});
					var plotly_data=[];
					$.each(node_array,function(i,v){
						//var url="static/js/customUI/monitor/widgets/physicals/rack/data/data"+v.id+".json";
						var url= urlConstants.nodes + v.id + plotly_url();
						$.ajax({
							type : "GET",
							url : url,
							async:false,
							dataType : "json",
							success : function (data) {
								var y=[];
								var z=[];
								var x=[];
								//data.history.sort(compare("time"));
								$.each(data.history,function(k,value){
									var y_inner=[analysisTime(value.time),analysisTime(value.time)];
									var x_inner=[v.name+"",v.name+" "];
									if($("#rack_content").attr("node_display") == "network"){
										var valueAdd=Number(value.value.split(",")[0])+Number(value.value.split(",")[1]);
										var z_inner=[valueAdd,valueAdd];
									} else {
										var z_inner=[value.value,value.value];
									}
									y.push(y_inner);
									z.push(z_inner);
									x.push(x_inner);
								});
								var plotly_obj= {
									x:x,
									y:y,
									z:z,
									name: nls.plotly_name,
									type: 'surface',
									opacity:0.9,
									showscale: true
								};
								plotly_data.push(plotly_obj);
							},
							error:function(){
								console.log("refresh plotly error")
							}
						});
					});
					var layout = {
						title: 'Time Plot',
						showlegend: true,
						autosize: true,
						width:700,
						height:600,
						margin: {
							autoexpand: false,
							l: 0,
							r: 0,
							b:20,
							t: 0,
							pad:0
						},
						scene: {
							xaxis: {title: 'x',type:'category'},
							yaxis: {title: 'y',type:'category'},
							zaxis: {title: 'z'}
						}
					};
					plotly.newPlot('3d_plotly', plotly_data, layout,{showLink: false});
				}
				function analysisTime(data){
					var time=new Date(parseInt(data) * 1000);
					var hour=time.getHours();
					if (hour < 10) {
						hour = "0" + hour;
					};
					var minutes=time.getMinutes();
					if (minutes < 10) {
						minutes = "0" + minutes;
					};
					var seconds=time.getSeconds();
					if (seconds < 10) {
						seconds = "0" + seconds;
					};
					var timeDisplay = hour + ":" + minutes + ":" + seconds;
					return timeDisplay;
				};
				function compare(propertyName) {
					return function(object1, object2) {
						var value1 = object1[propertyName];
						var value2 = object2[propertyName];
						if (parseInt(value2) < parseInt(value1)) {
							return 1;
						} else if (parseInt(value2) > parseInt(value1)) {
							return - 1;
						} else {
							return 0;
						}
					}
				};
				$("#physical_3d").css({"background": "rgb(249, 249, 249)"});
				$("#physical_3d").off("click");

				$("#physical_3d").on("click",function(event){
					if(!physical_3d_key){
						return false;
					}
					var _this=this;
					var node_len=$(".DTTT_selected.selected").length;
					if(node_len >= 1) {
						$(_this).css({"background": "rgb(173, 173, 173)"});
						if($("#3d_plotly")){
							$("#3d_plotly").empty();
						}
						$('#plotly_Modal').modal('show');
					} else {
						$("#plotly_Modal").modal('hide');
						alert(nls.plotly_alert)
					}
				});
				$('#plotly_Modal').on('shown.bs.modal',function(){
					var node_array=[];
					var _compare=$('#contrast_table').DataTable().rows('.selected').data();
					$.each(_compare,function(index,item){
						var user={id:item.id,name:item.hostname}
						node_array.push(user);
					});
					var plotly_data=[];
					$.each(node_array,function(i,v){
						//var url="static/js/customUI/monitor/widgets/physicals/rack/data/data"+v.id+".json";
						var url= urlConstants.nodes + v.id + plotly_url();
						//console.log(v.id);
						$.ajax({
							type : "GET",
							url : url,
							async:false,
							dataType : "json",
							success : function (data) {
								var y=[];
								var z=[];
								var x=[];
								data.history.sort(compare("time"));
								$.each(data.history,function(k,value){
									var y_inner=[analysisTime(value.time),analysisTime(value.time)];
									var x_inner=[v.name+"",v.name+" "];
									if($("#rack_content").attr("node_display") == "network"){
										var valueAdd=Number(value.value.split(",")[0])+Number(value.value.split(",")[1]);
										var z_inner=[valueAdd,valueAdd];
									} else {
										var z_inner=[value.value,value.value];
									}
									y.push(y_inner);
									z.push(z_inner);
									x.push(x_inner);
								});
								var plotly_obj= {
									x:x,
									y:y,
									z:z,
									name: nls.plotly_name,
									type: 'surface',
									opacity:0.9,
									showscale: true
								};
								plotly_data.push(plotly_obj);
							},
							error:function(){
								console.log("plotly error")
							}
						});
					});
					var layout = {
						title: 'Time Plot',
						showlegend: false,
						autosize: false,
						width:700,
						height:600,
						margin: {
							autoexpand: false,
							l: 0,
							r: 0,
							b:20,
							t: 0,
							pad:0
						},
						scene: {
							xaxis: {title: 'Node',type:'category'},
							yaxis: {title: 'Time',type:'category'},
							zaxis: {title: 'Power'}
						}
					};
					plotly.newPlot('3d_plotly', plotly_data, layout,{showLink: false});

					eventBus.on(constants.refreshRackPlotly,refreshPlotly);
				});

				$("button[data-dismiss='modal']").on("click",function(){
					$("#physical_3d").css({"background": "rgb(249, 249, 249)"});
				})
				function myBrowser(){
					var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
					var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
					var isIE_low = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
					//判断是否IE10以下浏览器
					var isIE_high = userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv") > -1;
					//var isIE_high = userAgent.indexOf("Trident") &&  userAgent.indexOf("rv") > -1; //判断是否IE11浏览器
					var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
					var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
					var isChrome = userAgent.indexOf("Chrome") > -1; //判断是否Safari浏览器
					if (isIE_high) {
						return "IE10版本以上";
					}
					if (isFF) {
						return "FF";
					}
					if (isOpera) {
						return "Opera";
					}
					if (isSafari) {
						return "Safari";
					}
					if (isChrome) {
						return "Chrome";
					}
				}
				// -------------3d按钮及视图结束

				init();
				//--------------------初始化获取数据
				function init(){
					$.ajax({
						url:urlConstants.racks + id + "/",
						//url:"static/js/customUI/monitor/widgets/physicals/rack/data/rack.json",
						dataType:"json",
						type:"get",
						success:function(data){
							//-----------------判断数据是否获取成功
							if(data.ret == "success"){
								data_ = data;
								$("#information_left_name").text(data.rack.name);
								$("#information_left_posi").text(data.rack.location.row_index + nls.rack_rows + data.rack.location.col_index);
								$("#information_left_nodes").text(data.rack.node_num);
								$("#information_left_busy").text(data.rack.node_busy);
								$("#information_left_free").text(data.rack.node_free);
								$("#information_left_occupy").text(data.rack.node_used);
								$("#information_left_off").text(data.rack.node_off);

								var temp = data.rack.chassis;
								//-----------------判断机架中chassia的个数
								if(data.rack.chassis.length > 0){
									add_chassis(temp);
								}
								//-----------------判断机架中server的个数
								if(data.rack.nodes.length > 0){
									classification(data,"server");
								}
								//-----------------判断机架中switch的个数
								if(data.rack.switches.length > 0){
									classification(data,"switch");
								}
								energy_trend();
								//---------------隐藏能耗趋势图
								$("#rack_information_right").css("visibility","hidden");
								table();
							}else{
								console.log(nls.init_rack);
							}
						},
						error:function(err){
							console.log(nls.init_err);
						}
					})
				}
				//------------------插入chassis
				function add_chassis(temp){
					for (var i=0;i<temp.length;i++) {
						var num = parseInt(temp[i].location.u);
						$("#monitor_rack_left").append(
							"<div class='chassis' style='bottom:"
							+ nodes_rack_coordinate[num] +
							"px;'><img src='"
							+ "static/js/customUI/monitor/widgets/physicals/rack/img/rack_img/re_chassis.png" +
							"' /><div class='chassis_cont'><div id='chassis_"
							+ temp[i].id +
							"' class='monitor_rack_public'></div></div></div>"
						);//-----------------所有图片处需要进行变量处理，从数据中读取图片名称。
					};
				}

				//-----------------对数据进行分类    chssis or rack
				function classification(data,type){
					//console.log(JSON.stringify(data));
					var node = data.rack;
					var chassis_temp = [];
					var hash_temp = [];
					var data_type;
					if(type == "server"){
						data_type = node.nodes;
					}else {
						data_type = node.switches;
					}
					//-----------------将nodes进行刀箱分类
					for (var i=0;i<data_type.length;i++) {
						if(type == "server" && node.nodes[i].power_status == "On"){
							node.nodes[i].network = nls.network_in+ node.nodes[i].network.split(",")[0] +"K,"+ nls.network_out + node.nodes[i].network.split(",")[1]+"K";
						}
						if(data_type[i].location.chassis_id != "null"){
							//-----------------有刀箱
							chassis_temp.push(data_type[i]);
						}else{
							//-----------------没有刀箱
							hash_temp.push(data_type[i])
						}
					}
					if(node.chassis.length > 0){
						for (var i=0;i<node.chassis.length;i++) {
							//-----------------将刀箱的ID传给解析的方法
							chassis_fun(chassis_temp,node.chassis[i].id,type);
						}
					}
					if(hash_temp.length > 0){
						hash_fun(hash_temp,type)
					}

				}
				//-----------分析属于机架中的data
				function hash_fun(arr,type){
					var server_temp = {};//-----------------定义server1U  包含0.5U-L
					server_temp.nodes = [];
					var server_temp_r = {};//-----------------定义server 0.5U-R
					server_temp_r.nodes = [];
					var switch_arr = {};//-----------------定义switch
					switch_arr.nodes = [];
					//console.log(JSON.stringify(arr));
					for(var i=0;i<arr.length;i++){
						var stmp = parseInt(arr[i].location.height);
						arr[i].location.height = stmp * 22;

						if(arr[i].location.width != "1"){

							var temp = arr[i].location.u.substr(parseInt(arr[i].location.u.indexOf(";"))+1,1);
							var num = Number(arr[i].location.u.substring(0,arr[i].location.u.indexOf(";")));

							arr[i].location.u = nodes_rack_coordinate[num];
							if (temp == "L") {
								server_temp.nodes.push(arr[i]);
							} else{
								server_temp_r.nodes.push(arr[i]);
							}
						}else{
							arr[i].location.u = nodes_rack_coordinate[parseInt(arr[i].location.u)];
							server_temp.nodes.push(arr[i]);
						}

					}
					if(server_temp_r.nodes.length > 0){
						fun_nodes(server_temp_r,type,'#monitor_rack_left',"R","no");
					}
					if(server_temp.nodes.length > 0){
						fun_nodes(server_temp,type,'#monitor_rack_left',"L","no");
					}
					//fun_nodes(switch_arr,'#monitor_rack_left',"L","no");
				}
				//---------------分析属于chssis中的data
				function chassis_fun(arr,id,type){
					//-----------------刀箱左边的node节点数组
					var nodes_left = {};
					nodes_left.nodes = [];
					//-----------------刀箱右边的node节点的数组
					var nodes_right = {};
					nodes_right.nodes = [];

					for (var i=0;i<arr.length;i++) {
						if(id == arr[i].location.chassis_id){
							//------------------判断刀箱中node的高度
							var num = parseInt(arr[i].location.height);
							arr[i].location.width = (Number(arr[i].location.width) * 100 - 0.5)/100;
							arr[i].location.height = num * 22 + (num - 1) * 6;
							//-----------------判断刀箱中的node具体分布，并查找其位置。
							if(arr[i].location.u%2 == 0){
								arr[i].location.u = nodes_chassis_coordinate[Number(arr[i].location.u)];
								nodes_right.nodes.push(arr[i]);
							}else{
								arr[i].location.u = nodes_chassis_coordinate[Number(arr[i].location.u)];
								nodes_left.nodes.push(arr[i]);
							}
						}
					}

					//var L ="L",R = "R";
					if(nodes_left.nodes.length > 0){
						fun_nodes(nodes_left,type,"#chassis_"+id,"L","yes");
					}

					if(nodes_right.nodes.length > 0){
						fun_nodes(nodes_right,type,"#chassis_" + id,"R","yes");
					}

				}
				//---------------node具体插入方法及绑定事件
				function fun_nodes(data,type,id,LR,C){
					//---------------插入节点的具体方法
					//---------------data 节点数据，需要有nodes数组，
					//----------------插入节点的类型 server or switch
					//---------------id  string 承载插入DOM节点的id 需要加(#)号
					//---------------LR  string 表示该组数据代表额节点在机架或chssis中的左右位置，默认为左(L);
					//---------------C  string 表示该组数据是否在chssis中，yes or no
					var data = data;
					//------------循环插入节点
					for (var i=0;i<data.nodes.length;i++) {
						if(type == "server"){
							var add_class = "nodes",
								temperature=data.nodes[i].temperature,
								energy=data.nodes[i].energy,
								cpu_usage=data.nodes[i].cpu_usage,
								memory_usage=data.nodes[i].memory_usage,
								load=data.nodes[i].load,
								network=data.nodes[i].network,
								disk_usage=data.nodes[i].disk_usage,
								cpu_core_used=data.nodes[i].cpu_core_used;
						}else {
							var add_class = "switchs",
								temperature="",
								energy="",
								cpu_usage="",
								memory_usage="",
								load="",
								network="",
								disk_usage="",
								cpu_core_used="";

						}
						var po = 0,
							pa = 3,
							node_status_color = "#EA2D00",
							node_id=data.nodes[i].id,
							node_name = data.nodes[i].hostname,
							status=data.nodes[i].power_status,
							machinetype = data.nodes[i].machinetype,
							frontimage = "static/js/customUI/monitor/widgets/physicals/rack/img/rack_img/" + data.nodes[i].frontimage;
							u=Number(data.nodes[i].location.u),
							width=Number(data.nodes[i].location.width)*100,
							height=Number(data.nodes[i].location.height),
							node_status_top = (height-10)/2;

						//-----------节点位置定位---左
						if(LR == "R"){
							po = 50;
						}
						//-----------节点内边距---上
						if(C == "yes"){
							pa = 0;
						}
						//-----------节点开机状态颜色
						if(status == "On"){
							node_status_color = "#9AFD23";
						}
						$(id).append(
							"<div class='nodes_half "+ add_class +"' name='"+ node_name +"' id='"+add_class+"_"+ node_id + "' status='"
							+ status +"'type='"+ type +"'temperature='"+ temperature +"℃'energy='"+ energy +"W'cpu_usage='"
							+ cpu_usage +"%'memory_usage='"+ memory_usage +"%' load='"+ load +"'network='"
							+ network +"' disk_usage='"+ disk_usage +"%'cpu_core_used='"+ cpu_core_used +"'style='padding-top: "
							+ pa +"px;left:"+ po +"%;bottom:"+ u +"px;width: "+ width +"%;height: "
							+ height +"px;'><div style='width: 100%;height: 100%;'><img src='"
							+ frontimage+"'/><i class='node_status'style='background-color: "+ node_status_color +";top:"
							+ node_status_top +"px;'></i></div></div>"
						);
					}
					$(".nodes").off();
					//-----------点击节点渲染详细信息
					$(".nodes").on("click",function(){
						$("#rack_node_information").removeClass("hidden");
						$("#rack_node_information").addClass("block");
						$("#body").attr('data-node_id',$(this).attr('id').split('_')[1]);
						var nodeinfo = new nodeInfoView({el:"#rack_node_information"});
						nodeinfo.render();
						//alert($(".nodes").length);
					});
					//-----------鼠标悬浮节点信息
					$(".nodes_half").hover(function(){
						$('#suspension').css('display',"block");
						//----------------------悬浮框位置
						$(document).mousemove(function(e){
							$('#suspension').css('top',e.pageY+10).css('left',e.pageX +10);
						});
//						//--------------------判断悬浮框动态信息内容
						var attribute_variable = $("#rack_content").attr('node_display');
						var attribute_name = "";
						switch (attribute_variable){
							case "default":
								attribute_name = nls.default_type + " ：";
								attribute_variable = nls.nodes_status_on;
								break;
							case "temperature":
								attribute_name = nls.temperature + " ：";
								break;
							case "energy":
								attribute_name = nls.energy + " ：";
								break;
							case "cpu_usage":
								attribute_name = nls.cpu_usage + " ："
								break;
							case "load":
								attribute_name = nls.nlsload + " ："
								break;
							case "memory_usage":
								attribute_name = nls.memory_usage + " ：";
								break;
							case "disk_usage":
								attribute_name = nls.disk_usage + " ：";
								break;
							case 'network':
								attribute_name = nls.network + " ：";
								break;
							case "cpu_core_used":
								attribute_name = nls.cpu_core_used + " ：";
								break;

							default:
								attribute_name = ""
								attribute_variable = ""
								break;
						}
						if($("#rack_content").attr('node_display') != "default"){
							attribute_variable = $(this).attr(attribute_variable);
						}

						if( $(this).attr("status") != "On" &&
							$("#rack_content").attr('node_display') != "temperature" &&
							$("#rack_content").attr('node_display') != "energy"
						){
							attribute_name = nls.default_type + " ：";
							attribute_variable = nls.nodes_status_off;
						}

						//-----------------判断是否是switch
						if($(this).attr("type") == "switch" && $("#rack_content").attr('node_display') != "default"){
							attribute_name = nls.default + "：";
							attribute_variable = "switch";
						}

						//---------------悬浮框插入动态信息
						$('#suspension').html(
							"<li style='list-style: none;'>"+nls.suspension_li+"<span>"
							+ $(this).attr('name') +
							"</span></li><li style='list-style: none;'>"
							+ attribute_name +
							"<span>"
							+ attribute_variable +
							"</span></li>"
						);
					},function(){$('#suspension').css('display',"none")});

					//---------------------------------
				}
				//---------------数据列表
				function table(){
					var temp = $("#rack_content").attr('node_display');
					var table_coll = "";
					var company = "";//----------table data 单位
					switch (temp){
						case "default":
							$("#contrast_table_content").text(nls.default_type)
							break;
						case "temperature":
							$("#contrast_table_content").text(nls.temperature)
							company = "℃";
							break;
						case "energy":
							$("#contrast_table_content").text(nls.energy)
							company = "W";
							break;
						case "cpu_usage":
							$("#contrast_table_content").text("CPU")
							company = "%";
							break;
						case "load":
							$("#contrast_table_content").text("load")
							break;
						case "memory_usage":
							$("#contrast_table_content").text(nls.memory_usage)
							company = "%";
							break;
						case "disk_usage":
							$("#contrast_table_content").text(nls.disk_usage)
							company = "%";
							break;
						case 'network':
							$("#contrast_table_content").text(nls.network)
							break;
						case "cpu_core_used":
							$("#contrast_table_content").text(nls.cpu_core_used)
							break;
						default:
							break;
					}
					if (temp == "default"){
						table_coll = "power_status";
					}else {
						$table.fnClearTable();
						table_coll = temp;
					}
					$table.dataTable({
						bDestroy:true,
						paging: false,
						searching: false,
						scrollY: 860,
						info:false,
						language: {
							"url": require.toUrl('') + "translation/datatables.chinese.json"
						},

						data: data_.rack.nodes,
						//使用对象数组，一定要配置columns，告诉 DataTables 每列对应的属性
						//data 这里是固定不变的，id，hostname 为数据里对应的属性
						columns: [
							{ data:null,defaultContent:''},
							{ data: 'hostname' },
							{ data: table_coll,render:function(data){
								if(data == "On"){
									return nls.nodes_status_on;
								}
								if(data == "Off"){
									return nls.nodes_status_off;
								}
								return data + company;
							}}
						],
						dom: 'T<"clear">lfrtip',
						tableTools:{
							sRowSelect:'multi',
							sRowSelector:'td:first-child',
							aButtons:[]
						}

					});
					console.log(nls.table_refresh);

				}

				//---------------能耗趋势图
				var myChart;
				var option;
				function energy_trend(){
					var xdata=[];
					var ydata=[];
					if(energy_key == true){
						myChart = echartsjs.init(document.getElementById('rack_information_right'));
					}
					dataEnery();
					function dataEnery(){
						$.ajax({
							type :"get",
							//url : "static/js/customUI/monitor/widgets/physicals/rack/data/enery.json",
							url:urlConstants.racks + id +"/hour/energy/",
							dataType : "json",
							success:function(data){
								if(data.ret == "success"){
									for(var i=0;i <data.history.length;i++){
										var time=new Date(Number(data.history[i].time) * 1000);
										var year=time.getFullYear();
										var month=time.getMonth()+1;
										if (month < 10) {
											month = "0" + month;
										};
										var date=time.getDate()
										if (date < 10) {
											date = "0" + date;
										};
										var hour=time.getHours();
										if (hour < 10) {
											hour = "0" + hour;
										};
										var minutes=time.getMinutes();
										if (minutes < 10) {
											minutes = "0" + minutes;
										};
										var seconds=time.getSeconds();
										if (seconds < 10) {
											seconds = "0" + seconds;
										};
										var timeDisplay = hour + ":" + minutes + ":" + seconds;
										var dateDisplay = year + "-" +  month + "-" + date;
										var realtime=timeDisplay + "\n" + dateDisplay;

										xdata.push(realtime);
										ydata.push(data.history[i].value);
									};
									myChart.setOption(option);
									window.onresize = myChart.resize;
									console.log(nls.energy_echarts_succ);
								}
							},
							error:function(err){
								console.log(nls.energy_echarts_err);
							}
						})
					}

					option = {
						title: {
							x:'center',
							y:'top',
							textStyle:{
								fontWeight:'normal',
								fontSize:16
							}
						},
						grid: {
							right : '4%',
							x: 50,
							y:30,
							y2:40,
						},
						tooltip: {
							trigger: 'axis',
							formatter: '{b}<br />{a} ：{c0}W'
						},
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: xdata,
							splitLine:{
								show:false
							},
							//axisLabel:{
							//	interval:12
							//}
						},
						yAxis: {
							type: 'value',
							splitLine:{
								show:false
							}
						},
						series: [
							{
								name: name,
								type: 'line',
								itemStyle : {
									normal : {
										color:"#89B6DE"
									}
								},

								stack: nls.energy_echarts_title,
								data:ydata
							}
						]
					};

				}

				//-----------------------物理机架颜色判断//机架右侧动态信息展示
				function rack_color(){
					//console.log(JSON.stringify(data_))
					var temp = $("#rack_content").attr("node_display");
					if(temp != "default"){
						var str,num,arr = [];
						var data = data_.rack.nodes;
						function color(stmp,num_min,temp){

							for (var i=0;i<$(".nodes").length;i++) {
								var num;
								if($($(".nodes")[i]).attr("status") != "On" && temp != "temperature" && temp != "energy"){
									$($(".nodes")[i]).children("div").css('background',"#EAE6E6");
								}else {
									if (temp != "network"){
										num = parseInt($($(".nodes")[i]).attr(temp));
									}else {
										num = parseFloat($($(".nodes")[i]).attr(temp).split(",")[0].split(":")[1]) + parseFloat($($(".nodes")[i]).attr(temp).split(",")[1].split(":")[1]);
									}

									var temp_color = "";
									if (num < stmp + num_min) {
										temp_color = "#F6EFA6";
									}
									if(num >= stmp + num_min && num < stmp * 2 + num_min){
										temp_color = "#EFD79B";
									}
									if(num >= stmp * 2 + num_min && num < stmp * 3 + num_min){
										temp_color = "#E9BF8F";
									}
									if(num >= stmp * 3 + num_min && num < stmp * 4 + num_min){
										temp_color = "#E2A684";
									}
									if(num >= stmp * 4 + num_min && num < stmp * 5 + num_min){
										temp_color = "#DB8E79";
									}
									if(num >= stmp * 5 + num_min && num < stmp * 6 + num_min){
										temp_color = "#D57B6F";
									}
									if(num >= stmp * 6 + num_min && num < stmp * 7 + num_min){
										temp_color = "#D06D66";
									}
									if(num >= stmp * 7 + num_min && num < stmp * 8 + num_min){
										temp_color = "#CA605D";
									}
									if(num >= stmp * 8 + num_min && num < stmp * 9 + num_min){
										temp_color = "#C55255";
									}
									if(num >= stmp * 9 + num_min){
										temp_color = "#BF444C";
									}
									$($(".nodes")[i]).children("div").css('background',temp_color);
								}



							}
							console.log("color" + nls.console_text);
						}
						for (var i=0;i<data.length;i++){
							switch (temp){
								case "default":
									break;
								case "temperature":
									str = data[i].temperature;
									break;
								case "energy":
									str = data[i].energy;
									break;
								case "cpu_usage":
									str = data[i].cpu_usage;
									break;
								case "load":
									str = data[i].load;
									break;
								case "memory_usage":
									str = data[i].memory_usage;
									break;
								case "disk_usage":
									str = data[i].disk_usage;
									break;
								case 'network':
									str = data[i].network;
									break;
								case "cpu_core_used":
									str = data[i].cpu_core_used;
									break;

								default:
									break;
							}
							if(data[i].power_status == "On"){
								if(temp == "network"){
									var num_ = parseInt($($(".nodes")[i]).attr(temp).split(",")[0].split(":")[1]) + parseFloat($($(".nodes")[i]).attr(temp).split(",")[1].split(":")[1]);
									arr.push(num_);
								}else {
									if(temp == "load"){
										arr.push(parseFloat(str));
									}else {
										arr.push(parseInt(str));
									}

									//var num_ = parseFloat($($(".nodes")[i]).attr(temp).split(",")[0]) + parseFloat($($(".nodes")[i]).attr(temp).split(",")[1]);
								}
							}
						}
						var num_min = Math.min.apply(null,arr);
						var num_max = Math.max.apply(null,arr);
						num = (num_max - num_min) / 10;
						color(num,num_min,temp);
						dynamic_show(temp,num_max,num_min,num);
					}else {
						for (var i=0;i<$(".nodes").length;i++) {
							if($($(".nodes")[i]).attr("status") == "On"){
								$($(".nodes")[i]).find(".node_status").css('background',"#9AFD23");
							}else {
								$($(".nodes")[i]).find(".node_status").css('background',"#EA2D00");
							}

						}

						$("#information_left_bottom").html(
						"<li class='clear'><i>" + nls.rack_nodes_busy + "</i><span id=\"information_left_busy\">"
						+ data_.rack.node_busy +
						"</span></li><li class='clear'><i>" + nls.rack_nodes_free + "</i><span id=\"information_left_free\">" +
						+ data_.rack.node_free +
						"</span></li><li class='clear'><i>" + nls.rack_nodes_occupy + "</i><span id=\"information_left_occupy\">"
						+ data_.rack.node_used +
						"</span></li><li class='clear'><i>" + nls.rack_nodes_off + "</i><span id=\"information_left_off\">"
						+ data_.rack.node_off +
						"</span></li>"
						);
					}
					//------------------------刷新switch状态指示
					for(var i=0;i<$(".switchs").length;i++){
						if($($(".switchs")[i]).attr("status") == "On"){
							$($(".switchs")[i]).find(".node_status").css('background',"#9AFD23");
						}else {
							$($(".switchs")[i]).find(".node_status").css('background',"#EA2D00");
						}
					}
					//----------------Rack动态信息展示
					function dynamic_show(type,max,min,stmp){

						var attribute_name,
							attribute_variable="",
							color_model_name,
							color_content,
							color_content_temp1,
							color_content_temp2,
							str,
							energy_num= 0,
							value,
							value_px;
						for(var i=0;i<data.length;i++){

							switch (type){
								case "default":
									attribute_name = nls.default + " ："
									str = data[i].type;
									break;
								case "temperature":
									attribute_name =  nls.temperature + nls.test_text + " ："
									color_model_name = nls.temperature
									str = data[i].temperature;
									value_px = "℃"
									break;
								case "energy":
									attribute_name = nls.energy + nls.test_text + " ："
									color_model_name = nls.energy
									str = data[i].energy;
									value_px = "W"
									break;
								case "cpu_usage":
									attribute_name = nls.cpu_usage + nls.test_use_text + nls.test_text + " ："
									color_model_name = nls.cpu_usage
									str = data[i].cpu_usage;
									value_px = "%"
									break;
								case "load":
									attribute_name = nls.nlsload + nls.test_text + " ："
									color_model_name = nls.nlsload;
									str = data[i].load;
									value_px = ""
									break;
								case "memory_usage":
									attribute_name = nls.memory_usage + nls.test_use_text + nls.test_text + " ："
									color_model_name = nls.memory_usage
									str = data[i].memory_usage;
									value_px = "%"
									break;
								case "disk_usage":
									attribute_name = nls.disk_usage + nls.test_use_text + nls.test_text + " ："
									color_model_name = nls.disk_usage
									str = data[i].disk_usage;
									value_px = "%"
									break;
								case 'network':
									attribute_name = nls.network + nls.test_use_text + nls.test_text + " ："
									color_model_name = nls.network
									str = data[i].network;
									value_px = "K"
									break;
								case "cpu_core_used":
									attribute_name = nls.cpu_core_used + nls.test_use_text + nls.test_text + " ："
									color_model_name = nls.cpu_core_used
									str = data[i].cpu_core_used;
									value_px = ""
									break;

								default:
									attribute_name = ""
									attribute_variable = ""
									break;
							}
							if(type != "network"){
								var type_max = parseInt(str)
								if(type == "energy"){
									//energy_num += Number(data_.rack.nodes[i].energy);
									energy_num = data_.rack.energy;
								}
								if(type == "load"){
									type_max = Number(str);
								}
								if(max == type_max && data[i].power_status != "Off"){
									attribute_variable = data_.rack.nodes[i].hostname;
									value = " ：" + max + value_px;
								}
							}else {
								//console.log(JSON.stringify(str))
								var num_1 = parseInt(str.split(",")[0].split(":")[1]);
								var num_2 = parseInt(str.split(",")[1].split(":")[1]);
								var num = num_1 + num_2;
								if (max == num && data[i].power_status != "Off"){
									attribute_variable = data_.rack.nodes[i].hostname;
									value = " ：" + max + value_px;
								}
							}
						}
						$("#color_model p b").text(min)
						$("#color_model b+b").text(max)
						$("#color_model a").text(color_model_name)
						$("#information_left_bottom").html("")
						if ( type == "energy") {
							$("#information_left_bottom").append(
								"<li class='clear'><i>"
								+ nls.rack_all_energy +
								"</i><span>"
								+ energy_num + value_px +
								"</span></li>"
							);
						}
						$("#information_left_bottom").append(
							"<li class='clear'><i>"
							+ attribute_name +
							"</i><span>"
							+ attribute_variable + value +
							"</span></li>"
						);

						$("#color_model i").off()
						$("#color_model i").hover(function(){
							$('#color_model_hover').css('display',"block");
							//----------------------悬浮框位置
							var num_x = 470;
							if($(this).index() > 5){
								num_x = 650;
							}
							$(document).mousemove(function(e){
								$('#color_model_hover').css('top',e.pageY-370).css('left',e.pageX-num_x);
							});

							if($(this).index() - 2 == 0){
								color_content_temp1 = min;
								color_content_temp2 = stmp + min;
							}else {
								if($(this).index() - 2 == 9){
									color_content_temp1 = stmp * 9 + min;
									color_content_temp2 = max;
								}else {
									color_content_temp1 = stmp * ($(this).index() - 2) + min;
									color_content_temp2 = stmp * ($(this).index() - 2 + 1) + min
								}
							}
							var load_num = 0;
							if(type == "load"){
								load_num = 2;
							}
							color_content = color_content_temp1.toFixed(load_num) + "～" + color_content_temp2.toFixed(load_num)+ " " + value_px;
							$('#color_model_hover').text(color_content)
						},function(){
							$('#color_model_hover').css('display',"none");
						})
					}
				}
				//--------------------------30s 刷新
				eventBus.off();
				eventBus.on(constants.refreshRack,refreshrack);

				function refreshrack(){
					console.log("//--------------------------30s 刷新");
					if ($("#plotly_Modal.in").length > 0) {
						return;
					}

					$.ajax({
						url:urlConstants.racks + id + "/",
						//url:"static/js/customUI/monitor/widgets/physicals/rack/data/rack.json",
						dataType:"json",
						type:"get",
						success:function(data){
							//-----------------判断数据是否获取成功
							if(data.ret == "success"){
								var temp = data.rack.nodes;
								var temp_switch = data.rack.switches;
								for(var i=0;i<temp.length;i++){
									temp[i].network = nls.network_in + temp[i].network.split(",")[0] +"K,"+ nls.network_out + temp[i].network.split(",")[1]+ "k"
									var data_id = "nodes_" + temp[i].id;
									for (var o=0;o<$(".nodes").length;o++) {
										var nodes_id = $($('.nodes')[o]).attr('id');
										if(data_id == nodes_id){
											$($('.nodes')[o]).attr('status',temp[i].power_status);
											$($('.nodes')[o]).attr('temperature',temp[i].temperature + "℃");
											$($('.nodes')[o]).attr('energy',temp[i].energy + "W");
											$($('.nodes')[o]).attr('cpu_usage',temp[i].cpu_usage + "%");
											$($('.nodes')[o]).attr('load',temp[i].load);
											$($('.nodes')[o]).attr('memory_usage',temp[i].memory_usage + "%");
											$($('.nodes')[o]).attr('disk_usage',temp[i].disk_usage + "%");
											$($('.nodes')[o]).attr('network',temp[i].network);
											$($('.nodes')[o]).attr('cpu_core_used',temp[i].cpu_core_used);

										}
									}
								}
								for(var i=0;i<temp_switch.length;i++){
									var switch_id = "switchs_" + temp_switch[i].id;
									for (var p=0;p<$(".switchs").length;p++) {
										var switchs_id = $($('.switchs')[p]).attr('id');
										if(switch_id == switchs_id){
											$($('.switchs')[p]).attr('status',temp_switch[i].power_status);
										}
									}
								}
								data_ = data;
								//console.log(JSON.stringify(data_));
								refresh_show();
								energy_trend();
							}else{
								console.log(nls.refresh_rack_err);
							}

						},
						error:function(err){
							console.log("30s" + nls.refresh_err);
						}
					})
				}
				function refresh_show(){
					var temp = $("#rack_content").attr("node_display");
					switch (temp){
						case "default":
							$("#physical_rack_view").trigger('click');
							break;
						case "temperature":
							$("#physical_temperature_view").trigger('click');
							break;
						case "energy":
							$("#physical_energy_view").trigger('click');
							energy_key = false;
							break;
						case "cpu_usage":
							$("#physical_cpu_usage_view").trigger('click');
							break;
						case "load":
							$("#physical_load_view").trigger('click');
							break;
						case "memory_usage":
							$("#physical_Memory_view").trigger('click');
							break;
						case "disk_usage":
							$("#physical_disk_view").trigger('click');
							break;
						case 'network':
							$("#physical_network_view").trigger('click');
							break;
						case "cpu_core_used":
							$("#physical_core_view").trigger('click');
							break;

						default:
							break;
					}
				}
			}
        	
		});
	});
