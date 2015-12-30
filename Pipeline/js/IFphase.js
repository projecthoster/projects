// IF Object

var IFphase = function(simulator) {
	this.pc = 0;
	this.sim = simulator;
	this.currInstruction = null;
	this.prevInstruction = Simulator.nop;
	this.inHazard = false;
	this.jalrCount = 0;
	this.bneCount = 0;
	this.bneHazard = false;
	this.readWriteHazard = false;
};

IFphase.prototype.run = function() {
	this.bneHazard = false;
	this.readWriteHazard = false;
	
	if(this.pc === -1) {
		this.currInstruction = Simulator.nop;
		return -1;
	}
	
	if(this.jalrCount > 0) {
		this.jalrCount--;
		return;
	}
	
	if(this.bneCount > 0) {
		this.bneCount--;
		return;
	}
	
	this.currInstruction = this.sim.memory[this.pc];
	
	this.inHazard = this.checkHazard();
	if( !this.inHazard ) {
		
	    this.sim.ID.currInstruction = this.currInstruction;
		this.prevInstruction = this.currInstruction;
	    this.sim.ID.pc = this.pc;
		this.pc++;
		if(this.currInstruction.instruction === "halt") {
			this.pc = -1;
		}
		
	} else {
		this.sim.ID.currInstruction = Simulator.nop;
		this.prevInstruction = Simulator.nop;
	}
};

IFphase.prototype.checkHazard = function() {
	
	if(this.prevInstruction.instruction == "jalr") {
		// jalr hazard
		this.jalrCount = 1;
		return true;
	}
	
	if(this.prevInstruction.instruction == "bne") {
		// bne hazard
		// check ahead of us for stuff that edits bne
		// if so, adjust for new bne
		// check bne true/false
		var instrEX = this.sim.MEM.currInstruction;
		if(instrEX.write) {
			this.reg0 = instrEX.regs[0] === this.prevInstruction.regs[0];
			this.reg1 = instrEX.regs[0] === this.prevInstruction.regs[1];
			if(this.reg0 || this.reg1) {
				// register hazard, do fancy pants stuff
				this.prevrB = this.sim.EX.rBData;
				this.prevrC = this.sim.EX.rCData;
				this.prevImm = this.sim.EX.imm;
				// figure out what affects bne ahead
				this.bneHazardHandle();
				this.bnerA = this.sim.readRegister(this.prevInstruction.regs[0]);
				this.bnerB = this.sim.readRegister(this.prevInstruction.regs[1]);
				if(this.reg0) {
					this.bnerA = this.prevrA;
				}
				if(this.reg1) {
					this.bnerB = this.prevrB;
				}
				
				if(this.bnerA !== this.bnerB) {
					// branch time
					this.bneHazard = true;
					return true;
				}
				
			}
		}
		return false;
	}
	
	if(this.currInstruction.read && this.prevInstruction.write) {
		// read-after-write hazard
		if(this.prevInstruction.instruction === "lw" &&
			(this.prevInstruction.regs[0] === this.currInstruction.regs[1] ||
			this.prevInstruction.regs[0] === this.currInstruction.regs[2]))
		{
			this.readWriteHazard = true;
			return true;
		}
	}
	
	return false;
};

IFphase.prototype.getCurrentInstruction = function () {
	return this.currInstruction;
};

IFphase.prototype.bneHazardHandle = function() {
	switch(this.sim.MEM.currInstruction.instruction) {
		
		case 'add':
			this.prevrA = this.prevrB + this.prevrC;
			break;
		
		case 'nand':
			this.prevrA = ~(this.prevrB & this.prevrC);
			break;
		
		case 'addi':
			this.prevrA = this.prevrB + this.prevImm;
			break;
		
		case 'lui':
			this.prevrA = (this.prevImm >> 6) << 6;
			break;
		
		default:
			break;
	}
};