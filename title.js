/*

	Infinity
	2012/11/20

*/

enchant();

//////////////////////////////////////////////////////////////////////////////
//タイトル画面
//////////////////////////////////////////////////////////////////////////////
Title = Class.create(enchant.Scene,{
	//////////////////////////////////////////////////////////////////////////////
	//生成時初期化処理
	//////////////////////////////////////////////////////////////////////////////
	initialize:function(){
		enchant.Scene.call(this);

		//タイトルロゴ
		this.lg1 = new Sprite(160,30);
		this.lg1.image = game.assets['media/title_1.png'];
		this.lg1.alphaBlending ="lighter";
		this.lg1.opacity = 0;
		this.grp.addChild(this.lg1);
		this.lg2 = new Sprite(160,30);
		this.lg2.image = game.assets['media/title_2.png'];
		this.lg2.alphaBlending ="lighter";
		this.lg2.opacity = 0;
		this.grp.addChild(this.lg2);
	},
	//シーン開始時処理
	onenter:function(){
	},
	//シーン終了時処理
	onexit:function(){
	},
	onenterframe:function(){
		this.time++;
	},
	ontouchstart:function(e){
	},
	ontouchmove:function(e){
	},
	ontouchend:function(e){
	},
});


