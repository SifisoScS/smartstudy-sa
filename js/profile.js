document.addEventListener('DOMContentLoaded', function() {
    // Sample user data
    const userData = {
      name: "Thabo Mbeki",
      email: "thabo@smartstudy.sa",
      grade: "4",
      language: "en",
      streak: 5,
      points: 1250,
      lastActive: "2023-06-15",
      achievements: [
        {
          id: "first-lesson",
          name: "First Lesson",
          description: "Completed your first lesson",
          icon: "fas fa-star",
          date: "2023-05-10"
        },
        {
          id: "quiz-master",
          name: "Quiz Master",
          description: "Scored 90% or higher on 3 quizzes",
          icon: "fas fa-trophy",
          date: "2023-06-01"
        },
        // More achievements...
      ],
      recentActivity: [
        {
          type: "quiz",
          title: "Math: Addition Quiz",
          result: "85%",
          date: "2023-06-15"
        },
        {
          type: "lesson",
          title: "English: Reading Comprehension",
          progress: "100%",
          date: "2023-06-14"
        },
        // More activities...
      ]
    };
  
    // DOM elements
    const profileForm = document.getElementById('profileForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const gradeLevel = document.getElementById('gradeLevel');
    const languagePreference = document.getElementById('languagePreference');
    const badgesGrid = document.getElementById('badgesGrid');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
  
    // Initialize profile page
    function initProfile() {
      loadUserData();
      renderAchievements();
      setupEventListeners();
    }
  
    // Load user data into form
    function loadUserData() {
      document.getElementById('profileName').textContent = userData.name;
      document.getElementById('streakCount').textContent = userData.streak;
      document.getElementById('pointsCount').textContent = userData.points.toLocaleString();
      document.getElementById('badgesCount').textContent = userData.achievements.length;
      
      fullName.value = userData.name;
      email.value = userData.email;
      gradeLevel.value = userData.grade;
      languagePreference.value = userData.language;
    }
  
    // Render achievements badges
    function renderAchievements() {
      badgesGrid.innerHTML = '';
      
      if (userData.achievements.length === 0) {
        badgesGrid.innerHTML = '<p>No achievements yet. Keep learning to earn badges!</p>';
        return;
      }
      
      userData.achievements.forEach(achievement => {
        const badge = document.createElement('div');
        badge.className = 'badge-card';
        badge.innerHTML = `
          <div class="badge-icon">
            <i class="${achievement.icon}"></i>
          </div>
          <div class="badge-info">
            <h3>${achievement.name}</h3>
            <p>${achievement.description}</p>
            <small>Earned on ${new Date(achievement.date).toLocaleDateString()}</small>
          </div>
        `;
        badgesGrid.appendChild(badge);
      });
    }
  
    // Set up event listeners
    function setupEventListeners() {
      // Profile form submission
      profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Update user data
        userData.name = fullName.value;
        userData.grade = gradeLevel.value;
        userData.language = languagePreference.value;
        
        // Update displayed name
        document.getElementById('profileName').textContent = userData.name;
        
        // Show success message
        showNotification('Profile updated successfully!', 'success');
        
        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify({
          name: userData.name,
          grade: userData.grade,
          language: userData.language
        }));
      });
      
      // Tab switching
      tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const tabId = this.dataset.tab;
          
          // Update active tab button
          tabBtns.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // Show corresponding tab content
          tabContents.forEach(content => {
            content.style.display = content.id === `${tabId}Tab` ? 'block' : 'none';
          });
          
          // Load content if needed
          if (tabId === 'completed') {
            loadCompletedLessons();
          } else if (tabId === 'quizzes') {
            loadQuizResults();
          }
        });
      });
      
      // Avatar edit button
      document.querySelector('.avatar-edit').addEventListener('click', function(e) {
        e.preventDefault();
        // In a real app, this would open a file picker for avatar upload
        showNotification('Avatar upload functionality coming soon!', 'info');
      });
    }
  
    // Load completed lessons (would be fetched from server in real app)
    function loadCompletedLessons() {
      const completedTab = document.getElementById('completedTab');
      completedTab.innerHTML = `
        <div class="completed-lesson">
          <i class="fas fa-book"></i>
          <div>
            <h3>Math: Addition Basics</h3>
            <p>Completed on 15/06/2023</p>
          </div>
          <button class="btn btn-outline">Review</button>
        </div>
        <!-- More lessons would be added here -->
      `;
    }
  
    // Load quiz results (would be fetched from server in real app)
    function loadQuizResults() {
      const quizzesTab = document.getElementById('quizzesTab');
      quizzesTab.innerHTML = `
        <div class="quiz-result">
          <div class="quiz-info">
            <h3>Math: Addition Quiz</h3>
            <p>Completed on 15/06/2023</p>
          </div>
          <div class="quiz-score">
            <div class="score-circle small">85%</div>
            <button class="btn btn-outline">View Details</button>
          </div>
        </div>
        <!-- More quiz results would be added here -->
      `;
    }
  
    // Initialize the profile page
    initProfile();
  });