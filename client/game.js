"use strict";



function draw() 
{
	var newCanvasRight = document.getElementById("myCanvas").width;
	var newCanvasBottom = document.getElementById("myCanvas").height;
	
	if(newCanvasRight != canvasRight || newCanvasBottom != canvasBottom)
	{
		canvasRight = newCanvasRight;
		canvasBottom = newCanvasBottom;
		
		configObj.canvasRight = canvasRight;
		configObj.canvasBottom = canvasBottom;
		
		worker.postMessage("update|" + JSON.stringify(configObj));
	}
	
	
	if(!changesSent || currentKeyPress != 0)
	{
		keyPressShortList.length = currentKeyPress;
		
		for(var i = 0 ; i < currentKeyPress ; i++)
		{
			keyPressShortList[i] = keyPressList[i];
		}
		
		currentKeyPress = 0;
		
		
		var strKeyPressList = JSON.stringify(keyPressShortList);
		
		//console.log(strKeyPressList);
		
		worker.postMessage("keypress|" + strKeyPressList);
		changesSent = true;
	}

	worker.postMessage("imageRequest|");
	
	window.requestAnimationFrame(draw);
}

