
import bcrypt from 'bcryptjs';
import { DatabaseService } from './db';
import { User, TransactionType } from '../types';

const SESSION_KEY = 'pem_session';

export const authService = {
  signUp: async (name: string, email: string, password: string): Promise<User> => {
    const existing = DatabaseService.findUserByEmail(email);
    if (existing) throw new Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.compare(password, salt) ? password : await bcrypt.hash(password, salt);
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
    };

    DatabaseService.insert('users', newUser);
    
    // Seed default categories for new user
    const defaultCategories = [
      { name: 'Salary', type: TransactionType.INCOME },
      { name: 'Bonus', type: TransactionType.INCOME },
      { name: 'Housing', type: TransactionType.EXPENSE },
      { name: 'Food', type: TransactionType.EXPENSE },
      { name: 'Transportation', type: TransactionType.EXPENSE },
      { name: 'Entertainment', type: TransactionType.EXPENSE },
    ];

    defaultCategories.forEach(cat => {
      DatabaseService.insert('categories', {
        ...cat,
        id: crypto.randomUUID(),
        userId: newUser.id
      });
    });

    return newUser;
  },

  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const user = DatabaseService.findUserByEmail(email);
    if (!user) throw new Error('User not found');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error('Invalid password');

    const token = btoa(JSON.stringify({ id: user.id, exp: Date.now() + 86400000 })); // Simple mock JWT
    localStorage.setItem(SESSION_KEY, token);

    return { user, token };
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      const users = DatabaseService.getAll('users');
      return users.find(u => u.id === payload.id) || null;
    } catch {
      return null;
    }
  }
};
