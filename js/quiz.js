// quiz.js - Interactive Quiz Functionality for SmartStudy SA

document.addEventListener('DOMContentLoaded', function() {
    // Quiz configuration
    const quizConfig = {
      quizId: 'math-grade4', // Unique identifier for this quiz
      quizTitle: 'Grade 4 Math: Addition',
      passingScore: 70, // Minimum score to pass
      timeLimit: 15 * 60, // 15 minutes in seconds
      questions: [
        {
          id: 'q1',
          text: 'What is 5 + 3?',
          options: [
            { id: 'q1-a', value: '6', text: '6', correct: false },
            { id: 'q1-b', value: '8', text: '8', correct: true },
            { id: 'q1-c', value: '10', text: '10', correct: false },
            { id: 'q1-d', value: '7', text: '7', correct: false }
          ],
          explanation: 'The sum of 5 and 3 is 8.'
        },
        // Additional questions would follow the same structure
        {
          id: 'q2',
          text: 'If you have 7 apples and get 4 more, how many apples do you have?',
          options: [
            { id: 'q2-a', value: '10', text: '10', correct: false },
            { id: 'q2-b', value: '11', text: '11', correct: true },
            { id: 'q2-c', value: '12', text: '12', correct: false },
            { id: 'q2-d', value: '13', text: '13', correct: false }
          ],
          explanation: '7 apples + 4 apples = 11 apples'
        }
      ]
    };
  
    // Quiz state
    const quizState = {
      currentQuestionIndex: 0,
      score: 0,
      timeRemaining: quizConfig.timeLimit,
      timerInterval: null,
      userAnswers: {},
      quizCompleted: false
    };
  
    // DOM Elements
    const quizForm = document.getElementById('quizForm');
    const quizProgress = document.getElementById('quizProgress');
    const progressText = document.getElementById('progressText');
    const timeRemainingDisplay = document.getElementById('timeRemaining');
    const quizResults = document.getElementById('quizResults');
    const finalScoreDisplay = document.getElementById('finalScore');
    const correctCountDisplay = document.getElementById('correctCount');
    const resultTitle = document.getElementById('resultTitle');
    const resultDescription = document.getElementById('resultDescription');
    const reviewQuizBtn = document.getElementById('reviewQuiz');
    const retakeQuizBtn = document.getElementById('retakeQuiz');
  
    // Initialize the quiz
    function initQuiz() {
      renderQuestion();
      startTimer();
      updateProgress();
      setupEventListeners();
    }
  
    // Render the current question
    function renderQuestion() {
      const currentQuestion = quizConfig.questions[quizState.currentQuestionIndex];
      const questionContainer = document.getElementById(currentQuestion.id);
      
      // Make sure the question container exists
      if (!questionContainer) {
        console.error(`Question container not found: ${currentQuestion.id}`);
        return;
      }
  
      // Show this question and hide others
      document.querySelectorAll('.quiz-question').forEach(q => {
        q.classList.remove('active');
      });
      questionContainer.classList.add('active');
  
      // Update navigation buttons
      updateNavigationButtons();
    }
  
    // Update previous/next navigation buttons
    function updateNavigationButtons() {
      const prevButtons = document.querySelectorAll('.prev-question');
      const nextButtons = document.querySelectorAll('.next-question');
      
      // Previous button state
      prevButtons.forEach(btn => {
        btn.disabled = quizState.currentQuestionIndex === 0;
      });
  
      // Next button text
      const isLastQuestion = quizState.currentQuestionIndex === quizConfig.questions.length - 1;
      nextButtons.forEach(btn => {
        btn.textContent = isLastQuestion ? 'Submit Quiz' : 'Next Question';
      });
    }
  
    // Start the quiz timer
    function startTimer() {
      updateTimerDisplay();
      quizState.timerInterval = setInterval(() => {
        quizState.timeRemaining--;
        updateTimerDisplay();
        
        if (quizState.timeRemaining <= 0) {
          clearInterval(quizState.timerInterval);
          endQuiz();
        }
      }, 1000);
    }
  
    // Update timer display
    function updateTimerDisplay() {
      const minutes = Math.floor(quizState.timeRemaining / 60);
      const seconds = quizState.timeRemaining % 60;
      timeRemainingDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      // Add warning class when time is running low
      if (quizState.timeRemaining < 60) {
        timeRemainingDisplay.classList.add('warning');
      } else {
        timeRemainingDisplay.classList.remove('warning');
      }
    }
  
    // Update progress bar and text
    function updateProgress() {
      const progressPercent = ((quizState.currentQuestionIndex + 1) / quizConfig.questions.length) * 100;
      quizProgress.style.width = `${progressPercent}%`;
      progressText.textContent = `${quizState.currentQuestionIndex + 1}/${quizConfig.questions.length} questions`;
    }
  
    // Set up event listeners
    function setupEventListeners() {
      // Next question buttons
      document.querySelectorAll('.next-question').forEach(button => {
        button.addEventListener('click', handleNextQuestion);
      });
  
      // Previous question buttons
      document.querySelectorAll('.prev-question').forEach(button => {
        button.addEventListener('click', handlePreviousQuestion);
      });
  
      // Review quiz button
      if (reviewQuizBtn) {
        reviewQuizBtn.addEventListener('click', reviewQuizAnswers);
      }
  
      // Retake quiz button
      if (retakeQuizBtn) {
        retakeQuizBtn.addEventListener('click', retakeQuiz);
      }
    }
  
    // Handle moving to next question
    function handleNextQuestion(e) {
      e.preventDefault();
      
      const currentQuestion = quizConfig.questions[quizState.currentQuestionIndex];
      const selectedOption = document.querySelector(`#${currentQuestion.id} input[type="radio"]:checked`);
      
      // Validate selection
      if (!selectedOption) {
        showNotification('Please select an answer before continuing.', 'error');
        return;
      }
      
      // Save the user's answer
      quizState.userAnswers[currentQuestion.id] = selectedOption.value;
      
      // Check if answer is correct
      const correctOption = currentQuestion.options.find(opt => opt.correct);
      if (selectedOption.value === correctOption.value) {
        quizState.score++;
      }
      
      // Move to next question or end quiz
      if (quizState.currentQuestionIndex < quizConfig.questions.length - 1) {
        quizState.currentQuestionIndex++;
        renderQuestion();
        updateProgress();
      } else {
        endQuiz();
      }
    }
  
    // Handle moving to previous question
    function handlePreviousQuestion(e) {
      e.preventDefault();
      
      if (quizState.currentQuestionIndex > 0) {
        quizState.currentQuestionIndex--;
        renderQuestion();
        updateProgress();
      }
    }
  
    // End the quiz and show results
    function endQuiz() {
      clearInterval(quizState.timerInterval);
      quizState.quizCompleted = true;
      
      // Calculate final score
      const scorePercentage = Math.round((quizState.score / quizConfig.questions.length) * 100);
      
      // Display results
      finalScoreDisplay.textContent = scorePercentage;
      correctCountDisplay.textContent = `${quizState.score} out of ${quizConfig.questions.length}`;
      
      // Set feedback based on score
      if (scorePercentage >= quizConfig.passingScore) {
        resultTitle.textContent = 'Congratulations!';
        resultDescription.textContent = 'You passed the quiz! Well done on your understanding of this material.';
      } else {
        resultTitle.textContent = 'Keep Practicing!';
        resultDescription.textContent = 'Review the material and try again. You can do it!';
      }
      
      // Hide quiz form and show results
      quizForm.style.display = 'none';
      quizResults.style.display = 'block';
      
      // Save quiz results
      saveQuizResults(scorePercentage);
    }
  
    // Save quiz results to local storage
    function saveQuizResults(score) {
      const quizResults = JSON.parse(localStorage.getItem('quizResults')) || {};
      
      // Only save if this is a higher score
      if (!quizResults[quizConfig.quizId] || score > quizResults[quizConfig.quizId].score) {
        quizResults[quizConfig.quizId] = {
          score: score,
          date: new Date().toISOString(),
          totalQuestions: quizConfig.questions.length,
          correctAnswers: quizState.score
        };
        localStorage.setItem('quizResults', JSON.stringify(quizResults));
      }
      
      // Update user progress
      updateUserProgress(score);
    }
  
    // Update user progress tracking
    function updateUserProgress(score) {
      const userProgress = JSON.parse(localStorage.getItem('userProgress')) || {
        quizzesTaken: 0,
        totalScore: 0,
        lastQuizDate: null,
        badges: []
      };
      
      userProgress.quizzesTaken++;
      userProgress.totalScore += score;
      userProgress.lastQuizDate = new Date().toISOString();
      
      // Check for achievements
      checkForAchievements(userProgress, score);
      
      localStorage.setItem('userProgress', JSON.stringify(userProgress));
    }
  
    // Check for achievements/badges
    function checkForAchievements(userProgress, score) {
      const achievements = [];
      
      // First quiz taken
      if (userProgress.quizzesTaken === 1) {
        achievements.push({
          id: 'first-quiz',
          name: 'First Quiz',
          description: 'Completed your first quiz',
          icon: 'fas fa-star',
          date: new Date().toISOString()
        });
      }
      
      // Perfect score
      if (score === 100) {
        achievements.push({
          id: 'perfect-score',
          name: 'Perfect Score',
          description: 'Scored 100% on a quiz',
          icon: 'fas fa-trophy',
          date: new Date().toISOString()
        });
      }
      
      // Save new achievements
      if (achievements.length > 0) {
        const userAchievements = JSON.parse(localStorage.getItem('userAchievements')) || [];
        userAchievements.push(...achievements);
        localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
        
        // Show achievement notifications
        achievements.forEach(achievement => {
          showAchievementNotification(achievement);
        });
      }
    }
  
    // Show achievement notification
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
      
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
      }, 5000);
    }
  
    // Review quiz answers
    function reviewQuizAnswers() {
      // Hide results and show quiz form
      quizResults.style.display = 'none';
      quizForm.style.display = 'block';
      
      // Show all questions with correct answers highlighted
      quizConfig.questions.forEach((question, index) => {
        const questionEl = document.getElementById(question.id);
        if (!questionEl) {
          return;
        }
        
        questionEl.classList.add('review-mode');
        
        // Highlight correct answer
        const correctOption = question.options.find(opt => opt.correct);
        if (correctOption) {
          const correctInput = document.querySelector(`#${question.id} input[value="${correctOption.value}"]`);
          if (correctInput) {
            correctInput.closest('.option-card').classList.add('correct-answer');
          }
        }
        
        // Highlight user's answer if incorrect
        const userAnswer = quizState.userAnswers[question.id];
        if (userAnswer && userAnswer !== correctOption.value) {
          const userInput = document.querySelector(`#${question.id} input[value="${userAnswer}"]`);
          if (userInput) {
            userInput.closest('.option-card').classList.add('incorrect-answer');
          }
        }
        
        // Show explanation
        const explanationEl = document.createElement('div');
        explanationEl.className = 'question-explanation';
        explanationEl.innerHTML = `<p><strong>Explanation:</strong> ${question.explanation}</p>`;
        questionEl.appendChild(explanationEl);
      });
      
      // Show first question
      quizState.currentQuestionIndex = 0;
      renderQuestion();
      
      // Disable all inputs
      document.querySelectorAll('.quiz-question input').forEach(input => {
        input.disabled = true;
      });
      
      // Change navigation buttons
      document.querySelectorAll('.next-question').forEach(btn => {
        btn.textContent = 'Next Question';
        btn.removeEventListener('click', handleNextQuestion);
        btn.addEventListener('click', () => {
          if (quizState.currentQuestionIndex < quizConfig.questions.length - 1) {
            quizState.currentQuestionIndex++;
            renderQuestion();
          }
        });
      });
      
      document.querySelectorAll('.prev-question').forEach(btn => {
        btn.removeEventListener('click', handlePreviousQuestion);
        btn.addEventListener('click', () => {
          if (quizState.currentQuestionIndex > 0) {
            quizState.currentQuestionIndex--;
            renderQuestion();
          }
        });
      });
    }
  
    // Retake the quiz
    function retakeQuiz() {
      // Reset quiz state
      quizState.currentQuestionIndex = 0;
      quizState.score = 0;
      quizState.timeRemaining = quizConfig.timeLimit;
      quizState.userAnswers = {};
      quizState.quizCompleted = false;
      
      // Hide results and show quiz form
      quizResults.style.display = 'none';
      quizForm.style.display = 'block';
      
      // Reset all questions
      quizConfig.questions.forEach(question => {
        const questionEl = document.getElementById(question.id);
        if (questionEl) {
          questionEl.classList.remove('review-mode');
          questionEl.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('correct-answer', 'incorrect-answer');
          });
          
          const explanation = questionEl.querySelector('.question-explanation');
          if (explanation) {
            explanation.remove();
          }
        }
      });
      
      // Re-enable inputs
      document.querySelectorAll('.quiz-question input').forEach(input => {
        input.disabled = false;
        input.checked = false;
      });
      
      // Reset event listeners
      setupEventListeners();
      
      // Restart timer
      clearInterval(quizState.timerInterval);
      startTimer();
      
      // Show first question
      renderQuestion();
      updateProgress();
    }
  
    // Show notification
    function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
      }, 3000);
    }
  
    // Initialize the quiz
    initQuiz();
  });