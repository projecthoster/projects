// Javascript Document
//  - Useful functions that need a home.

function parseInt2sComp( binString, numBits ) {
    var something = parseInt( binString, 2 ) % Math.pow(2,numBits);

    if ( something >= Math.pow( 2, numBits-1 ) ) {
        return something - Math.pow(2,numBits);
    }
    else {
        return something;
    }
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function padWithSpaces(str, spaces) {
	var pad = "";
	for(var i = 0; i < spaces; i++) {
		pad += " ";
	}
	return pad.substring(0, pad.length - str.length) + str;
}

function intToPadHex(num) {
	var pad = "0000";
	var hexStr = num.toString(16);
	return pad.substring(0, pad.length - hexStr.length) + hexStr;
}

function padBin3(str) {
    if(str.length == 32) { // negative number
        str = str.substr(29,3);
    }
    var pad = "000";
    return pad.substring(0, pad.length - str.length) + str;
}

function padBin7(str) {
    if(str.length == 32) { // negative number
        str = str.substr(25,7);
    }
    var pad = "0000000";
    return pad.substring(0, pad.length - str.length) + str;
}

function padBin10(str) {
    if(str.length == 32) { // negative number
        str = str.substr(22,10);
    }
    var pad = "0000000000";
    return pad.substring(0, pad.length - str.length) + str;
}

function padBin16(str) {
    if(str.length == 32) { // negative number
        str = str.substr(16,16);
    }
    var pad = "0000000000000000";
    return pad.substring(0, pad.length - str.length) + str;
}
