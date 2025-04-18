// quiz.js - Now with API integration

import { apiService } from './apiService';
import { authService } from './auth';

document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Get current user
    const user = await authService.getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
      return;
    }

    // Get quiz ID from URL
    const quizId = new URLSearchParams(window.location.search).get('id');
    if (!quizId) {
      throw new Error('No quiz ID provided');
    }

    // Load quiz data
    const quiz = await apiService.getQuiz(quizId);
    const userProgress = await apiService.getUserProgress(user.id);
    const quizProgress = userProgress.quizzes?.[quizId] || {};

    // Initialize quiz
    const quizApp = new QuizApp(quiz, user.id, quizProgress);
    quizApp.init();
  } catch (error) {
    console.error('Failed to initialize quiz:', error);
    showNotification('Failed to load quiz. Please try again.', 'error');
  }
});

class QuizApp {
  constructor(quiz, userId, quizProgress) {
    this.quiz = quiz;
    this.userId = userId;
    this.quizProgress = quizProgress;
    this.state = {
      currentQuestionIndex: 0,
      answers: {},
      startTime: new Date(),
      timerInterval: null
    };
  }

  async init() {
    this.renderQuizInfo();
    this.renderQuestion();
    this.setupEventListeners();
    this.startTimer();
  }

  renderQuizInfo() {
    document.getElementById('quizTitle').textContent = this.quiz.title;
    
    // Display highest score if available
    if (this.quizProgress.highestScore) {
      document.getElementById('highScore').textContent = 
        `Your best: ${this.quizProgress.highestScore}%`;
    }
  }

  renderQuestion() {
    const question = this.quiz.questions[this.state.currentQuestionIndex];
    const questionContainer = document.getElementById('questionContainer');
    
    questionContainer.innerHTML = `
      <div class="question-header">
        <span>Question ${this.state.currentQuestionIndex + 1} of ${this.quiz.questions.length}</span>
      </div>
      <p class="question-text">${question.text}</p>
      <div class="options-grid">
        ${question.options.map(option => `
          <label class="option-card">
            <input type="radio" name="question" value="${option.value}" 
                   ${this.state.answers[question.id] === option.value ? 'checked' : ''}>
            <span class="option-content">
              <span class="option-letter">${option.id.split('-')[1].toUpperCase()}</span>
              <span class="option-text">${option.value}</span>
            </span>
          </label>
        `).join('')}
      </div>
    `;
    
    this.updateNavigation();
  }

  updateNavigation() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    prevBtn.disabled = this.state.currentQuestionIndex === 0;
    nextBtn.textContent = this.state.currentQuestionIndex === this.quiz.questions.length - 1 
      ? 'Submit Quiz' 
      : 'Next Question';
  }

  startTimer() {
    const timerDisplay = document.getElementById('timeRemaining');
    const updateTimer = () => {
      const elapsed = Math.floor((new Date() - this.state.startTime) / 1000);
      const remaining = Math.max(0, 15 * 60 - elapsed); // 15 minute limit
      
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      if (remaining <= 0) {
        clearInterval(this.state.timerInterval);
        this.submitQuiz();
      }
    };
    
    this.state.timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
  }

  setupEventListeners() {
    document.getElementById('prevQuestion').addEventListener('click', () => {
      this.state.currentQuestionIndex--;
      this.renderQuestion();
    });
    
    document.getElementById('nextQuestion').addEventListener('click', () => {
      this.saveCurrentAnswer();
      
      if (this.state.currentQuestionIndex < this.quiz.questions.length - 1) {
        this.state.currentQuestionIndex++;
        this.renderQuestion();
      } else {
        this.submitQuiz();
      }
    });
  }

  saveCurrentAnswer() {
    const currentQuestion = this.quiz.questions[this.state.currentQuestionIndex];
    const selectedOption = document.querySelector('input[name="question"]:checked');
    
    if (selectedOption) {
      this.state.answers[currentQuestion.id] = selectedOption.value;
    }
  }

  async submitQuiz() {
    clearInterval(this.state.timerInterval);
    
    // Calculate score
    const correctAnswers = this.quiz.questions.reduce((count, question) => {
      const correctOption = question.options.find(opt => opt.correct);
      return count + (this.state.answers[question.id] === correctOption?.value ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctAnswers / this.quiz.questions.length) * 100);
    
    // Save results
    try {
      await apiService.saveQuizResults(
        this.userId,
        this.quiz.id,
        {
          score,
          answers: this.state.answers
        }
      );
      
      this.showResults(score, correctAnswers);
    } catch (error) {
      console.error('Failed to save quiz results:', error);
      showNotification('Failed to save results. Please check your connection.', 'error');
    }
  }

  showResults(score, correctAnswers) {
    document.getElementById('quizContainer').style.display = 'none';
    
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.style.display = 'block';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('correctCount').textContent = `${correctAnswers}/${this.quiz.questions.length}`;
    
    // Set feedback based on score
    const feedback = score >= 70
      ? {
          title: 'Congratulations!',
          message: 'You passed the quiz! Well done on your understanding of this material.'
        }
      : {
          title: 'Keep Practicing!',
          message: 'Review the material and try again. You can do it!'
        };
    
    document.getElementById('resultTitle').textContent = feedback.title;
    document.getElementById('resultDescription').textContent = feedback.message;
    
    // Check for achievements
    if (score === 100) {
      this.awardPerfectScoreBadge();
    }
  }

  async awardPerfectScoreBadge() {
    try {
      await apiService.addUserBadge(this.userId, 'perfect-score');
      showAchievementNotification({
        id: 'perfect-score',
        name: 'Perfect Score',
        description: 'Scored 100% on a quiz',
        icon: 'fas fa-trophy'
      });
    } catch (error) {
      console.error('Failed to award badge:', error);
    }
  }
}

// Helper functions
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function showAchievementNotification(achievement) {
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-icon">
      <i class="${achievement.icon}"></i>
    </div>
    <div class="achievement-content">
      <h3>New Achievement!</h3>
      <p>${achievement.name}</p>
      <small>${achievement.description}</small>
    </div>
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}