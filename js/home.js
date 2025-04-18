document.addEventListener('DOMContentLoaded', () => {
    // Render Quick Access cards
    fetch('/data/quick-access.json')
      .then(response => response.json())
      .then(items => {
        const accessGrid = document.getElementById('access-grid');
        accessGrid.innerHTML = items.map(item => `
          <a href="${item.url}" class="access-button ${item.class}">
            <i class="icon">${item.icon}</i>
            <span>${item.title}</span>
            <p>${item.description}</p>
          </a>
        `).join('');
      })
      .catch(error => {
        console.error('Error fetching quick access:', error);
        document.getElementById('access-grid').innerHTML = '<p>Error loading quick access.</p>';
      });
  
    // Render progress
    fetch('/data/progress.json')
      .then(response => response.json())
      .then(data => {
        const progressContainer = document.getElementById('progress-container');
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
        document.getElementById('progress-container').innerHTML = '<p>Error loading progress.</p>';
      });
  });