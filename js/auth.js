// js/auth.js
class AuthService {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    this.token = localStorage.getItem('authToken') || null;
  }

  async login(email, password) {
    try {
      const response = await fetch('/data/user.json');
      const user = await response.json();
      
      if (user.email === email && password === 'password') { // Mock password check
        this.currentUser = user;
        this.token = 'mock-auth-token';
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  logout() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  async getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    if (this.token) {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
          this.currentUser = user;
          return user;
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        this.logout();
      }
    }
    throw new Error('No user logged in');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const authService = new AuthService();