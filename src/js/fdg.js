(function () {

var bodyElement = document.getElementsByTagName("body")[0]; 

bodyElement.onload = function () {
	console.log("Initializing fdg.js");
	var inputTextElement = document.getElementById("inputtext");
	var saveInputElement = document.getElementById("saveinput");

	saveInputElement.onclick = saveInputOnClick;
}

function saveInputOnClick() {
	console.log("clicked!");
}
})();
