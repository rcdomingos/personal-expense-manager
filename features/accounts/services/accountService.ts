
import { DatabaseService } from '../../../services/db';
import { BankAccount } from '../../../types';
import { authService } from '../../../services/authService';

export const accountService = {
  getAccounts: (): BankAccount[] => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    return DatabaseService.getAll('accounts', user.id);
  },

  addAccount: (account: Omit<BankAccount, 'id' | 'currentBalance' | 'userId'>): void => {
    const user = authService.getCurrentUser();
    if (!user) return;
    const newAccount: BankAccount = {
      ...account,
      id: crypto.randomUUID(),
      userId: user.id,
      currentBalance: account.initialBalance,
    };
    DatabaseService.insert('accounts', newAccount);
  },

  updateBalance: (id: string, amount: number): void => {
    const account = DatabaseService.getById('accounts', id);
    if (account) {
      DatabaseService.update('accounts', id, {
        currentBalance: account.currentBalance + amount
      });
    }
  },

  toggleActive: (id: string): void => {
    const account = DatabaseService.getById('accounts', id);
    if (account) {
      DatabaseService.update('accounts', id, { isActive: !account.isActive });
    }
  }
};
