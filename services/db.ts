
import { BankAccount, CreditCard, Category, Transaction, User, Classification } from '../types';

const STORAGE_KEY = 'personal_expense_manager_db';

interface DBStructure {
  users: User[];
  classifications: Classification[];
  accounts: BankAccount[];
  cards: CreditCard[];
  categories: Category[];
  transactions: Transaction[];
  version: number;
}

const INITIAL_DB: DBStructure = {
  users: [],
  classifications: [],
  accounts: [],
  cards: [],
  categories: [],
  transactions: [],
  version: 3,
};

export class DatabaseService {
  private static getDB(): DBStructure {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.saveDB(INITIAL_DB);
      return INITIAL_DB;
    }
    return JSON.parse(data);
  }

  private static saveDB(db: DBStructure): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  static getAll<T extends keyof DBStructure>(table: T, userId?: string): DBStructure[T] {
    const data = this.getDB()[table];
    if (userId && Array.isArray(data)) {
      return (data as any[]).filter(item => item.userId === userId) as any;
    }
    return data;
  }

  static getById<T extends keyof DBStructure>(table: T, id: string): any {
    const db = this.getDB();
    return (db[table] as any[]).find((item: any) => item.id === id);
  }

  static insert<T extends keyof DBStructure>(table: T, record: any): void {
    const db = this.getDB();
    (db[table] as any[]).push(record);
    this.saveDB(db);
  }

  static update<T extends keyof DBStructure>(table: T, id: string, record: any): void {
    const db = this.getDB();
    const index = (db[table] as any[]).findIndex((item: any) => item.id === id);
    if (index !== -1) {
      (db[table] as any[])[index] = { ...(db[table] as any[])[index], ...record };
      this.saveDB(db);
    }
  }

  static delete<T extends keyof DBStructure>(table: T, id: string): void {
    const db = this.getDB();
    db[table] = (db[table] as any[]).filter((item: any) => item.id !== id) as any;
    this.saveDB(db);
  }

  static findUserByEmail(email: string): User | undefined {
    return this.getDB().users.find(u => u.email === email);
  }
}
