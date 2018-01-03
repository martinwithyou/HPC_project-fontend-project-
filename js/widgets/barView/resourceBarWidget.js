/*
 * © Copyright Lenovo 2015.
 *
 * LIMITED AND RESTRICTED RIGHTS NOTICE:
 *
 * If data or software is delivered pursuant a General Services Administration
 * "GSA" contract, use, reproduction, or disclosure is subject to
 * restrictions set forth in Contract No. GS-35F-05925.
*/
function drawAQueue(number, color, label, scaleFactor) {
	var height = 2;
	height = number*scaleFactor;
	if (height < 2 || scaleFactor == Infinity){
		height =2;
	}
	var html = "<div><div>" + number + "</div><div><svg width='12' height='"+
			height +"'>" +	"<rect x='0' y='0' width='12' height='"+
			height +"'style='fill:"+color+";stroke-width:0;stroke:"+
			color+"' /> Sorry, your browser does not support inline SVG.</svg></div><div>"+
			label+"</div></div>"
	return html;
};

function drawAnIOBar(number, color, label, scaleFactor) {
	var height = 2;
	
	var getIOUnit = function(ioData) {
		var ioUnit = {data: 0, unit: "MB/s"};
		
		if (ioData < 1024) {
			ioUnit.data = Number(ioData).toFixed(0);
			ioUnit.unit = "B/s";
		} else if(ioData >= 1024 && ioData < 1048576) {
			ioUnit.data = (ioData/1024).toFixed(0) ;
			ioUnit.unit = "KB/s";
		} else if (ioData >= 1048576 && ioData < 1073741824) {
			ioUnit.data = (ioData/1048576).toFixed(0);
			ioUnit.unit = "MB/s";
		} else if (ioData >= 1073741824) {
			ioUnit.data = (ioData/1073741824).toFixed(0);
			ioUnit.unit = "GB/s";
		}
		return ioUnit;
	};
	
	height = number*scaleFactor;
	if (height < 2 || scaleFactor == Infinity){
		height =2;
	}
	
	var ioUnit = getIOUnit(number);
	var html = "<div><div>" + ioUnit.data + ioUnit.unit + "</div><div><svg width='12' height='"+
			height +"'>" +	"<rect x='0' y='0' width='12' height='"+
			height +"'style='fill:"+color+";stroke-width:0;stroke:"+
			color+"' /> Sorry, your browser does not support inline SVG.</svg></div><div>"+
			label + "</div></div>"
	return html;
};



(function ( $ ) {
	var getMaxNum =	function (dataArray) {
		var maxNum = 0;
		for (var i = 0; i<dataArray.length; i++){
			var waitNum = dataArray[i].jobs.waiting + dataArray[i].jobs.holding + dataArray[i].jobs.suspending + dataArray[i].jobs.queueing;
			if (waitNum > maxNum){
				maxNum = waitNum;
			}
			if (dataArray[i].jobs.running > maxNum){
				maxNum = dataArray[i].jobs.running;
			}
		}
		return maxNum;
	};

    $.fn.slidingWindow = function( data, options ) {
		// default options.
        var settings = $.extend({
            // These are the defaults.
            color1: "#89B6DE",
			color2: "rgb(200,200,200)",
            columnWidth: "90"
        }, options );

		return this.each(function() {
			$(this).empty();
			var elSlidingWindow = $("<div class='sliding-window' style='padding-left:25%;'></div>");
			$(this).append(elSlidingWindow);
			var elSlidingWindowTable = $("<table class='sliding-table'></table>");
			elSlidingWindow.append(elSlidingWindowTable);
			var elSlidingTableHeader = $("<tr class='sliding-table-header'></tr>");
			var elSlidingTableData = $("<tr class='sliding-table-data'></tr>");
			elSlidingWindowTable.append(elSlidingTableHeader);
			elSlidingWindowTable.append("<tr style='height: 10px'></tr>");
			elSlidingWindowTable.append(elSlidingTableData);
			var queueNum = data.datasets.length;
			elSlidingWindow.css("width", settings.columnWidth * queueNum * 2);
			var maxNumber = getMaxNum(data.datasets);
			var scaleFactor = 0;
			if (maxNumber == 0){
				scaleFactor = 0; 
			}
			scaleFactor = 100/maxNumber;

			if (data.datasets){
				$.each(data.datasets, function(index, value){

					elSlidingTableHeader.append("<th><div>"+value.name+"</div></th>");
					var jobs = value.jobs;
					var waitNum = jobs.waiting + jobs.holding + jobs.suspending + jobs.queueing;
					elSlidingTableData.append("<td>"+drawAQueue(value.jobs.running, settings.color1, settings.runningLabel, scaleFactor)+ drawAQueue(waitNum, settings.color2, settings.queueingLabel, scaleFactor)+"</td>");
				})
			}
		});
    };
}( jQuery ));


