document.addEventListener('DOMContentLoaded', () => {
    const subjectGrid = document.getElementById('subject-grid');
    const gradeSelector = document.getElementById('grade-selector');
    const gradeSelect = document.getElementById('grade-select');
    const lessonList = document.getElementById('lesson-list');
    const lessonsContainer = document.getElementById('lessons-container');
  
    // Fetch lessons data
    fetch('/data/lessons.json')
      .then(response => response.json())
      .then(data => {
        // Render subject cards
        subjectGrid.innerHTML = data.map(subject => `
          <div class="subject-button ${subject.class}" data-subject="${subject.subject}">
            <i class="icon">${subject.icon}</i>
            <span>${subject.subject}</span>
            <p>Explore ${subject.subject} lessons</p>
          </div>
        `).join('');
  
        // Add click events to subject cards
        document.querySelectorAll('.subject-button').forEach(button => {
          button.addEventListener('click', () => {
            const subjectName = button.dataset.subject;
            const subject = data.find(s => s.subject === subjectName);
  
            // Show grade selector
            gradeSelector.style.display = 'block';
            lessonList.style.display = 'none';
            subjectGrid.style.display = 'none';
  
            // Handle grade selection
            gradeSelect.onchange = () => {
              const grade = parseInt(gradeSelect.value);
              const gradeData = subject.grades.find(g => g.grade === grade);
  
              // Render lessons
              lessonsContainer.innerHTML = gradeData.lessons.map(lesson => `
                <a href="${lesson.url}" class="lesson-card">
                  <h4>${lesson.title}</h4>
                  <p>${lesson.description}</p>
                </a>
              `).join('');
  
              lessonList.style.display = 'block';
            };
  
            // Trigger initial grade selection
            gradeSelect.value = '8';
            gradeSelect.dispatchEvent(new Event('change'));
          });
        });
      })
      .catch(error => {
        console.error('Error fetching lessons:', error);
        subjectGrid.innerHTML = '<p>Error loading lessons.</p>';
      });
  
    // Back button to return to subjects
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-back';
    backButton.textContent = 'Back to Subjects';
    backButton.onclick = () => {
      subjectGrid.style.display = 'grid';
      gradeSelector.style.display = 'none';
      lessonList.style.display = 'none';
    };
    gradeSelector.insertBefore(backButton, gradeSelect);
  });