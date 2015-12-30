// Pipeline Viewer

var winWidth = $(window).width();
var winHeight = $(window).height();

var Viewer = function () {
	
	this.width = winWidth * 0.9;
	this.height = winHeight * 0.9;
	this.homeX = winWidth * 0.05;
	this.homeY = winHeight * 0.05;
	this.dom = $("#viewer");
	this.button = $("#viewButton");
	this.stop = $("#stop");
	this.pause = $("#pausePlay");
	this.paper = new Raphael("viewPaper", this.width, this.height);
	this.paths = [];
	
	this.setUpDom();
	this.setUpPipeline();
};

Viewer.prototype.refresh = function(IF, ID, EX, MEM, WB) {
	console.log("refreshing");
	
	this.reset();
	
	this.updatePaths(IF, ID, EX, MEM, WB);
	
	this.IFinstr.attr("text",  IF);
	this.IDinstr.attr("text",  ID);
	this.EXinstr.attr("text",  EX);
	this.MEMinstr.attr("text", MEM);
	this.WBinstr.attr("text",  WB);
	
	var IFhazType = "";
	if (this.sim.IF.bneHazard) {
		IFhazType = "bne branch\nincoming";
	} else if (this.sim.IF.currInstruction && this.sim.IF.currInstruction.instruction === "jalr") {
		IFhazType = "jalr hazard";
	} else if (this.sim.IF.readWriteHazard) {
		IFhazType = "read-after-write\nhazard";
	}
	
	
	var EXhazType = "";
	if(this.sim.EX.forwardHazard) {
		EXhazType = "register forward\nhazard";
	}
	
	this.IFhazard.attr("text",  IFhazType);
	this.EXhazard.attr("text",  EXhazType);
};

Viewer.prototype.updatePaths = function(IF, ID, EX, MEM, WB) {
	this.updateIF(IF);
	this.updateID(ID);
	this.updateEX(EX);
	this.updateMEM(MEM);
	this.updateWB(WB);
};

Viewer.prototype.toggleView = function () {
	if (this.dom.css("left") === (winWidth + "px")) {
		// hidden, unhide
		this.show();
	} else {
		// on screen, hide
		this.hide();
	}
};

Viewer.prototype.show = function () {
	this.dom.animate({
		left: winWidth * 0.05
	}, {
		duration: 2000
	});
	
	this.button.html("&gt;");
	$("#assemblerWrap").animate({
		opacity: 0.4
	}, {
		duration: 1500
	});
};

Viewer.prototype.hide = function () {
	this.dom.animate({
		left: winWidth
	}, {
		duration: 2000
	});
	
	this.button.html("&lt;");
	$("#assemblerWrap").animate({
		opacity: 1.0
	}, {
		duration: 1500
	});
};

Viewer.prototype.setUpDom = function () {
	$("html").css("max-width", winWidth);
	$("body").css("max-width", winWidth);
	
	this.dom.width(this.width);
	this.dom.height(this.height);
	this.dom.css("top", winHeight * 0.05);
	this.dom.css("left", winWidth);
	
	// css for button
	this.button.width(50);
	this.button.height(this.height * 0.1);
	this.button.css("left", -35);
	this.button.css("top", this.height * 0.45);
	this.button.css("font-size", this.height * 0.08);
	this.button.css("text-align", "center");
	this.button.css("text-align", "left");
	this.button.css("line-height", this.height * 0.1 + "px");
	
	this.stop.css("left", this.width * 0.02);
	this.stop.css("top", this.height * 0.88);
	this.stop.css("font-size", this.height * 0.04);
	
	this.pause.css("left", this.width * 0.024);
	this.pause.css("top", this.height * 0.75);
	this.pause.css("font-size", this.height * 0.035);
};

Viewer.prototype.linkSim = function (sim) {
	this.sim = sim;
};

Viewer.prototype.setUpPipeline = function () {
	
	// some shared values between drawn elements, include in functions?
	this.dataBoxY = this.height * 0.4;
	this.dataBoxWidth = this.width * 0.1;
	this.dataBoxHeight = this.height * 0.25;
	
	this.phaseY = this.height * 0.17;
	this.phaseWidth = this.width * 0.02;
	this.phaseHeight = this.height * 0.6;
	
	this.muxWidth = this.width * 0.02;
	this.muxHeight = this.height * 0.09;
	
	this.ellipseHRadius = this.width * 0.016;
	this.ellipseVRadius = this.height * 0.05;
	
	this.aluWidth = this.width * 0.04;
	this.aluHeight = this.height * 0.12;
	
	this.phaseColor = "#004705";
	this.hotPathColor = "#FF0000";
	
	this.fontS = this.height * 0.02;
	this.fontM = this.height * 0.025;
	this.fontL = this.height * 0.03;
	
	this.drawPCBox();
	this.drawPCMux();
	this.drawInstructionMemory();
	this.drawpcAddALU();
	this.drawIFID();
	this.drawRegisters();
	this.drawSignExtend();
	this.drawIDEX();
	this.drawEXMux();
	this.drawEXALU();
	this.drawShiftLeft();
	this.drawPCAddShift();
	this.drawEXMEM();
	this.drawDataMemory();
	this.drawMEMWB();
	this.drawWBMux();
	this.drawInstructions();
	
	this.setUpAnchors();
	
	this.drawPaths();
	
};

Viewer.prototype.drawInstructions = function() {
	var fontXL = this.height * 0.05;
	var instrHeight = this.height * 0.9;
	var hazardHeight = this.height * 0.85;
	this.IFinstr = this.paper.text(
		this.width * 0.19,
		instrHeight,
		"none").attr({"font-size": fontXL, "font-weight": "bold"});
	
	this.IDinstr = this.paper.text(
		this.width * 0.39,
		instrHeight,
		"none").attr({"font-size": fontXL, "font-weight": "bold"});
	
	this.EXinstr = this.paper.text(
		this.width * 0.6,
		instrHeight,
		"none").attr({"font-size": fontXL, "font-weight": "bold"});
	
	this.MEMinstr = this.paper.text(
		this.width * 0.795,
		instrHeight,
		"none").attr({"font-size": fontXL, "font-weight": "bold"});
	
	this.WBinstr = this.paper.text(
		this.width * 0.95,
		instrHeight,
		"none").attr({"font-size": fontXL, "font-weight": "bold"});
	
	this.IFhazard = this.paper.text(
		this.width * 0.19,
		hazardHeight,
		"IFhazard").attr({"font-size": this.fontL, "font-weight": "bold", "fill": "#000596"});
	
	this.EXhazard = this.paper.text(
		this.width * 0.6,
		hazardHeight,
		"EXhazard").attr({"font-size": this.fontL, "font-weight": "bold", "fill": "#000596"});
};

