
import { DatabaseService } from '../../../services/db';
import { CreditCard } from '../../../types';
import { authService } from '../../../services/authService';

export const cardService = {
  getCards: (): CreditCard[] => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    return DatabaseService.getAll('cards', user.id);
  },

  addCard: (card: Omit<CreditCard, 'id' | 'availableLimit' | 'userId'>): void => {
    const user = authService.getCurrentUser();
    if (!user) return;
    const newCard: CreditCard = {
      ...card,
      id: crypto.randomUUID(),
      userId: user.id,
      availableLimit: card.creditLimit,
    };
    DatabaseService.insert('cards', newCard);
  },

  updateLimit: (id: string, amount: number): void => {
    const card = DatabaseService.getById('cards', id);
    if (card) {
      DatabaseService.update('cards', id, {
        availableLimit: card.availableLimit + amount
      });
    }
  },

  toggleActive: (id: string): void => {
    const card = DatabaseService.getById('cards', id);
    if (card) {
      DatabaseService.update('cards', id, { isActive: !card.isActive });
    }
  }
};
