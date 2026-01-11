
import { DatabaseService } from '../../../services/db';
import { Transaction, TransactionType, PaymentMethod, TransactionWithDetails } from '../../../types';
import { accountService } from '../../accounts/services/accountService';
import { cardService } from '../../cards/services/cardService';
import { authService } from '../../../services/authService';

export const transactionService = {
  getTransactions: (): TransactionWithDetails[] => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    
    const transactions = DatabaseService.getAll('transactions', user.id);
    const categories = DatabaseService.getAll('categories', user.id);
    const accounts = DatabaseService.getAll('accounts', user.id);
    const cards = DatabaseService.getAll('cards', user.id);

    return transactions.map(t => {
      const category = categories.find(c => c.id === t.categoryId);
      let paymentName = '';
      if (t.paymentMethod === PaymentMethod.BANK_ACCOUNT) {
        paymentName = accounts.find(a => a.id === t.paymentMethodId)?.bankName || 'Unknown Bank';
      } else {
        paymentName = cards.find(c => c.id === t.paymentMethodId)?.title || 'Unknown Card';
      }

      return {
        ...t,
        categoryName: category?.name || 'Uncategorized',
        paymentMethodName: paymentName,
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>): void => {
    const user = authService.getCurrentUser();
    if (!user) return;

    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      userId: user.id,
    };

    if (transaction.transactionType === TransactionType.INCOME) {
      if (transaction.paymentMethod === PaymentMethod.BANK_ACCOUNT) {
        accountService.updateBalance(transaction.paymentMethodId, transaction.amount);
      }
    } else {
      if (transaction.paymentMethod === PaymentMethod.BANK_ACCOUNT) {
        accountService.updateBalance(transaction.paymentMethodId, -transaction.amount);
      } else if (transaction.paymentMethod === PaymentMethod.CREDIT_CARD) {
        cardService.updateLimit(transaction.paymentMethodId, -transaction.amount);
      }
    }

    DatabaseService.insert('transactions', newTransaction);
  }
};
