// Javascript Document
//  - Word Class

/*
    Word member variables:
    address          - Integer address associated with this word.
    instruction      - String instruction name.
    regs             - Integer array of registers that this word may use.
    label            - Optional String label associated with this word address.
    immediate        - Optional Number immediate value.
    immediateLabel   - Optional immediate String that will be resolved to immediate.
*/

var Word = function( params ){
    this.immediate = 0;
    this.regs = [0,0,0];
    this.address = 0;
    this.read = false;
    this.write = false;
    this.binaryString = '0000000000000000';

    if ( !params ) {
        this.instruction = "nop";
        return;
    }
    this.address = Word.line;
    Word.line++;
    if ( typeof params === "string" ) {
        // Importing from a machine code instruction, use separate code.
        this.decode(params);
        return;
    }

    if ( params[0].indexOf(':') > -1 ) {
        this.label = params[0].replace(':','');
        params.splice(0,1);

        Word.labelToAddressMap[this.label] = this.address;
    }
    
    this.instruction = params[0];
    
    switch( this.instruction ) {
        // RRR Type
        case 'add':
        case 'nand':
            this.regs[0] = Number( params[1] );
            this.regs[1] = Number( params[2] );
            this.regs[2] = Number( params[3] );
            break;
		
        // RRI Type
        case 'addi':
        case 'sw':
        case 'lw':
        case 'bne':
        case 'jalr':
            this.regs[0] = Number(params[1]);
            this.regs[1] = Number(params[2]);

            if ( isNaN(params[3]) ) {
                // Immediate is a label and not an address.
                this.immediateLabel = params[3];
            } else {
                this.immediate = Number( params[3] );
            }
            break;

        // RI Type
        case 'lui':
            this.regs[0] = params[1];

            if ( isNaN(params[2]) ) {
                // Immediate is a label and not an address.
                this.immediateLabel = params[2];
            } else {
                this.immediate = Number( params[2] );
            }
            break;
        
        // Pseudo
        case 'nop':
            this.instruction = 'add';
            this.regs[0] = this.regs[1] = this.regs[2] = 0;
            break;

        case 'halt':
            this.instruction = 'jalr';
            this.regs[0] = this.regs[1] = 0;
            this.immediate = 113;
            break;

        case '.fill':
            if ( isNaN(params[1]) ) {
                // Immediate is a label and not an address.
                this.immediateLabel = params[1];
            } else {
                this.immediate = Number( params[1] );
            }
            break;
        
        default:
            console.error( "Unexpected opcode name: " + this.instruction );
            break;
    }
	
	this.setReadWrite();
	
};

Word.prototype.setReadWrite = function() {
	switch(this.instruction) {
		case "add":
		case "nand":
		case "addi":
		case "lw":
			this.read = true;
			this.write = true;
			break;
		
		case "sw":
		case "bne":
			this.read = true;
			break;
			
		case "lui":
			this.write = true;
			break;
		
		case "jalr":
			if(!(this.regs[0] == 0 && this.regs[1] == 0)) {
				this.write = true;
				this.read = true;
			}
			break;
		
		default:
			break;
	}
};

Word.prototype.resolveImmediateLabel = function () {
    if ( this.immediateLabel === undefined ) {
        return;
    }

    var immLabelValue = Word.labelToAddressMap[ this.immediateLabel ];

    this.immediate = this.instruction === "bne" ?  (immLabelValue - this.address - 1) : immLabelValue ;

    delete this.immediateLabel;
};

