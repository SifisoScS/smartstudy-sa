// js/dashboard.js
import { authService } from '/js/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    // Update user info
    document.getElementById('username').textContent = user.name;
    document.getElementById('streak').textContent = `${user.streak} day streak`;
  } catch {
    window.location.href = '/index.html';
    return;
  }

  // Fetch and render goals
  fetch('/data/goals.json')
    .then(response => response.json())
    .then(goals => {
      const goalsContainer = document.getElementById('goals-container');
      goalsContainer.innerHTML = goals.map(goal => `
        <div class="goal-card">
          <i class="${goal.icon}"></i>
          <h3>${goal.title}</h3>
          <div class="progress-bar">
            <div class="progress" style="width: ${goal.progress}%"></div>
          </div>
          <button class="btn btn-outline">Continue</button>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Error fetching goals:', error);
      document.getElementById('goals-container').innerHTML = '<p>Error loading goals.</p>';
    });

  // Fetch and render activity
  fetch('/data/activity.json')
    .then(response => response.json())
    .then(activities => {
      const activityList = document.getElementById('activity-list');
      activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
          <i class="fas ${activity.type === 'quiz' ? 'fa-check-circle success' : activity.type === 'lesson' ? 'fa-book-open primary' : 'fa-award accent'}"></i>
          <div>
            <p>${activity.title}</p>
            <small>${new Date(activity.timestamp).toLocaleString()}</small>
          </div>
          ${activity.score ? `<span class="badge success">${activity.score}%</span>` : activity.status ? `<span class="badge primary">${activity.status}</span>` : ''}
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Error fetching activity:', error);
      document.getElementById('activity-list').innerHTML = '<p>Error loading activity.</p>';
    });

  // Fetch and render recommendations
  fetch('/data/recommendations.json')
    .then(response => response.json())
    .then(recommendations => {
      const contentGrid = document.getElementById('recommended-content');
      contentGrid.innerHTML = recommendations.map(item => `
        <a href="${item.url}" class="content-card">
          <img src="${item.image}" alt="${item.title}">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="difficulty ${item.difficulty}">${item.difficulty}</div>
        </a>
      `).join('');
    })
    .catch(error => {
      console.error('Error fetching recommendations:', error);
      document.getElementById('recommended-content').innerHTML = '<p>Error loading recommendations.</p>';
    });
});