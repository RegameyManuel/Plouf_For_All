function gomain(){
  Crafty.scene("main"); //when everything is loaded, run the main scene
}


if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";

        if (this === void 0 || this === null) throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) return -1;

        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n) // shortcut for verifying if it's NaN
            n = 0;
            else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }

        if (n >= len) return -1;

        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) return k;
        }
        return -1;
    };
}


var Bag=function(){
  this.data = [];
  this.currentPosition = -1;
};

Bag.prototype.size=function(){
  return this.data.length;
};

Bag.prototype.add=function(a){
  this.data.push(a);
  this.currentPosition = this.size() - 1;
};

Bag.prototype.clear=function(){
  this.data.length = 0;
  this.currentPosition = -1;
};

Bag.prototype.next=function(){
  if(this.size() == 0)
    return undefined;

  if(this.currentPosition < 1){
    this.currentPosition = this.size() - 1;
    return this.data[0];
  }
  this.random = new Random();
  pos = Math.floor(this.random.uniform(0, this.currentPosition+1));
  curItem = this.data[pos];
  this.data[pos] = this.data[this.currentPosition];
  this.data[this.currentPosition] = curItem;
  this.currentPosition--;
  return curItem;
};

function show_props(o, n){
  retour = '';
  for(i in o){
    retour += (retour!=''?"\n":'') + i + ' => ' + o[i];
  }
  alert(retour);
}

var pdebug = function (t){
  txt='';
  for(p in t.prototype)
    txt += p + "\n";
  alert(txt);

}

window.onload = function () {
  var spacer = window.document.getElementById('spacer1');
  if(!spacer){
    var spacer = window.document.createElement('div');
    window.document.getElementsByTagName('BODY')[0].appendChild(spacer);
    spacer.id = 'spacer1';
  }
  spacer.style.height = Math.floor((window.innerHeight-h)/2-5) + 'px';

  Crafty.init(w, h);
  var spacer = window.document.getElementById('spacer2');
  if(!spacer){
    var spacer = window.document.createElement('div');
    window.document.getElementsByTagName('BODY')[0].appendChild(spacer);
    spacer.id = 'spacer2';
  }
  spacer.style.height = Math.floor((window.innerHeight-h)/2) + 'px';

  debug = window.document.getElementById('debug1');
  if(!debug){
    debug = window.document.createElement('div');
    window.document.getElementsByTagName('BODY')[0].appendChild(debug);
    debug.id = 'debug1';
  }

  Crafty.scene("main", function () {
      Crafty.canvas.init();
      Crafty.viewport.scale(zoom);
      var g = Crafty.e('game').attr({x:0, y:0, w:w, h:h, z:0}).newGame();
    });

  Crafty.scene("loading", function () {
      //load takes an array of assets and a callback when complete
      Crafty.load([url + "pieces.svg"], function () {
		    Crafty.sprite(64, url + "pieces.svg", {
			"blue_king": [0, 0],
			  "blue_necromant": [1, 0],
			  "blue_orc": [2, 0],
			  "blue_troll": [3, 0],
			  "blue_skeleton": [4, 0],
			"star_blue_king": [0, 2],
			  "star_blue_necromant": [1, 2],
			  "star_blue_orc": [2, 2],
			  "star_blue_troll": [3, 2],
			  "star_blue_skeleton": [4, 2],
			"green_king": [0, 1],
			  "green_necromant": [1, 1],
			  "green_orc": [2, 1],
			  "green_troll": [3, 1],
			  "green_skeleton": [4, 1],
			"star_green_king": [0, 3],
			  "star_green_necromant": [1, 3],
			  "star_green_orc": [2, 3],
			  "star_green_troll": [3, 3],
			  "star_green_skeleton": [4, 3],
			  });
	  setTimeout("gomain()", 125);
	});
      Crafty.e("2D, DOM, Color").attr({x:0, y:0, w:w, h:h}).color('#000');
      Crafty.e("2D, DOM, Text").attr({ w: w, h: 20, x: 0, y: h/2-10 })
	.text("Loading...").css({ "text-align": "center" });
    });
  
  //automatically play the loading scene
  Crafty.scene("loading");
};
