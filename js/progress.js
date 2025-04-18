// js/progress.js
document.addEventListener('DOMContentLoaded', () => {
    const progressContainer = document.getElementById('progress-container');
  
    // Fetch progress data
    fetch('/data/progress.json')
      .then(response => response.json())
      .then(data => {
        progressContainer.innerHTML = data.map(item => `
          <div class="subject-progress">
            <h4>${item.subject}</h4>
            <div class="progress-bar">
              <div class="progress" style="width: ${item.progress}%"></div>
            </div>
            <span>${item.progress}% complete</span>
          </div>
        `).join('');
      })
      .catch(error => {
        console.error('Error fetching progress:', error);
        progressContainer.innerHTML = '<p>Error loading progress.</p>';
      });
  });