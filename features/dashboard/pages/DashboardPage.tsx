
import React, { useMemo } from 'react';
import { Card, Badge } from '../../../components/UI';
import { transactionService } from '../../transactions/services/transactionService';
import { accountService } from '../../accounts/services/accountService';
import { cardService } from '../../cards/services/cardService';
import { TransactionType, PaymentMethod } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, CreditCard as CardIcon } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const transactions = useMemo(() => transactionService.getTransactions(), []);
  const accounts = useMemo(() => accountService.getAccounts(), []);
  const cards = useMemo(() => cardService.getCards(), []);

  const stats = useMemo(() => {
    const totalBalance = accounts.reduce((acc, curr) => acc + curr.currentBalance, 0);
    const totalLimit = cards.reduce((acc, curr) => acc + curr.availableLimit, 0);
    const income = transactions
      .filter(t => t.transactionType === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.transactionType === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);

    return { totalBalance, totalLimit, income, expenses };
  }, [transactions, accounts, cards]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(t => t.date === date);
      const income = dayTransactions.filter(t => t.transactionType === TransactionType.INCOME).reduce((a, b) => a + b.amount, 0);
      const expense = dayTransactions.filter(t => t.transactionType === TransactionType.EXPENSE).reduce((a, b) => a + b.amount, 0);
      return {
        date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
        income,
        expense
      };
    });
  }, [transactions]);

  const categoryDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    transactions
      .filter(t => t.transactionType === TransactionType.EXPENSE)
      .forEach(t => {
        const name = t.categoryName || 'Other';
        dist[name] = (dist[name] || 0) + t.amount;
      });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>
        <p className="text-slate-500">Welcome back! Here's what's happening with your money.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Income</p>
            <p className="text-xl font-bold text-slate-800">${stats.income.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="bg-rose-100 p-3 rounded-xl text-rose-600">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Expenses</p>
            <p className="text-xl font-bold text-slate-800">${stats.expenses.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Bank Balance</p>
            <p className="text-xl font-bold text-slate-800">${stats.totalBalance.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
            <CardIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Available Credit</p>
            <p className="text-xl font-bold text-slate-800">${stats.totalLimit.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Income vs Expenses (Last 7 Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Expenses by Category</h3>
          <div className="h-[300px]">
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No data available
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {categoryDistribution.slice(0, 4).map((item, i) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions Snippet */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm font-medium text-slate-500 border-b">
                <th className="pb-3">Date</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Method</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id} className="text-sm text-slate-600">
                  <td className="py-3">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="py-3 font-medium text-slate-800">
                    {t.description}
                  </td>
                  <td className="py-3">
                    <Badge>{t.categoryName}</Badge>
                  </td>
                  <td className="py-3">{t.paymentMethodName}</td>
                  <td className={`py-3 text-right font-bold ${t.transactionType === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.transactionType === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
