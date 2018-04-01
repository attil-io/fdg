(function () {

var bodyElement = document.getElementsByTagName("body")[0]; 
var inputTextElement, saveInputElement, chooseWordsElement;


bodyElement.onload = function () {
	console.log("Initializing fdg.js");
	inputTextElement = document.getElementById("inputtext");
	saveInputElement = document.getElementById("saveinput");
	chooseWordsElement = document.getElementById("choosewords");

	saveInputElement.onclick = saveInputOnClick;
}

function splitTextToWords(text) {
	return text.replace(/\s\s+/g, ' ').match(/\w+|\s+|[^\s\w]+/g).filter(w => (w != ' ' && w != '\t' && w != '\n'));
}

function clearChoosableWords() {
	while (chooseWordsElement.firstChild) {
		    chooseWordsElement.removeChild(chooseWordsElement.firstChild);
	}
}

function saveInputOnClick() {
	var text = inputTextElement.value;
	var words = splitTextToWords(text);
	words.forEach(function(word) {
		console.log(word);
	});
}
})();

