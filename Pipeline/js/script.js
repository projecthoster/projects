// JavaScript Document

var viewer;

window.onload = function() {
	viewer = new Viewer();
};

// Viewport
function setDims(obj) {
    obj.width = document.documentElement.clientWidth;
    obj.height = document.documentElement.clientHeight;
}

function setTime() {
	$("#time").html( Number($("#timeInput").val()).toFixed(1) + "s" );
}

var nextInterval;
var checkInterval;
var paused = false;
var simulating = false;
var that;
var milliseconds;
function pausePlayView() {
	if(simulating) {
		if(paused) {
			// play
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
			$("#pausePlay").html("Pause");
			$("#pausePlay").css("color", "#49DE64");
			$("#pausePlay").css("background-color", "#470073");
			
		} else {
			// pause
			clearInterval(nextInterval);
			clearInterval(checkInterval);
			$("#pausePlay").html("Play");
			$("#pausePlay").css("color", "#450070");
			$("#pausePlay").css("background-color", "#00C424");
		}
		paused = !paused;
	}
}

function stopView() {
	clearInterval(nextInterval);
	clearInterval(checkInterval);
	viewer.reset();
	viewer.hide();
	$("#pausePlay").html("Pause");
	$("#pausePlay").css("color", "#49DE64");
	$("#pausePlay").css("background-color", "#470073");
	paused = false;
	simulating = false;
}

function handle(e) {
    if(e.keyCode === 13) {
        $("button#simulate").click();
    }
}

// Clean up strings (comments, empty lines, etc.)
function parseClean(arr) {
    var newArr = [];
    for(var key in arr) {
        var newStr = arr[key];
        
        if(newStr.indexOf('#') > -1) {  // Remove comments
            newStr = newStr.substring(0, newStr.indexOf('#') - 1);
        }
        
        newStr = $.trim(newStr);        // Remove trailing whitespace

        if(newStr != "") {              // Prevent blank lines
            newArr.push(newStr);
        }
    }
    return newArr;
}

// Convert raw assembly to machine code
function encode(strArray) {
	Word.line = 0;
    var words = [];
    for(key in strArray) {
        strArray[key] = strArray[key].replace(/,/g," ");
        strArray[key] = strArray[key].replace(/\t/g," ");
        var tmparr = strArray[key].split(" ");
        var params = [];
        for(var ind in tmparr) {
            if(tmparr[ind] != "") params.push(tmparr[ind]);
        }
        var word = new Word( params );
        words.push( word );
    }

    for ( var i in words ) {
        words[i].resolveImmediateLabel();
    }
    
	$("#hiddenText").val("");
	
    for(key in words) {
		$("#hiddenText").val($("#hiddenText").val() + words[key].encode());
	}
}

function getLogLevel() {
    return Number( $("#logLevel").val() );
}

function runSimulator( wordsArr ) {
    var sim = new Simulator( getLogLevel(), wordsArr );
    sim.start();
}

// Convert machine code to raw assembly
function decode(strArray) {
	Word.line = 0;
    var words = [];
	for(var i in strArray) {
		if(strArray[i] != "NaN") {
			words.push( new Word(padBin16(parseInt(strArray[i], 16).toString(2))));
		}
	}
	return words;
}

// Assembly to Machine
function assemble() {
    var file = $("#assemblyFile");

    // Check if user has selected a file
    if(file.val() == "") {
        alert("Please choose a file!");
        return;
    }
    console.log("Assembling...");

    // Read file into an element
    var inputFile = file[0].files[0];
    readFile(inputFile);
	
	$("#hiddenText").val("");

    var filename = getFileNameWithoutExtension( file );

    // Need this to allow time for... something
    // otherwise 'data' doesn't get set
    // Weird but necessary - don't change!!!
    setTimeout(function() {
        var data = $("#hiddenFile").val();
        var newArr = parseClean(data.split("\n"));
        encode(newArr);
        download( filename + '.txt' ); // Machine code file.
    }, 5);
}

var filename;
// Machine to Assembly
function simulate() {
    var file = $("#machineFile");
    
    // Check if user has selected a file
    if(file.val() == "") {
        alert("Please choose a file!");
        return;
    }
    console.log("Simulating...");
    
    // Read file into an element
    var inputFile = file[0].files[0];
    readFile(inputFile);
	
	filename = getFileNameWithoutExtension( file );

    // Need this to allow time for... something
    // otherwise 'data' doesn't get set
    // Weird but necessary - don't change!!!
    viewer.show();
    setTimeout(function() {
        var data = $("#hiddenFile").val();
        var newArr = data.split("\n");
        var words = decode(newArr);
		runSimulator( words );
		//while(!done) {}
		//download( filename + '.' + getLogLevel() + '.pipetrace.txt' );
		//viewer.hide();
    }, Math.max(2000, $("#timeInput").val() * 1000));
}

function getFileNameWithoutExtension( fileObject ) {
    return fileObject.val().split(/(\\|\/)/g).pop().split('.')[0];
}

// Reads file and saves text to a unique div
function readFile(inputFile) {
    var fr = new FileReader();
    fr.onload = function(e) {
        $("#hiddenFile").val(e.target.result);
    };
    fr.readAsText(inputFile);
}

/*
 * Download function courtesy of:
 * https://thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip/
 */
function download(fileName) {
    var textToWrite = document.getElementById("hiddenText").value;
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = fileName;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.URL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}