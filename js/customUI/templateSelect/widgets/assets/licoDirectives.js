define(['jquery'],function($){
	var licoDirectives={};
	licoDirectives['licoEvents']=['click','checked','change','focus','hover','init'];

	licoDirectives['disable']=function(g,initdata,init){
		var initial=typeof init !== 'undefined' ?  init : false;
		var l=g.length;
		if(l>0){
				for(var i=0;i<l;i++){
					var a=g[i];
					if(a[0]=='#'){
						var $this=$(a);
						var thisDataID=a;
					} else{
						var q='#'+a;
						var thisDataID=q;
						var $this=$(q);
					}
					var thisType=initdata[thisDataID][0];
					var thisData=initdata[thisDataID][1];
					var thisHTML=initdata[thisDataID][2];
					switch(thisType){
						case "radio":
							if($($this).find('input:checked').val() != thisData && typeof($(thisDataID).find('input').val()) != 'undefined'){
								$($this).html(thisHTML);
								$($this).trigger('change');
							}
							break;
						case "checkbox":
							var checkboxData=$($this).find('input:checked');
							var checkboxDatas;
							var checkboxDatas2=[];
							var usefulData;
							if(checkboxData.length<2){
								if(typeof($($this).find('input:checked').val())=='undefined'){
									checkboxDatas='null';
								} else {
									checkboxDatas=$($this).find('input:checked').val();
								}
								usefulData=checkboxDatas;
							} else {
								checkboxData.each(function(){
									checkboxDatas2.push($(this).val());
								});
								usefulData=checkboxDatas2;
							}
							if(usefulData!=thisData){
								$($this).html(thisHTML);
								$($this).trigger('change');
							}	
							break;
						case "select":
							if($($this).find('select').val() != thisData){
								$($this).html(thisHTML);
								$($this).trigger('change');
							}
							break;
						case "input":
							if($($this).find('input').val() != thisData){
								$($this).html(thisHTML);
								$($this).trigger('change');
							}
							break;
						default:
							break;
					}
				}
			}
		if(initial){
			if(l>0){
				for(var i=0;i<l;i++){
					var a=g[i];
					if(a[0]=='#'){
						var $this=$(a);
					} else{
						var q='#'+a;
						var $this=$(q);
					}
						$this.attr('disabled','disabled');
						$this.find('input').each(function(){
							$(this).attr('disabled','disabled');
						});
						$this.find('select').each(function(){
							$(this).attr('disabled','disabled');
						});
				}
			}
		} else {
			if(l>0){
				for(var i=0;i<l;i++){
					var a=g[i];
					if(a[0]=='#'){
						var $this=$(a);
					} else{
						var q='#'+a;
						var $this=$(q);
					}
					if($this.find(':disabled').length>0 || $($this).attr('disabled')=='disabled'){
						$this.attr('disabled',false);
						$this.find('input').each(function(){
							$(this).attr('disabled',false);
						});
						$this.find('select').each(function(){
							$(this).attr('disabled',false);
						});
					} else{
						$this.attr('disabled','disabled');
						$this.find('input').each(function(){
							$(this).attr('disabled','disabled');
						});
						$this.find('select').each(function(){
							$(this).attr('disabled','disabled');
						});
					}
				}
			}
		}
	}

	licoDirectives['enable']=function(g,initdata,init){
		var l=g.length;
		var initial=typeof init !== 'undefined' ?  init : false;
		if(initial){
			for(var i=0;i<l;i++){
					var a=g[i];
					if(a[0]=='#'){
						var $this=$(a);
					} else{
						var q='#'+a;
						var $this=$(q);
					}
						$this.attr('disabled',false);
						$this.find('input').each(function(){
							$(this).attr('disabled',false);
						});
						$this.find('select').each(function(){
							$(this).attr('disabled',false);
						});					
				}
		} else {
			if(l>0){
				for(var i=0;i<l;i++){
					var a=g[i];
					// if(a[0]=='#'){
					// 	var $this=$(a);
					// } else{
					// 	var q='#'+a;
					// 	var $this=$(q);
					// }
					if(a[0]=='#'){
						var $this=$(a);
						var thisDataID=a;
					} else{
						var q='#'+a;
						var thisDataID=q;
						var $this=$(q);
					}
					var thisType=initdata[thisDataID][0];
					var thisData=initdata[thisDataID][1];
					var thisHTML=initdata[thisDataID][2];
					switch(thisType){
						case "radio":
							if($($this).find('input:checked').val() != thisData && typeof($(thisDataID).find('input').val()) != 'undefined'){
								$($this).html(thisHTML);
								$($this).trigger('change');
							}
							break;
						case "checkbox":
							var checkboxData=$($this).find('input:checked');
							var checkboxDatas;
							var checkboxDatas2=[];
							var usefulData;
							if(checkboxData.length<2){
								if(typeof($($this).find('input:checked').val())=='undefined'){
									checkboxDatas='null';
								} else {
									checkboxDatas=$($this).find('input:checked').val();
								}
								usefulData=checkboxDatas;
							} else {
								checkboxData.each(function(){
									checkboxDatas2.push($(this).val());
								});
								usefulData=checkboxDatas2;
							}
							if(usefulData!=thisData){
								$($this).html(thisHTML);
								$($this).trigger('change');
							}	
							break;
						case "select":
							if($($this).find('select').val() != thisData){
								$($this).html(thisHTML);
								$($this).trigger('change');
							}
							break;
						case "input":
							if($($this).find('input').val() != thisData){
								$($this).html(thisHTML);
								$($this).trigger('change');
							}
							break;
						default:
							break;
					}					
					if($this.find(':disabled').length>0 || $($this).attr('disabled')=='disabled'){
						$this.attr('disabled',false);
						$this.find('input').each(function(){
							$(this).attr('disabled',false);
						});
						$this.find('select').each(function(){
							$(this).attr('disabled',false);
						});
					} else{
						$this.attr('disabled',true);
						$this.find('input').each(function(){
							$(this).attr('disabled',true);
						});
						$this.find('select').each(function(){
							$(this).attr('disabled',true);
						});
					}
				}
			}
		}
	}

	return licoDirectives;
});