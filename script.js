// Get DOM elements related to the quiz functionality.
const startButton = document.getElementById("start-button");
const timerEl = document.getElementById("timer");
const startScreen = document.getElementById("start-quiz");
const questions = document.querySelectorAll(".question");
const feedbacks = document.querySelectorAll(".feedback");
const results = document.getElementById("results");
const finalScoreEl = document.getElementById("final-score");
const initialsInput = document.getElementById("initials");
const submitScoreBtn = document.getElementById("submit-score");
const viewHighscoresLink = document.getElementById("view-highscores");
const highscoreList = document.getElementById("highscore-list");
const goBackBtn = document.getElementById("goback");
const clearScoresBtn = document.getElementById("clearscores");

// Initialize quiz variables.
let time = 0;
let currentQuestion = 0;
let timer;

// Attach event listeners to various DOM elements.
startButton.addEventListener("click", startQuiz);
viewHighscoresLink.addEventListener("click", viewHighscores);
submitScoreBtn.addEventListener("click", storeScore);
goBackBtn.addEventListener("click", goBack);
clearScoresBtn.addEventListener("click", clearScores);

// start the quiz.
function startQuiz() {
    // Reset the current question counter and hide the start screen.
    currentQuestion = 0;
    startScreen.style.display = "none";
    // Set timer starting value and show it in the UI.
    time = 75;
    timerEl.textContent = `Time: ${time}`;
    // Start the timer countdown.
    timer = setInterval(updateTimer, 1000);
    // Display the first question.
    displayQuestion();
}

// update the timer and end the quiz when time's up.
function updateTimer() {
    time--;
    timerEl.textContent = `Time: ${time}`;
    if (time <= 0) {
        endQuiz();
    }
}

// display a question.
function displayQuestion() {
    // If there are no more questions, end the quiz.
    if (currentQuestion >= questions.length) {
        endQuiz();
        return;
    }
    // Otherwise, show the current question and wait for an answer.
    questions[currentQuestion].style.display = "block";
    questions[currentQuestion].addEventListener("click", checkAnswer);
}

// verify if an answer is correct.
function checkAnswer(event) {
    // If the clicked item isn't a button, exit the function.
    if (event.target.tagName !== "BUTTON") return;

    const answer = event.target.dataset.answer === "true";
    // If the answer is correct, provide feedback and proceed to the next question.
    if (answer) {
        feedbacks[currentQuestion].textContent = "Correct!";
        feedbacks[currentQuestion].style.display = "block";
        setTimeout(function() {
            feedbacks[currentQuestion].style.display = "none";
            questions[currentQuestion].style.display = "none";
            currentQuestion++;
            displayQuestion();
        }, 1000);
    } else {
        // Otherwise, provide negative feedback and deduct time.
        feedbacks[currentQuestion].textContent = "Wrong!";
        feedbacks[currentQuestion].style.display = "block";
        time -= 10;
    }
}

// end the quiz.
function endQuiz() {
    // Stop the timer.
    clearInterval(timer);
    timerEl.textContent = `Time: ${time}`;
    finalScoreEl.textContent = time;
    // Show the results screen.
    results.style.display = "block";
}

// store the score with initials.
function storeScore() {
    const initials = initialsInput.value;
    // If initials aren't provided, exit the function.
    if (!initials) return;

    // Fetch existing high scores or initialize with an empty array.
    const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    // Push the new score to the array.
    highscores.push({ initials, score: time });
    // Store updated high scores in local storage.
    localStorage.setItem("highscores", JSON.stringify(highscores));

    // Clear the initials input for a clean UI.
    initialsInput.value = '';

    // Show the high scores.
    viewHighscores();
}

// view high scores.
function viewHighscores() {
    // Hide other screens.
    startScreen.style.display = "none";
    for (const question of questions) {
        question.style.display = "none";
    }

    // Fetch high scores, sort them, and display them.
    const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    highscores.sort((a, b) => b.score - a.score);
    highscoreList.innerHTML = highscores.map(score => `<li>${score.initials} - ${score.score}</li>`).join("");

    // Hide the results and show the high scores screen.
    results.style.display = "none";
    document.getElementById("viewscores").style.display = "block";
}

// navigate back to the start screen.
function goBack() {
    document.getElementById("viewscores").style.display = "none";
    startScreen.style.display = "block";
}

// clear the stored high scores.
function clearScores() {
    localStorage.removeItem("highscores");
    highscoreList.innerHTML = "";
}