Word.prototype.encode = function () {
    if ( this.instruction === 'nop' ) {
        return '0000\n';
    }

    var machineString = "";
	var regA, regB, regC, imm;
    machineString = machineString.concat(opcodes[this.instruction]);
	
    switch( this.instruction ) {
        // RRR Type
        case 'add':
        case 'nand':
            regA = padBin3(dec2bin(parseInt(this.regs[0])));
			regB = padBin3(dec2bin(parseInt(this.regs[1])));
			regC = padBin3(dec2bin(parseInt(this.regs[2])));
            machineString = machineString.concat(regA);
            machineString = machineString.concat(regB);
            machineString = machineString.concat("0000");
            machineString = machineString.concat(regC);
            break;

        // RRI Type
        case 'addi':
        case 'sw':
        case 'lw':
        case 'bne':
        case 'jalr':
        case 'halt':
			regA = padBin3(dec2bin(parseInt(this.regs[0])));
			regB = padBin3(dec2bin(parseInt(this.regs[1])));
			imm = padBin7(dec2bin(this.immediate));
            machineString = machineString.concat(regA);
            machineString = machineString.concat(regB);
            machineString = machineString.concat(imm);
            break;

        // RI Type
        case 'lui':
			regA = padBin3(dec2bin(parseInt(this.regs[0])));
			imm = padBin10(dec2bin(this.immediate));
			machineString = machineString.concat(regA);
			machineString = machineString.concat(imm);
            break;
		
		case '.fill':
			imm = padBin16(dec2bin(this.immediate));
			machineString = machineString.concat(imm);
			break;

        default:
            break;
    }
	var mac1 = parseInt(machineString.substring(0,4), 2).toString(16);
	var mac2 = parseInt(machineString.substring(4,8), 2).toString(16);
	var mac3 = parseInt(machineString.substring(8,12), 2).toString(16);
	var mac4 = parseInt(machineString.substring(12,16), 2).toString(16);
	return mac1.concat(mac2.concat(mac3.concat(mac4.concat("\n"))));
};

Word.prototype.decode = function(binStr) {
	if(binStr == "0000" || binStr == "0000000000000000") {
        this.instruction = "nop";
    } else {
		this.instruction = revOps[binStr.substring(0,3)];
	}

    this.binaryString = binStr;

	switch( this.instruction ) {
		// RRR Type
		case 'add':
		case 'nand':
			this.regs[0] = Number(parseInt(binStr.substring(3,6),2).toString(10));
			this.regs[1] = Number(parseInt(binStr.substring(6,9),2).toString(10));
			this.regs[2] = Number(parseInt(binStr.substring(13,16),2).toString(10));
			break;

		// RRI Type
		case 'addi':
		case 'sw':
		case 'lw':
		case 'bne':
			this.regs[0] = Number(parseInt(binStr.substring(3,6),2).toString(10));
			this.regs[1] = Number(parseInt(binStr.substring(6,9),2).toString(10));
			this.immediate = Number(parseInt(binStr.substring(9,16),2).toString(10));
            this.immediate = parseInt2sComp(this.immediate.toString(2), 7);
            break;
            
		case 'jalr':
            this.regs[0] = Number(parseInt(binStr.substring(3,6),2).toString(10));
			this.regs[1] = Number(parseInt(binStr.substring(6,9),2).toString(10));
			this.immediate = Number(parseInt(binStr.substring(9,16),2).toString(10));
            this.immediate = parseInt2sComp(this.immediate.toString(2), 7);
            if(this.isHalt()) {
                this.instruction = 'halt';
            }
			break;

		// RI Type
		case 'lui':
			this.regs[0] = Number(parseInt(binStr.substring(3,6),2).toString(10));
			this.immediate = Number(parseInt(binStr.substring(6,16),2).toString(10));
			break;

		default:
			break;
	}
	
	this.setReadWrite();
	
};

Word.prototype.isHalt = function() {
    return this.regs[0] === 0 && this.regs[1] === 0;
};

Word.line = 0;
Word.labelToAddressMap = {};

var opcodes = {
    "add":   "000",
    "nop":   "000",
    "addi":  "001",
    "nand":  "010",
    "lui":   "011",
    "sw":    "100",
    "lw":    "101",
    "bne":   "110",
    "jalr":  "111",
    "halt":  "111",
	".fill": ""
};
	
var revOps = {
	"000":   "add",
	"001":  "addi",
	"010":  "nand",
	"011":   "lui",
	"100":    "sw",
	"101":    "lw",
	"110":   "bne",
	"111":  "jalr"
};
