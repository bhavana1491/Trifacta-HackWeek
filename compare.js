var diff = require('deep-diff').diff;
const fs = require('fs');
var prettyjson = require('prettyjson');
var colors = require('colors');


var lhs =JSON.parse(fs.readFileSync(process.argv[2]));
var rhs =JSON.parse(fs.readFileSync(process.argv[3]));

var differences = diff(lhs, rhs);
var diffobject  = [];
var oldobject = [];
var subDict = {};
var oldOptions = {
	keysColor: 'red'
}
var newOptions = {
	keysColor: 'blue'
}

// console.log(differences);

for(var i=0; i<differences.length; i++){
	var original = JSON.parse(JSON.stringify(differences[i]));
	if(differences[i].kind == 'E'){
		if(differences[i].path.length > 1){
			differences[i].path.push(differences[i].rhs);
			diffobject.push(addDict(differences[i].path));
			original.path.push(original.lhs);
			oldobject.push(addDict(original.path));

		}
		else{
			subDict = {};
			subDict[differences[i].path[0]] = differences[i].rhs;
			diffobject.push(subDict);
			subDict = {};
			subDict[original.path[0]] = original.lhs;
			oldobject.push(subDict)
		}
	}
	if(differences[i].kind == 'N'){
		if(differences[i].path.length > 1){
			differences[i].path.push(differences[i].rhs);
			diffobject.push(addDict(differences[i].path));
			original.path.push("This property/value is New");
			oldobject.push(addDict(original.path));
		}
		else{
			subDict = {};
			subDict[differences[i].path[0]] = differences[i].rhs;
			diffobject.push(subDict);
			subDict = {};
			subDict[original.path[0]] = "This property/value is New";
			oldobject.push(subDict);
		}
	}
	if(differences[i].kind == 'D'){
		if(differences[i].path.length > 1){
			differences[i].path.push(differences[i].rhs);
			diffobject.push(addDict(differences[i].path));
			original.path.push("This value is deleted in the new file");
			oldobject.push(addDict(original.path));
		}
		else{
			subDict = {};
			subDict[differences[i].path[0]] = "This value is deleted in the new file";
			diffobject.push(subDict);
			subDict = {};
			subDict[original.path[0]] = (original.lhs);
			oldobject.push(subDict);
		}
	}
}

for(var i=0;i<diffobject.length;i++){
	console.log("Old \n" + prettyjson.render(oldobject[i],oldOptions));
	console.log("New \n" + prettyjson.render(diffobject[i],newOptions));	
}
// console.log(diffobject);

function addDict(path){
	if(path.length == 2){
		var innerDict = new Object();
		innerDict[path[0]] = path[1];
		return innerDict;
	}
	else{
		var key = path.shift();
		var outerDict = new Object();
		outerDict[key] = addDict(path);
		//console.log(subDict);
		return outerDict;
	}
}

