/*

	intersectとwithinを絶対座標変換を考慮してみた
	2012/08/27
	This program is MIT lisence.

*/


enchant.Entity.prototype.absX = function(){
	var x = 0;
	if( this.parentNode )x = this.parentNode.absX();
	return this.x+x;
};

enchant.Entity.prototype.absY = function(){
	var y = 0;
	if( this.parentNode )y = this.parentNode.absY();
	return this.y+y;
};

enchant.Entity.prototype.intersectEX = function(other){
	var x = this.absX();
	var y = this.absY();
	return x < other.x + other.width && other.x < x + this.width && y < other.y + other.height && other.y < y + this.height;
};

enchant.Entity.prototype.withinEX: function(other, distance){
	var x = this.absX();
	var y = this.absY();
	if( distance == null ){
		distance = (this.width + this.height + other.width + other.height) / 4;
	}
	var _;
	return	(_ = x - other.x + (this.width - other.width) / 2) * _ +
			(_ = y - other.y + (this.height - other.height) / 2) * _ < distance * distance;
};
