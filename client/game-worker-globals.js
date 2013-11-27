"use strict";

// Enable the passage of the 'this' object through the JavaScript timers
/*
//var __nativeST__ = setTimeout, __nativeSI__ = setInterval;
// 
//setTimeout = function (vCallback, nDelay / *, argumentToPass1, argumentToPass2, etc. * /) {
//  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
//  return __nativeST__(vCallback instanceof Function ? function () {
//    vCallback.apply(oThis, aArgs);
//  } : vCallback, nDelay);
//};
// 
//setInterval = function (vCallback, nDelay / *, argumentToPass1, argumentToPass2, etc. * /) {
// var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
//  return __nativeSI__(vCallback instanceof Function ? function () {
//    vCallback.apply(oThis, aArgs);
//  } : vCallback, nDelay);
//};
*/
var canvasRight = 800;
var canvasBottom = 600;



var shipArray = Array();
var asteroidArray = Array();


var lastTime;
var thisTime;


var thisStepStartTime = timeMeasure.now();
var thisStepEndTime = timeMeasure.now();
var lastStepStartTime = timeMeasure.now();
var lastStepEndTime = timeMeasure.now();
var avgStepCalcTime = 1;
var avgStepCycleTime = 1;
var avgStepGapTime = 1;
var worstGap = 1;
var worstGapTime = timeMeasure.now() - 2000;
var worstStep = 1;
var worstStepTime = timeMeasure.now() - 2000;
var worstFrameSentGap = 1;
var worstFrameSentGapTime = timeMeasure.now() - 3000;


var WorkerState = {
    STOPPED : 0,
    STARTED : 1,
    PAUSED : 2
}

var currentState = WorkerState.STOPPED;

var numPlayers = 1;

var playerSettings = null;

var timeToNextFrame = 8;

var console = {
    log :	function(text)
			{
				postMessage("console.log|" + text);
			}
}
