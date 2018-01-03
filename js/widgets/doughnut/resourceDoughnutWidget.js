/*
 * © Copyright Lenovo 2015.
 *
 * LIMITED AND RESTRICTED RIGHTS NOTICE:
 *
 * If data or software is delivered pursuant a General Services Administration
 * "GSA" contract, use, reproduction, or disclosure is subject to
 * restrictions set forth in Contract No. GS-35F-05925.
*/
function drawATag( number, color, label) {
	var html = "<div><div><svg width='50' height='5px'><rect x='0' y='0' width='50' height='5px' style='fill:"+color+";stroke-width:0;stroke:"+color+"' /> Sorry, your browser does not support inline SVG.</svg></div><div>"+label+"</div><div>" + number + "</div></div>";
	return html;
};

function drawFooter(data) {
	var html = "";
	for (i=data.length-1; i>=0; i--) {
		html+= drawATag(data[i].value, data[i].color, data[i].label);
	}
	return html;
};

window.drawFooter = drawFooter;

function decimalPlaces(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0));
};

(function ( $ ) {
    $.fn.doughnut = function( data, canvasAreaId, options ) {
        // default options.
        var settings = $.extend({
            // These are the defaults.
            header: "集群CPU",
            amount: "G"
        }, options );

		return this.each(function() {
			$(this).empty();
			$(this).append("<div class='resource-header' style='width:100%;margin-bottom:25px;'>"+settings.header+"</div>");
			$(this).append("<canvas id='"+canvasAreaId+"' width='100%' height='100%'></canvas>");
			var num = Math.max(decimalPlaces(data[0].value), decimalPlaces(data[1].value));
			var total = (parseFloat(data[0].value) + parseFloat(data[1].value)).toFixed(num);
			$(this).append("<div class='resource-usage' style='width:150%;margin-left:-25%;'>"+settings.nls.used+data[0].value+settings.amount+"/"+total+settings.amount+"</div>");

//			var cloneData = jQuery.extend(true, {}, data);
//			if ( Number(cloneData[0].value) == 0 && Number(cloneData[1].value) == 0){
//				cloneData[0].value = 1; //For nice looking, in order not to have an empty area.
//			}

			var ctx = $('#'+canvasAreaId).get(0).getContext("2d");
			var myDoughnut = new Chart(ctx).Doughnut(data,{
				animation:settings.animation,
	        	animationSteps: 60,
				responsive: false,
				showTooltips: false,
				percentageInnerCutout : 85,
				segmentShowStroke : false,
				onAnimationComplete: function() {
					var canvasWidthvar = $('#'+canvasAreaId).width();
					var canvasHeight = $('#'+canvasAreaId).height();
					//this constant base on canvasHeight / 2.8em
					//var constant = 114;
					var constant = 3.5;
					var fontsize = (canvasHeight/constant).toFixed(0);
					ctx.font=fontsize +"px Arial";
					ctx.fillStyle="#333333";
					ctx.textBaseline="middle";
					var total = 0;
					$.each(data,function() {
						total += parseFloat(this.value,10);
					});
					//var tpercentage = ((data[0].value/total)*100).toFixed(2)+"%";
					var tpercentage = ((data[0].value/total)*100).toFixed(0);
					if (tpercentage === "NaN") {
						tpercentage = 0;
					}
					var textWidth = ctx.measureText(tpercentage).width;

					var txtPosx = Math.round((canvasWidthvar - textWidth)/2);
					ctx.fillText(tpercentage, txtPosx, canvasHeight/2);

					fontsize = (fontsize/2).toFixed(0);
					ctx.font=fontsize +"px sans-serif";
					//var textWidth2 = ctx.measureText(nls.unfinished).width;
					var txtPosx2 = Math.round((canvasWidthvar + textWidth)/2);
					ctx.textBaseline="top";
					ctx.fillText("%", txtPosx2, (canvasHeight)/2);
				}
			});
		});
    };

}( jQuery ));