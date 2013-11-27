"use strict";

var drawArrayBackground = new Array(20);
	drawArrayBackground.currEnd = 0;

var drawArrayAsteroids = new Array(800);
	drawArrayAsteroids.currEnd = 0;

var drawArrayShips = new Array(500);
	drawArrayShips.currEnd = 0;

var drawArrayBullets = new Array(250);
	drawArrayBullets.currEnd = 0;
	
var drawArrayUI = new Array(500);
	drawArrayUI.currEnd = 0;

var allDrawArrays = new Object();

allDrawArrays.drawArrayBackground = drawArrayBackground;
allDrawArrays.drawArrayAsteroids = drawArrayAsteroids;
allDrawArrays.drawArrayShips = drawArrayShips;
allDrawArrays.drawArrayBullets = drawArrayBullets;
allDrawArrays.drawArrayUI = drawArrayUI;

function appendDrawBackground(canvasRight, canvasBottom)
{
	if(canvasRight == null 	|| canvasBottom == null)
		console.log("appendDrawBackground: ARGGHH! EVIL NULLS!");
	
	drawArrayBackground[drawArrayBackground.currEnd++] = "drawBackground";
	
	drawArrayBackground[drawArrayBackground.currEnd++] = canvasRight;
	drawArrayBackground[drawArrayBackground.currEnd++] = canvasBottom;
	drawArrayBackground[drawArrayBackground.currEnd++] = null;
}

function appendDrawExplosion(gameObj)
{
	appendDrawExplosionImg(gameObj.pos, gameObj);
	
	
	appendDrawBorderIllusions(gameObj.pos, appendDrawExplosionImg, gameObj);
}

function appendDrawExplosionImg(pos, gameObj)
{
	if(gameObj == null 	|| pos.x == null || pos.y == null
						|| gameObj.deadTime == null 
						|| gameObj.explosionSize == null)
		console.log("appendDrawExplosionImg: ARGGHH! EVIL NULLS!");
	
	var drawArray = drawArrayAsteroids;
	if(Ship.prototype.isPrototypeOf(gameObj))
		drawArray = drawArrayShips;
	
	drawArray[drawArray.currEnd++] = "drawExplosionImg";
	
	drawArray[drawArray.currEnd++] = pos.x;
	drawArray[drawArray.currEnd++] = pos.y;
	drawArray[drawArray.currEnd++] = thisTime - gameObj.deadTime;
	drawArray[drawArray.currEnd++] = gameObj.explosionSize;
	drawArray[drawArray.currEnd++] = null;
}

function appendDrawAsteroid(asteroid)
{
	appendDrawAsteroidImg(asteroid.pos, asteroid);
	
	
	appendDrawBorderIllusions(asteroid.pos, appendDrawAsteroidImg, asteroid);
}

function appendDrawAsteroidImg(pos, asteroid)
{
	if(asteroid == null || pos.x == null || pos.y == null
						|| asteroid.size == null)
		console.log("appendDrawAsteroidImg: ARGGHH! EVIL NULLS!");
	
	drawArrayAsteroids[drawArrayAsteroids.currEnd++] = "drawAsteroidImg";
	
	drawArrayAsteroids[drawArrayAsteroids.currEnd++] = pos.x;
	drawArrayAsteroids[drawArrayAsteroids.currEnd++] = pos.y;
	drawArrayAsteroids[drawArrayAsteroids.currEnd++] = asteroid.size;
	drawArrayAsteroids[drawArrayAsteroids.currEnd++] = null;
}

function appendDrawShipImg(pos, ship) 
{
	if(ship == null || pos.x == null || pos.y == null || ship.rot == null 
					|| ship.forwards == null || ship.shields == null)
		console.log("appendDrawShipImg: ARGGHH! EVIL NULLS!");
	
	drawArrayShips[drawArrayShips.currEnd++] = "drawShipImg";
	
	drawArrayShips[drawArrayShips.currEnd++] = pos.x;
	drawArrayShips[drawArrayShips.currEnd++] = pos.y;
	drawArrayShips[drawArrayShips.currEnd++] = ship.rot;
	drawArrayShips[drawArrayShips.currEnd++] = ship.forwards;
	drawArrayShips[drawArrayShips.currEnd++] = ship.shields;
	drawArrayShips[drawArrayShips.currEnd++] = null;
}

function appendDrawShip(ship) 
{
	appendDrawShipImg(ship.pos, ship);
	
	appendDrawBorderIllusions(ship.pos, appendDrawShipImg, ship);
}

function appendDrawBullet(oldPos, pos)
{
	if((oldPos != null && ( oldPos.x == null || oldPos.y == null ))
	    || pos == null ||	   pos.x == null ||	   pos.y == null	)
		console.log("appendDrawBullet: ARGGHH! EVIL NULLS!");
	
	if(oldPos != null)
	{
		drawArrayBullets[drawArrayBullets.currEnd++] = "drawBulletLine";
		
		drawArrayBullets[drawArrayBullets.currEnd++] = oldPos.x;
		drawArrayBullets[drawArrayBullets.currEnd++] = oldPos.y;
	}
	else
	{
		drawArrayBullets[drawArrayBullets.currEnd++] = "drawBulletCircle";
	}
	
	drawArrayBullets[drawArrayBullets.currEnd++] = pos.x;
	drawArrayBullets[drawArrayBullets.currEnd++] = pos.y;
	drawArrayBullets[drawArrayBullets.currEnd++] = null;
}

