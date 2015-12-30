// Javascript Document
//  - Logger Class

var Logger = function ( simulator, logLevel ) {
    this.sim = simulator;
    this.logLevel = logLevel;
    this.runTime = undefined;
    this.contents = "";
    this.cycles = 0;
    this.instrCount = 0;
    this.phaseData = [];

    this.instructionCount = {
        'add': 0,
        'addi': 0,
        'nand': 0,
        'lui': 0,
        'sw': 0,
        'lw': 0,
        'bne': 0,
        'jalr': 0,
        'nop': 0,
        'halt': 0
    };
};

Logger.prototype.setStartTime = function () {
    this.startTime = new Date().getTime();
};

Logger.prototype.setEndTime = function () {
    var endTime =  new Date().getTime();
    this.runTime = endTime - this.startTime;
    console.log( 'Execution time: ' + this.runTime + 'ms.' );
};

Logger.prototype.logInstruction = function ( instruction ) {
    this.instructionCount[ instruction ]++;
};

Logger.prototype.incrementInstructionCount = function () {
    this.instrCount++;
};

Logger.prototype.logCycleComplete = function () {
    this.cycles++;
};

Logger.prototype.print = function () {
    switch ( this.logLevel ) {
        case -1:
            break;
        case 0:
        case 1:
            this.printCycleCount();
            this.printRegisterContents();
            this.printInstructionMix();
            this.printString("\n");
            break;
        case 2:
            this.printRegisterContents();
            this.printString("\n");
            this.printDivider();
            this.printCycleCount();
            this.printRegisterContents();
            this.printInstructionMix();
            this.printMemoryContents();
            break;
        case 3:
            this.printRegisterContents();
            this.printMemoryContents();
            this.printString("\n");
            this.printDivider();
            this.printCycleCount();
            this.printRegisterContents();
            this.printInstructionMix();
            this.printMemoryContents();
            break;
    }

    $("#hiddenText").val( this.contents );
};

Logger.prototype.logPostCycle = function ( instructionWord ) {
    this.currentWord = instructionWord;
    if ( !this.currentWord ) {
        return;
    }

    this.printString( this.phaseData['IF'] );
    this.printString( this.phaseData['ID'] );
    this.printString( this.phaseData['EX'] );
    this.printString( this.phaseData['MEM'] );
    this.printString( this.phaseData['WB'] );

    switch (this.logLevel) {
        case -1:
        case 0:
            this.printString("\n");
            this.printDivider();
            break;
        case 1:
            this.printInstructionCode( this.currentWord );
            this.printString("\n");
            this.printDivider();
            break;
        case 2:
            this.printInstructionCode( this.currentWord );
            this.printRegisterContents();
            this.printString("\n");
            this.printDivider();
            break;
        case 3:
            this.printInstructionCode( this.currentWord );
            this.printRegisterContents();
            this.printMemoryContents();
            this.printString("\n");
            this.printDivider();
            break;
    }
};

Logger.prototype.printInstructionCode = function ( word ) {
    this.printString("\n");
    this.printString( "Instruction Code: 0x" + intToPadHex(parseInt(word.binaryString, 2)) + "\n" );
};

Logger.prototype.printRegisterContents = function () {
    this.printString("\n");
    this.printString("Register contents:\n");
    for ( var i = 0; i < this.sim.regs.length; i++ ) {
        var valueDec = this.sim.regs[i];
        var valueHex = this.sim.regs[i].toString(16);
        
        if ( valueHex.indexOf('-') >= 0 ) {
            valueHex = parseInt(dec2bin(this.sim.regs[i]).substr(16,16),2).toString(16)
        }

        this.printString("r" + i + ": " + padWithSpaces(String(valueDec), 8) + padWithSpaces(valueHex, 8) + "\n");
    }
};

Logger.prototype.printMemoryContents = function () {
    this.printString("\n");
    this.printString("Memory contents:\n");

    var MAX_MEMORY = 64;

    for ( var i = 0; i < this.sim.memory.length; i++ ) {
        var memValue = parseInt( this.sim.memory[i].binaryString, 2 );
        this.printString( padWithSpaces(i.toString(16), 5) + ":  " + intToPadHex(memValue) + "\n" );
    }

    for ( ; i < MAX_MEMORY; i++ ) {
        this.printString( padWithSpaces(i.toString(16), 5) + ":  " + intToPadHex(0) + "\n" );
    }
};

Logger.prototype.printInstructionMix = function () {
    this.printString("\n");
    this.printString( "Instruction Mix:\n" );
    
    for ( var inst in this.instructionCount ) {
        var count = this.instructionCount[inst];
        var padded = padWithSpaces(String(count), 10 - inst.length);
        this.printString( inst.toUpperCase() + padded + "\n" );
    }

    this.printString( "Total Instructions: " + this.instrCount + "\n" );
};

Logger.prototype.printDivider = function () {
    this.printString( "---------------\n" );
};

Logger.prototype.printString = function ( string ) {
    this.contents += string;
};

