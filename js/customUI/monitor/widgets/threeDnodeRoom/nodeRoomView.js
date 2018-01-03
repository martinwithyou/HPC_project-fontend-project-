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
	'lib',
	'plotly'
	],function(Marionette,lib,plotly){
		return Marionette.ItemView.extend({
			template:" ",
			templateHelpers:" ",

			onRender:function(){
				
     
     
     
     
     
        function init(){
        	//创建数据容器，容纳所有的3d对象
            var box = new mono.DataBox();
            
            //创建3d画布，现实3d场景。monoCanvas是html页面中canvas标签对象的id值。
            var network= new mono.Network3D(box, null, monoCanvas);
            
            //当页面调整大小时，自动调整network画布的宽度，铺满整个页面
            mono.Utils.autoAdjustNetworkBounds(network,document.documentElement,'clientWidth','clientHeight');
 
            //在坐标1000，1000，1000，处放一个颜色为0xffffff,强度为 1.5的点光源
            var pointLight = new mono.PointLight(0xFFFFFF,1.5);
            pointLight.setPosition(1000,1000,1000);
            box.add(pointLight);
            
            //在场景中增加颜色为0x88888888的环境光
            box.add(new mono.AmbientLight(0x888888));
 
            //创建一个大小为200，200，200的立方体
            var cube = new mono.Cube(200, 200, 200);
            //设置立方体的材质，颜色等样式
            cube.s({
                'm.type': 'phong',
                'm.color': 'red',
                'm.ambient': 'red',
            });
            //设置立方体在x,y,z轴的旋转角度
            cube.setRotation(-Math.PI/10, -Math.PI/5, Math.PI/10);
            
            //将立方体放入databox数据容器进行显示
            box.add(cube);
        }
 
 
           init();
//          	var box =new mono.DataBox();
//          	var network= new mono.Network3D(box,null,monoCanvas);
//          	mono.Utils.autoAdjustNetworkBounds(network,document.documentElement,"clientWidth","clientHeight");
//          	
//          	var pointLight = new mono.PointLight(0xFFFFFF,1.5);
//          	pointLight.setPosition(1000,1000,1000);
//          	box.add(pointLight);
//          	box.add(new mono.AmbientLight(0x888888));
//          	
//          	var cube=new mono.Cube(200,200,200);
//          	cube.s({
//          		"m.type":"phong",
//          		"m.color":"red",
//          		"m.anbient":"red"
//          	});
//          	
//          	cube.setRotation(-Math.PI/10,-Math.PI/5,Math.PI/10);
//          	box.add(cube);
       
            
        
//            $("body").css("background-color", "darkorange");
//            var width= window.innerWidth;
//            var height=window.innerHeight;
//            var container=document.createElement('div');
//            document.body.appendChild(container);
//            var webglcanvas=document.createElement('canvas');
//            //创建canvas上下文
//            container.appendChild(webglcanvas);
//            var gl=webglcanvas.getContext("experimental-webgl");
              //获得webgl上下文
              
//            function updateFrame(){
//            	
//            	gl.viewport(0,0,width,height);
//            	
//            	gl.clear ( gl.COLOR_BUFFER_BIT );
//            	
//            	gl.clearColor(0.4,0.4,0.7,1);
//            	
//            	setTimeout(function(){updateFrame()},20);
//            }
//            
//            setTimeout(function(){
//            	updateFrame();
//            },
//            20);
              
              
//*************************************************************************************** 
//***************************************************************************************   
//***************************************************************************************   
    //地板对象
//  var floor={
//  	name:"floor",
//  	type:"cube",
//  	width:1600,
//  	height:10,
//  	depth:1300,
//  	style:{
//  		"m.color":"#BEC9BE",
//  		"m.ambient":"#BEC9BE",
//  		"top.m.texture.image":"images/floor.png",
//  		"top.m.texture.repeat":new mono.Vec(10,10),
//  		
//  	}
//  }

//*************************************************************************************** 
//***************************************************************************************   
//***************************************************************************************   
 
          
           
  

			}

			
		});
	});