// EX Object

var EXphase = function(simulator) {
	this.pc = -5;
	this.sim = simulator;
	this.currInstruction = null;
	this.rA = 0;
	this.rB = 0;
	this.rC = 0;
	this.imm = 0;
	this.forwardHazard = false;
};

EXphase.prototype.run = function() {
	this.forwardHazard = false;
	if(this.pc === -5) {
		return;
	}
	
	if(this.pc === -1) {
		this.currInstruction = Simulator.nop;
		return -1;
	}
	
	this.prevInstruction = this.sim.MEM.currInstruction;
	this.rAData = this.sim.readRegister(this.rA);
	this.rBData = this.sim.readRegister(this.rB);
	this.rCData = this.sim.readRegister(this.rC);
	
	if(this.prevInstruction && this.currInstruction.read && this.prevInstruction.write) {
		this.reg0 = this.prevInstruction.regs[0] === this.currInstruction.regs[0];
		this.reg1 = this.prevInstruction.regs[0] === this.currInstruction.regs[1];
		this.reg2 = this.prevInstruction.regs[0] === this.currInstruction.regs[2];
		if(this.reg0 || this.reg1 || this.reg2) {
			// register hazard, do fancy pants stuff
			this.prevrB = this.prevInstruction.regs[1];
			this.prevrC = this.prevInstruction.regs[2];
			this.prevImm = this.prevInstruction.immediate;
			this.registerHazard();
			this.forwardHazard = true;
		}
	}
	
	switch(this.currInstruction.instruction) {
		case 'add':
			var sum = this.rBData + this.rCData;
			this.sim.MEM.writeData = sum;
			this.sim.MEM.dest = this.rA;
			break;
		
		case 'nand':
			var sum = ~(this.rBData & this.rCData);
			this.sim.MEM.writeData = sum;
			this.sim.MEM.dest = this.rA;
			break;
		
		case 'addi':
			var sum = this.rBData + this.imm;
			this.sim.MEM.writeData = sum;
			this.sim.MEM.dest = this.rA;
			break;
		
		case 'sw':
			var sum = this.rBData + this.imm;
			this.sim.MEM.writeData = this.sim.readRegister(this.rA);
			this.sim.MEM.storeAddress = sum;
			break;
		
		case 'lw':
			var sum = this.rBData + this.imm;
			this.sim.MEM.rA = this.rA;
			this.sim.MEM.loadAddress = sum;
			break;
		
		case 'bne':
			var offset = parseInt2sComp( dec2bin( this.imm ), 6 );
			if ( this.rAData !== this.rBData ) {
				this.sim.IF.pc += offset;
				this.sim.IF.bneCount = 1;
				this.sim.IF.currInstruction = Simulator.nop;
				this.sim.ID.currInstruction = Simulator.nop;
			}
			
			break;
		
		case 'jalr':
			var savePC = this.pc + 1;
			this.sim.MEM.dest = this.rA;
			this.sim.MEM.writeData = savePC;
			
			this.sim.IF.pc = this.rBData;
			
			this.sim.IF.jalrCount = 1;
			this.sim.IF.currInstruction = Simulator.nop;
			this.sim.ID.currInstruction = Simulator.nop;
			
			break;
		
		case 'halt':
			this.sim.MEM.currInstruction = this.currInstruction;
			this.pc = -1;
			return -1;
			break;
		
		case 'lui':
			var newImm = (this.imm >> 6) << 6;
			this.sim.MEM.dest = this.rA;
			this.sim.MEM.writeData = newImm;
			break;
		
		default:
			break;
	}
	
	this.sim.MEM.currInstruction = this.currInstruction;
	this.sim.MEM.pc = this.pc;
};

EXphase.prototype.registerHazard = function() {
	switch(this.prevInstruction.instruction) {
		
		case 'add':
			var prevrA = this.sim.readRegister(this.prevrB) + this.sim.readRegister(this.prevrC);
			break;
		
		case 'nand':
			var prevrA = ~(this.sim.readRegister(this.prevrB) & this.sim.readRegister(this.prevrC));
			break;
		
		case 'addi':
			var prevrA = this.sim.readRegister(this.prevrB) + this.prevImm;
			break;
		
		case 'lui':
			var prevrA = (this.prevImm >> 6) << 6;
			break;
		
		default:
			break;
	}
	
	if(this.reg0) {
		this.rAData = prevrA;
	}
	if(this.reg1) {
		this.rBData = prevrA;
	}
	if(this.reg2) {
		this.rCData = prevrA;
	}
};