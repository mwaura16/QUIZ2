// Quiz Data
const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "Which language is primarily used for web development?",
    options: ["Python", "JavaScript", "C++", "Java"],
    answer: "JavaScript",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
];

let currentQuestionIndex = 0;
let score = 0;
let unansweredQuestions = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let totalTime = 0;
let timer;
let timeLeft = 10;

// DOM Elements
const question = document.querySelector(".question");
const answersEl = document.querySelector(".answers");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score-display");
const scoreEl = document.getElementById("score");
const feedbackEl = document.getElementById("feedback");
const unansweredEl = document.getElementById("unanswered");
const correctEl = document.getElementById("correct");
const incorrectEl = document.getElementById("incorrect");
const timeTakenEl = document.getElementById("time-taken");
const timerEl = document.getElementById("timer");

// Shuffle Function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Load Question
function loadQuestion() {
  if (currentQuestionIndex >= quizData.length) {
    endQuiz();
    return;
  }

  const currentQuestion = quizData[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;

  // Shuffle and display options
  const options = [...currentQuestion.options];
  shuffle(options);

  answersEl.innerHTML = "";
  options.forEach((option) => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="radio" name="answer" value="${option}">
      ${option}
    `;
    answersEl.appendChild(label);
  });

  // Reset buttons and timer
  submitBtn.disabled = false;
  nextBtn.disabled = true;
  resetTimer();
}

// Reset Timer
function resetTimer() {
  clearInterval(timer);
  timeLeft = 10;
  updateTimer();
  timer = setInterval(() => {
    timeLeft--;
    totalTime++; // Track total time

    updateTimer();

    // Flash warning when 3 seconds are left
    if (timeLeft === 3) {
      timerEl.style.color = "red";
      timerEl.style.fontWeight = "bold";
      timerEl.style.animation = "flash 1s infinite";
    }

    if (timeLeft === 0) {
      clearInterval(timer);
      moveToNextQuestion(true); // Skip the question if time runs out
    }
  }, 1000);
}

// Update Timer
function updateTimer() {
  timerEl.textContent = `Time Left: ${timeLeft}s`;

  if (timeLeft > 3) {
    timerEl.style.color = "black";
    timerEl.style.fontWeight = "normal";
    timerEl.style.animation = "none";
  }
}

// Check Answer
function checkAnswer() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (!selectedOption) {
    unansweredQuestions++; // Increment unanswered questions if no option selected
    alert("You skipped this question!");
  } else {
    const userAnswer = selectedOption.value;
    const correctAnswer = quizData[currentQuestionIndex].answer;

    if (userAnswer === correctAnswer) {
      score++;
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }
  }

  submitBtn.disabled = true;
  nextBtn.disabled = false;
  clearInterval(timer);
}

// Move to Next Question Automatically
function moveToNextQuestion(skipped = false) {
  if (skipped) unansweredQuestions++;

  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timer);

  // Hide quiz elements
  questionEl.style.display = "none";
  answersEl.style.display = "none";
  submitBtn.style.display = "none";
  nextBtn.style.display = "none";

  // Hide the timer
  timerEl.style.display = "none";

  // Display score summary
  scoreDisplay.style.display = "block";
  scoreEl.textContent = score;

  // Display feedback and quiz summary
  feedbackEl.textContent =
    score === quizData.length
      ? "Amazing! You got everything correct!"
      : score > quizData.length / 2
      ? "Great job! Keep practicing!"
      : "Don't worry, keep practicing and you'll improve!";

  unansweredEl.textContent = `Unanswered Questions: ${unansweredQuestions}`;
  correctEl.textContent = `Correct Answers: ${correctAnswers}`;
  incorrectEl.textContent = `Incorrect Answers: ${incorrectAnswers}`;
  timeTakenEl.textContent = `Total Time Taken: ${totalTime}s`;

   // Trigger celebration for a perfect score
   if (score === quizData.length) {
      triggerConfetti();
}
}

function triggerConfetti() {
const duration = 3 * 1000; // 3 seconds
const animationEnd = Date.now() + duration;

const interval = setInterval(() => {
  const timeLeft = animationEnd - Date.now();

  if (timeLeft <= 0) {
    clearInterval(interval);
    return;
  }

  const particleCount = 50 * (timeLeft / duration);
  confetti({
    particleCount: particleCount,
    startVelocity: 30,
    spread: 360,
    origin: {
      x: Math.random(),
      y: Math.random() - 0.2, // Slightly above center
    },
  });
}, 250);
}

// Event Listeners
submitBtn.addEventListener("click", () => {
  checkAnswer();
});

nextBtn.addEventListener("click", () => {
  moveToNextQuestion();
});

// Initialize Quiz
loadQuestion();
