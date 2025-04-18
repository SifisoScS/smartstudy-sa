// apiService.js - Mock API service for SmartStudy SA

const API_BASE_URL = 'https://api.smartstudy-sa.com/v1'; // Replace with your actual API URL

// Simulated database
let mockDatabase = {
  users: [
    {
      id: 1,
      name: "Thabo Mbeki",
      email: "thabo@smartstudy.sa",
      grade: "4",
      language: "en",
      avatar: "assets/images/user-avatar.png"
    }
  ],
  quizzes: [
    {
      id: 'math-grade4',
      title: 'Grade 4 Math: Addition',
      questions: [
        {
          id: 'q1',
          text: 'What is 5 + 3?',
          options: [
            { id: 'q1-a', value: '6', correct: false },
            { id: 'q1-b', value: '8', correct: true },
            { id: 'q1-c', value: '10', correct: false }
          ],
          explanation: 'The sum of 5 and 3 is 8.'
        },
        // More questions...
      ]
    }
  ],
  videos: [
    {
      id: 'math1',
      title: 'Introduction to Addition',
      description: 'Learn the basics of addition with simple examples.',
      url: 'https://www.youtube.com/embed/XYZ123',
      thumbnail: 'assets/images/math-thumb1.jpg',
      subject: 'math',
      grade: '4'
    }
  ],
  userProgress: {
    1: { // User ID 1
      quizzes: {
        'math-grade4': {
          attempts: [
            { date: '2023-06-15', score: 85 }
          ],
          highestScore: 85
        }
      },
      badges: [
        { id: 'first-quiz', date: '2023-05-10' }
      ]
    }
  }
};

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // User methods
  async getUser(userId) {
    await delay(500);
    const user = mockDatabase.users.find(u => u.id === userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
  },

  async updateUser(userId, updates) {
    await delay(500);
    const userIndex = mockDatabase.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error('User not found');
    }
    mockDatabase.users[userIndex] = { ...mockDatabase.users[userIndex], ...updates };
    return mockDatabase.users[userIndex];
  },

  // Quiz methods
  async getQuiz(quizId) {
    await delay(300);
    const quiz = mockDatabase.quizzes.find(q => q.id === quizId);
    if (!quiz) {
        throw new Error('Quiz not found');
    }
    return quiz;
  },

  async saveQuizResults(userId, quizId, results) {
    await delay(500);
    if (!mockDatabase.userProgress[userId]) {
      mockDatabase.userProgress[userId] = { quizzes: {} };
    }
    
    if (!mockDatabase.userProgress[userId].quizzes[quizId]) {
      mockDatabase.userProgress[userId].quizzes[quizId] = { attempts: [] };
    }
    
    const newAttempt = {
      date: new Date().toISOString().split('T')[0],
      score: results.score,
      answers: results.answers
    };
    
    mockDatabase.userProgress[userId].quizzes[quizId].attempts.push(newAttempt);
    
    // Update highest score if needed
    const currentHighest = mockDatabase.userProgress[userId].quizzes[quizId].highestScore || 0;
    if (results.score > currentHighest) {
      mockDatabase.userProgress[userId].quizzes[quizId].highestScore = results.score;
    }
    
    return newAttempt;
  },

  // Video methods
  async getVideos(filters = {}) {
    await delay(400);
    return mockDatabase.videos.filter(video => {
      return (!filters.subject || video.subject === filters.subject) &&
             (!filters.grade || video.grade === filters.grade);
    });
  },

  // Progress methods
  async getUserProgress(userId) {
    await delay(500);
    return mockDatabase.userProgress[userId] || {};
  },

  async addUserBadge(userId, badgeId) {
    await delay(300);
    if (!mockDatabase.userProgress[userId]) {
      mockDatabase.userProgress[userId] = { badges: [] };
    }
    
    const newBadge = {
      id: badgeId,
      date: new Date().toISOString().split('T')[0]
    };
    
    mockDatabase.userProgress[userId].badges.push(newBadge);
    return newBadge;
  }
};