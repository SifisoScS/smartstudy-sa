// auth.js - User session management

import { apiService } from './apiService';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.token = localStorage.getItem('authToken') || null;
  }

  async login(email, password) {
    // In a real app, this would call your authentication API
    try {
      // Mock authentication - in reality, verify with backend
      const user = await apiService.getUser(1); // Using mock user ID 1
      
      if (user.email === email) { // Simple mock validation
        this.currentUser = user;
        this.token = 'mock-auth-token';
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('userId', user.id);
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
    localStorage.removeItem('userId');
  }

  async getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    if (this.token) {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.currentUser = await apiService.getUser(parseInt(userId));
          return this.currentUser;
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        this.logout();
      }
    }
    return null;
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const authService = new AuthService();