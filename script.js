let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let selectedQuestion = 0; //Is the current selected question out of the quizQuestions array
let quetionsAnsweredCorrectly = 0;
let questionsAnswered = 0;
let clickedQuestionsArray = [];
let quizQuestions = [{
    "question": "Wer hat HTML erfunden?",
    "possibleAnswer0": "Robbie Williams",
    "possibleAnswer1": "Tim Berners - Lee",
    "possibleAnswer2": "Justin Bieber",
    "possibleAnswer3": "Laddy Gagga",
    "correctAnswer": "1"   

},{
    "question": "Wie erstellt man einen Container?",
    "possibleAnswer0": "div",
    "possibleAnswer1": '<li>',
    "possibleAnswer2": "div>",
    "possibleAnswer3": "<h1>",
    "correctAnswer": "3"  
},{
    "question": "Was heißt HTML?",
    "possibleAnswer0": "Hyper Text Markup Language",
    "possibleAnswer1": "Hyper Text and Markup Language",
    "possibleAnswer2": "Deine Mutter",
    "possibleAnswer3": "Mozzila",
    "correctAnswer": "0"  
}]

function init(){
    headlineRender();
    renderRows();
    checkIfBackArrowNeedsToBeDisabled();
    checkIfForwardArrowNeedsToBeDisabled();
    insertCurrentQuestion();
    inserQuizLength();
    renderProgressBar();
}

function renderRows(){
    let rowContainer = document.getElementById('questionRows');
    
    for (let index = 0; index < 4; index++) {
        let test = quizQuestions[selectedQuestion]['possibleAnswer' + index];
        rowContainer.innerHTML += `<button class="questionRow" onclick="saveClickedQuestionInArray('question${index}')" id="question${index}"><span class="badge" id="badge${index}">A</span> <p class="quizText">${test}</p></button>`;
        enterCorrectAlphabetInBadge(index);
        
    }
    
}

function enterCorrectAlphabetInBadge(index){
    let badgeID = document.getElementById('badge' + index);
    badgeID.innerHTML = `${alphabet[index]}`
}

function headlineRender(){
    let currentHeadline = document.getElementById('headline');
    currentHeadline.innerHTML = quizQuestions[selectedQuestion]['question'];
}

// todo for me, first create a function that saves the clickedquestiuon into an array, then that goes to changecolor function. in order for the array to work when theplayer goes on a previous page, a new function is being activaited that checks if the selectedQuestion is anywhere to be found in the array, if yes then go to the change colors function with the variable from the array

function saveClickedQuestionInArray(clickedQuestion){  // Saves the last clicked answer so if the player returns to the previous page his/her selected answer is still selected
    let clickedRowNumber = clickedQuestion.slice(-1);
    
    clickedQuestionsArray.push(selectedQuestion && clickedRowNumber);
    changeColor(clickedQuestion);   
}

function changeColor(clickedQuestion){
    let row = document.getElementById(clickedQuestion);

    if(clickedQuestionIsCorrect(clickedQuestion)){
        row.classList.add("btn-success");
        disableAllAnswers();
        saveEndScoreToMemory();
        ifEndQuestionIsAnsweredThenLeadToEndScreen();
    }else{
        row.classList.add("btn-danger");
        highlightCorrectAnswer();
        disableAllAnswers();
        ifEndQuestionIsAnsweredThenLeadToEndScreen();
    }
}

function clickedQuestionIsCorrect(clickedQuestion){
    let clickedQuestionNumber = clickedQuestion.slice(-1); //Gets the last character from the string which is a number
    let correctCurrentAnswer = quizQuestions[selectedQuestion]["correctAnswer"];
    if(clickedQuestionNumber == correctCurrentAnswer){  //And compares it with the correct answer if the number matches with the correct answer then it returns true
        return true;
    }
}

function ifEndQuestionIsAnsweredThenLeadToEndScreen(){
    questionsAnswered++;
    if(questionsAnswered == quizQuestions.length){
        setTimeout(leadToEndScreen, 1000);
    }
}

