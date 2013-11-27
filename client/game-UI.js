"use strict";


function generateCanvasUI()
{/*
	for(var shipNum = 0 ; shipNum < shipArray.length ; shipNum++)
	{
		var ship = shipArray[shipNum];
		
		var screenXPosition = 0;
		
		if(shipNum % 2 == 0)
			screenXPosition = 50;
		else if(shipNum % 2 == 1)
			screenXPosition = 650;
			
		var screenYPosition = 0;
		
		if(shipNum % 4 < 2)
			screenYPosition = 10;
		else if(shipNum % 4 >= 2)
			screenYPosition = 500;
		
		
		var addedYForLine = 30;
		
		if(ship.dead)
		{
			appendDrawUIText("Ship is Dead.", screenXPosition, screenYPosition + addedYForLine);
			//make lines stay lined up
			addedYForLine += 70;
		}
		else
		{
			appendDrawUIText("Position X= " + ship.pos.x.toFixed(2), screenXPosition, screenYPosition + addedYForLine);
			addedYForLine += 10;
			appendDrawUIText("Position Y= " + ship.pos.y.toFixed(2), screenXPosition, screenYPosition + addedYForLine);
			addedYForLine += 10;
			appendDrawUIText("Velocity X= " + ship.vel.x.toFixed(2), screenXPosition, screenYPosition + addedYForLine);
			addedYForLine += 10;
			appendDrawUIText("Velocity Y= " + ship.vel.y.toFixed(2), screenXPosition, screenYPosition + addedYForLine);
			addedYForLine += 10;
			appendDrawUIText("Acceleration X= " + ship.acc.x.toFixed(2), screenXPosition, screenYPosition + addedYForLine);
			addedYForLine += 10;
			appendDrawUIText("Acceleration Y= " + ship.acc.y.toFixed(2), screenXPosition, screenYPosition + addedYForLine);
			addedYForLine += 10;
			appendDrawUIText("shield Strength Y= " + ship.shieldStrength.toFixed(2), screenXPosition, screenYPosition + addedYForLine);
			addedYForLine += 10;
		}
		appendDrawUIText("Bullet Queue F= " + ship.frontOfBulletQueue, screenXPosition, screenYPosition + addedYForLine);
		addedYForLine += 10;
		appendDrawUIText("Bullet Queue B= " + ship.backOfBulletQueue, screenXPosition, screenYPosition + addedYForLine);
		addedYForLine += 10;
	}*/


	thisStepEndTime = timeMeasure.now();
	
	avgStepCycleTime = ((thisStepEndTime - lastStepEndTime) + ( avgStepCycleTime * (FPS_FILTER_DEPTH-1) )) / FPS_FILTER_DEPTH;
	avgStepGapTime = ((thisStepStartTime - lastStepEndTime) + ( avgStepGapTime   * (FPS_FILTER_DEPTH-1) )) / FPS_FILTER_DEPTH;
	avgStepCalcTime = ((thisStepEndTime - thisStepStartTime) + ( avgStepCalcTime * (FPS_FILTER_DEPTH-1) )) / FPS_FILTER_DEPTH;
	
	if(	thisStepEndTime - thisStepStartTime > worstStep || 
		thisStepEndTime - worstStepTime	  > 2000	  		)
	{
		worstStep = thisStepEndTime - thisStepStartTime;
		worstStepTime = thisStepEndTime;
	}
	
	if(	thisStepStartTime - lastStepEndTime 	> worstGap || 
		thisStepStartTime - worstGapTime 	> 2000	  )
	{
		worstGap = thisStepStartTime - lastStepEndTime;
		worstGapTime = thisStepStartTime;
	}
	
	if(	thisStepEndTime - lastFrameSentTime 	> worstFrameSentGap || 
		thisStepEndTime - worstFrameSentGapTime 	> 3000	  )
	{
		worstFrameSentGap = thisStepEndTime - lastFrameSentTime;
		worstFrameSentGapTime = thisStepEndTime;
	}
	
	lastStepStartTime = thisStepStartTime;
	lastStepEndTime = thisStepEndTime;
	
//	if(networked)
//		appendDrawUIText("rrPing = " + rrPing.toFixed(2), 300, 10);

	//1000 to turn spms into sps
	appendDrawUIText("Steps/s = " + (1000/avgStepCycleTime).toFixed(2), 300, 20);
	appendDrawUIText("Average Step Cycle = " + avgStepCycleTime.toFixed(2), 300, 30);
	appendDrawUIText("Average Step Gap = " + avgStepGapTime.toFixed(2), 300, 40);
	appendDrawUIText("Average Step Calc Time = " + avgStepCalcTime.toFixed(2), 300, 50);
	appendDrawUIText("Last Bad Step Calc Time = " + worstStep.toFixed(2), 300, 60);
	appendDrawUIText("Last Bad Step Gap = " + worstGap.toFixed(2), 300, 70);
	appendDrawUIText("worst lastFrameSentTime Gap = " + worstFrameSentGap.toFixed(2), 300, 80);
}

