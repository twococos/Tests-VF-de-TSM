
/* Definició Constants */

const separator1 = ";";
const separator2 = "\r";

const path = "tsm.txt";
const textId = "idfrases";
const vButtonId = "verdader";
const fButtonId = "fals";
const solTextId = "solucio";
const correctTextId = "estanbe";
const incorrectTextId = "estanmalament";
const nextButtonId = "seguent";

const correctReactionsArray = [
    "Eii, vas millorant",
    "Putu amo noi/a!",
    "Segur que ha estat potra",
    "Gens malament...",
    "La pregunta era massa fàcil",
    "Es nota que has estudiat!",
    "Molt bé!",
    "Perfecte! Veus, la falta d'amics te coses bones!",
    "Vas bé, segueix",
    "A topeeee!",
    "Aquesta la fallaràs el dia de l'examen",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
];
const incorrectReactionsArray = [
    "Espavila xatu/a",
    "Et falta biblio",
    "Ets un baldo noi/a",
    "Al profe no li faras tanta pena com a mi...",
    "El dia de l'examen també faras el ridícul d'aquesta manera?",
    "No passa res, un mal dia el te tothom!",
    "Malament",
    "Tremendo fallo",
    "Aquesta era fàcil...",
    "Torna a llegir",
    "Ups, la has cagada",
    "No et preocupis, aquesta era xunga",
    "Materials 1 no et va anar be oi?",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
];
const correctReactionsArrayLength = correctReactionsArray.length - 1;
const incorrectReactionsArrayLength = incorrectReactionsArray.length - 1;

/* Definició Variables */

let sentenceArray = new Array();
let sentenceArrayLength;


let currentIndex;

let errades = 0;
let correctes = 0;
let gameFinished = false;

/* Definició de Listeners */

document.getElementById(vButtonId).addEventListener("click", function () { onResponse(true); });
document.getElementById(fButtonId).addEventListener("click", function () { onResponse(false); });
document.getElementById(nextButtonId).addEventListener("click", function () { next(); });

/* Codi Principal */

setText(textId, "Carregant...");

readFile(path);


/*** Definició Funcions */

/* Utilitats*/

function setHidden(textId, state) {
    document.getElementById(textId).hidden = state;
}

function setText(textId, text) {
    document.getElementById(textId).innerHTML = text;
}

function generateRandomIndex(len) {
    return Math.round(Math.random() * len);
}


/* Gameplay loop */

function onResponse(res) {
    setHidden(fButtonId, true);
    setHidden(vButtonId, true);

    if (res == sentenceArray[currentIndex].isTrue) {      

        setText(solTextId, "Correcta. " + correctReactionsArray[generateRandomIndex(correctReactionsArrayLength)]);

		correctes++;
        setText(correctTextId, "Encerts: " + correctes);

        sentenceArray[currentIndex].alredyUsed = true;
	}
    else {
        setText(solTextId, "Incorrecta. " + incorrectReactionsArray[generateRandomIndex(incorrectReactionsArrayLength)]);
        
		errades++;
        setText(incorrectTextId, "Errades: " + errades);
	}
}

function next() {
    pullRandomSentence();

    if (!gameFinished) {
        setText(solTextId, "");
        setText(textId, sentenceArray[currentIndex].text);
        setHidden(fButtonId, false);
        setHidden(vButtonId, false);
    }  
}

function finishGame() {
    gameFinished = true; 
    setText(textId,"Felicitats! Has endevinat totes les frases que hi havia disponibles! Cada cop estàs més preparat per l'examen.");
    setHidden(nextButtonId, true);
}

function pullRandomSentence() {
    let alredyUsed = true;

    if (correctes > sentenceArrayLength) {
        finishGame();
        return undefined;
    }

    while (alredyUsed) {
        currentIndex = generateRandomIndex(sentenceArrayLength);
        console.log("index random es " + currentIndex);
        console.log("la resposta es " + sentenceArray[currentIndex].isTrue)
        alredyUsed = sentenceArray[currentIndex].alredyUsed;
    }
}


/* Custom objects */

function Sentence(text, isTrue) {
    this.text = text;
    this.isTrue = isTrue;
    this.alredyUsed = false;
}

/* Constructor array */

function readFile(filePath) {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            makeSentenceArray(xhr.responseText);
        }
    }
    xhr.open('GET', filePath);
    xhr.send();
}

function makeSentenceArray(csv) {
    console.log("començant array");
    console.log(csv);
    for (element of csv.split(separator2)) {
        let elementArray = element.split(separator1);
        let elementSentence = new Sentence(elementArray[0], ("V" == elementArray[1]));

        sentenceArray = sentenceArray.concat(elementSentence);

        console.log("elementArray 1 : " + elementArray[1]);
        console.log("text: " + elementSentence.text + " isTrue: " + elementSentence.isTrue + " alredyUsed: " + elementSentence.alredyUsed);
    }
    sentenceArrayLength = sentenceArray.length - 1;
    console.log("array finalitzat amb llargada ajustada: " + sentenceArrayLength);
    next();
}