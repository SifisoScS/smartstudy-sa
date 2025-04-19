document.addEventListener('DOMContentLoaded', () => {
  const subjectGrid = document.getElementById('subject-grid');
  const gradeSelector = document.getElementById('grade-selector');
  const gradeSelect = document.getElementById('grade-select');
  const lessonList = document.getElementById('lesson-list');
  const lessonsContainer = document.getElementById('lessons-container');

  let currentSubject = null; // Track selected subject

  // Sanitize HTML for text fields, but preserve emojis for icons
  function sanitizeHTML(str, isIcon = false) {
    if (isIcon) {
      return str; // Skip sanitization for icons to preserve emojis
    }
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Fetch lessons data
  fetch('/data/lessons.json')
    .then(response => response.json())
    .then(data => {
      console.log('Loaded lessons data:', data); // Debug log

      // Render subject cards
      subjectGrid.innerHTML = data.map(subject => {
        console.log(`Rendering card for ${subject.subject} with class ${subject.class}`); // Debug log
        return `
          <div class="subject-button ${sanitizeHTML(subject.class)}" data-subject="${sanitizeHTML(subject.subject)}">
            <i class="icon">${sanitizeHTML(subject.icon, true)}</i>
            <span>${sanitizeHTML(subject.subject)}</span>
            <p>Explore ${sanitizeHTML(subject.subject)} lessons</p>
          </div>
        `;
      }).join('');

      // Add click events to subject cards
      document.querySelectorAll('.subject-button').forEach(button => {
        button.addEventListener('click', () => {
          currentSubject = data.find(s => s.subject === button.dataset.subject);
          console.log('Selected subject:', currentSubject); // Debug log

          // Show grade selector and populate grades
          gradeSelector.style.display = 'block';
          lessonList.style.display = 'none';
          subjectGrid.style.display = 'none';

          // Update grade options based on subject
          gradeSelect.innerHTML = currentSubject.grades.map(grade => `
            <option value="${grade.grade}">Grade ${grade.grade}</option>
          `).join('');

          // Trigger initial grade selection
          renderCurriculum(currentSubject, parseInt(gradeSelect.value));
        });
      });

      // Handle grade selection
      gradeSelect.addEventListener('change', () => {
        if (currentSubject) {
          console.log('Grade selected:', gradeSelect.value); // Debug log
          renderCurriculum(currentSubject, parseInt(gradeSelect.value));
        }
      });
    })
    .catch(error => {
      console.error('Error fetching lessons:', error);
      subjectGrid.innerHTML = '<p>Error loading lessons.</p>';
    });

  // Function to render curriculum for a subject and grade
  function renderCurriculum(subject, grade) {
    const gradeData = subject.grades.find(g => g.grade === grade);
    console.log('Rendering curriculum for', subject.subject, 'Grade', grade, gradeData); // Debug log
    if (!gradeData) {
      lessonsContainer.innerHTML = '<p>No curriculum available for this grade.</p>';
      return;
    }

    // Clear previous content
    lessonsContainer.innerHTML = '';

    // Render semesters (Digital Technology) or terms (others)
    const hasSemesters = gradeData.semesters;
    lessonsContainer.innerHTML = `
      ${(hasSemesters ? gradeData.semesters : gradeData.terms).map(unit => `
        <div class="${hasSemesters ? 'semester' : 'term'}">
          <h4>${sanitizeHTML(unit.name)}</h4>
          <div class="${hasSemesters ? 'week-grid' : 'topic-grid'}">
            ${(hasSemesters ? unit.weeks : unit.topics).map(item => `
              <a href="${sanitizeHTML(item.url)}" class="lesson-card">
                <h5>${hasSemesters ? `Week ${item.week}: ${sanitizeHTML(item.title)}` : sanitizeHTML(item.title)}</h5>
                <p>${sanitizeHTML(item.description)}</p>
              </a>
            `).join('')}
          </div>
        </div>
      `).join('')}
      ${hasSemesters && gradeData.bonus ? `
        <div class="bonus-section">
          <h4>Bonus Ideas</h4>
          <div class="week-grid">
            ${gradeData.bonus.map(bonus => `
              <a href="${sanitizeHTML(bonus.url)}" class="lesson-card bonus">
                <h5>${sanitizeHTML(bonus.title)}</h5>
                <p>${sanitizeHTML(bonus.description)}</p>
              </a>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;

    lessonList.style.display = 'block';
  }

  // Back button to return to subjects
  const backButton = document.createElement('button');
  backButton.className = 'btn btn-back';
  backButton.textContent = 'Back to Subjects';
  backButton.onclick = () => {
    subjectGrid.style.display = 'grid';
    gradeSelector.style.display = 'none';
    lessonList.style.display = 'none';
    currentSubject = null;
  };
  gradeSelector.insertBefore(backButton, gradeSelect);
});