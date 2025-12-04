// =============================
// 1. QUESTIONS
// =============================
const questions = [
  {
    question: "ما معنى حفيد؟ ",
    subtitle: "",
    options: ["Cousin", "Niece", "Grandson", "Granddaughter"],
    correctIndex: 2,
    explanation: ""
  },
  {
    question: "ما معنى سعيد؟",
    subtitle: "",
    options: [
      "Sad",
      "Excited",
      "Angry",
      "Happy"
    ],
    correctIndex: 3,
    explanation: ""
  },
  {
    question: "ما معنى أنف؟",
    subtitle: "",
    options: ["Nose", "Mouth", "Eye", "Teeth"],
    correctIndex: 0,
    explanation: ""
  },
  {
    question: "ما معنى باب؟",
    subtitle: "",
    options: ["Window", "Door", "Floor", "Wall"],
    correctIndex: 1,
    explanation: ""
  },
  {
    question: "ما معنى ثريا؟",
    subtitle: "",
    options: ["Bulb", "Curtain", "Chandelier", "Clock"],
    correctIndex: 2,
    explanation: ""
  },
  {
    question: "ما معنى مرآة؟",
    subtitle: "",
    options: ["Mattress", "Mirror", "Pillow", "Blanket"],
    correctIndex: 1,
    explanation: ""
  },
  {
    question: "ما معنى فرن؟",
    subtitle: "",
    options: ["Blender", "Pot", "Oven", "Tray"],
    correctIndex: 2,
    explanation: ""
  },
  {
    question: "ما معنى ملعب؟",
    subtitle: "",
    options: ["Hotel", "Stadium", "Tangerine", "Raisins"],
    correctIndex: 1,
    explanation: ""
  },
  {
    question: "ما معنى خس؟",
    subtitle: "",
    options: ["Cucumber", "Lettuce", "Carrot", "Eggplant"],
    correctIndex: 1,
    explanation: ""
  },
  {
    question: "ما معنى رمان؟",
    subtitle: "",
    options: ["Pear", "Fig", "Watermelon", "Pomegranate"],
    correctIndex: 3,
    explanation: ""
  },
  {
    question: "ما معنى جوز الهند؟",
    subtitle: "",
    options: ["Almond", "Cashew", "Coconut", "Pistachio"],
    correctIndex: 2,
    explanation: ""
  },
  {
    question: "ما معنى ضباب؟",
    subtitle: "",
    options: ["Fog", "Thunder", "Storm", "Wind"],
    correctIndex: 0,
    explanation: ""
  },
  {
    question: "ما معنى ملعقة؟",
    subtitle: "",
    options: ["Bowl", "Knife", "Fork", "Spoon"],
    correctIndex: 3,
    explanation: ""
  },
  {
    question: "ما معنى حديقة؟'",
    subtitle: "",
    options: ["Park", "Bakery", "Restaurant", "Library"],
    correctIndex: 0,
    explanation: ""
  },
  {
    question: "ما معنى صيدلية؟",
    subtitle: "",
    options: [
      "Museum",
      "Workshop",
      "Pharmacy",
      "Stadium"
    ],
    correctIndex: 2,
    explanation: ""
  }
];

// =============================
// 2. STATE
// =============================
let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

let timeLeft = 15;   // seconds per question
let timerId = null;
let lives = 3;       // 3 hearts

// =============================
// 3. DOM ELEMENTS
// =============================
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const questionTextEl = document.getElementById("question-text");
const questionSubtitleEl = document.getElementById("question-subtitle");
const optionsListEl = document.getElementById("options-list");
const feedbackEl = document.getElementById("feedback");
const explanationEl = document.getElementById("explanation");

const timerEl = document.getElementById("timer");
const livesEl = document.getElementById("lives");

const restartBtn = document.getElementById("restart-btn");
const nextBtn = document.getElementById("next-btn");
const playAgainBtn = document.getElementById("play-again-btn");

const finalScoreEl = document.getElementById("final-score");
const finalMessageEl = document.getElementById("final-message");

// =============================
// 4. TIMER + LIVES FUNCTIONS
// =============================
function updateTimerDisplay() {
  if (!timerEl) return; // safety
  timerEl.textContent = `⏱ ${timeLeft}s`;
}

function updateLivesDisplay() {
  if (!livesEl) return; // safety
  livesEl.textContent = "❤️".repeat(lives) + "🤍".repeat(3 - lives);
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = 15;
  updateTimerDisplay();

  timerId = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      if (!hasAnswered) {
        handleTimeout();
      }
    }
  }, 1000);
}

