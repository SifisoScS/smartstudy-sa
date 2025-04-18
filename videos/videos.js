document.addEventListener('DOMContentLoaded', function() {
    // Sample video data
    const videoData = [
      {
        id: 'math1',
        title: 'Introduction to Addition',
        description: 'Learn the basics of addition with simple examples and exercises.',
        thumbnail: 'assets/images/math-thumb1.jpg',
        url: 'https://www.youtube.com/embed/XYZ123',
        duration: '8:32',
        subject: 'math',
        grade: '4',
        views: 1250,
        likes: 95
      },
      {
        id: 'english1',
        title: 'Reading Comprehension Basics',
        description: 'Improve your reading skills with these simple techniques.',
        thumbnail: 'assets/images/english-thumb1.jpg',
        url: 'https://www.youtube.com/embed/ABC456',
        duration: '10:15',
        subject: 'english',
        grade: '4',
        views: 980,
        likes: 87
      },
      // More video objects...
    ];
  
    // DOM elements
    const videoGrid = document.getElementById('videoGrid');
    const videoSearch = document.getElementById('videoSearch');
    const subjectFilter = document.getElementById('subjectFilter');
    const gradeFilter = document.getElementById('gradeFilter');
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const closeModal = document.querySelector('.close-modal');
  
    // Initialize video gallery
    function initVideoGallery() {
      renderVideos(videoData);
      setupEventListeners();
    }
  
    // Render videos to the grid
    function renderVideos(videos) {
      videoGrid.innerHTML = '';
      
      if (videos.length === 0) {
        videoGrid.innerHTML = '<p class="no-results">No videos found matching your criteria.</p>';
        return;
      }
      
      videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
          <div class="video-thumbnail">
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="video-duration">${video.duration}</div>
            <button class="play-btn" data-video-id="${video.id}">
              <i class="fas fa-play"></i>
            </button>
          </div>
          <div class="video-info">
            <h3>${video.title}</h3>
            <div class="video-meta">
              <span><i class="fas fa-eye"></i> ${video.views.toLocaleString()}</span>
              <span><i class="fas fa-thumbs-up"></i> ${video.likes}</span>
            </div>
          </div>
        `;
        videoGrid.appendChild(videoCard);
      });
    }
  
    // Filter videos based on search and filters
    function filterVideos() {
      const searchTerm = videoSearch.value.toLowerCase();
      const subject = subjectFilter.value;
      const grade = gradeFilter.value;
      
      const filteredVideos = videoData.filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm) || 
                            video.description.toLowerCase().includes(searchTerm);
        const matchesSubject = subject === 'all' || video.subject === subject;
        const matchesGrade = grade === 'all' || video.grade === grade;
        
        return matchesSearch && matchesSubject && matchesGrade;
      });
      
      renderVideos(filteredVideos);
    }
  
    // Open video in modal
    function openVideoModal(videoId) {
      const video = videoData.find(v => v.id === videoId);
      if (!video) {
        return;
      }
      
      videoPlayer.src = video.url;
      videoTitle.textContent = video.title;
      videoDescription.textContent = video.description;
      videoModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  
    // Close video modal
    function closeVideoModal() {
      videoPlayer.src = '';
      videoModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  
    // Set up event listeners
    function setupEventListeners() {
      // Search and filter events
      videoSearch.addEventListener('input', filterVideos);
      subjectFilter.addEventListener('change', filterVideos);
      gradeFilter.addEventListener('change', filterVideos);
      
      // Video card click events
      document.addEventListener('click', function(e) {
        if (e.target.closest('.play-btn')) {
          const { videoId } = e.target.closest('.play-btn').dataset;
          openVideoModal(videoId);
        }
      });
      
      // Modal close event
      closeModal.addEventListener('click', closeVideoModal);
      
      // Close modal when clicking outside
      window.addEventListener('click', function(e) {
        if (e.target === videoModal) {
          closeVideoModal();
        }
      });
      
      // Playlist toggle buttons
      document.querySelectorAll('.playlist-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
          const playlistVideos = this.closest('.playlist-card').nextElementSibling;
          playlistVideos.style.display = playlistVideos.style.display === 'none' ? 'block' : 'none';
          this.innerHTML = playlistVideos.style.display === 'none' ? 
            '<i class="fas fa-chevron-down"></i>' : '<i class="fas fa-chevron-up"></i>';
        });
      });
    }
  
    // Initialize the video gallery
    initVideoGallery();
  });