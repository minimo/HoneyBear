/*

	HoneyBear
	2012/11/20

*/

enchant();

var soundEnable = true;

var rand = function(max){ return ~~(Math.random() * max); }
var sec = function(s){return s*game.fps;}
window.onload = function() {
	var game = new Game( 320, 320 );
	game.fps = 30;
	var sec = function( time ){ return Math.floor( game.fps * time ); }

	//実行ブラウザ取得
	if( (navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 ){
		userAgent = "iOS";
		soundEnable = false;
	}else if( navigator.userAgent.indexOf('Android') > 0){
		userAgent = "Android";
		soundEnable = false;
	}else if( navigator.userAgent.indexOf('Chrome') > 0){
		userAgent = "Chrome";
	}else if( navigator.userAgent.indexOf('Firefox') > 0){
		userAgent = "Firefox";
		soundEnable = false;
	}else if( navigator.userAgent.indexOf('Safari') > 0){
		userAgent = "Safari";
		soundEnable = false;
	}else if( navigator.userAgent.indexOf('IE') > 0){
		userAgent = "IE";
	}else{
		userAgent = "unknown";
	}
	
	//アセット読み込み
	game.preload('icon0.png','chara1.png','font.png','map2.png','back.png','effect.gif','bee.png');

	game.onload = function(){
		//環境変数
		/////////////////////////////////////////////////////////////////////////////
		var level = 1;	//ゲームレベル
		var score = 0;	//スコア
		
		var touch = false;

		var items = [];	//画面上アイテム
		var stock = [];	//ストックアイテム
		var stockBee = [];	//ストック蜂

		//ステージ準備
		/////////////////////////////////////////////////////////////////////////////
		stage = new Group();
		game.rootScene.addChild( stage );
		game.rootScene.backgroundColor = 'rgb(0,100,0)';

		//背景
		/////////////////////////////////////////////////////////////////////////////
		var back1 = new Sprite(320,320);
		back1.image = game.assets['back.png'];
		back1.x = 0;
		back1.y = 0;
		back1.onenterframe = function(){
			this.x -= player.speed;
			if( this.x < -320 )this.x += 640;
		}
		stage.addChild(back1);

		//スコア表示
		/////////////////////////////////////////////////////////////////////////////
		var sc = new MutableText(0,0,16*10,"SCORE:0");
		sc.onenterframe = function(){
			this.text = "SCORE:"+score;
		}
		stage.addChild(sc);

		//タイマー表示
		/////////////////////////////////////////////////////////////////////////////
		var tm = new MutableText(180,0,16*10,"TIME:180");
		tm.time = 180;
		tm.onenterframe = function(){
			this.text = "TIME:"+this.time;
			if( this.age % 30 == 0 )this.time--;
			if( this.time < 0 )game.end(score,"SCORE:"+score);
		}
		stage.addChild(tm);

		//イコールボタン
		/////////////////////////////////////////////////////////////////////////////
		var eq = new Text(16,300,"=");
		eq.scaleX = 1.5;
		eq.scaleY = 1.5;
		stage.addChild(eq);

		//プレイヤキャラクタ
		/////////////////////////////////////////////////////////////////////////////
		var player = new Sprite( 32, 32 );
		player.image = game.assets['chara1.png'];
		player.frame = 0;
		player.x = 160;
		player.y = 160;
		player.bx = 160;
		player.by = 160;
		player.check = false;
		player.addEventListener( 'enterframe', function (){
			if( this.x < this.bx )this.scaleX = -1;
			if( this.x > this.bx )this.scaleX = 1;
			if( this.age % 3 == 0 ){
				if( this.x != this.bx || this.y != this.y ){
					this.frame++;
					if( this.frame == 3 )this.frame = 0;
				}else{
					this.frame=0;
				}
			}
			this.bx = this.x;
			this.by = this.y;
		});
		stage.addChild( player );

		stage.numStock = 0;	//アイテムストック数
		stage.numBee = 0;	//蜂ストック数
		stage.time = 0;
		//ステージ進行
		/////////////////////////////////////////////////////////////////////////////
		stage.addEventListener('enterframe', function() {
			if( this.time == 0 ){
				for( var i = 0; i < 15; i++ ){
					dropItem(i);
				}
			}else {
				if( this.time % 20 == 0 )dropItem();
			}
			this.time++;
		});

		//アイテムドロップ
		var ct = 0;
		var dropItem = function(num){
			var item = new Text(0,0," ");
			//数字を設定
			if( num == undefined || num == 0 ){
				item.val = rand(8)+1;
				num = 0;
			}else{
				item.val = num;
			}
			var txt = ""+item.val;
			item.op = null;
			//演算子を出す	
			var dice = rand(100);
			if( dice < 50 || num > 9 ){
				var op = rand(4);
				switch( op ){
					case 0:
						item.op = "+";
						break;
					case 1:
						item.op = "-";
						break;
					case 2:
						item.op = "*";
						break;
					case 3:
						item.op = "/";
						break;
				}
				txt = item.op;
			}
			item.setText(txt);
			item.x = rand(300)+10;
			item.y = rand(230)+20;
			item.scaleX = item.scaleY = 2;
			item.num = ct;ct++;
			item.life = rand(3)+15;
			item.tl.moveTo(rand(300)+10,rand(230)+20,sec(10)).moveTo(rand(300)+10,rand(230)+20,sec(10)).loop();
			item.onenterframe = function(){
				if( this.stock ){
				}else{
					if( this.age < sec(this.life-5) ){
					}else if( this.age < sec(this.life-1) ){
						if( this.age % 5 == 0 ){
							this.visible = !this.visible;
						}
					}else{
						if( this.age % 2 == 0 ){
							this.visible = !this.visible;
						}
					}
					if( this.age > sec(this.life) ){
						for( var i = 0,len = items.length; i < len; i++ ){
							if( items[i].num == this.num ){
								items.splice(i,1);
								break;
							}
						}
						stage.removeChild(this);
					}
				}
			}
			stage.addChild(item);
			items[items.length]=item;
		}

		//アイテム取得判定
		var collsionCheck = function(x,y){
			var max = items.length;
			var dis = 9999;
			var n = -1;
			for( var i = 0; i < max; i++ ){
				var it = items[i];
				var ix = it.x-x;
				var iy = it.y-y;
				var d = Math.sqrt(ix*ix+iy*iy);
				if( d < dis && d < 32 ){
					if( it.op && stage.numStock % 2 == 0 )continue;
					if( !it.op && stage.numStock % 2 == 1 )continue;
					dis = d;
					n = i;
				}
			}
			if( n == -1 )return false;
			stockItem(items[n]);
			items.splice(n,1);
		}

		//アイテムをストックする
		var stockItem = function(item){
			score+=10;
			item.visible = true;
			item.tl.clear().moveTo(16+stage.numStock*23,270,15,enchant.Easing.QUART_EASEOUT);
			item.stock = true;
			stage.numStock++;
			stock[stock.length] = item;
			
			if( stage.numStock == 7 ){
				answer();
			}
		}

		//式評価
		var answer = function(){
			var val = stock[0].val;
			var op = "";	//直前の演算子
			for( var i = 1,len = stock.length; i < len; i++ ){
				var st = stock[i];
				if( st.op ){
					op = stock[i].op;
				}else{
					switch( op ){
						case "+":
							val += st.val;
							break;
						case "-":
							val -= st.val;
							break;
						case "*":
							val *= st.val;
							break;
						case "/":
							val = ~~(val/st.val);
							break;
					}
				}
			}
			//答えの表示
			var ans = new Text(40,300,""+val);
			ans.scaleX = ans.scaleY = 1.5;
			stage.addChild(ans);
			ans.tl.then(function(){stage.stop=true;}).
			fadeOut(sec(1)).
			then(function(){stage.stop=false;stage.removeChild(this);});

			//数式消去
			for( var i = 0,len = stock.length; i < len; i++ ){
				var st = stock[i];
				st.tl.fadeOut(sec(1)).then(function(){stage.removeChild(this);});
			}

			//答えが蜂になりました
			if( val == 8 ){
				var bee = new Sprite(32,32);
				bee.image = game.assets['bee.png'];
				bee.x = 40;
				bee.y = 280;
				bee.px = -3;
				bee.sx = 0;
				bee.stop = false;
				bee.esc = false;
				bee.rad = 0;
				bee.onenterframe = function(){
					if( this.esc ){
						this.x = this.sx+Math.sin(this.rad)*10;
						this.y-=3;
						this.rad+=0.3;
						if( this.y < -32 )stage.removeChild(this);
						return;
					}
					if( this.stop )return;
					if( this.age > sec(20) ){
						if( this.age % 2 == 0 || this.age > sec(25)){
							this.px*=-1;
							this.x+=this.px;
						}
						if( this.age == sec(30) ){
							//逃げる
							stockBee.splice(0,1);
							stage.numBee--;
							this.stop = true;
							this.esc = true;
							this.sx = this.x;
							if( stage.numBee > 0 ){
								stockBee[0].tl.moveBy(-20,0,sec(1));
							}
						}
					}
				}
				stage.addChild(bee);

//				score+=100;
				var point = 100+stage.numStock*10;
				for( var i = 0; i < stage.numStock; i++ ){
					var op = stock[i].op;
					if( op == "*" || op == "/" ){
						point += 50;
					}
				}
				addScore(40,280,100);

				bee.tl.clear().moveTo(230+stage.numBee*20,250,sec(1),enchant.Easing.QUART_EASEOUT);
				stockBee[stockBee.length] = bee;
				stage.numBee++;
				if( stage.numBee == 3 ){
					bee.stop = true;
					bee.tl.moveTo(250,250,sec(1)).then(function(){stage.removeChild(this)});
					getHoney();
				}
			}
			stage.numStock = 0;
			stock.length = 0;
		}
		
		var getHoney = function(){
			for( var i = 0; i < 2; i++ ){
				var b = stockBee[i];
				b.stop = true;
				b.tl.delay(sec(1)).moveTo(250,250,sec(1)).then(function(){stage.removeChild(this)});
			}
			stockBee.length = 0;
			stage.numBee = 0;
			stage.tl.delay(sec(2)).
			then(function(){
				var explode = new Sprite(16,16);

				explode.image = game.assets['effect.gif'];

				explode.frame = 0;

				explode.x = 250;

				explode.y = 250;

				explode.scaleX = explode.scaleY = 3;

				explode.addEventListener( 'enterframe', function(){

					if( this.age % 2 == 0 )this.frame++;

					if( this.frame> 4 )stage.removeChild(this);

				});

				stage.addChild(explode);

			}).
			then(function(){
//				score+=500;
				addScore(250,220,500);

				var h = new Sprite(16,16);
				h.image = game.assets['icon0.png'];
				h.frame = 12;
				h.x = 250;
				h.y = 250;
				h.tl.moveBy(0,50,sec(1)).delay(sec(1)).then(function(){stage.removeChild(this);});
				stage.addChild(h);

				var b = new Sprite(32,32);
				b.image = game.assets['chara1.png'];
				b.frame = 5;
				b.x = -32;
				b.y = 280;
				b.bx = -32;
				b.onenterframe = function(){
					if( this.x < this.bx )this.scaleX = -1;
					if( this.x > this.bx )this.scaleX = 1;
					if( this.age % 3 == 0 ){
						this.frame++;
						if( this.frame == 8 ){
							this.frame = 5;
						}
					}
					this.bx = this.x;
				}
				b.tl.delay(sec(1)).moveBy(250,0,sec(1)).moveBy(-250,0,sec(1)).then(function(){stage.removeChild(this)});
				stage.addChild(b);
			});
		}

		var addScore = function(x,y,point){
			var pt = new Text(x,y,""+point);

			pt.point = point;

			pt.scaleX = pt.scaleY = 1.5;

			pt.tl.moveBy(0,-20,sec(3)).and().fadeOut(sec(3)).then(function(){stage.removeChild(this)});

			score+=point;			

			stage.addChild(pt);

		}

		//操作系
		/////////////////////////////////////////////////////////////////////////////
		var px = 0;
		var py = 0;
		game.rootScene.addEventListener('touchstart', function(e) {
			if( e.y < 250 ){
				player.tl.clear().then(function(){this.check=false;}).
				moveTo(e.x-16,e.y-16,10,enchant.Easing.QUART_EASEOUT).
				then(function(){collsionCheck(this.x+16,this.y+16);});
			}
			if( e.y > 250 && stage.numStock > 2 ){
				answer();
			}
		});
		game.rootScene.addEventListener('touchmove', function(e) {
		});
		game.rootScene.addEventListener('touchend', function(e) {
		});
	};
	game.start();
};