function handleTimeout() {
  const q = questions[currentQuestionIndex];
  hasAnswered = true;

  const optionElements = Array.from(document.querySelectorAll(".option"));
  optionElements.forEach((el, idx) => {
    if (idx === q.correctIndex) {
      el.classList.add("correct");
    }
  });

  feedbackEl.textContent = "⏰ Time's up!";
  feedbackEl.className = "feedback wrong";
  explanationEl.textContent = q.explanation || "";

  loseLife();
  nextBtn.disabled = false;
}

function loseLife() {
  lives--;
  if (lives < 0) lives = 0;
  updateLivesDisplay();

  if (lives === 0) {
    showResult(true); // game over
  }
}

// =============================
// 5. LOAD QUESTION
// =============================
function loadQuestion() {
  const q = questions[currentQuestionIndex];

  progressEl.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
  questionTextEl.textContent = q.question;
  questionSubtitleEl.textContent = q.subtitle || "";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  explanationEl.textContent = "";

  optionsListEl.innerHTML = "";
  hasAnswered = false;

  q.options.forEach((optionText, index) => {
    const li = document.createElement("li");
    li.className = "option";

    const labelSpan = document.createElement("span");
    labelSpan.className = "option-label";
    labelSpan.textContent = String.fromCharCode(65 + index); // A, B, C...

    const textSpan = document.createElement("span");
    textSpan.textContent = optionText;

    li.appendChild(labelSpan);
    li.appendChild(textSpan);

    li.addEventListener("click", () => handleOptionClick(index));

    optionsListEl.appendChild(li);
  });

  nextBtn.disabled = true;
  nextBtn.textContent =
    currentQuestionIndex === questions.length - 1 ? "Finish" : "Next";

  // 🔥 start the countdown for this question
  startTimer();
}

// =============================
// 6. HANDLE ANSWER
// =============================
function handleOptionClick(selectedIndex) {
  if (hasAnswered) return;
  hasAnswered = true;

  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  const optionElements = Array.from(document.querySelectorAll(".option"));

  optionElements.forEach((el, idx) => {
    el.classList.remove("selected", "correct", "wrong");

    if (idx === selectedIndex) {
      el.classList.add("selected");
    }

    if (idx === q.correctIndex) {
      el.classList.add("correct");
    }

    if (idx === selectedIndex && selectedIndex !== q.correctIndex) {
      el.classList.add("wrong");
    }
  });

  if (selectedIndex === q.correctIndex) {
    score++;
    scoreEl.textContent = score;
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.className = "feedback correct";
  } else {
    feedbackEl.textContent = "❌ Not quite.";
    feedbackEl.className = "feedback wrong";
    loseLife();
  }

  explanationEl.textContent = q.explanation || "";
  nextBtn.disabled = false;
}

// =============================
// 7. NEXT / RESULT
// =============================
function handleNext() {
  clearInterval(timerId);

  if (lives === 0) {
    showResult(true);
    return;
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    showResult(false);
  }
}

function showResult(isGameOver = false) {
  clearInterval(timerId);

  quizScreen.style.display = "none";
  resultScreen.style.display = "block";

  finalScoreEl.textContent = `You scored ${score} / ${questions.length}`;

  const percent = (score / questions.length) * 100;
  let message = "";

  if (isGameOver) {
    message = "Game over! You ran out of hearts. Try again";
  } else if (percent === 100) {
    message = "Perfect! 👏";
  } else if (percent >= 70) {
    message = "Great job! You're doing very well, keep practicing 💪";
  } else if (percent >= 40) {
    message = "Not bad! Review the questions and try again 😊";
  } else {
    message = "Good start! Practice more and you will improve 🚀";
  }

  finalMessageEl.textContent = message;
}

// =============================
// 8. RESTART
// =============================
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  scoreEl.textContent = score;
  lives = 3;
  updateLivesDisplay();

  clearInterval(timerId);

  quizScreen.style.display = "block";
  resultScreen.style.display = "none";
  loadQuestion();
}

// =============================
// 9. EVENTS + INIT
// =============================
nextBtn.addEventListener("click", handleNext);
restartBtn.addEventListener("click", restartQuiz);
playAgainBtn.addEventListener("click", restartQuiz);

updateLivesDisplay();
loadQuestion();
