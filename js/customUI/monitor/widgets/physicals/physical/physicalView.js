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
		'echartjs',
		'bootstrap',
		'customUI/monitor/widgets/physicals/rack/rackView',
		'utils/constants/urlConstants',
		'utils/constants/constants',
		'utils/eventBus',
		'text!./templates/physicalViewTmpl.mustache',
		'i18n!./nls/physical',
		'css!./style/physical'
	],
	function(Marionette, chartjs, bootstrap, rackView,urlConstants, constants, eventBus, template, nls ) {
		'use strict';
		return Marionette.ItemView.extend({
			template: template,

			templateHelpers: function() {
				return {
					nls: nls
				};
			},

			onShow: function() {
				$("body").css("background-color","#ffffff");
				$("#body>div").css("padding","0 20px");
				init(true)
				var id;
				var id_arr = [];
				function init(key){

					if(key){
						id = "physical_room_chart";
						id = chartjs.init(document.getElementById(id));
					}
					$.ajax({
						type:"get",
						url:urlConstants.rooms,
						//url:"static/js/customUI/monitor/widgets/physicals/physical/data/room.json",
						dataType:"json",
						success:function(data){
							if(data.ret == "success"){
								$("#physical_room_name").text(data.rooms[0].name);
								$("#physical_room_posi").text(data.rooms[0].location);
								$("#physical_room_nodes").text(data.rooms[0].node_num);
								$("#physical_room_energy").text(data.rooms[0].power_consumption + "W");
								var option = {
									color:['#3398DB'],
									tooltip : {
										show:false
										//trigger : 'axis',
										//axisPointer : {
										//	type : 'shadow'
										//}
									},
									grid :{
										left : '3%',
										right : '4%',
										bottom : '20%',
										top:"15%",
										cintainLable : true
									},
									xAxis : [
										{
											type : 'category',
											data : [nls.chart_busy,nls.chart_used,nls.chart_free,nls.chart_off],
											axisTick : {
												alignWithLable : true
											}
										}
									],
									yAxis : [
										{
											show : false
										}
									],
									series : [
										{
											name : nls.chart_name,
											type : "bar",
											barWidth : "40",
											data : [
												{
													value : data.rooms[0].node_busy,
													itemStyle : {
														normal : {
															color : "#FF3000"
														}
													}
												},
												{
													value : data.rooms[0].node_used,
													itemStyle : {
														normal : {
															color : "#FFCC00"
														}
													}
												},
												{
													value : data.rooms[0].node_free,
													itemStyle : {
														normal : {
															color : "#8FE9A5"
														}
													}
												},
												{
													value : data.rooms[0].node_off,
													itemStyle : {
														normal : {
															color : "#DEDEDE"
														}
													}
												}
											],
											itemStyle: {
												normal: {
													label: {
														show: true,
														position:"top",
														textStyle: {
															fontWeight:'100',
															fontSize : '12',
															fontFamily : nls.chart_font,
															color:"black"
														}
													}
												}
											},
										}
									]
								}
								id.setOption(option);
							}else {
								console.log("room data error");
							}
						},
						error:function(err){

						}
					});
				}

				rows(true);
				function rows(key){
					var id = 1;
					$.ajax({
						type:"get",
						url:urlConstants.rows,
						dataType:"json",
						success:function(data){
							var data = data;
							if(data.ret == "success"){
								for (var i=0;i<data.rows.length;i++) {
									if(key){
										$("#list_menu").append(
											"<option>"+ data.rows[i].name +"</option>"
										);
									}
									if(!key && $("#list_menu").val() == data.rows[i].name){
										id = data.rows[i].row_index;
									}
								}
								$("#list_menu").off();
								$("#list_menu").change(function(){
									$("#rows").html("");
									id_arr.length = 0;
									for(var i=0;i<data.rows.length;i++){
										if($("#list_menu").val() == data.rows[i].name){
											id = data.rows[i].row_index;
											Rows_rack(true,id);
										}

									}
								})
								Rows_rack(key,id);
							}else{
								alert("rows error");
							}
						},
						error:function(err){
							alert("row error");
						}
					});
				}

				function Rows_rack(key,num){
					$.ajax({
						type:"get",
						url:urlConstants.rows + num + "/",
						dataType:"json",
						success:function(data){
							if(data.ret == "success"){
								var cont_width = 1470,row_nodes = 0,row_energy = 0;
								//if(data.row.racks.length>6){
								//	cont_width +=(data.row.racks.length - 6) * 244;
								//}
								cont_width = data.row.racks.length * 251.5
								$("#rows").css("width",cont_width)
								for(var y=0;y<data.row.racks.length;y++){
									var option = {
										color:['#3398DB'],
										tooltip : {
											show:false
											//trigger : 'axis',
											//axisPointer : {
											//	type : 'shadow'
											//}
										},
										grid :{
											left : '3%',
											right : '4%',
											bottom : '20%',
											top:"20%",
											cintainLable : true
										},
										xAxis : [
											{
												type : 'category',
												data : [nls.chart_busy,nls.chart_used,nls.chart_free,nls.chart_off],
												axisTick : {
													alignWithLable : true
												}
											}
										],
										yAxis : [
											{
												show : false
											}
										],
										series : [
											{
												name : nls.chart_name,
												type : "bar",
												barWidth : "20",
												data : [
													{
														value : data.row.racks[y].node_busy,
														itemStyle : {
															normal : {
																color : "#FF3000"
															}
														}
													},
													{
														value : data.row.racks[y].node_used,
														itemStyle : {
															normal : {
																color : "#FFCC00"
															}
														}
													},
													{
														value : data.row.racks[y].node_free,
														itemStyle : {
															normal : {
																color : "#8FE9A5"
															}
														}
													},
													{
														value : data.row.racks[y].node_off,
														itemStyle : {
															normal : {
																color : "#DEDEDE"
															}
														}
													}
												],
												itemStyle: {
													normal: {
														label: {
															show: true,//是否展示
															position:"top",
															textStyle: {
																fontWeight:'100',
																fontSize : '12',
																fontFamily : nls.chart_font,
																color:"black"
															}
														}
													}
												},
											}
										]
									}
									if(key){
										$("#rows").append(
											"<a class='monitor_frame' id='rack_"
											+ data.row.racks[y].id +
											"' name='"
											+ data.row.racks[y].name +
											"'><ul><li>" + nls.rack + "<span class='frame_name'>"
											+ data.row.racks[y].name +
											"</span></li><li>"+nls.posi+"<span class='frame_position'>"
											+ data.row.racks[y].location.row_index + nls.posi_px +data.row.racks[y].location.col_index +
											"</span></li><li>"+ nls.rack_conts +"<span class='frame_nodes'>"
											+ data.row.racks[y].node_num +
											"</span></li><li>"+ nls.energy_rows +"<span class='frame_energy'>"
											+ data.row.racks[y].energy +
											"</span></li><div class='chart_rack' id='row_rack_"
											+ data.row.racks[y].id +
											"'></div></ul></a>"
										);
										row_nodes += data.row.racks[y].node_num;
										var id = 'row_rack_' + data.row.racks[y].id;
										id = chartjs.init(document.getElementById(id));
										id_arr.push(id);
										id.setOption(option);
									}else {
										for(var i=0;i<id_arr.length;i++){
											if(y == i){
												id_arr[i].setOption(option);
												console.log(id_arr[i])
											}
										}
									}
									row_energy += Number(data.row.racks[y].energy);
								}
								if(key){
									$("#room_rows_rack").text(data.row.racks.length);
									$("#room_rows_nodes").text(row_nodes);
								}

								$("#room_rows_energy").text(row_energy);
								$(".monitor_frame").off();
								$(".monitor_frame").on("click",function(){
									var id=$(this).attr("id").split('_')[1];
									var name=$(this).attr("name");
									var rack=new rackView({el:"#body",name:name,id:id});
									rack.render();
								});
							}else{
								alert("rack data error");
							}

						},
						error:function(err){
							alert("rack error");
						}
					});

				}

				eventBus.on(constants.refreshRackAll,refreshrackall);
				function refreshrackall(){
					init(false);
					console.log("room load success");
					rows(false);
					console.log("rack load success")
				}

			}
			
		});
	});