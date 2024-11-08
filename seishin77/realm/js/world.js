var isize=64;
var zoom=1;

var size = zoom * isize;
var w = size * 8;
var h = w;

Crafty.c('game', {
      board:[],
      camps:[{'skeletons':6}, {'skeletons':6}],
      whoPlays:0,
      id:'',
      beginDate:'',
      cards:[],
      selected:-1,
      // 0 for green camp, 1 for blue camp
      igame:[{'king':[4], 'necromant':[3], 'orc':[2,5], 'troll':[1,6], 'skeleton':[9, 10, 11, 12, 13, 14]},
	     {'king':[59], 'necromant':[60], 'orc':[58,61], 'troll':[57, 62], 'skeleton':[49,50,51,52,53,54]}],
      init:function(){
      this.addComponent('2D, DOM');
      for(i=0; i < 64; i++){
	var y = Math.floor(i/8);
	var x = i%8;
	c = Crafty.e('case').attr({id:i, x:isize * x, y:isize * y, w:isize, h:isize, wg:x%2==y%2?0:1, z:0, game:this});
	this.board.push(c);
      }
      this.bind("Draw", function() {
	  this.drawBoard();
	});
    },
      drawBoard:function(){
      ctx = Crafty.canvas.context;

      for(i=0; i < 64; i++){
	this.board[i].drawCase(ctx);
      }
    },
      newGame:function(){
      for(c in this.igame){
	for(p in this.igame[c]){
	  for(n in this.igame[c][p]){
	    this.board[this.igame[c][p][n]].setCamp(c).setPiece(p);
	  }
	}
      }
    },
      select:function(pos){
      if(this.selected != -1)
	this.board[this.selected].unclick();
      this.selected=pos;
    },

      });

Crafty.c('case', {
      id:0,
      wg:0, // 0 for green, 1 for white, 2 & 3 for blue (highlight)
      types:['king', 'necromant','orc','troll','skeleton'],
      game:null,
      clicked:false,
      init:function(){
      this.addComponent('2D, Canvas, Color, Mouse, piece');
      this.bind('Click', function(){
	  if(this.highlighted()){
	    pos = this.game.selected;
	    p = this.game.board[this.game.selected];
	    this.game.select(-1);
	    if(this.type != '')
	      p.capture(this);
	    this.setPiece(p.type).setCamp(p.camp).setPromotion(p.adv);
	    if(this.id < 8 && p.camp == 1){
	      this.promote();
	    }
	    else
	      if(this.id > 55 && p.camp == 0){
		this.promote();
	      }
	    this.game.board[pos] = 
	      Crafty.e('case').attr({id:p.id, x:p.x, y:p.y, w:p.w, h:p.h,
		    wg:p.wg, z:0, game:p.game});
	    this.game.board[pos].draw();
	  }
	  else{
	    if(this.type != ''){
	      if(this.clicked){
		this.clicked=false;
		this.game.select(-1);
	      }
	      else{
		this.game.select(this.id);
		this.clicked=true;
	      }
	      var mov = this.movements();
	      for(m in mov){
		move = (this.camp==0?-1:1) * mov[m];
		if(((move%8 != 1 && move!= -7)|| this.id%8!=7) && 
		   ((move%8 != -1 && move != 7) || this.id%8!=0)){
		  var pos = this.id + move;
		  if(pos > -1 && pos < 64){
		    if(this.clicked)
		      this.game.board[pos].highlight();
		    else
		      this.game.board[pos].downlight();
		  }
		}
	      }
	    }
	    else
	      this.game.select(-1);
	  }
	});
      this.bind("Draw", function(obj) {
	  this.drawCase(obj.ctx, obj.pos);
	});

    },
      highlighted:function(){
      return this.wg > 1;
    },
      highlight:function(){
      if(this.wg < 2){
	this.wg += 2;
	this.draw();
      }
    },
      downlight:function(){
      if(this.wg>1){
	this.wg -= 2;
	this.draw();
      }
    },
      drawCase:function(ctx, pos){
//      alert('drawCase ' + this.wg);
      this.color((this.wg>1?'#aaf':(this.wg==0?'#faa':'#fff')));
    },
      unclick:function(){
      if(this.type != ''){
	this.clicked=false;
	var mov = this.movements();
	mod=false;
	for(m in mov){
	  var pos = this.id + (this.camp==0?-1:1) * mov[m];
	  if(pos > -1 && pos < 64){
	    mod=true;
	    this.game.board[pos].downlight();
	  }
	}
      }
    },
      
  });
