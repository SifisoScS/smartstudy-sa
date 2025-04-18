// dashboard.js - Dynamic dashboard with user progress

import { apiService } from './apiService';
import { authService } from './auth';

document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Check authentication
    const user = await authService.getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
      return;
    }

    // Load user progress
    const progress = await apiService.getUserProgress(user.id);
    
    // Update UI
    updateUserGreeting(user);
    updateProgressOverview(progress);
    loadRecentActivity(progress);
    loadRecommendedContent();
  } catch (error) {
    console.error('Failed to load dashboard:', error);
    showNotification('Failed to load dashboard data', 'error');
  }
});

function updateUserGreeting(user) {
  document.getElementById('username').textContent = user.name;
  document.getElementById('userGrade').textContent = `Grade ${user.grade}`;
  
  // Update avatar if available
  if (user.avatar) {
    document.getElementById('userAvatar').src = user.avatar;
  }
}

function updateProgressOverview(progress) {
  const progressBars = {
    math: document.getElementById('mathProgress'),
    english: document.getElementById('englishProgress')
  };
  
  // Update progress bars
  for (const [subject, element] of Object.entries(progressBars)) {
    if (element) {
      const percent = progress.quizzes?.[`${subject}-grade4`]?.highestScore || 0;
      element.style.width = `${percent}%`;
      element.nextElementSibling.textContent = `${percent}% complete`;
    }
  }
  
  // Update streak
  const streakElement = document.getElementById('streakCount');
  if (streakElement) {
    streakElement.textContent = progress.streak || 0;
  }
}

function loadRecentActivity(progress) {
  const activityContainer = document.getElementById('recentActivity');
  if (!activityContainer) {
    return;
  }
  
  // Get recent quiz attempts
  const recentQuizzes = Object.values(progress.quizzes || {})
    .flatMap(quiz => quiz.attempts.map(attempt => ({
      type: 'quiz',
      title: quiz.title,
      score: attempt.score,
      date: attempt.date
    })))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  
  if (recentQuizzes.length === 0) {
    activityContainer.innerHTML = '<p>No recent activity yet.</p>';
    return;
  }
  
  activityContainer.innerHTML = recentQuizzes.map(quiz => `
    <div class="activity-item">
      <i class="fas fa-question-circle ${quiz.score >= 70 ? 'success' : 'error'}"></i>
      <div>
        <p>${quiz.title}</p>
        <small>${formatDate(quiz.date)} • Score: ${quiz.score}%</small>
      </div>
    </div>
  `).join('');
}

async function loadRecommendedContent() {
  try {
    const recommendedContainer = document.getElementById('recommendedContent');
    if (!recommendedContainer) {
        return;
    }
    
    // In a real app, this would be based on user progress
    const recommended = await apiService.getVideos({ subject: 'math', grade: '4' });
    
    if (recommended.length === 0) {
      recommendedContainer.innerHTML = '<p>No recommendations available.</p>';
      return;
    }
    
    recommendedContainer.innerHTML = recommended.slice(0, 2).map(video => `
      <a href="videos.html?id=${video.id}" class="content-card">
        <img src="${video.thumbnail}" alt="${video.title}">
        <h3>${video.title}</h3>
        <p>${video.description.substring(0, 60)}...</p>
        <div class="difficulty easy">Beginner</div>
      </a>
    `).join('');
  } catch (error) {
    console.error('Failed to load recommendations:', error);
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}