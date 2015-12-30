//  Simulator Class


var Simulator = function ( logLevel, machineCodeWords ) {
    this.memory = [];
    this.regs = [ 0,0,0,0,0,0,0,0 ];
    this.pc = 0;
    viewer.linkSim(this);
    
    // Phase Objects
    this.IF  = new IFphase(this);
    this.ID  = new IDphase(this);
    this.EX  = new EXphase(this);
    this.MEM = new MEMphase(this);
    this.WB  = new WBphase(this);
    
    this.logger = new Logger( this, logLevel );
    
    this.loadWordsIntoMemory( machineCodeWords );
};

Simulator.nop = new Word();

Simulator.prototype.loadWordsIntoMemory = function ( words ) {
    this.memory = [];
    
    for ( var i = 0; i < words.length; i++ ) {
        this.memory.push( words[i] );
    }
};

Simulator.prototype.readRegister = function ( register ) {
    return ( register === 0 ) ? 0 : this.regs[register];
};

Simulator.prototype.writeRegister = function ( register, value ) {
    if ( register === 0 ) {
        return;
    }
    this.regs[register] = value;
};

Simulator.prototype.start = function () {
    this.logger.setStartTime();
    
    this.retVal = 0;
	
	simulating = true;
	that = this;
	milliseconds = $("#timeInput").val() * 1000;
	nextInterval = setInterval(function() {
		that.next();
	}, milliseconds);
	
    checkInterval = setInterval(function() {
	    console.log("running");
	    if(that.retVal === -1) {
			clearInterval(nextInterval);
			clearInterval(checkInterval);
		    setTimeout(function() {
			    that.logger.setEndTime();
			    that.logger.print();
			    download( filename + '.' + getLogLevel() + '.pipetrace.txt' );
			    viewer.hide();
			    viewer.reset();
			    simulating = false;
		    }, 0);
	    }
	    }, milliseconds);
};

Simulator.prototype.next = function () {
    this.retVal = this.WB.run();
	var instrWB = this.WB.currInstruction ? this.WB.currInstruction.instruction : "null";
    this.logger.logWB();
    this.MEM.run();
	var instrMEM = this.MEM.currInstruction ? this.MEM.currInstruction.instruction : "null";
    this.logger.logMEM();
    this.EX.run();
	var instrEX = this.EX.currInstruction ? this.EX.currInstruction.instruction : "null";
    this.logger.logEX();
    this.ID.run();
	var instrID = this.ID.currInstruction ? this.ID.currInstruction.instruction : "null";
    this.logger.logID();
    this.IF.run();
	var instrIF = this.IF.currInstruction ? this.IF.currInstruction.instruction : "null";
    this.logger.logIF();
    
	viewer.refresh(instrIF, instrID, instrEX, instrMEM, instrWB);
    
    this.logger.logCycleComplete(); // i.e. cycles++
    
    this.logger.logPostCycle( this.IF.getCurrentInstruction() );
};
