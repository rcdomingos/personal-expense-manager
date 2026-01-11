
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge } from '../../../components/UI';
import { cardService } from '../services/cardService';
import { CreditCard } from '../../../types';
import { CreditCard as CardIcon, Plus, Power } from 'lucide-react';

export const CardsPage: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [limit, setLimit] = useState('');
  const [brand, setBrand] = useState('Visa');
  const [dueDate, setDueDate] = useState('10');
  const [closingDate, setClosingDate] = useState('1');

  const loadCards = () => setCards(cardService.getCards());

  useEffect(() => {
    loadCards();
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !limit) return;
    cardService.addCard({
      title,
      creditLimit: parseFloat(limit),
      brand,
      dueDate: parseInt(dueDate),
      closingDate: parseInt(closingDate),
      isActive: true
    });
    setTitle('');
    setLimit('');
    setShowForm(false);
    loadCards();
  };

  const handleToggle = (id: string) => {
    cardService.toggleActive(id);
    loadCards();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Credit Cards</h2>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={18} /> New Card
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input label="Card Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Travel Card" required />
            <Input label="Credit Limit" type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="0.00" required />
            <Select label="Brand" value={brand} onChange={e => setBrand(e.target.value)} options={[
              { value: 'Visa', label: 'Visa' },
              { value: 'Mastercard', label: 'Mastercard' },
              { value: 'Amex', label: 'Amex' }
            ]} />
            <Input label="Closing Day" type="number" value={closingDate} onChange={e => setClosingDate(e.target.value)} placeholder="1" required />
            <Input label="Due Day" type="number" value={dueDate} onChange={e => setDueDate(e.target.value)} placeholder="10" required />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Add Card</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => {
          const usagePercent = Math.round(((card.creditLimit - card.availableLimit) / card.creditLimit) * 100);
          return (
            <Card key={card.id} className={`overflow-hidden ${!card.isActive ? 'opacity-60 grayscale' : ''}`}>
              <div className="bg-slate-800 p-5 text-white relative h-32 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CardIcon size={24} className="text-slate-400" />
                    <span className="font-semibold">{card.title}</span>
                  </div>
                  <Badge variant="neutral">{card.brand}</Badge>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs uppercase tracking-wider text-slate-400">Available Limit</div>
                  <div className="text-xl font-bold">${card.availableLimit.toLocaleString()}</div>
                </div>
                <button 
                  onClick={() => handleToggle(card.id)} 
                  className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                  <Power size={18} />
                </button>
              </div>
              <div className="p-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Usage</span>
                  <span className="font-semibold text-slate-700">{usagePercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${usagePercent > 80 ? 'bg-rose-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t text-xs text-slate-500">
                  <div>Limit: <span className="font-semibold">${card.creditLimit.toLocaleString()}</span></div>
                  <div>Due: <span className="font-semibold">Day {card.dueDate}</span></div>
                </div>
              </div>
            </Card>
          );
        })}
        {cards.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
            No credit cards recorded. Click "New Card" to add one.
          </div>
        )}
      </div>
    </div>
  );
};
