// js/profile.js
import { authService } from '/js/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Update profile info
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileGrade').textContent = `Grade ${user.grade} Student`;
    document.getElementById('streakCount').textContent = user.streak;
    document.getElementById('pointsCount').textContent = user.points;
    document.getElementById('badgesCount').textContent = user.badges.length;

    // Update form fields
    document.getElementById('fullName').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('gradeLevel').value = user.grade;
    document.getElementById('languagePreference').value = user.language;
  } catch {
    window.location.href = '/index.html';
    return;
  }

  // Render badges
  fetch('/data/user.json')
    .then(response => response.json())
    .then(user => {
      const badgesGrid = document.getElementById('badgesGrid');
      badgesGrid.innerHTML = user.badges.map(badge => `
        <div class="badge-card">
          <div class="badge-icon"><i class="fas fa-award"></i></div>
          <div class="badge-info">
            <h3>${badge.name}</h3>
            <p>${badge.description}</p>
            <small>Earned on ${new Date(badge.date).toLocaleDateString()}</small>
          </div>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Error fetching badges:', error);
      document.getElementById('badgesGrid').innerHTML = '<p>Error loading badges.</p>';
    });

  // Render learning history
  fetch('/data/activity.json')
    .then(response => response.json())
    .then(activities => {
      const recentTab = document.getElementById('recentTab');
      const completedTab = document.getElementById('completedTab');
      const quizzesTab = document.getElementById('quizzesTab');

      recentTab.innerHTML = activities.map(activity => `
        <div class="activity-item">
          <i class="fas ${activity.type === 'quiz' ? 'fa-check-circle success' : activity.type === 'lesson' ? 'fa-book-open primary' : 'fa-award accent'}"></i>
          <div>
            <p>${activity.title}</p>
            <small>${new Date(activity.timestamp).toLocaleString()}</small>
          </div>
        </div>
      `).join('');

      completedTab.innerHTML = activities
        .filter(activity => activity.type === 'lesson' && activity.status === 'In Progress')
        .map(activity => `
          <div class="activity-item">
            <i class="fas fa-book-open primary"></i>
            <div>
              <p>${activity.title}</p>
              <small>${new Date(activity.timestamp).toLocaleString()}</small>
            </div>
          </div>
        `).join('');

      quizzesTab.innerHTML = activities
        .filter(activity => activity.type === 'quiz')
        .map(activity => `
          <div class="activity-item">
            <i class="fas fa-check-circle success"></i>
            <div>
              <p>${activity.title}</p>
              <small>${new Date(activity.timestamp).toLocaleString()}</small>
            </div>
            <span class="badge success">${activity.score}%</span>
          </div>
        `).join('');
    })
    .catch(error => {
      console.error('Error fetching history:', error);
      document.getElementById('recentTab').innerHTML = '<p>Error loading history.</p>';
    });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      
      btn.classList.add('active');
      document.getElementById(`${btn.dataset.tab}Tab`).style.display = 'block';
    });
  });

  // Handle form submission
  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatedUser = {
      name: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      grade: document.getElementById('gradeLevel').value,
      language: document.getElementById('languagePreference').value
    };
    // Update user data (mock for now)
    localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), ...updatedUser }));
    alert('Profile updated successfully!');
  });
});