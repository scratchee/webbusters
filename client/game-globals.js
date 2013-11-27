"use strict";

// Enable the passage of the 'this' object through the JavaScript timers

var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;
 
window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeST__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};
 
window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeSI__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};

	
var ASTEROID_IMG_ARRAY = new Array(4);

ASTEROID_IMG_ARRAY[0] = new Image();
ASTEROID_IMG_ARRAY[1] = new Image();
ASTEROID_IMG_ARRAY[2] = new Image();
ASTEROID_IMG_ARRAY[3] = new Image();

ASTEROID_IMG_ARRAY[0].src = ASSET_FOLDER + 'asteroid-0.png';
ASTEROID_IMG_ARRAY[1].src = ASSET_FOLDER + 'asteroid-1.png';
ASTEROID_IMG_ARRAY[2].src = ASSET_FOLDER + 'asteroid-2.png';
ASTEROID_IMG_ARRAY[3].src = ASSET_FOLDER + 'asteroid-3.png';

var JUPITER_IMG = new Image();
JUPITER_IMG.src = ASSET_FOLDER + 'jupiter.png';

var STARS_IMG = new Image();
STARS_IMG.src = ASSET_FOLDER + 'stars.jpg';

var SHIP_IMG = new Image();
SHIP_IMG.src = ASSET_FOLDER + 'ship-circle.png';

var fireNoises = new Array(8);
fireNoises[0] = new Audio(FIRE_NOISE);
fireNoises[1] = new Audio(FIRE_NOISE);
fireNoises[2] = new Audio(FIRE_NOISE);
fireNoises[3] = new Audio(FIRE_NOISE);
fireNoises[4] = new Audio(FIRE_NOISE);
fireNoises[5] = new Audio(FIRE_NOISE);
fireNoises[6] = new Audio(FIRE_NOISE);
fireNoises[7] = new Audio(FIRE_NOISE);

var lastPlayedFireNoise = 7;

var bangNoises = new Array(8);
bangNoises[0] = new Audio(BANG_NOISE);
bangNoises[1] = new Audio(BANG_NOISE);
bangNoises[2] = new Audio(BANG_NOISE);
bangNoises[3] = new Audio(BANG_NOISE);
bangNoises[4] = new Audio(BANG_NOISE);
bangNoises[5] = new Audio(BANG_NOISE);
bangNoises[6] = new Audio(BANG_NOISE);
bangNoises[7] = new Audio(BANG_NOISE);

var lastPlayedBangNoise = 7;

var canvasRight = 800;
var canvasBottom = 600;






var shipArray = Array();
var asteroidArray = Array();


var asteroidNetPriorityArray = Array();
var ANPAStart = 0;
var ANPAEnd = 0;
var ANPALength = 0;

var ctx;

var lastTime;
var thisTime;
var requestAnimationFrame = window.requestAnimationFrame || 
						 window.mozRequestAnimationFrame || 
					  window.webkitRequestAnimationFrame || 
						  window.msRequestAnimationFrame;

var media;
var client;
var server;



var myPeerID;
var otherPeerID;

var peer;
var netConn = null;

var networked = false;

var ownedShip = 0;

var recvAsteroidArray = null;

var asteroidArraySendPos = 0;

/* a.play();// – start playing
 a.pause();// – stop playing
 a.currentTime = 0;// – rewind to beginning
 a.duration;// – returns length
 a.ended;// – returns true if finished
 a.loop = true;// – set looping
 a.volume = 0.5;// – half volume
 a.muted = true;// – mute
 a.addEventListener('ended', func);// – call ‘func()’ when finishes playing*/


var keyPressList = new Array(100);
var keyPressShortList = new Array(100);

var currentKeyPress = 0;

for(var i = 0 ; i < keyPressList.length ; i++)
{
	keyPressList[i] = new Object();
	
	keyPressList[i].shipNum = 0;
	keyPressList[i].time = 0;
	keyPressList[i].key = 0;
	keyPressList[i].type = 0;
}

var worker;

var configObj = new Object();
var keyPressArray;
var changesSent = true;


var lastConsoleLogMessage = "";
 
 