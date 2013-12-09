importScripts("buffer-loader.js");
// may need to move these vars somewhere else
var context;
var bufferLoader;

function init() {
    // Fix up prefixing
    // may want to de-webkitify this at some point
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    
    //pre-load all sounds here
    bufferLoader = new BufferLoader(
    context,
    [
      'assets/bang.ogg',
      'assets/boom.ogg',
      'assets/engine.ogg',
      'assets/engine2.ogg',
      'assets/fire.ogg',
    ],
    finishedLoading
    );
    
    bufferLoader.load();
}

// this function will be moved to the game init.
function finishedLoading(bufferList) {
    // Create two sources and play them both together.
    var source1 = context.createBufferSource();
    source1.buffer = bufferList[0];
    
    source1.connect(context.destination);
    source1.start(0);
}

