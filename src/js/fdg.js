(function () {

var bodyElement = document.getElementsByTagName("body")[0]; 
var inputTextElement, saveInputElement, chooseWordsElement;

var words = [];
var wordElements = [];
var hidden = [];

bodyElement.onload = function () {
	console.log("Initializing fdg.js");
	inputTextElement = document.getElementById("inputtext");
	saveInputElement = document.getElementById("saveinput");
	chooseWordsElement = document.getElementById("choosewords");

	saveInputElement.onclick = saveInputOnClick;
}

function splitTextToWords(text) {
	return text.replace(/\s\s+/g, ' ').match(/[a-zA-Z\u00E0-\u00FC\u00DF]+|\s+|[^\sa-zA-Z\u00E0-\u00FC\u00DF]+/g).filter(w => (w != ' ' && w != '\t'));
}

var actualLineElement;
function clearChoosableWords() {
	while (chooseWordsElement.firstChild) {
		    chooseWordsElement.removeChild(chooseWordsElement.firstChild);
	}
	actualLineElement = null;
	words = [];
	wordElements = [];
	hidden = [];
}

function newLineForChoosableWords() {
	actualLineElement = document.createElement("div");
	chooseWordsElement.appendChild(actualLineElement);
}

function createChoosableWord(id, word) {
	var wordElement = document.createElement("label");
	wordElement.innerHTML = word;
	wordElement.id = id;
	wordElement.classList.add("choosableWord");
	wordElement.onclick = function () {
		wordElementOnClick(id);
	}
	actualLineElement.appendChild(wordElement);
	wordElements[id] = wordElement;
}

function saveInputOnClick() {
	clearChoosableWords();
	newLineForChoosableWords();
	var text = inputTextElement.value;
	words = splitTextToWords(text);
	hidden = new Array(words.length).fill(false);
	wordElements = new Array(words.length).fill(null);
	words.forEach(function(word, index) {
		if ("\n" === word) {
			newLineForChoosableWords();
		} else {
			createChoosableWord(index, word);
		}
	});
}

function wordElementOnClick(id) {
	var wordElement = wordElements[id];
	var wasHidden = hidden[id];
	console.log("Clicked id:", id);
	if (wasHidden) {
		wordElement.classList.remove("chosenWord");
	} else {
		wordElement.classList.add("chosenWord");
	}
	hidden[id] = !wasHidden;
}
})();

