
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select } from '../../../components/UI';
import { categoryService } from '../services/categoryService';
import { classificationService } from '../services/classificationService';
import { Category, TransactionType, Classification } from '../../../types';
import { Tag, TrendingUp, TrendingDown, Layers, Pencil, Trash2, X } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [classificationId, setClassificationId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = () => {
    setCategories(categoryService.getCategories());
    setClassifications(classificationService.getClassifications());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !classificationId) return;

    if (editingId) {
      categoryService.updateCategory(editingId, { name, type, classificationId });
      setEditingId(null);
    } else {
      categoryService.addCategory({ name, type, classificationId });
    }

    resetForm();
    loadData();
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setType(cat.type);
    setClassificationId(cat.classificationId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category? This might affect transaction reports.')) {
      categoryService.deleteCategory(id);
      loadData();
    }
  };

  const resetForm = () => {
    setName('');
    setEditingId(null);
    // Keep type and classification as they might be useful for batch adding
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Categories</h2>
        <p className="text-slate-500">Manage labels for your incomes and expenses, grouped by classifications.</p>
      </header>

      <Card className="p-6 border-blue-100 shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <Input 
              label={editingId ? "Edit Category Name" : "Category Name"} 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Rent" 
              required 
            />
          </div>
          <div>
            <Select 
              label="Type" 
              value={type} 
              onChange={e => setType(e.target.value as TransactionType)} 
              options={[
                { value: TransactionType.EXPENSE, label: 'Expense' },
                { value: TransactionType.INCOME, label: 'Income' }
              ]} 
            />
          </div>
          <div>
            <Select 
              label="Classification" 
              value={classificationId} 
              onChange={e => setClassificationId(e.target.value)} 
              placeholder="Select..."
              options={classifications.map(c => ({ value: c.id, label: c.name }))} 
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingId ? 'Update' : 'Add Category'}
            </Button>
            {editingId && (
              <Button variant="ghost" onClick={resetForm} className="px-2">
                <X size={20} />
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Expenses Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-rose-600">
            <TrendingDown size={20} />
            <h3 className="font-bold">Expense Categories</h3>
          </div>
          <div className="space-y-6">
            {classifications.map(cls => {
              const cats = categories.filter(c => c.type === TransactionType.EXPENSE && c.classificationId === cls.id);
              if (cats.length === 0) return null;
              return (
                <div key={cls.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                    <Layers size={14} /> {cls.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cats.map(cat => (
                      <CategoryItem 
                        key={cat.id} 
                        cat={cat} 
                        onEdit={() => handleEdit(cat)} 
                        onDelete={() => handleDelete(cat.id)} 
                        isEditing={editingId === cat.id}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Income Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <TrendingUp size={20} />
            <h3 className="font-bold">Income Categories</h3>
          </div>
          <div className="space-y-6">
             {classifications.map(cls => {
              const cats = categories.filter(c => c.type === TransactionType.INCOME && c.classificationId === cls.id);
              if (cats.length === 0) return null;
              return (
                <div key={cls.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                    <Layers size={14} /> {cls.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cats.map(cat => (
                      <CategoryItem 
                        key={cat.id} 
                        cat={cat} 
                        onEdit={() => handleEdit(cat)} 
                        onDelete={() => handleDelete(cat.id)}
                        isEditing={editingId === cat.id}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

interface CategoryItemProps {
  cat: Category;
  onEdit: () => void;
  onDelete: () => void;
  isEditing?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ cat, onEdit, onDelete, isEditing }) => (
  <Card className={`p-3 flex items-center justify-between group transition-all duration-200 ${isEditing ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'hover:border-blue-300'}`}>
    <div className="flex items-center gap-2 min-w-0">
      <Tag size={16} className={`${isEditing ? 'text-blue-500' : 'text-slate-400'}`} />
      <span className={`text-sm font-medium truncate ${isEditing ? 'text-blue-700' : 'text-slate-700'}`}>{cat.name}</span>
    </div>
    <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-2">
      <button 
        onClick={(e) => { e.stopPropagation(); onEdit(); }} 
        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        title="Edit category"
      >
        <Pencil size={14} />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(); }} 
        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
        title="Delete category"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </Card>
);