Viewer.prototype.drawPCMux = function() {
	// PC mux - rounded rectangle
	this.pcMux = this.paper.rect(
		this.width * 0.05,
		(this.pcBox.attr("height") - this.muxHeight ) / 2.0 + this.pcBox.attr("y"),
		this.muxWidth,
		this.muxHeight,
		this.phaseWidth * 0.5);
	this.pcMux.attr("stroke-width", 2);
	this.paper.text(
		this.pcMux.attr("x") + this.pcMux.attr("width") * 0.5,
		this.pcMux.attr("y") + this.pcMux.attr("height") * 0.5,
		"M\nu\nx").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.drawPCBox = function() {
	// PC - rectangle
	this.pcBox = this.paper.rect(
		this.width * 0.09,
		this.dataBoxY,
		this.width * 0.03,
		this.height * 0.07);
	this.pcBox.attr("stroke-width", 2);
	this.paper.text(
		this.pcBox.attr("x") + this.pcBox.attr("width") * 0.5,
		this.pcBox.attr("y") + this.pcBox.attr("height") * 0.45,
		"PC").attr({"font-size": this.fontM, "font-weight": "bold"});
};

Viewer.prototype.drawInstructionMemory = function() {
	// instruction memory - rectangle
	this.instructionMemory = this.paper.rect(
		this.width * 0.14,
		this.dataBoxY,
		this.dataBoxWidth,
		this.dataBoxHeight);
	this.instructionMemory.attr("stroke-width", 2);
	this.paper.text(
		this.instructionMemory.attr("x") + this.instructionMemory.attr("width") * 0.5,
		this.instructionMemory.attr("y") + this.instructionMemory.attr("height") * 0.45,
		"Instruction\nMemory").attr({"font-size": this.fontL, "font-weight": "bold"});
};

Viewer.prototype.drawpcAddALU = function() {
	// IF PC add - ALU
	this.pcAddALU = this.drawALU(this.width * 0.18, this.height * 0.2);
	this.paper.text(
		this.pcAddALU.x + this.aluWidth * 0.6,
		this.pcAddALU.y + this.aluHeight * 0.5,
		"Add").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.drawIFID = function() {
	// IF/ID - rectangle
	this.IFID = this.paper.rect(
		this.width * 0.28,
		this.phaseY,
		this.phaseWidth,
		this.phaseHeight);
	this.IFID.attr("stroke-width", 2);
	this.IFID.attr("fill", this.phaseColor);
	this.paper.text(
		this.IFID.attr("x") + this.IFID.attr("width") * 0.5,
		this.IFID.attr("y") - this.fontS,
		"IF/ID").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.drawRegisters = function() {
	// registers - rectangle
	this.registers = this.paper.rect(
		this.width * 0.34,
		this.dataBoxY,
		this.dataBoxWidth,
		this.dataBoxHeight);
	this.registers.attr("stroke-width", 2);
	this.paper.text(
		this.registers.attr("x") + this.registers.attr("width") * 0.5,
		this.registers.attr("y") + this.registers.attr("height") * 0.45,
		"Registers").attr({"font-size": this.fontL, "font-weight": "bold"});	
};

Viewer.prototype.drawSignExtend = function() {
	// ID sign extend - ellipse
	this.signExtend = this.paper.ellipse(
		this.width * 0.42,
		this.height * 0.72,
		this.ellipseHRadius,
		this.ellipseVRadius);
	this.signExtend.attr("stroke-width", 2);
	this.paper.text(
		this.signExtend.attr("cx"),
		this.signExtend.attr("cy"),
		"Sign\nextend").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.drawIDEX = function() {
	// ID/EX - rectangle
	this.IDEX = this.paper.rect(
		this.width * 0.49,
		this.phaseY,
		this.phaseWidth,
		this.phaseHeight);
	this.IDEX.attr("stroke-width", 2);
	this.IDEX.attr("fill", this.phaseColor);
	this.paper.text(
		this.IDEX.attr("x") + this.IDEX.attr("width") * 0.5,
		this.IDEX.attr("y") - this.fontS,
		"ID/EX").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.drawEXMux = function() {
	// EX mux - rounded rectangle
	this.EXMux = this.paper.rect(
		this.width * 0.55,
		this.height * 0.52,
		this.muxWidth,
		this.muxHeight,
		this.phaseWidth * 0.5);
	this.EXMux.attr("stroke-width", 2);
	this.paper.text(
		this.EXMux.attr("x") + this.EXMux.attr("width") * 0.5,
		this.EXMux.attr("y") + this.EXMux.attr("height") * 0.5,
		"M\nu\nx").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.drawEXALU = function() {
	// EX ALU - ALU
	this.EXALU = this.drawALU(this.width * 0.6, this.height * 0.425);
	this.paper.text(
		this.EXALU.x + this.aluWidth * 0.6,
		this.EXALU.y + this.aluHeight * 0.5,
		"ALU").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.drawShiftLeft = function() {
	// EX shift - ellipse
	this.shiftLeft = this.paper.ellipse(
		this.width * 0.535,
		this.height * 0.325,
		this.ellipseHRadius,
		this.ellipseVRadius);
	this.shiftLeft.attr("stroke-width", 2);
	this.paper.text(
		this.shiftLeft.attr("cx"),
		this.shiftLeft.attr("cy"),
		"Shift\nLeft 2").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.drawPCAddShift = function() {
	// EX PC add - ALU
	this.pcAddShift = this.drawALU(this.width * 0.59, this.height * 0.23);
	this.paper.text(
		this.pcAddShift.x + this.aluWidth * 0.6,
		this.pcAddShift.y + this.aluHeight * 0.5,
		"Add").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.drawEXMEM = function() {
	// EX/MEM - rectangle
	this.EXMEM = this.paper.rect(
		this.width * 0.68,
		this.phaseY,
		this.phaseWidth,
		this.phaseHeight);
	this.EXMEM.attr("stroke-width", 2);
	this.EXMEM.attr("fill", this.phaseColor);
	this.paper.text(
		this.EXMEM.attr("x") + this.EXMEM.attr("width") * 0.5,
		this.EXMEM.attr("y") - this.fontS,
		"EX/MEM").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.drawDataMemory = function() {
	// data memory - rectangle
	this.dataMemory = this.paper.rect(
		this.width * 0.73,
		this.dataBoxY + this.height * 0.06,
		this.dataBoxWidth,
		this.dataBoxHeight);
	this.dataMemory.attr("stroke-width", 2);
	this.paper.text(
		this.dataMemory.attr("x") + this.dataMemory.attr("width") * 0.5,
		this.dataMemory.attr("y") + this.dataMemory.attr("height") * 0.45,
		"Data\nMemory").attr({"font-size": this.fontL, "font-weight": "bold"});
};

Viewer.prototype.drawMEMWB = function() {
	// MEM/WB - rectangle
	this.MEMWB = this.paper.rect(
		this.width * 0.89,
		this.phaseY,
		this.phaseWidth,
		this.phaseHeight);
	this.MEMWB.attr("stroke-width", 2);
	this.MEMWB.attr("fill", this.phaseColor);
	this.paper.text(
		this.MEMWB.attr("x") + this.MEMWB.attr("width") * 0.5,
		this.MEMWB.attr("y") - this.fontS,
		"MEM/WB").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.drawWBMux = function() {
	// WB mux - rounded rectangle
	this.WBMux = this.paper.rect(
		this.width * 0.93,
		this.height * 0.48,
		this.muxWidth,
		this.muxHeight,
		this.phaseWidth * 0.5);
	this.WBMux.attr("stroke-width", 2);
	this.paper.text(
		this.WBMux.attr("x") + this.WBMux.attr("width") * 0.5,
		this.WBMux.attr("y") + this.WBMux.attr("height") * 0.5,
		"M\nu\nx").attr({"font-size": this.fontS, "font-weight": "bold"});
};

Viewer.prototype.setUpAnchors = function() {
	// pcMux anchors
	this.pcMux.anchors = {
		"in0": {
			x: this.pcMux.attr("x"),
			y: this.pcMux.attr("y") + this.pcMux.attr("height")*0.2
		},
		"in1": {
			x: this.pcMux.attr("x"),
			y: this.pcMux.attr("y") + this.pcMux.attr("height")*0.8
		},
		"out0": {
			x: this.pcMux.attr("x") + this.pcMux.attr("width"),
			y: this.pcMux.attr("y") + this.pcMux.attr("height")*0.5
		}
	};
	
	// pcBox anchors
	this.pcBox.anchors = {
		"in0": {
			x: this.pcBox.attr("x"),
			y: this.pcBox.attr("y") + this.pcBox.attr("height")*0.5
		},
		"out0": {
			x: this.pcBox.attr("x") + this.pcBox.attr("width"),
			y: this.pcBox.attr("y") + this.pcBox.attr("height")*0.5
		}
	};
	
	// instruction memory anchors
	this.instructionMemory.anchors = {
		"in0": {
			x: this.instructionMemory.attr("x"),
			y: this.pcBox.anchors.out0.y
		},
		"out0": {
			x: this.instructionMemory.attr("x") + this.instructionMemory.attr("width"),
			y: this.instructionMemory.attr("y") + this.instructionMemory.attr("height") * 0.5
		}
	};
	
	// pcAddALU anchors
	this.pcAddALU.anchors = {
		"in0": {
			x: this.pcAddALU.x,
			y: this.pcAddALU.y + this.aluHeight * 0.2
		},
		"in1": {
			x: this.pcAddALU.x,
			y: this.pcAddALU.y + this.aluHeight * 0.8
		},
		"out0": {
			x: this.pcAddALU.x + this.aluWidth,
			y: this.pcAddALU.y + this.aluHeight * 0.5
		}
	};
	
	// IF/ID anchors
	this.IFID.anchors = {
		"in0": {
			x: this.IFID.attr("x"),
			y: this.pcAddALU.anchors.out0.y
		},
		"in1": {
			x: this.IFID.attr("x"),
			y: this.instructionMemory.anchors.out0.y
		},
		"out0": {
			x: this.IFID.attr("x") + this.IFID.attr("width"),
			y: this.pcAddALU.anchors.out0.y
		},
		"out1": {
			x: this.IFID.attr("x") + this.IFID.attr("width"),
			y: this.instructionMemory.anchors.out0.y
		}
	};
	
	// registers anchors
	this.registers.anchors = {
		"in0": {
			"x": this.registers.attr("x"),
			"y": this.registers.attr("y") + this.registers.attr("height") * (0.9 * 0.00 + 0.05)
		},
		"in1": {
			"x": this.registers.attr("x"),
			"y": this.registers.attr("y") + this.registers.attr("height") * (0.9 * 0.33 + 0.05)
		},
		"in2": {
			"x": this.registers.attr("x"),
			"y": this.registers.attr("y") + this.registers.attr("height") * (0.9 * 0.66 + 0.05)
		},
		"in3": {
			"x": this.registers.attr("x"),
			"y": this.registers.attr("y") + this.registers.attr("height") * (0.9 * 1.00 + 0.05)
		},
		"out0": {
			"x": this.registers.attr("x") + this.registers.attr("width"),
			"y": this.registers.attr("y") + this.registers.attr("height") * 0.2
		},
		"out1": {
			"x": this.registers.attr("x") + this.registers.attr("width"),
			"y": this.registers.attr("y") + this.registers.attr("height") * 0.55
		}
	};
	
	// sign extend anchors
	this.signExtend.anchors = {
		"in0": {
			x: this.signExtend.attr("cx") - this.signExtend.attr("rx"),
			y: this.signExtend.attr("cy")
		},
		"out0": {
			x: this.signExtend.attr("cx") + this.signExtend.attr("rx"),
			y: this.signExtend.attr("cy")
		}
	};
	
	// ID/EX anchors
	this.IDEX.anchors = {
		"in0": {
			x: this.IDEX.attr("x"),
			y: this.IFID.anchors.out0.y
		},
		"in1": {
			x: this.IDEX.attr("x"),
			y: this.registers.anchors.out0.y
		},
		"in2": {
			x: this.IDEX.attr("x"),
			y: this.registers.anchors.out1.y
		},
		"in3": {
			x: this.IDEX.attr("x"),
			y: this.signExtend.anchors.out0.y
		},
		"out0": {
			x: this.IDEX.attr("x") + this.IDEX.attr("width"),
			y: this.IFID.anchors.out0.y
		},
		"out1": {
			x: this.IDEX.attr("x") + this.IDEX.attr("width"),
			y: this.registers.anchors.out0.y
		},
		"out2": {
			x: this.IDEX.attr("x") + this.IDEX.attr("width"),
			y: this.registers.anchors.out1.y
		},
		"out3": {
			x: this.IDEX.attr("x") + this.IDEX.attr("width"),
			y: this.signExtend.anchors.out0.y
		}
	};
	
	// EXMux anchors
	this.EXMux.anchors = {
		"in0": {
			x: this.EXMux.attr("x"),
			y: this.IDEX.anchors.out2.y
		},
		"in1": {
			x: this.EXMux.attr("x"),
			y: this.EXMux.attr("y") + this.EXMux.attr("height") * 0.8
		},
		"out0": {
			x: this.EXMux.attr("x") + this.EXMux.attr("width"),
			y: this.EXMux.attr("y") + this.EXMux.attr("height") * 0.5
		}
	};
	
	// EXALU anchors
	this.EXALU.anchors = {
		"in0": {
			x: this.EXALU.x,
			y: this.IDEX.anchors.out1.y
		},
		"in1": {
			x: this.EXALU.x,
			y: this.EXALU.y + this.aluHeight * 0.8
		},
		"out0": {
			x: this.EXALU.x + this.aluWidth,
			y: this.EXALU.y + this.aluHeight * 0.35
		},
		"out1": {
			x: this.EXALU.x + this.aluWidth,
			y: this.EXALU.y + this.aluHeight * 0.65
		}
	};
	
	// shift left anchors
	this.shiftLeft.anchors = {
		"in0": {
			x: this.shiftLeft.attr("cx"),
			y: this.shiftLeft.attr("cy") + this.shiftLeft.attr("ry")
		},
		"out0": {
			x: this.shiftLeft.attr("cx") + this.shiftLeft.attr("rx"),
			y: this.shiftLeft.attr("cy")
		}
	};
	
	// pcAddShift anchors
	this.pcAddShift.anchors = {
		"in0": {
			x: this.pcAddShift.x,
			y: this.IDEX.anchors.out0.y
		},
		"in1": {
			x: this.pcAddShift.x,
			y: this.shiftLeft.anchors.out0.y
		},
		"out0": {
			x: this.pcAddShift.x + this.aluWidth,
			y: this.pcAddShift.y + this.aluHeight * 0.5
		}
	};
	
	// EX/MEM anchors
	this.EXMEM.anchors = {
		"in0": {
			x: this.EXMEM.attr("x"),
			y: this.pcAddShift.anchors.out0.y
		},
		"in1": {
			x: this.EXMEM.attr("x"),
			y: this.EXALU.anchors.out0.y
		},
		"in2": {
			x: this.EXMEM.attr("x"),
			y: this.EXALU.anchors.out1.y
		},
		"in3": {
			x: this.EXMEM.attr("x"),
			y: this.EXMEM.attr("y") + this.EXMEM.attr("height") * 0.8
		},
		"out0": {
			x: this.EXMEM.attr("x") + this.EXMEM.attr("width"),
			y: this.pcAddShift.anchors.out0.y
		},
		"out1": {
			x: this.EXMEM.attr("x") + this.EXMEM.attr("width"),
			y: this.EXALU.anchors.out0.y
		},
		"out2": {
			x: this.EXMEM.attr("x") + this.EXMEM.attr("width"),
			y: this.EXALU.anchors.out1.y
		},
		"out3": {
			x: this.EXMEM.attr("x") + this.EXMEM.attr("width"),
			y: this.EXMEM.attr("y") + this.EXMEM.attr("height") * 0.8
		}
	};
	
	// data memory anchors
	this.dataMemory.anchors = {
		"in0": {
			x: this.dataMemory.attr("x"),
			y: this.EXMEM.anchors.out2.y
		},
		"in1": {
			x: this.dataMemory.attr("x"),
			y: this.EXMEM.anchors.out3.y
		},
		"out0": {
			x: this.dataMemory.attr("x") + this.dataMemory.attr("width"),
			y: this.EXMEM.anchors.out2.y
		}
	};
	
	// MEM/WB anchors
	this.MEMWB.anchors = {
		"in0": {
			x: this.MEMWB.attr("x"),
			y: this.dataMemory.anchors.out0.y
		},
		"in1": {
			x: this.MEMWB.attr("x"),
			y: this.MEMWB.attr("y") + this.MEMWB.attr("height") * 0.95
		},
		"out0": {
			x: this.MEMWB.attr("x") + this.MEMWB.attr("width"),
			y: this.dataMemory.anchors.out0.y
		},
		"out1": {
			x: this.MEMWB.attr("x") + this.MEMWB.attr("width"),
			y: this.MEMWB.attr("y") + this.MEMWB.attr("height") * 0.85
		}
	};
	
	// WBMux anchors
	this.WBMux.anchors = {
		"in0": {
			x: this.WBMux.attr("x"),
			y: this.MEMWB.anchors.out0.y
		},
		"in1": {
			x: this.WBMux.attr("x"),
			y: this.WBMux.attr("y") + this.WBMux.attr("height") * 0.8
		},
		"out0": {
			x: this.WBMux.attr("x") + this.WBMux.attr("width"),
			y: this.WBMux.attr("y") + this.WBMux.attr("height") * 0.5
		}
	};
	
};

Viewer.prototype.drawPaths = function() {
	// Horizontal Lines - left to right, top to bottom
	
	// pcMux to pcBox
	this.paths["pcMux0-pcBox0"] = this.paper.path(
		"M" + this.pcMux.anchors.out0.x + "," + this.pcMux.anchors.out0.y +
		"L" + this.pcBox.anchors.in0.x + "," + this.pcBox.anchors.in0.y
	);
	
	// pcBox to instructionMemory
	this.paths["pcBox0-instructionMemory0"] = this.paper.path(
		"M" + this.pcBox.anchors.out0.x + "," + this.pcBox.anchors.out0.y +
		"L" + this.instructionMemory.anchors.in0.x + "," + this.instructionMemory.anchors.in0.y
	);
	
	// 4 to pcAddALU
	this.paths["4-pcAddALU1"] = this.paper.path(
		"M" + this.width*0.16 + "," + this.pcAddALU.anchors.in1.y +
		"L" + this.pcAddALU.anchors.in1.x + "," + this.pcAddALU.anchors.in1.y
	);
	this.paper.text( // write the '4'
		this.width*0.155,
		this.pcAddALU.anchors.in1.y,
		"4").attr({"font-size": this.fontS, "font-weight": "bold"});
	
	
	// pcAddALU to IFID
	this.paths["pcAddALU0-IFID0"] = this.paper.path(
		"M" + this.pcAddALU.anchors.out0.x + "," + this.pcAddALU.anchors.out0.y +
		"L" + this.IFID.anchors.in0.x + "," + this.IFID.anchors.in0.y
	);
	
	// instructionMemory to IFID
	this.paths["instructionMemory0-IFID1"] = this.paper.path(
		"M" + this.instructionMemory.anchors.out0.x + "," + this.instructionMemory.anchors.out0.y +
		"L" + this.IFID.anchors.in1.x + "," + this.IFID.anchors.in1.y
	);
	
	// IFID to IDEX
	this.paths["IFID0-IDEX0"] = this.paper.path(
		"M" + this.IFID.anchors.out0.x + "," + this.IFID.anchors.out0.y +
		"L" + this.IDEX.anchors.in0.x + "," + this.IDEX.anchors.in0.y
	);
	
	// register readData1 to IDEX
	this.paths["reg0-IDEX1"] = this.paper.path(
		"M" + this.registers.anchors.out0.x + "," + this.registers.anchors.out0.y +
		"L" + this.IDEX.anchors.in1.x + "," + this.IDEX.anchors.in1.y
	);
	
	// register readData2 to IDEX
	this.paths["reg1-IDEX2"] = this.paper.path(
		"M" + this.registers.anchors.out1.x + "," + this.registers.anchors.out1.y +
		"L" + this.IDEX.anchors.in2.x + "," + this.IDEX.anchors.in2.y
	);
	
	// signExtend to IDEX
	this.paths["signExtend0-IDEX3"] = this.paper.path(
		"M" + this.signExtend.anchors.out0.x + "," + this.signExtend.anchors.out0.y +
		"L" + this.IDEX.anchors.in3.x + "," + this.IDEX.anchors.in3.y
	);
	
	// IDEX pcOut to pcAddShift
	this.paths["IDEX0-pcAddShift0"] = this.paper.path(
		"M" + this.IDEX.anchors.out0.x + "," + this.IDEX.anchors.out0.y +
		"L" + this.pcAddShift.anchors.in0.x + "," + this.pcAddShift.anchors.in0.y
	);
	
	// IDEX readData1 to EXALU
	this.paths["IDEX1-EXALU0"] = this.paper.path(
		"M" + this.IDEX.anchors.out1.x + "," + this.IDEX.anchors.out1.y +
		"L" + this.EXALU.anchors.in0.x + "," + this.EXALU.anchors.in0.y
	);
	
	// shiftLeft to pcAddShift
	this.paths["shiftLeft0-pcAddShift1"] = this.paper.path(
		"M" + this.shiftLeft.anchors.out0.x + "," + this.shiftLeft.anchors.out0.y +
		"L" + this.pcAddShift.anchors.in1.x + "," + this.pcAddShift.anchors.in1.y
	);
	
	// pcAddShift to EXMEM
	this.paths["pcAddShift0-EXMEM0"] = this.paper.path(
		"M" + this.pcAddShift.anchors.out0.x + "," + this.pcAddShift.anchors.out0.y +
		"L" + this.EXMEM.anchors.in0.x + "," + this.EXMEM.anchors.in0.y
	);
	
	// EXALU zeroResult to EXMEM
	this.paths["EXALU0-EXMEM0"] = this.paper.path(
		"M" + this.EXALU.anchors.out0.x + "," + this.EXALU.anchors.out0.y +
		"L" + this.EXMEM.anchors.in1.x + "," + this.EXMEM.anchors.in1.y
	);
	
	// EXALU aluResult to EXMEM
	this.paths["EXALU1-EXMEM2"] = this.paper.path(
		"M" + this.EXALU.anchors.out1.x + "," + this.EXALU.anchors.out1.y +
		"L" + this.EXMEM.anchors.in2.x + "," + this.EXMEM.anchors.in2.y
	);
	
	// EXMEM zeroResult to nothing (?)
	this.paths["EXMEM1-endPoint"] = this.paper.path(
		"M" + this.EXMEM.anchors.out1.x + "," + this.EXMEM.anchors.out1.y +
		"L" + (this.dataMemory.attr("x")-(this.dataMemory.attr("x") - this.EXMEM.anchors.out1.x)/2) + "," + this.EXMEM.anchors.out1.y
	);
	
	// EXMEM readData2 to dataMemory
	this.paths["EXMEM3-dataMemory1"] = this.paper.path(
		"M" + this.EXMEM.anchors.out3.x + "," + this.EXMEM.anchors.out3.y +
		"L" + this.dataMemory.anchors.in1.x + "," + this.dataMemory.anchors.in1.y
	);
	
	// dataMemory to MEMWB
	this.paths["dataMemory0-MEMWB0"] = this.paper.path(
		"M" + this.dataMemory.anchors.out0.x + "," + this.dataMemory.anchors.out0.y +
		"L" + this.MEMWB.anchors.in0.x + "," + this.MEMWB.anchors.in0.y
	);
	
	// MEMWB to WBMux
	this.paths["MEMWB0-WBMux0"] = this.paper.path(
		"M" + this.MEMWB.anchors.out0.x + "," + this.MEMWB.anchors.out0.y +
		"L" + this.WBMux.anchors.in0.x + "," + this.WBMux.anchors.in0.y
	);
	
	////////////////////////////////////////////////////////////
	// Complex Lines - left to right, top to bottom (start point)
	////////////////////////////////////////////////////////////
	
	// pcBox to pcAddALU
	var pcBoxIntersection = (this.pcBox.anchors.out0.x + (this.instructionMemory.anchors.in0.x - this.pcBox.anchors.out0.x)*0.4);
	this.paths["pcBox0I-pcAddALU0"] = this.paper.path(
		"M" + pcBoxIntersection	+ "," + this.pcBox.anchors.out0.y +
		"L" + pcBoxIntersection	+ "," + this.pcAddALU.anchors.in0.y +
		"L" + this.pcAddALU.anchors.in0.x + "," + this.pcAddALU.anchors.in0.y
	);
	
	// pcAddALU to pcMux
	var pcAddALUIntersection = (this.pcAddALU.anchors.out0.x + (this.IFID.anchors.in0.x - this.pcAddALU.anchors.out0.x)*0.2);
	this.paths["pcAddALU0I-pcMux0"] = this.paper.path(
		"M" + pcAddALUIntersection	+ "," + this.pcAddALU.anchors.out0.y +
		"L" + pcAddALUIntersection	+ "," + this.height*0.05 +
		"L" + this.width*0.02 + "," + this.height*0.05 +
		"L" + this.width*0.02	+ "," + this.pcMux.anchors.in0.y +
		"L" + this.pcMux.anchors.in0.x + "," + this.pcMux.anchors.in0.y
	);
	
	// IFID to intersection
	var IFIDIntersectionX = (this.IFID.anchors.out0.x + (this.registers.attr("x") - this.IFID.anchors.out0.x)*0.4);
	var IFIDIntersectionY = this.IFID.anchors.out1.y;
	this.paths["IFID1-IFID1I"] = this.paper.path(
		"M" + this.IFID.anchors.out1.x + "," + this.IFID.anchors.out1.y +
		"L" + IFIDIntersectionX + "," + IFIDIntersectionY
	);
	
	// intersection to register readReg1
	this.paths["IFID1I-reg0"] = this.paper.path(
		"M" + IFIDIntersectionX + "," + IFIDIntersectionY + 
		"L" + IFIDIntersectionX + "," + this.registers.anchors.in0.y + 
		"L" + this.registers.anchors.in0.x + "," + this.registers.anchors.in0.y
	);
	
	// intersection to register readReg2
	this.paths["IFID1I-reg1"] = this.paper.path(
		"M" + IFIDIntersectionX + "," + IFIDIntersectionY +
		"L" + IFIDIntersectionX + "," + this.registers.anchors.in1.y +
		"L" + this.registers.anchors.in1.x + "," + this.registers.anchors.in1.y
	);
	
	// intersection to register writeRegister
	this.paths["IFID1I-reg2"] = this.paper.path(
		"M" + IFIDIntersectionX + "," + IFIDIntersectionY +
		"L" + IFIDIntersectionX + "," + this.registers.anchors.in2.y +
		"L" + this.registers.anchors.in2.x + "," + this.registers.anchors.in2.y
	);
	
	// intersection to signExtend
	this.paths["IFID1I-signExtend0"] = this.paper.path(
		"M" + IFIDIntersectionX + "," + IFIDIntersectionY +
		"L" + IFIDIntersectionX + "," + this.signExtend.anchors.in0.y +
		"L" + this.signExtend.anchors.in0.x + "," + this.signExtend.anchors.in0.y
	);
	
	// IDEX readData2 to IDEX readData2 intersection
	var IDEXreadData2IntersectionX = (this.IDEX.anchors.out2.x + (this.EXMux.anchors.in0.x - this.IDEX.anchors.out2.x)*0.3);
	var IDEXreadData2IntersectionY = this.IDEX.anchors.out2.y;
	this.paths["IDEX2-IDEX2I"] = this.paper.path(
		"M" + this.IDEX.anchors.out2.x + "," + this.IDEX.anchors.out2.y +
		"L" + IDEXreadData2IntersectionX + "," + IDEXreadData2IntersectionY
	);
	
	// IDEX readData2 intersection to EXMux
	this.paths["IDEX2I-EXMux0"] = this.paper.path(
		"M" + IDEXreadData2IntersectionX + "," + IDEXreadData2IntersectionY +
		"L" + this.EXMux.anchors.in0.x + "," + this.EXMux.anchors.in0.y
	);
	
	// IDEX readData2 intersection to EXMEM
	this.paths["IDEX2I-EXMEM3"] = this.paper.path(
		"M" + IDEXreadData2IntersectionX + "," + IDEXreadData2IntersectionY +
		"L" + IDEXreadData2IntersectionX + "," + this.EXMEM.anchors.in3.y +
		"L" + this.EXMEM.anchors.in3.x + "," + this.EXMEM.anchors.in3.y
	);
	
	// IDEX to IDEX imm intersection
	var IDEXimmIntersectionX = this.shiftLeft.anchors.in0.x;
	var IDEXimmIntersectionY = this.EXMux.anchors.in1.y;
	this.paths["IDEX3-IDEX3I"] = this.paper.path(
		"M" + this.IDEX.anchors.out3.x + "," + this.IDEX.anchors.out3.y +
		"L" + this.shiftLeft.anchors.in0.x + "," + this.IDEX.anchors.out3.y +
		"L" + IDEXimmIntersectionX + "," + IDEXimmIntersectionY
	);
	
	// IDEX imm intersection to shiftLeft
	this.paths["IDEX3I-shiftLeft0"] = this.paper.path(
		"M" + IDEXimmIntersectionX + "," + IDEXimmIntersectionY +
		"L" + this.shiftLeft.anchors.in0.x + "," + this.shiftLeft.anchors.in0.y
	);
	
	// IDEX imm intersection to EXMux
	this.paths["IDEX3I-EXMux1"] = this.paper.path(
		"M" + IDEXimmIntersectionX + "," + IDEXimmIntersectionY +
		"L" + this.EXMux.anchors.in1.x + "," + this.EXMux.anchors.in1.y
	);
	
	// EXMux to EXALU
	this.paths["EXMux0-EXALU1"] = this.paper.path(
		"M" + this.EXMux.anchors.out0.x + "," + this.EXMux.anchors.out0.y +
		"L" + this.width*0.584 + "," + this.EXMux.anchors.out0.y +
		"L" + this.width*0.584 + "," + this.EXALU.anchors.in1.y +
		"L" + this.EXALU.anchors.in1.x + "," + this.EXALU.anchors.in1.y
	);
	
	// EXMEM to pcMux
	this.paths["EXMEM0-pcMux1"] = this.paper.path(
		"M" + this.EXMEM.anchors.out0.x + "," + this.EXMEM.anchors.out0.y +
		"L" + this.width*0.75 + "," + this.EXMEM.anchors.out0.y +
		"L" + this.width*0.75 + "," + this.height*0.03 +
		"L" + this.width*0.01 + "," + this.height*0.03 +
		"L" + this.width*0.01 + "," + this.pcMux.anchors.in1.y +
		"L" + this.pcMux.anchors.in1.x + "," + this.pcMux.anchors.in1.y
	);
	
	// EXMEM aluResult to EXMEM aluResult intersection
	var EXMEMaddressIntersectionX = this.width*0.71;
	var EXMEMaddressIntersectionY = this.EXMEM.anchors.out2.y;
	this.paths["EXMEM2-EXMEM2I"] = this.paper.path(
		"M" + this.EXMEM.anchors.out2.x + "," + this.EXMEM.anchors.out2.y +
		"L" + EXMEMaddressIntersectionX + "," + EXMEMaddressIntersectionY
	);
	
	// EXMEM address intersection to dataMemory address
	this.paths["EXMEM2I-dataMemory0"] = this.paper.path(
		"M" + EXMEMaddressIntersectionX + "," + EXMEMaddressIntersectionY +
		"L" + this.dataMemory.anchors.in0.x + "," + this.dataMemory.anchors.in0.y
	);
	
	// EXMEM address intersection to MEMWB
	this.paths["EXMEM2I-MEMWB1"] = this.paper.path(
		"M" + EXMEMaddressIntersectionX + "," + EXMEMaddressIntersectionY +
		"L" + EXMEMaddressIntersectionX + "," + this.MEMWB.anchors.in1.y +
		"L" + this.MEMWB.anchors.in1.x + "," + this.MEMWB.anchors.in1.y
	);
	
	// MEMWB to WBMux
	this.paths["MEMWB1-WBMux1"] = this.paper.path(
		"M" + this.MEMWB.anchors.out1.x + "," + this.MEMWB.anchors.out1.y +
		"L" + this.width*0.92 + "," + this.MEMWB.anchors.out1.y +
		"L" + this.width*0.92 + "," + this.WBMux.anchors.in1.y +
		"L" + this.WBMux.anchors.in1.x + "," + this.WBMux.anchors.in1.y
	);
	
	// WBMux to register writeData
	this.paths["WBMux0-reg3"] = this.paper.path(
		"M" + this.WBMux.anchors.out0.x + "," + this.WBMux.anchors.out0.y +
		"L" + this.width*0.97 + "," + this.WBMux.anchors.out0.y +
		"L" + this.width*0.97 + "," + this.height*0.8 +
		"L" + this.width*0.323 + "," + this.height*0.8 +
		"L" + this.width*0.323 + "," + this.registers.anchors.in3.y +
		"L" + this.registers.anchors.in3.x + "," + this.registers.anchors.in3.y
	);
	
	
	for(var key in this.paths) {
		this.paths[key].attr("stroke-width", 2);
		this.paths[key].attr("arrow-end", "classic-wide-long");
	}
};

Viewer.prototype.updateIF = function(IF) {
	if(IF === "null" || IF === "nop" || IF === "halt") {
		return;
	}
	this.paths["pcBox0-instructionMemory0"].attr("stroke", this.hotPathColor);
	this.paths["pcBox0I-pcAddALU0"].attr("stroke", this.hotPathColor);
	this.paths["4-pcAddALU1"].attr("stroke", this.hotPathColor);
	this.paths["pcAddALU0-IFID0"].attr("stroke", this.hotPathColor);
	this.paths["pcAddALU0I-pcMux0"].attr("stroke", this.hotPathColor);
	this.paths["instructionMemory0-IFID1"].attr("stroke", this.hotPathColor);
};

Viewer.prototype.updateID = function(ID) {
	if(ID === "null" || ID === "nop" || ID === "halt") {
		return;
	}
	this.paths["IFID0-IDEX0"].attr("stroke", this.hotPathColor);
	this.paths["IFID1-IFID1I"].attr("stroke", this.hotPathColor);
	switch (ID) {
		case 'add':
		case 'nand':
			this.paths["IFID1I-reg0"].attr("stroke", this.hotPathColor);
			this.paths["IFID1I-reg1"].attr("stroke", this.hotPathColor);
			this.paths["IFID1I-reg2"].attr("stroke", this.hotPathColor);
			this.paths["reg0-IDEX1"].attr("stroke", this.hotPathColor);
			this.paths["reg1-IDEX2"].attr("stroke", this.hotPathColor);
			break;
		
		case 'jalr':
		case 'halt':
		case 'addi':
		case 'lw':
			this.paths["IFID1I-reg0"].attr("stroke", this.hotPathColor);
			this.paths["IFID1I-reg2"].attr("stroke", this.hotPathColor);
			this.paths["IFID1I-signExtend0"].attr("stroke", this.hotPathColor);
			this.paths["reg0-IDEX1"].attr("stroke", this.hotPathColor);
			this.paths["signExtend0-IDEX3"].attr("stroke", this.hotPathColor);
			break;
		
		case 'sw':
		case 'bne':
			this.paths["IFID1I-reg0"].attr("stroke", this.hotPathColor);
			this.paths["IFID1I-reg1"].attr("stroke", this.hotPathColor);
			this.paths["reg0-IDEX1"].attr("stroke", this.hotPathColor);
			this.paths["reg1-IDEX2"].attr("stroke", this.hotPathColor);
			this.paths["IFID1I-signExtend0"].attr("stroke", this.hotPathColor);
			this.paths["signExtend0-IDEX3"].attr("stroke", this.hotPathColor);
			break;
		
		case 'lui':
			this.paths["IFID1I-reg2"].attr("stroke", this.hotPathColor);
			this.paths["IFID1I-signExtend0"].attr("stroke", this.hotPathColor);
			this.paths["signExtend0-IDEX3"].attr("stroke", this.hotPathColor);
			break;
		
		case 'nop':
		default:
			return;
			break;
	}
};

Viewer.prototype.updateEX = function(EX) {
	if(EX === "null" || EX === "nop" || EX === "halt") {
		return;
	}
	this.paths["IDEX0-pcAddShift0"].attr("stroke", this.hotPathColor);
	this.paths["pcAddShift0-EXMEM0"].attr("stroke", this.hotPathColor);
	this.paths["EXALU1-EXMEM2"].attr("stroke", this.hotPathColor);
	switch (EX) {
		case 'add':
		case 'nand':
			this.paths["IDEX1-EXALU0"].attr("stroke", this.hotPathColor);
			this.paths["IDEX2-IDEX2I"].attr("stroke", this.hotPathColor);
			this.paths["IDEX2I-EXMux0"].attr("stroke", this.hotPathColor);
			this.paths["EXMux0-EXALU1"].attr("stroke", this.hotPathColor);
			break;
		
		case 'addi':
		case 'lw':
		case 'lui':
			this.paths["IDEX1-EXALU0"].attr("stroke", this.hotPathColor);
			this.paths["IDEX3-IDEX3I"].attr("stroke", this.hotPathColor);
			this.paths["IDEX3I-EXMux1"].attr("stroke", this.hotPathColor);
			this.paths["EXMux0-EXALU1"].attr("stroke", this.hotPathColor);
			break;
		
		case 'sw':
			this.paths["IDEX1-EXALU0"].attr("stroke", this.hotPathColor);
			this.paths["IDEX2-IDEX2I"].attr("stroke", this.hotPathColor);
			this.paths["IDEX2I-EXMEM3"].attr("stroke", this.hotPathColor);
			this.paths["IDEX3-IDEX3I"].attr("stroke", this.hotPathColor);
			this.paths["IDEX3I-EXMux1"].attr("stroke", this.hotPathColor);
			this.paths["EXMux0-EXALU1"].attr("stroke", this.hotPathColor);
			break;
		
		case 'bne':
			this.paths["IDEX1-EXALU0"].attr("stroke", this.hotPathColor);
			this.paths["IDEX2-IDEX2I"].attr("stroke", this.hotPathColor);
			this.paths["IDEX2I-EXMux0"].attr("stroke", this.hotPathColor);
			this.paths["EXMux0-EXALU1"].attr("stroke", this.hotPathColor);
			this.paths["IDEX3-IDEX3I"].attr("stroke", this.hotPathColor);
			this.paths["IDEX3I-shiftLeft0"].attr("stroke", this.hotPathColor);
			this.paths["shiftLeft0-pcAddShift1"].attr("stroke", this.hotPathColor);
			break;
		
		case 'jalr':
		case 'halt':
			this.paths["IDEX1-EXALU0"].attr("stroke", this.hotPathColor);
			this.paths["IDEX2-IDEX2I"].attr("stroke", this.hotPathColor);
			this.paths["IDEX3-IDEX3I"].attr("stroke", this.hotPathColor);
			this.paths["IDEX3I-shiftLeft0"].attr("stroke", this.hotPathColor);
			this.paths["shiftLeft0-pcAddShift1"].attr("stroke", this.hotPathColor);
			break;
		
		case 'nop':
		default:
			return;
			break;
	}
};

Viewer.prototype.updateMEM = function(MEM) {
	if(MEM === "null" || MEM === "nop" || MEM === "halt") {
		return;
	}
	this.paths["EXMEM0-pcMux1"].attr("stroke", this.hotPathColor);
	this.paths["EXMEM2-EXMEM2I"].attr("stroke", this.hotPathColor);
	switch (MEM) {
		case 'add':
		case 'nand':
		case 'addi':
		case 'jalr':
		case 'halt':
		case 'lui':
			this.paths["EXMEM2I-MEMWB1"].attr("stroke", this.hotPathColor);
			break;
		
		case 'sw':
			this.paths["EXMEM3-dataMemory1"].attr("stroke", this.hotPathColor);
			this.paths["EXMEM2I-dataMemory0"].attr("stroke", this.hotPathColor);
			break;
		
		case 'lw':
			this.paths["EXMEM2I-dataMemory0"].attr("stroke", this.hotPathColor);
			this.paths["dataMemory0-MEMWB0"].attr("stroke", this.hotPathColor);
			break;
		
		case 'bne':
			break;
		
		case 'nop':
		default:
			return;
			break;
	}
};

Viewer.prototype.updateWB = function(WB) {
	if(WB === "null" || WB === "nop" || WB === "halt") {
		return;
	}
	switch (WB) {
		case 'add':
		case 'nand':
		case 'addi':
		case 'jalr':
		case 'halt':
		case 'lui':
			this.paths["MEMWB1-WBMux1"].attr("stroke", this.hotPathColor);
			this.paths["WBMux0-reg3"].attr("stroke", this.hotPathColor);
			break;
		
		case 'lw':
			this.paths["MEMWB0-WBMux0"].attr("stroke", this.hotPathColor);
			this.paths["WBMux0-reg3"].attr("stroke", this.hotPathColor);
			break;
		
		case 'sw':
		case 'bne':
			break;
		
		case 'nop':
		default:
			return;
			break;
	}
};

Viewer.prototype.drawALU = function (x, y) {
	var p0 = {x: x,                     y: y};
	var p1 = {x: x+this.aluWidth,       y: y+this.aluHeight*0.25};
	var p2 = {x: x+this.aluWidth,       y: y+this.aluHeight*0.75};
	var p3 = {x: x,                     y: y+this.aluHeight};
	var p4 = {x: x,                     y: y+this.aluHeight*0.60};
	var p5 = {x: x+this.aluWidth*0.25,   y: y+this.aluHeight*0.5};
	var p6 = {x: x,                     y: y+this.aluHeight*0.40};
	var alu = this.paper.path(
		"M" + p0.x + "," + p0.y +
		"L" + p1.x + "," + p1.y +
		"L" + p2.x + "," + p2.y +
		"L" + p3.x + "," + p3.y +
		"L" + p4.x + "," + p4.y +
		"L" + p5.x + "," + p5.y +
		"L" + p6.x + "," + p6.y +
		"Z");
	alu.attr("stroke-width", 2);
	alu.x = x;
	alu.y = y;
	return alu;
};

Viewer.prototype.reset = function() {
	console.log("resetting");
	this.IFinstr.attr("text",  "none");
	this.IDinstr.attr("text",  "none");
	this.EXinstr.attr("text",  "none");
	this.MEMinstr.attr("text", "none");
	this.WBinstr.attr("text",  "none");
	this.IFhazard.attr("text",  "");
	this.EXhazard.attr("text",  "");
	
	for(var key in this.paths) {
		this.paths[key].attr("stroke", "#000000")
	}
};
