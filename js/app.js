// Enhanced app.js with better content loading
function loadLesson(subject) {
    const content = document.getElementById('content');
    content.innerHTML = `
      <div class="loading-animation">
        <h3>Loading ${subject} content...</h3>
        <div class="spinner"></div>
      </div>
    `;
    
    // Simulate API call
    setTimeout(() => {
      const lessonContent = generateLessonContent(subject);
      content.innerHTML = lessonContent;
    }, 1500);
  }
  
  function generateLessonContent(subject) {
    const subjects = {
      math: {
        title: "Mathematics Lessons",
        content: `
          <div class="card">
            <h3>Algebra Basics</h3>
            <p>Learn fundamental algebraic concepts and equations.</p>
            <button class="start-lesson" onclick="startLesson('algebra')">Start Lesson</button>
          </div>
          <div class="card">
            <h3>Geometry Fundamentals</h3>
            <p>Explore shapes, angles, and geometric theorems.</p>
            <button class="start-lesson" onclick="startLesson('geometry')">Start Lesson</button>
          </div>
        `
      },
      english: {
        title: "English Language",
        content: `
          <div class="card">
            <h3>Grammar Essentials</h3>
            <p>Master the rules of English grammar and syntax.</p>
            <button class="start-lesson" onclick="startLesson('grammar')">Start Lesson</button>
          </div>
          <div class="card">
            <h3>Reading Comprehension</h3>
            <p>Improve your reading and analysis skills.</p>
            <button class="start-lesson" onclick="startLesson('reading')">Start Lesson</button>
          </div>
        `
      },
      // Add more subjects as needed
    };
  
    return `
      <h3>${subjects[subject].title}</h3>
      <p>Available lessons for ${subject}:</p>
      ${subjects[subject].content}
      <button class="back-button" onclick="goBack()">Back to Subjects</button>
    `;
  }
  
  function startLesson(topic) {
    const content = document.getElementById('content');
    content.innerHTML = `
      <h3>${topic.charAt(0).toUpperCase() + topic.slice(1)} Lesson</h3>
      <div class="lesson-content">
        <p>This is where your interactive lesson content would appear.</p>
        <p>You could include videos, interactive exercises, and quizzes here.</p>
      </div>
      <button class="back-button" onclick="goBack()">Back to Subjects</button>
    `;
  }
  
  function goBack() {
    const content = document.getElementById('content');
    content.innerHTML = `
      <div class="welcome-message">
        <h3>Welcome to SmartStudy SA</h3>
        <p>Select a subject above to view available lessons and quizzes.</p>
      </div>
    `;
  }