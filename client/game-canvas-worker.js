"use strict";
var ctx;
importScripts("game-draw.js");

onmessage = function (event) {
	if(event.data instanceof CanvasProxy)
	{
		ctx = new CanvasRenderingContext2D();
		event.data.setContext(context); // event.data is the CanvasProxy object

		// setInterval(function () 
		// 			{
		// 				context.clearRect(0, 0, context.width, context.height);
		// 				context.fillText(new Date(), 0, 100);
		// 				context.commit();
		// 			}, 
		// 			1000);
	}
	else
	{
		drawArrays(event.data);
		ctx.commit();
	}
};

