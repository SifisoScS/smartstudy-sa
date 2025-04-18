// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply the current theme
document.documentElement.setAttribute('data-theme', currentTheme);

// Update the toggle icon
if (currentTheme === 'dark') {
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

// Toggle theme when button is clicked
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update the toggle icon
  if (newTheme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Accessibility features
function initAccessibility() {
  // Increase text size button
  const textSizeButtons = document.querySelectorAll('.text-size-btn');
  textSizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const newSize = btn.classList.contains('increase') ? currentSize + 1 : currentSize - 1;
      document.documentElement.style.fontSize = `${newSize}px`;
    });
  });
  
  // High contrast toggle
  const contrastToggle = document.getElementById('contrastToggle');
  if (contrastToggle) {
    contrastToggle.addEventListener('change', (e) => {
      document.body.classList.toggle('high-contrast', e.target.checked);
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initAccessibility();
  
  // Load user preferences if available
  if (localStorage.getItem('username')) {
    const usernameElements = document.querySelectorAll('#username, .username-placeholder');
    usernameElements.forEach(el => {
      el.textContent = localStorage.getItem('username');
    });
  }
  
  // Language selector functionality
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.value = localStorage.getItem('language') || 'en';
    languageSelect.addEventListener('change', function() {
      const lang = this.value;
      localStorage.setItem('language', lang);
      // In a real app, you would reload content in the new language
      document.getElementById('language-note').innerText = `Language set to ${this.options[this.selectedIndex].text}`;
    });
  }
});

// Offline detection
window.addEventListener('online', () => {
  showNotification('You are back online!', 'success');
});

window.addEventListener('offline', () => {
  showNotification('You are offline. Some features may not be available.', 'warning');
});

// Notification function
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