
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '../../../components/UI';
import { accountService } from '../services/accountService';
import { BankAccount } from '../../../types';
import { Landmark, Plus, Power } from 'lucide-react';

export const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [bankName, setBankName] = useState('');
  const [balance, setBalance] = useState('');

  const loadAccounts = () => setAccounts(accountService.getAccounts());

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !balance) return;
    accountService.addAccount({
      bankName,
      initialBalance: parseFloat(balance),
      isActive: true
    });
    setBankName('');
    setBalance('');
    setShowForm(false);
    loadAccounts();
  };

  const handleToggle = (id: string) => {
    accountService.toggleActive(id);
    loadAccounts();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Bank Accounts</h2>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={18} /> New Account
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input label="Bank Name" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. Chase" required />
            <Input label="Initial Balance" type="number" value={balance} onChange={e => setBalance(e.target.value)} placeholder="0.00" required />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Add Account</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(acc => (
          <Card key={acc.id} className={`p-5 flex flex-col justify-between h-40 ${!acc.isActive ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Landmark size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{acc.bankName}</h4>
                  <p className="text-xs text-slate-400">Current Balance</p>
                </div>
              </div>
              <button onClick={() => handleToggle(acc.id)} className={`p-2 rounded-lg transition-colors ${acc.isActive ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}>
                <Power size={18} />
              </button>
            </div>
            
            <div className="mt-4">
              <div className="text-2xl font-bold text-slate-900">${acc.currentBalance.toLocaleString()}</div>
              {!acc.isActive && <span className="text-xs text-rose-500 font-medium">Inactive</span>}
            </div>
          </Card>
        ))}
        {accounts.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
            No bank accounts yet. Click "New Account" to get started.
          </div>
        )}
      </div>
    </div>
  );
};
