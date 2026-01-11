
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum PaymentMethod {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  CREDIT_CARD = 'CREDIT_CARD'
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface Classification {
  id: string;
  userId: string;
  name: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  initialBalance: number;
  currentBalance: number;
  isActive: boolean;
}

export interface CreditCard {
  id: string;
  userId: string;
  title: string;
  creditLimit: number;
  availableLimit: number;
  brand: string;
  dueDate: number;
  closingDate: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  userId: string;
  classificationId: string;
  name: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  description: string;
  transactionType: TransactionType;
  categoryId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentMethodId: string;
}

export interface TransactionWithDetails extends Transaction {
  categoryName?: string;
  classificationName?: string;
  paymentMethodName?: string;
}
