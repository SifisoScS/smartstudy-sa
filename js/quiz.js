// js/quiz.js
import { authService } from '/js/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  try {
    await authService.getCurrentUser();
  } catch {
    window.location.href = '/index.html';
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('id');
  let currentQuestion = 0;
  let answers = [];
  let quizData = null;
  let timeRemaining = 0;
  let timerInterval = null;

  const elements = {
    quizTitle: document.getElementById('quizTitle'),
    highScore: document.getElementById('highScore'),
    timeRemaining: document.getElementById('timeRemaining'),
    questionContainer: document.getElementById('questionContainer'),
    prevQuestion: document.getElementById('prevQuestion'),
    nextQuestion: document.getElementById('nextQuestion'),
    resultsContainer: document.getElementById('resultsContainer'),
    finalScore: document.getElementById('finalScore'),
    correctCount: document.getElementById('correctCount'),
    resultTitle: document.getElementById('resultTitle'),
    resultDescription: document.getElementById('resultDescription'),
    retakeQuiz: document.getElementById('retakeQuiz')
  };

  // Fetch quiz data
  try {
    const response = await fetch('/data/quizzes.json');
    const quizzes = await response.json();
    quizData = quizzes.find(quiz => quiz.id == quizId);
    if (!quizData) {
      throw new Error('Quiz not found');
    }

    elements.quizTitle.textContent = quizData.title;
    timeRemaining = quizData.timeLimit;
    answers = new Array(quizData.questions.length).fill(null);
    startTimer();
    renderQuestion();
  } catch (error) {
    console.error('Error fetching quiz:', error);
    elements.questionContainer.innerHTML = '<p>Error loading quiz.</p>';
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timeRemaining--;
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      elements.timeRemaining.innerHTML = `<i class="fas fa-clock"></i> ${minutes}:${seconds.toString().padStart(2, '0')}`;
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        showResults();
      }
    }, 1000);
  }

  function renderQuestion() {
    const question = quizData.questions[currentQuestion];
    elements.questionContainer.innerHTML = `
      <div class="question-header">
        <span>Question ${currentQuestion + 1} of ${quizData.questions.length}</span>
      </div>
      <div class="question-text">${question.text}</div>
      <div class="options-grid">
        ${question.options.map((option, index) => `
          <label class="option-card">
            <input type="radio" name="option" value="${index}" ${answers[currentQuestion] === index ? 'checked' : ''}>
            <div class="option-content">
              <span class="option-letter">${String.fromCharCode(65 + index)}</span>
              <span>${option}</span>
            </div>
          </label>
        `).join('')}
      </div>
    `;
    elements.prevQuestion.disabled = currentQuestion === 0;
    elements.nextQuestion.textContent = currentQuestion === quizData.questions.length - 1 ? 'Submit' : 'Next';
  }

  elements.questionContainer.addEventListener('change', (e) => {
    if (e.target.name === 'option') {
      answers[currentQuestion] = parseInt(e.target.value);
    }
  });

  elements.prevQuestion.addEventListener('click', () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
    }
  });

  elements.nextQuestion.addEventListener('click', () => {
    if (currentQuestion < quizData.questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      clearInterval(timerInterval);
      showResults();
    }
  });

  elements.retakeQuiz.addEventListener('click', () => {
    currentQuestion = 0;
    answers = new Array(quizData.questions.length).fill(null);
    timeRemaining = quizData.timeLimit;
    elements.resultsContainer.style.display = 'none';
    elements.quizContainer.style.display = 'block';
    startTimer();
    renderQuestion();
  });

  function showResults() {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        score++;
      }
    });
    const percentage = Math.round((score / quizData.questions.length) * 100);

    elements.resultsContainer.style.display = 'block';
    elements.quizContainer.style.display = 'none';
    
    elements.finalScore.textContent = percentage;
    elements.correctCount.textContent = score;
    elements.resultTitle.textContent = percentage >= 80 ? 'Great Job!' : percentage >= 50 ? 'Good Effort!' : 'Keep Practicing!';
    elements.resultDescription.textContent = `You scored ${percentage}% on this quiz. Review your answers and try again to improve!`;
  }
});