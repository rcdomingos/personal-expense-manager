
import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../../components/UI';
import { classificationService } from '../services/classificationService';
import { Classification } from '../../../types';
import { FolderPlus, Pencil, Trash2 } from 'lucide-react';

export const ClassificationsPage: React.FC = () => {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = () => setClassifications(classificationService.getClassifications());

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      classificationService.updateClassification(editingId, name);
      setEditingId(null);
    } else {
      classificationService.addClassification(name);
    }
    
    setName('');
    loadData();
  };

  const handleEdit = (c: Classification) => {
    setEditingId(c.id);
    setName(c.name);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure? This will not delete categories but they might lose their classification link.')) {
      classificationService.deleteClassification(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Classifications</h2>
        <p className="text-slate-500">Group your categories for better reporting (e.g., Housing, Automobile).</p>
      </header>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input 
              label={editingId ? "Edit Classification Name" : "New Classification Name"} 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Fixed Expenses" 
              required 
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button type="submit" className="flex-1 md:w-auto">
              {editingId ? 'Update' : 'Add Classification'}
            </Button>
            {editingId && (
              <Button variant="ghost" onClick={() => { setEditingId(null); setName(''); }}>Cancel</Button>
            )}
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classifications.map(c => (
          <Card key={c.id} className="p-4 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FolderPlus size={18} />
              </div>
              <span className="font-semibold text-slate-700">{c.name}</span>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(c)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}
        {classifications.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed rounded-xl">
            No classifications yet. Start grouping your data!
          </div>
        )}
      </div>
    </div>
  );
};
