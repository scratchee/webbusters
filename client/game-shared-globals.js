"use strict";

var timeMeasure = Date;

//if(typeof performance !== 'undefined' && performance != null && performance.now != null)
//	timeMeasure = performance;
//else if(typeof window !== 'undefined' && typeof window.performance !== 'undefined' && window.performance != null && window.performance.now != null)
//	timeMeasure = window.performance;
	
	
//define SeededRandom
function SeededRandom(min,max,seed)
{
	this.startSeed = seed;
	
	this.seed = seed;
	this.min = min || 0;
	this.max = max || 1;
	
	
	
	
	Object.preventExtensions(this);
}


SeededRandom.prototype.getNext = 	function()
									{
										var min = this.min;
										var max = this.max;
										
										this.seed = (this.seed * 9301 + 49297) % 233280;
										var rnd = this.seed / 233280;
									 
										return min + rnd * (max - min);
									};

Object.preventExtensions(SeededRandom);
// in order to work 'Math.seed' must NOT be undefined,
// so in any case, you HAVE to provide a Math.seed
Math.seededRandom = function(max, min) {
	
	return 	function(seed)
			{

			}

}


var ASSET_FOLDER = "assets/";

var FIRE_NOISE = ASSET_FOLDER + 'fire.ogg';

var NUM_LAYERED_NOISES = 8;

var BANG_NOISE = ASSET_FOLDER + 'bang.ogg';

// The higher this value, the less the FPS meter will be affected by quick changes
// Setting this to 1 will show you the FPS of the last sampled frame only
var FPS_FILTER_DEPTH = 50;


var MIN_SHIELDS = -20;
var MAX_SHIELDS = 100;
var SHIELD_HIT_COST = 40;
var SHIELD_REGEN = 10;
var SHIELD_START_COST = 10;
var SHIELD_RUN_COST = 30;

var ASTEROID_VELOCITY_VARIATION = 100;
var NUM_STARTING_ASTEROIDS = 10;

var MAX_BULLETS_PER_PLAYER = 6;

//fun, but annoying as hell
var BULLET_VELOCITY_VARIATION = 0;

var ASTEROID_SIZE_ARRAY = Array();

ASTEROID_SIZE_ARRAY[0] = 10;
ASTEROID_SIZE_ARRAY[1] = 20;
ASTEROID_SIZE_ARRAY[2] = 40;
ASTEROID_SIZE_ARRAY[3] = 60;

var networked = false;