function appendDrawUIText(text, posX, posY)
{
	if(text == null || posX == null || posY == null)
		console.log("appendDrawUIText: ARGGHH! EVIL NULLS!");
	
	drawArrayUI[drawArrayUI.currEnd++] = "drawUIText";
	
	drawArrayUI[drawArrayUI.currEnd++] = text;
	drawArrayUI[drawArrayUI.currEnd++] = posX;
	drawArrayUI[drawArrayUI.currEnd++] = posY;
	drawArrayUI[drawArrayUI.currEnd++] = null;
}

function appendDrawBorderIllusions(pos, funcDrawGameObjImg, gameObj)
{
	if(appendDrawBorderIllusions.illusionPosition == null)
	{
		appendDrawBorderIllusions.illusionPosition = new Vec2(0,0);
	}
	
	var illusionPosition = appendDrawBorderIllusions.illusionPosition;
	
	//if near top, draw illusion on bottom
	if(		pos.y < 100					)
	{
		illusionPosition.x = pos.x;
		illusionPosition.y = pos.y + canvasBottom;
		
		funcDrawGameObjImg(illusionPosition, gameObj);
	}
	
	//if near top-right, draw illusion on bottom-left
	if(		pos.x > canvasRight  - 100 &&
			pos.y < 100					)
	{
		illusionPosition.x = pos.x - canvasRight;
		illusionPosition.y = pos.y + canvasBottom;
		
		funcDrawGameObjImg(illusionPosition, gameObj);
	}
	
	//if near right, draw illusion on left
	if(		pos.x > canvasRight  - 100	)
	{
		illusionPosition.x = pos.x - canvasRight;
		illusionPosition.y = pos.y;
		
		funcDrawGameObjImg(illusionPosition, gameObj);
	}
	
	//if near bottom-right, draw illusion on top-left
	if(		pos.x > canvasRight  - 100 && 	
			pos.y > canvasBottom - 100	)
	{
		illusionPosition.x = pos.x - canvasRight;
		illusionPosition.y = pos.y - canvasBottom;
		
		funcDrawGameObjImg(illusionPosition, gameObj);
	}
	
	//if near bottom, draw illusion on top
	if(		pos.y > canvasBottom - 100	)
	{
		illusionPosition.x = pos.x;
		illusionPosition.y = pos.y - canvasBottom;
		
		funcDrawGameObjImg(illusionPosition, gameObj);
	}
	
	//if near bottom-left, draw illusion on top-right
	if(		pos.x < 100 				 && 
			pos.y > canvasBottom - 100	)
	{
		illusionPosition.x = pos.x + canvasRight;
		illusionPosition.y = pos.y - canvasBottom;
		
		funcDrawGameObjImg(illusionPosition, gameObj);
	}
	
	//if near left, draw illusion on right
	if(		pos.x < 100					)
	{
		illusionPosition.x = pos.x + canvasRight;
		illusionPosition.y = pos.y;
		
		funcDrawGameObjImg(illusionPosition, gameObj);
	}
	
	//if near top-left, draw illusion on bottom-right
	if(		pos.x < 100 				 &&
			pos.y < 100					)
	{
		illusionPosition.x = pos.x + canvasRight;
		illusionPosition.y = pos.y + canvasBottom;
		
		funcDrawGameObjImg(illusionPosition, gameObj);
	}
}

function completeArrays()
{
	drawArrayBackground[drawArrayBackground.currEnd++	] = null;
	drawArrayAsteroids[	drawArrayAsteroids.currEnd++	] = null;
	drawArrayShips[		drawArrayShips.currEnd++		] = null;
	drawArrayBullets[	drawArrayBullets.currEnd++		] = null;
	drawArrayUI[		drawArrayUI.currEnd++			] = null;
	
//	console.log("drawArrayBackground.currEnd == " + drawArrayBackground.currEnd);
//	console.log("drawArrayAsteroids.currEnd == " + drawArrayAsteroids.currEnd);
//	console.log("drawArrayShips.currEnd == " + drawArrayShips.currEnd);
//	console.log("drawArrayBullets.currEnd == " + drawArrayBullets.currEnd);
//	console.log("drawArrayUI.currEnd == " + drawArrayUI.currEnd);
	
	drawArrayBackground.length = drawArrayBackground.currEnd++;
	drawArrayAsteroids.length = drawArrayAsteroids.currEnd++;
	drawArrayShips.length = drawArrayShips.currEnd++;
	drawArrayBullets.length = drawArrayBullets.currEnd++;
	drawArrayUI.length = drawArrayUI.currEnd++;
	
	var result = JSON.stringify(allDrawArrays);
	//console.log(result);
	
	return result;
}

function resetArrays()
{
	drawArrayBackground.currEnd	= 0;
	drawArrayAsteroids.currEnd	= 0;
	drawArrayShips.currEnd		= 0;
	drawArrayBullets.currEnd	= 0;
	drawArrayUI.currEnd 		= 0;
}