(function ( $ ) {
	$.fn.ioWindow = function( data, options ) {
		var getMaxNum =	function (dataArray) {
			var maxNum = 0;
			for (var i = 0; i<dataArray.length; i++){
				var nIn = Number(dataArray[i].in);
				if (nIn > maxNum){
					maxNum = nIn;
				}
				var nOut = Number(dataArray[i].out);
				if ( nOut > maxNum){
					maxNum = nOut;
				}
			}
			return maxNum;
		};


        // default options.
        var settings = $.extend({
            // These are the defaults.
            color1: "#89B6DE",
			      color2: "#8FE9A5",
            columnWidth: "155"
        }, options );

		return this.each(function() {
			$(this).empty();
			var elIOWindow = $("<div class='io-window' ></div>");
			$(this).append(elIOWindow);
			var elIOTable = $("<table class='io-table' style='width:100%;'></table>");
			elIOWindow.append(elIOTable);
			var elIOTableHeader = $("<tr class='io-table-header'></tr>");
			var elIOTableData = $("<tr class='io-table-data'></tr>");
			elIOTable.append(elIOTableHeader);
			elIOTable.append("<tr style='height: 10px'>");
			elIOTable.append(elIOTableData);
			//打桩开始
			//alert(data.datasets.length);
			//打桩结束
			var queueNum = data.datasets.length;
			//打桩开始
			//alert(settings.columnWidth);
			//打桩结束
			//elIOWindow.css("width", settings.columnWidth * queueNum);
			elIOWindow.css("width", settings.columnWidth * queueNum * 1.3);
			//alert($(".io-window").width());
			
			var maxNumber = getMaxNum(data.datasets);
			var scaleFactor = 0;
			if (maxNumber == 0){
				scaleFactor = 0; 
			}
			scaleFactor = 100/maxNumber;			

			if (data.datasets){
				$.each(data.datasets, function(index, value){
					elIOTableHeader.append("<th>"+value.name+"</th>");
					elIOTableData.append("<td>"+drawAnIOBar(value.in, settings.color1, settings.readLabel, scaleFactor)+ drawAnIOBar(value.out, settings.color2, settings.writeLabel, scaleFactor)+"</td>");
				})
			}
		});
	};
}( jQuery ));


(function ( $ ) {
	$.fn.plainBarWindow = function( data, options ) {
		var getMaxNum =	function (dataArray) {
			var maxNum = 0;
			for (var i = 0; i<dataArray.length; i++){
				var nIn = Number(dataArray[i].in);
				if (nIn > maxNum){
					maxNum = nIn;
				}
				var nOut = Number(dataArray[i].out);
				if ( nOut > maxNum){
					maxNum = nOut;
				}
			}
			return maxNum;
		};


        // default options.
        var settings = $.extend({
            // These are the defaults.
            color1: "#89B6DE",
			      color2: "#8FE9A5",
            columnWidth: "90"
        }, options );

		return this.each(function() {
			$(this).empty();
			var elIOWindow = $("<div class='io-window' ></div>");
			$(this).append(elIOWindow);
			var elIOTable = $("<table class='io-table' style='width:100% !important;'></table>");
			elIOWindow.append(elIOTable);
			var elIOTableHeader = $("<tr class='io-table-header'></tr>");
			var elIOTableData = $("<tr class='io-table-data'></tr>");
			elIOTable.append(elIOTableHeader);
			elIOTable.append("<tr style='height: 10px'>");
			elIOTable.append(elIOTableData);
			var queueNum = data.datasets.length;
			elIOWindow.css("width", settings.columnWidth * queueNum * 2);
			var maxNumber = getMaxNum(data.datasets);
			var scaleFactor = 0;
			if (maxNumber == 0){
				scaleFactor = 0; 
			}
			scaleFactor = 100/maxNumber;			

			if (data.datasets){
				$.each(data.datasets, function(index, value){
					elIOTableHeader.append("<th>"+value.name+"</th>");
					elIOTableData.append("<td>"+drawAQueue(value.in, settings.color1, settings.readLabel, scaleFactor)+ drawAQueue(value.out, settings.color2, settings.writeLabel, scaleFactor)+"</td>");
				})
			}
		});
	};
}( jQuery ));
