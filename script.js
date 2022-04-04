const questionEl = document.getElementById("question");
const a = document.getElementById("a_text");
const b = document.getElementById("b_text");
const c = document.getElementById("c_text");
const d = document.getElementById("d_text");
const answerEls = document.querySelectorAll(".answer");
const quiz = document.getElementById("quiz");
const submitBtn = document.getElementById("submit");

let TriviaURL = "https://opentdb.com/api.php?amount=10&type=multiple"; //api url
let currentIndex = 0;
let score = 0;
var trivia; //json trivia object

async function getTrivia() {
    await fetch(TriviaURL)
    .then(res => res.json())
    .then(data => trivia = data.results)
}


loadQuiz();


async function loadQuiz() {
    //wait to fetch trivia api
    await getTrivia();

    deselect();

    var currentTriviaData = trivia[currentIndex];
    shuffleQuestions(currentTriviaData);

    questionEl.innerText = removeXML(currentTriviaData.question);
    a.innerText = removeXML(questionPool[0]);
    b.innerText = removeXML(questionPool[1]);
    c.innerText = removeXML(questionPool[2]);
    d.innerText = removeXML(questionPool[3]);
}

function shuffleQuestions(currentTriviaData) {
    questionPool = [];
    questionPool.push(
        currentTriviaData.correct_answer, 
        currentTriviaData.incorrect_answers[0],
        currentTriviaData.incorrect_answers[1],
        currentTriviaData.incorrect_answers[2],
    )

    //fisher yates shuffle algorithm
    var j, x, i;
    for (i = questionPool.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = questionPool[i];
        questionPool[i] = questionPool[j];
        questionPool[j] = x;
    }
}

function removeXML(str) {
    str = str.replaceAll( "&apos;", "\'" );
    str = str.replaceAll( "&quot;", '\"' );
    str = str.replaceAll( "&#039;", '\'' );
    str = str.replaceAll( "&gt;", ">" );
    str = str.replaceAll( "&lt;", "<" );
    str = str.replaceAll( "&amp;", "&" );
    return str;
}

function getSelected() {
    let selectionID;

    for (const entry of answerEls) {
        if (entry.checked) {
            selectionID = entry.id + "_text";
        }
    }

    let guessedAnswer = document.getElementById(selectionID).innerText;
 
    return guessedAnswer;
}

function deselect() {
    for (const answerEl of answerEls) {
        answerEl.checked = false;
    }
}


submitBtn.addEventListener("click", function() {
    let guessedAnswer = getSelected();
    let correctAnswer = trivia[currentIndex].correct_answer
    
    if (guessedAnswer == correctAnswer) {
        score++;
    }

    currentIndex++;

    //load next or finish
    if (currentIndex < 10) {
        loadQuiz();
    } else {
        quiz.innerHTML = `
            <h1>You answered ${score}/10 questions right</h1>
        `;
    }

});
    