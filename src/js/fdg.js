(function () {

var bodyElement = document.getElementsByTagName("body")[0]; 
var inputTextElement, saveInputElement, chooseWordsElement, practiceElement, showWordsElement, missingWordsElement;

var words = [];
var wordElements = [];
var hidden = [];

bodyElement.onload = function () {
	console.log("Initializing fdg.js");
	inputTextElement = document.getElementById("inputtext");
	saveInputElement = document.getElementById("saveinput");
	chooseWordsElement = document.getElementById("choosewords");
	showWordsElement = document.getElementById("showwords");
	practiceElement = document.getElementById("practice");
	missingWordsElement = document.getElementById("missingwords");

	saveInputElement.onclick = saveInputOnClick;
	practiceElement.onclick = practiceElementOnClick;
}

function splitTextToWords(text) {
	return text.replace(/\s\s+/g, ' ').match(/[a-zA-Z\u00E0-\u00FC\u00DF]+|\s+|[^\sa-zA-Z\u00E0-\u00FC\u00DF]+/g).filter(w => (w != ' ' && w != '\t'));
}

var actualLineElement;
function removeAllChildrenOf(element) {
	while (element.firstChild) {
		    element.removeChild(element.firstChild);
	}
}

function clearChoosableWords() {
	removeAllChildrenOf(chooseWordsElement);
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
	var elementId = "choosable" + id;
	wordElement.innerHTML = word;
	wordElement.id = elementId;
	wordElement.classList.add("choosableWord");
	wordElement.onclick = function () {
		wordElementOnClick(elementId);
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

function wordElementOnClick(elementId) {
	var id = elementId.replace(/^choosable/, "");
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

var actualExerciseLineElement;
function clearExercise() {
	removeAllChildrenOf(showWordsElement);
	removeAllChildrenOf(missingWordsElement);
	actualExerciseLineElement = null;
}

function newLineForExerciseWords() {
	actualExerciseLineElement = document.createElement("div");
	showWordsElement.appendChild(actualExerciseLineElement);
}

function createExerciseWord(id, word) {
	var wordElement = document.createElement("label");
	wordElement.innerHTML = word;
	wordElement.id = "exercise" + id;
	wordElement.classList.add("exerciseWord");
	actualExerciseLineElement.appendChild(wordElement);
}

function createExerciseInput(id, word) {
	var wordElement = document.createElement("input");
	wordElement.id = "exercise" + id;
	wordElement.classList.add("exerciseWord");
	actualExerciseLineElement.appendChild(wordElement);
}

function showExercise() {
	actualExerciseLineElement = null;
	clearExercise();
	newLineForExerciseWords();
	words.forEach(function(word, index) {
		if ("\n" === word) {
			newLineForExerciseWords();
		} else if (hidden[index]){
			createExerciseInput(index, word);
		} else {
			createExerciseWord(index, word);
		}
	});
}

function practiceElementOnClick() {
	showExercise();
}

})();