Logger.prototype.printCycleCount = function () {
    this.printString("\n");
    this.printString( "Cycles = " + this.cycles );
    this.printString("\n");
};

Logger.prototype.logWB = function() {
    var tempString = "\nWBEND:\n";

    var instruction = this.sim.WB.currInstruction;
    if ( instruction ) {
        tempString += "instr:\t\t\t" + instruction.encode();
        tempString += "writeData:\t\t" +  this.sim.WB.writeData + "\n";
        tempString +=
            instruction.address + " " + instruction.instruction.toUpperCase() + "\t\t\t" +
            "regs: " + instruction.regs[0] + " " + instruction.regs[1] + " " + instruction.regs[2] + "; " +
            "immValue: " + instruction.immediate + "\t; " +
            "code: " + instruction.encode();
    } else {
        tempString +=
        "instr:          0\n" +
        "writeData:      0\n" +
        "0               regs: 0 0 0; immValue: 0    ; code: 0000\n";
    }

    this.phaseData['WB'] = tempString;
};
Logger.prototype.logMEM = function() {
    var tempString = "\nMEMWB:\n";
    
    var instruction = this.sim.MEM.currInstruction;
    if ( instruction ) {
        tempString += "instr:\t\t\t" + instruction.encode();
        tempString += "writeData:\t\t" +  this.sim.MEM.writeData + "\n";
        tempString +=
            instruction.address + " " + instruction.instruction.toUpperCase() + "\t\t\t" +
            "regs: " + instruction.regs[0] + " " + instruction.regs[1] + " " + instruction.regs[2] + "; " +
            "immValue: " + instruction.immediate + "\t; " +
            "code: " + instruction.encode();
    } else {
        tempString +=
            "instr:          0\n" +
            "writeData:      0\n" +
            "0               regs: 0 0 0; immValue: 0    ; code: 0000\n";
    }
    
    this.phaseData['MEM'] = tempString;
};
Logger.prototype.logEX = function() {
    var tempString = "\nEXMEM:\n";
    
    var instruction = this.sim.EX.currInstruction;
    if ( instruction ) {
        tempString += "instr:\t\t\t" + instruction.encode();
        tempString += "aluResult:\t\t" +  this.sim.MEM.writeData + "\n";
        tempString += "readReg2:\t\t" +  this.sim.readRegister(instruction.regs[2]) + "\n";
        tempString +=
            instruction.address + " " + instruction.instruction.toUpperCase() + "\t\t\t" +
            "regs: " + instruction.regs[0] + " " + instruction.regs[1] + " " + instruction.regs[2] + "; " +
            "immValue: " + instruction.immediate + "\t; " +
            "code: " + instruction.encode();
    } else {
        tempString +=
            "instr:          0\n" +
            "aluResult:      0\n" +
            "readReg2:       0\n" +
            "0               regs: 0 0 0; immValue: 0    ; code: 0000\n";
    }
    
    this.phaseData['EX'] = tempString;
};
Logger.prototype.logID = function() {
    var tempString = "\nIDEX:\n";
    
    var instruction = this.sim.ID.currInstruction;
    if ( instruction ) {
        tempString += "instr:\t\t\t" + instruction.encode();
        tempString += "readReg1:\t\t" +  this.sim.readRegister(instruction.regs[1]) + "\n";
        tempString += "readReg2:\t\t" +  this.sim.readRegister(instruction.regs[2]) + "\n";
        tempString += "offset:\t\t\t" +  instruction.immediate + "\n";
        tempString +=
            instruction.address + " " + instruction.instruction.toUpperCase() + "\t\t\t" +
            "regs: " + instruction.regs[0] + " " + instruction.regs[1] + " " + instruction.regs[2] + "; " +
            "immValue: " + instruction.immediate + "\t; " +
            "code: " + instruction.encode();
    } else {
        tempString +=
            "instr:          0\n" +
            "readReg1:       0\n" +
            "readReg2:       0\n" +
            "offset:         0\n" +
            "0               regs: 0 0 0; immValue: 0    ; code: 0000\n";
    }
    
    this.phaseData['ID'] = tempString;
};
Logger.prototype.logIF = function() {
    var tempString = "\nIFID:\n";
    
    var instruction = this.sim.IF.currInstruction;
    if ( instruction ) {
        tempString += "instr:\t\t\t" + instruction.encode();
        tempString += "ip:\t\t\t\t" +  instruction.address + "\n";
        tempString +=
            instruction.address + " " + instruction.instruction.toUpperCase() + "\t\t\t" +
            "regs: " + instruction.regs[0] + " " + instruction.regs[1] + " " + instruction.regs[2] + "; " +
            "immValue: " + instruction.immediate + "\t; " +
            "code: " + instruction.encode();
    } else {
        tempString +=
            "instr:\t\t\t0\n" +
            "ip:\t\t\t\t0\n" +
            "0               regs: 0 0 0; immValue: 0    ; code: 0000\n";
    }
    
    this.phaseData['IF'] = tempString;
};