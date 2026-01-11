
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge } from '../../../components/UI';
import { transactionService } from '../services/transactionService';
import { accountService } from '../../accounts/services/accountService';
import { cardService } from '../../cards/services/cardService';
import { categoryService } from '../../categories/services/categoryService';
import { TransactionType, PaymentMethod, TransactionWithDetails } from '../../../types';
import { Plus, Filter, Trash2 } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.BANK_ACCOUNT);
  const [paymentMethodId, setPaymentMethodId] = useState('');

  const accounts = accountService.getAccounts().filter(a => a.isActive);
  const cards = cardService.getCards().filter(c => c.isActive);
  const categories = categoryService.getCategories(type);

  const loadData = () => {
    setTransactions(transactionService.getTransactions());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !paymentMethodId) return;

    transactionService.addTransaction({
      transactionType: type,
      amount: parseFloat(amount),
      date,
      categoryId,
      paymentMethod,
      paymentMethodId
    });

    // Reset Form
    setAmount('');
    setCategoryId('');
    setPaymentMethodId('');
    setShowForm(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Transactions</h2>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={18} /> Add New
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Type"
              value={type}
              onChange={(e) => {
                const newType = e.target.value as TransactionType;
                setType(newType);
                if (newType === TransactionType.INCOME) setPaymentMethod(PaymentMethod.BANK_ACCOUNT);
              }}
              options={[
                { value: TransactionType.EXPENSE, label: 'Expense' },
                { value: TransactionType.INCOME, label: 'Income' }
              ]}
            />
            <Input
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              placeholder="Select Category"
            />
            
            {type === TransactionType.EXPENSE ? (
              <>
                <Select
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value as PaymentMethod);
                    setPaymentMethodId('');
                  }}
                  options={[
                    { value: PaymentMethod.BANK_ACCOUNT, label: 'Bank Account' },
                    { value: PaymentMethod.CREDIT_CARD, label: 'Credit Card' }
                  ]}
                />
                <Select
                  label="Select Account/Card"
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                  options={paymentMethod === PaymentMethod.BANK_ACCOUNT 
                    ? accounts.map(a => ({ value: a.id, label: a.bankName }))
                    : cards.map(c => ({ value: c.id, label: c.title }))
                  }
                  placeholder="Choose..."
                />
              </>
            ) : (
              <Select
                label="Deposit to Account"
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
                options={accounts.map(a => ({ value: a.id, label: a.bankName }))}
                placeholder="Choose Account"
              />
            )}

            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save Transaction</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm font-semibold text-slate-500 border-b bg-slate-50">
                <th className="p-4">Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Method</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Badge variant={t.transactionType === TransactionType.INCOME ? 'success' : 'danger'}>
                      {t.categoryName}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div className="text-sm font-medium">{t.paymentMethodName}</div>
                    <div className="text-xs text-slate-400 capitalize">{t.paymentMethod.replace('_', ' ')}</div>
                  </td>
                  <td className={`p-4 text-right font-bold ${t.transactionType === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.transactionType === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-400 italic">No history yet. Start by adding your first transaction!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
