// ID Object

var IDphase = function (simulator) {
	this.pc = -5;
	this.sim = simulator;
	this.currInstruction = null;
};

IDphase.prototype.run = function () {
	if(this.pc == -5) {
		return;
	}
	
	if(this.pc === -1) {
		this.currInstruction = Simulator.nop;
		return -1;
	}
	
	switch (this.currInstruction.instruction) {
		
		case 'add':
		case 'nand':
			this.sim.EX.rA = this.currInstruction.regs[0];
			this.sim.EX.rB = this.currInstruction.regs[1];
			this.sim.EX.rC = this.currInstruction.regs[2];
			break;

		case 'addi':
		case 'sw':
		case 'lw':
		case 'bne':
			this.sim.EX.rA = this.currInstruction.regs[0];
			this.sim.EX.rB = this.currInstruction.regs[1];
			this.sim.EX.imm = this.currInstruction.immediate;
			break;

		case 'jalr':
			this.sim.EX.rA = this.currInstruction.regs[0];
			this.sim.EX.rB = this.currInstruction.regs[1];
			break;
		
		case 'halt':
			this.sim.EX.currInstruction = this.currInstruction;
			this.pc = -1;
			return -1;
			break;

		case 'lui':
			this.sim.EX.rA = this.currInstruction.regs[0];
			this.sim.EX.imm = this.currInstruction.immediate;
			break;
		
		case 'nop':
		default:
			break;

	}

	this.sim.EX.currInstruction = this.currInstruction;
	this.sim.EX.pc = this.pc;
};
