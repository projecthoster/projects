// WB Object

var WBphase = function(simulator) {
	this.pc = -5;
	this.sim = simulator;
    this.currInstruction = null;
};

WBphase.prototype.run = function() {
    if(this.pc == -5) {
        return;
    }
    
	if(this.pc === -1) {
        this.currInstruction = Simulator.nop;
		return -1;
	}
    
    if(this.currInstruction.instruction !== 'nop') {
        this.sim.logger.incrementInstructionCount();
    }
    this.sim.logger.logInstruction( this.currInstruction.instruction );
    
    switch(this.currInstruction.instruction) {
        
        case 'add':
        case 'addi':
        case 'nand':
        case 'lw':
        case 'lui':
            this.sim.writeRegister(this.dest, this.writeData);
            break;
	    
        case 'jalr':
	        this.sim.writeRegister(this.dest, this.writeData);
            break;
        
        case 'halt':
            this.pc = -1;
            break;
        
        case 'bne':
        case 'sw':
	    default:
            break;
    }
    
};
