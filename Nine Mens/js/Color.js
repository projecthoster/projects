// Javascript Document
// Color Class

var Color = function(hexName) {
	this.hex = hexName;
};

Color.prototype.getHex = function() {
	return this.hex;
};

Color.prototype.setHex = function(hexName) {
	this.hex = hexName;
};