function leadToEndScreen(){
    window.location.href ="/templates/endScreen.html";
}

function highlightCorrectAnswer(){
    let correctCurrentAnswer = quizQuestions[selectedQuestion]["correctAnswer"];
    let correctAnswerID = document.getElementById('question' + correctCurrentAnswer);
    correctAnswerID.classList.add("btn-success");
}

function disableAllAnswers(){
    for (let index = 0; index < 4; index++) {
        let questionContainer = document.getElementById('question' + index);
        console.log(questionContainer);
        questionContainer.disabled = true;
        
    }
} 

function nextQuestion(){
    selectedQuestion++;
    cleanPreviousQuestions();
    init();
}

function cleanPreviousQuestions(){
    let currentHeadline = document.getElementById("headline");
    let rowContainer = document.getElementById('questionRows');

    currentHeadline.innerHTML = "";
    for (let index = 0; index < 4; index++) {
        rowContainer.innerHTML = "";
    }
}

function previousQuestion(){
    selectedQuestion--;
    if(selectedQuestion < 0){
        selectedQuestion = 0 //Sets the current que back to zero if the player decides to go out of the array (-1)
        checkIfBackArrowNeedsToBeDisabled();
    }else{
        cleanPreviousQuestions();
        init();
    }
    
}

function checkIfBackArrowNeedsToBeDisabled(){
    let arrowIDBack = document.getElementById("arrowBack");

    if(selectedQuestion == 0){
        arrowIDBack.disabled = true;
    }else if(selectedQuestion > 0){
        arrowIDBack.disabled = false;
    }
}

function checkIfForwardArrowNeedsToBeDisabled(){
    let arrowIDFroward = document.getElementById("arrowForward");

    if(selectedQuestion + 1 == quizQuestions.length){
        arrowIDFroward.disabled = true;
    }else if(selectedQuestion < quizQuestions.length){
        arrowIDFroward.disabled = false;
    }
}

function insertCurrentQuestion(){
    let idForCurrentQuestion = document.getElementById("currentQuestion");

    idForCurrentQuestion.innerHTML = `${selectedQuestion+1}`;
}

function inserQuizLength(){
    let idForQuizLength = document.getElementById("quizLength");

    idForQuizLength.innerHTML = `${quizQuestions.length}`;
}


function renderProgressBar(){
    let progressInTheProgressBar = (selectedQuestion + 1) / quizQuestions.length;
    progressInTheProgressBar = Math.round(progressInTheProgressBar * 100);
    console.log(progressInTheProgressBar);
    document.getElementById('progress-bar').style = `width: ${progressInTheProgressBar}%`

}

// Script for the endscreen

function loadEndScreen(){
    selectedQuestion = quizQuestions.length;
    addQuizLength();
    addCorrectQuestionsAnswered();
    renderProgressBar();
}

function addQuizLength(){
    let idForQuizLength = document.getElementById("questionsAmount");

    idForQuizLength.innerHTML = `${quizQuestions.length}`;
}

function addCorrectQuestionsAnswered(){
    let idForCorrectQuestionsAnswered = document.getElementById("correctQuetionsAnswered");
    loadEndScoreFromMemory();

    idForCorrectQuestionsAnswered.innerHTML = `${quetionsAnsweredCorrectly}`;
}

function saveEndScoreToMemory(){
    quetionsAnsweredCorrectly++;
    let quetionsAnsweredCorrectlyAsText = JSON.stringify(quetionsAnsweredCorrectly);    
    localStorage.setItem('trueAnswers', quetionsAnsweredCorrectlyAsText);

}

function loadEndScoreFromMemory(){
    let quetionsAnsweredCorrectlyAsText = localStorage.getItem('trueAnswers');
    if(quetionsAnsweredCorrectlyAsText == null){
        quetionsAnsweredCorrectly = 0;
    }else{
        quetionsAnsweredCorrectly = JSON.parse(quetionsAnsweredCorrectlyAsText);
    }
    
}

function clearsMemoryOnReplay(){
    localStorage.clear('trueAnswers');
}