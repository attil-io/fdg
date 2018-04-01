(function () {

var bodyElement = document.getElementsByTagName("body")[0]; 
var messageElement, inputTextElement, saveInputElement, chooseWordsElement, practiceElement, showWordsElement, missingWordsElement, inputStepElement, chooseStepElement, practiceStepElement;

var words = [];
var hidden = [];
var found = [];

var wordElements = [];
var missingWordElements = [];

var actualLineElement;
var actualExerciseLineElement;

bodyElement.onload = function () {
	console.log("Initializing fdg.js");
	messageElement = document.getElementById("message");
	inputTextElement = document.getElementById("inputtext");
	saveInputElement = document.getElementById("saveinput");
	chooseWordsElement = document.getElementById("choosewords");
	showWordsElement = document.getElementById("showwords");
	practiceElement = document.getElementById("practice");
	missingWordsElement = document.getElementById("missingwords");
	inputStepElement = document.getElementById("inputstep");
	chooseStepElement = document.getElementById("choosestep");
	practiceStepElement = document.getElementById("practicestep");

	saveInputElement.onclick = saveInputOnClick;
	practiceElement.onclick = practiceElementOnClick;

	startUp();
}

function showMessage(msg) {
	messageElement.innerHTML = msg;	
}

function addMessage(msg) {
	messageElement.innerHTML = messageElement.innerHTML + "<br />" + msg;	
}

function hideAllSteps() {
	inputStepElement.style.display = "none";
	chooseStepElement.style.display = "none";
	practiceStepElement.style.display = "none";
}

function showInputStep() {
	hideAllSteps();
	inputStepElement.style.display = "block";
}

function showChooseStep() {
	hideAllSteps();
	chooseStepElement.style.display = "block";
}

function showPracticeStep() {
	hideAllSteps();
	practiceStepElement.style.display = "block";
}

function startUp() {
	hideAllSteps();
	showMessage("Loading, please wait...");
	var textParameter = getQueryParameterByName("text", window.location.href);
	var missingWordsParameter = getQueryParameterByName("missing", window.location.href);
	console.log("textParameter=", textParameter, "missingWordsParameter=", missingWordsParameter);
	if (!textParameter || !missingWordsParameter) {
		showMessage("Please, enter your text");
		showInputStep();
	} else {
		words = b64DecodeUnicode(textParameter).split('|');
		hidden = b64DecodeUnicode(missingWordsParameter).split('|').map(b => ("true" === b ? true : false));
		showPracticeStep();
		initPractice();
	}
}

function splitTextToWords(text) {
	return text.replace(/\s\s+/g, ' ').match(/[a-zA-Z\u00E0-\u00FC\u00DF]+|\s+|[^\sa-zA-Z\u00E0-\u00FC\u00DF]+/g).filter(w => (w != ' ' && w != '\t'));
}

function getQueryParameterByName(name, url) {
	var cleanName = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + cleanName + "(=([^&#]*)|&|#|$)");
	var results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getUrlWithoutQuery(url) {
	return window.location.href.split('?')[0];
}

function b64EncodeUnicode(str) {
	    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
		            return String.fromCharCode(parseInt(p1, 16))
		        }))
}

function b64DecodeUnicode(str) {
	    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
		            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
		        }).join(''))
}

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
	showMessage("Please click on the words which should be hidden");
	showChooseStep();
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

function clearExercise() {
	removeAllChildrenOf(showWordsElement);
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
	var elementId = "exercise" + id;
	wordElement.id = elementId;
	wordElement.classList.add("exerciseWord");
	actualExerciseLineElement.appendChild(wordElement);
	wordElement.onkeyup = function() {
		exerciseInputOnKeyDown(elementId);
	}
}

function createPracticeUrl() {
	var baseUrl = getUrlWithoutQuery();
	var wordList = words.join("|");
	var missingList = hidden.map(h => "" + h).join("|");
	return baseUrl + "?text=" + b64EncodeUnicode (wordList) + "&missing=" + b64EncodeUnicode(missingList);
}

function showExercise() {
	actualExerciseLineElement = null;
	found = new Array(words.length).fill(true);
	clearExercise();
	newLineForExerciseWords();
	words.forEach(function(word, index) {
		if ("\n" === word) {
			newLineForExerciseWords();
		} else if (hidden[index]){
			createExerciseInput(index, word);
			found[index] = false;
		} else {
			createExerciseWord(index, word);
		}
	});
	var practiceUrl = createPracticeUrl();
	showMessage("<a href='" + practiceUrl + "'>Link to this exercise</a>");
	showPracticeStep();
}

function createMissingWord(id, word) {
	var wordElement = document.createElement("label");
	wordElement.innerHTML = word;
	wordElement.id = "missing" + id;
	wordElement.classList.add("missingWord");
	missingWordsElement.appendChild(wordElement);
	missingWordElements[id] = wordElement;
}

function showMissingWords() {
	removeAllChildrenOf(missingWordsElement);
	missingWordElements = [];
	words.forEach(function(word, index) {
		if (hidden[index]){
			createMissingWord(index, word);
		} 
	});
	var len = missingWordsElement.children.length;
	for (var i = 0; i < len * 10; ++i) {
		for (var j = 0; j < len; ++j) {
			var otherIdx = Math.floor(Math.random() * len);
			var elem1 = missingWordsElement.children[j];
			var elem2 = missingWordsElement.children[otherIdx];
			missingWordsElement.insertBefore(elem2, elem1);
		}
	}
}

function initPractice() {
	showExercise();
	showMissingWords();
}

function practiceElementOnClick() {
	initPractice();
}

function exerciseInputOnKeyDown(elementId) {
	var id = elementId.replace(/^exercise/, "");
	var inputElement = document.getElementById(elementId);
	var word = words[id];
	var text = inputElement.value;
	if (word === text) {
		foundWord(id);
	} else {
		notFoundWord(id);
	}
	if (checkAllFound()) {
		addMessage("<span class='well-done-message'>Well done!</span>");
	}
}

function foundWord(id) {
	missingWordElements[id].classList.add("missingWordFound");
	found[id] = true;
}

function notFoundWord(id) {
	missingWordElements[id].classList.remove("missingWordFound");
	found[id] = false;
}

function checkAllFound() {
	return found.every(v => v);
}
})();