Crafty.c("piece", {
      type:'',
      camp:0,
      adv:0,
      moves:[{'king':[-9, -8, -7, -1, 1, 7, 8, 9], 'skeleton':[-8, -1, 1],
	  'troll':[-16, -9, -8, -7, 8], 'orc':[-9, -7, 8], 'necromant':[-8, 7, 9]},
	{'king':[-9, -8, -7, -1, 1, 7, 8, 9], 'skeleton':[-9, -8, -7, -1, 1, 7, 8, 9],
	    'troll':[-16, -9, -8, -7, -1, 1, 7, 8, 9], 'orc':[-9, -8, -7, -1, 1, 7, 8, 9],
	    'necromant':[-9, -8, -7, -1, 1, 7, 8, 9]}],
      init:function(){
      this.addComponent("2D, Canvas");
    },
      setPiece:function(p){
      this.removeComponent((this.adv==1?'star_':'')+(this.camp==0?'green_':'blue_') + this.type);
      this.type=p;
      if(this.type != '')
	this.addComponent((this.adv==1?'star_':'')+(this.camp==0?'green_':'blue_') + this.type);
      //      show_props(this.__c);
      return this;
    },
      setCamp:function(p){
      this.removeComponent((this.adv==1?'star_':'')+(this.camp==0?'green_':'blue_') + this.type);
      this.camp=p;
      if(this.type != '')
	this.addComponent((this.adv==1?'star_':'')+(this.camp==0?'green_':'blue_') + this.type);
      return this;
    },
      setPromotion:function(a){
      if(a==1)
	this.promote();
      else
	this.demote();
      return this;
    },
      promote:function(){
      this.adv = 1;
      this.removeComponent((this.adv==1?'star_':'')+(this.camp==0?'green_':'blue_') + this.type);
      this.addComponent('star');
      this.addComponent((this.adv==1?'star_':'')+(this.camp==0?'green_':'blue_') + this.type);
      this.draw();
    },
      demote:function(){
      this.removeComponent((this.adv==1?'star_':'')+(this.camp==0?'green_':'blue_') + this.type);
      this.removeComponent('star');
      this.addComponent((this.adv==1?'star_':'')+(this.camp==0?'green_':'blue_') + this.type);
      this.adv = 0;
      this.draw();
    },
      movements:function(){
      if(this.type != '')
	return this.moves[this.adv][this.type];
      return [];
    },
      capture:function(t){
      if(t.type == 'skeleton'){
	this.game.camps[t.camp]['skeletons']--;
      }
      if(this.type == 'necromant' && this.game.camps[this.camp]['skeletons'] < 8){
	start = 40 * this.camp;
	end = start + 23;
	b = new Bag();
	for(var i= start; i <= end; i++){
	  if(this.game.board[i].type == ''){
	    b.add(i);
	  }
	}
	pos = b.next();
	c = this.game.board[pos];
	this.game.board[pos] = 
	  Crafty.e('case').attr({id:pos, x:c.x, y:c.y, w:c.w, h:c.h,
		wg:c.wg, z:0, game:c.game});
	this.game.board[pos].setPiece('skeleton').setCamp(this.camp);
	this.game.camps[this.camp]['skeletons']++;
	this.game.board[pos].draw();
      }
    },      
      });
