
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge } from '../../../components/UI';
import { categoryService } from '../services/categoryService';
import { Category, TransactionType } from '../../../types';
import { Tag, Plus, TrendingUp, TrendingDown } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);

  const loadData = () => setCategories(categoryService.getCategories());

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    categoryService.addCategory({ name, type });
    setName('');
    loadData();
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Categories</h2>
        <p className="text-slate-500">Manage labels for your incomes and expenses.</p>
      </header>

      <Card className="p-6">
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input label="New Category Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Entertainment" required />
          </div>
          <div className="w-full md:w-48">
            <Select label="Type" value={type} onChange={e => setType(e.target.value as TransactionType)} options={[
              { value: TransactionType.EXPENSE, label: 'Expense' },
              { value: TransactionType.INCOME, label: 'Income' }
            ]} />
          </div>
          <Button type="submit" className="w-full md:w-auto">Add Category</Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center gap-2 mb-4 text-rose-600">
            <TrendingDown size={20} />
            <h3 className="font-bold">Expense Categories</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categories.filter(c => c.type === TransactionType.EXPENSE).map(cat => (
              <Card key={cat.id} className="p-3 flex items-center gap-2 hover:border-blue-300 transition-colors cursor-default">
                <Tag size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">{cat.name}</span>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <TrendingUp size={20} />
            <h3 className="font-bold">Income Categories</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categories.filter(c => c.type === TransactionType.INCOME).map(cat => (
              <Card key={cat.id} className="p-3 flex items-center gap-2 hover:border-blue-300 transition-colors cursor-default">
                <Tag size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">{cat.name}</span>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
