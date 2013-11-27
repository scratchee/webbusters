"use strict";

var thisFrameStartTime = timeMeasure.now();
var thisFrameEndTime = timeMeasure.now();
var lastFrameStartTime = timeMeasure.now();
var lastFrameEndTime = timeMeasure.now();
var avgFrameDrawTime = 1;
var avgFrameCycleTime = 1;
var avgFrameGapTime = 1;
var worstGap = 1;
var worstGapTime = timeMeasure.now() - 2000;
var worstFrame = 1;
var worstFrameTime = timeMeasure.now() - 2000;

function drawArrays(arraysToDrawStr)
{
	thisFrameStartTime = timeMeasure.now();
	
	var arraysToDraw = JSON.parse(arraysToDrawStr);
	
	drawArray(arraysToDraw.drawArrayBackground);
	drawArray(arraysToDraw.drawArrayAsteroids);
	drawArray(arraysToDraw.drawArrayShips);
	drawArray(arraysToDraw.drawArrayBullets);
	//all UI is white. Saves a draw call per text draw
	ctx.fillStyle="#FFFFFF";
	
	drawArray(arraysToDraw.drawArrayUI);
	
	thisFrameEndTime = timeMeasure.now();
	
	avgFrameCycleTime = ((thisFrameEndTime - lastFrameEndTime) + ( avgFrameCycleTime * (FPS_FILTER_DEPTH-1) )) / FPS_FILTER_DEPTH;
	avgFrameGapTime = ((thisFrameStartTime - lastFrameEndTime) + ( avgFrameGapTime   * (FPS_FILTER_DEPTH-1) )) / FPS_FILTER_DEPTH;
	avgFrameDrawTime = ((thisFrameEndTime - thisFrameStartTime) + ( avgFrameDrawTime * (FPS_FILTER_DEPTH-1) )) / FPS_FILTER_DEPTH;
		
	if(	thisFrameStartTime - lastFrameEndTime 	> worstGap || 
		thisFrameStartTime - worstGapTime 	> 2000	  )
	{
		worstGap = thisFrameStartTime - lastFrameEndTime;
		worstGapTime = thisFrameStartTime;
	}
	
	if(	thisFrameEndTime - thisFrameStartTime > worstFrame || 
		thisFrameEndTime - worstFrameTime	  > 2000	  		)
	{
		worstFrame = thisFrameEndTime - thisFrameStartTime;
		worstFrameTime = thisFrameEndTime;
	}
	
	lastFrameStartTime = thisFrameStartTime;
	lastFrameEndTime = thisFrameEndTime;
	
	//1000 to turn fpms into fps
	drawUIText("FPS = " + (1000/avgFrameCycleTime).toFixed(2), 300, 105);
	drawUIText("Average Frame Cycle = " + avgFrameCycleTime.toFixed(2), 300, 115);
	drawUIText("Average Frame Gap = " + avgFrameGapTime.toFixed(2), 300, 125);
	drawUIText("Average Frame Draw Time = " + avgFrameDrawTime.toFixed(2), 300, 135);
	drawUIText("Last Bad Frame Draw Time = " + worstFrame.toFixed(2), 300, 145);
	drawUIText("Last Bad Frame Cycle = " + worstGap.toFixed(2), 300, 155);
}

function drawArray(drawArray)
{
	
	if(drawArray.paraArray == null)
	{
		drawArray.paraArray = new Array(6);
	}
	var paraArray = drawArray.paraArray;
	
	var func = null;
	var j = -1;
	for(var i = 0 ; i < drawArray.length ; i++)
	{
		func = functionalise(drawArray[i]);
		
		//if we start with a null, we have reached the end of the list
		if(func == null)
			break;
		
		//if we have more than 5 parameters plus null, we are fucked.
		do
		{
			paraArray[++j] = drawArray[++i];
		}
		while(paraArray[j] != null)
		j = -1;
		
		//max parameters is 5 for now. Javascript ignores extra parameters, so that's fine
		func(paraArray[0],paraArray[1],paraArray[2],paraArray[3],paraArray[4]);
	}
}

function functionalise(funcStr)
{
	switch(funcStr)
	{
	
	case "drawBackground":
		return drawBackground;
	case "drawExplosionImg":
		return drawExplosionImg;
	case "drawAsteroidImg":
		return drawAsteroidImg;
	case "drawShipImg":
		return drawShipImg;
	case "drawBulletCircle":
		return drawBulletCircle;
	case "drawBulletLine":
		return drawBulletLine;
	case "drawUIText":
		return drawUIText;
	case null:
		return null;
	
	default:
		console.log("Unfunctionalisable function string!!!");
		return null;
	}
}


function drawBackground(canvasRight, canvasBottom)
{
	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,canvasRight,canvasBottom);
	
	ctx.save();
	ctx.globalAlpha = 1;
	ctx.drawImage(STARS_IMG, 0, 0);
	ctx.restore();
	
	ctx.save();
	ctx.globalAlpha = 1;
	ctx.drawImage(JUPITER_IMG, 69, 50);
	ctx.restore();
}

function drawExplosionImg(posX, posY, time, size)
{
	ctx.save();
	ctx.translate(posX, posY);
	ctx.fillStyle="#FF0000";
	ctx.globalAlpha =  Math.max((300 - time)/300, 0);
	ctx.beginPath(); 
	ctx.arc(0, 0, size + time * 30/300, 0, 2*Math.PI);
	ctx.fill();
	ctx.restore();
}

function drawAsteroidImg(posX, posY, size)
{
	ctx.save();
	ctx.translate(posX, posY);
	if(size > 3 || size < 0)
		console.log("drawAsteroidImg size: "+size);
	ctx.drawImage(	  ASTEROID_IMG_ARRAY[size], 
					-(ASTEROID_IMG_ARRAY[size].width/2), 
					-(ASTEROID_IMG_ARRAY[size].height/2));
	
	ctx.restore();
}

function drawShipImg(posX, posY, rot, engines, shields) 
{
	ctx.save();
	ctx.translate(posX, posY);
	ctx.rotate(rot);
	
	ctx.globalAlpha = 1;
	ctx.drawImage(SHIP_IMG, -(SHIP_IMG.width/2), -(SHIP_IMG.height/2));
	
	if(engines)
	{
		ctx.fillStyle="#ff4500";
		
		ctx.beginPath();  
		ctx.moveTo(-3, 14);
		ctx.lineTo( 3, 14);
		var rnd = Math.random();
		ctx.lineTo( 0, rnd * (50 - 16) + 16);
		ctx.globalAlpha = 1-rnd;
		ctx.closePath();
		ctx.fill();
	}
	
	if(shields)
	{
		ctx.fillStyle="#0000FF";
		ctx.globalAlpha = 0.5;
		ctx.beginPath();
		ctx.arc(0,0,25,0,2*Math.PI);
		ctx.fill();
	}
	ctx.restore();
}

function drawBulletCircle(posX,posY)
{
	ctx.save();
	ctx.translate(posX, posY);
	ctx.fillStyle="#FFFFFF";
	ctx.beginPath();
	ctx.arc(0,0,2,0,2*Math.PI);
	ctx.fill();
	ctx.restore();
}

function drawBulletLine(oldX,oldY,posX,posY)
{
	ctx.save();
	//ctx.translate(posX, posY);
	ctx.strokeStyle="#FFFFFF";
	ctx.lineWidth = 4;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(oldX,oldY);
	ctx.lineTo(posX,posY);
	ctx.stroke();
	ctx.restore();
}

function drawUIText(text, posX, posY)
{
	ctx.fillText(text, posX, posY);
}
