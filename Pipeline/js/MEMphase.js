// MEM Object

var MEMphase = function(simulator) {
	this.pc = -5;
	this.sim = simulator;
	this.currInstruction = null;
	this.writeData = 0;
	this.dest = 0;
};

MEMphase.prototype.run = function() {
	if(this.pc === -5) {
		return;
	}
	
	if(this.pc === -1) {
		this.currInstruction = Simulator.nop;
		return -1;
	}
	
	switch(this.currInstruction.instruction) {

		case 'add':
		case 'addi':
        case 'nand':
        case 'lui':
			this.sim.WB.writeData = this.writeData;
			this.sim.WB.dest = this.dest;
			break;

        case 'sw':
			this.sim.memory[this.storeAddress] = new Word(padBin16(dec2bin(this.writeData)));
            break;

        case 'lw':
			//this.sim.WB.writeData = parseInt(this.sim.memory[this.loadAddress].binaryString, 2);
			this.sim.WB.writeData = parseInt2sComp( padBin16(parseInt(this.sim.memory[this.loadAddress].binaryString, 2).toString(2)), 16 );
			this.sim.WB.dest = this.rA;
            break;
		
        case 'jalr':
	        this.sim.WB.writeData = this.writeData;
	        this.sim.WB.dest = this.dest;
            break;
		
		case 'halt':
			this.sim.WB.currInstruction = this.currInstruction;
			this.pc = -1;
			return -1;
			break;

        case 'bne':
		default:
            break;

	}
	
	this.sim.WB.currInstruction = this.currInstruction;
	this.sim.WB.pc = this.pc;

};