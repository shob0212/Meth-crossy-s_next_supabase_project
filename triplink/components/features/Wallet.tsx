'use client';

import React, { useState } from 'react';
import { Expense, Category, User, Language } from '@/lib/types';
import { Receipt, Wallet as WalletIcon, MoreHorizontal, X, Plus, Trash2, Pencil, ArrowRight } from 'lucide-react';

interface WalletProps {
  expenses: Expense[];
  members: User[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  isReadOnly?: boolean;
  language?: Language;
}

const TEXT = {
  ja: {
    total: '合計支出',
    record: '記録',
    report: 'レポート',
    history: '履歴',
    edit: '編集',
    new: '新規支出',
    whatFor: '何に使った？',
    amount: '金額 (¥)',
    save: '保存',
    categories: {
      [Category.Transport]: '交通費',
      [Category.Food]: '食費',
      [Category.Activity]: '観光',
      [Category.Lodging]: '宿泊',
      [Category.Other]: 'その他'
    }
  },
  en: {
    total: 'Total Expenses',
    record: 'Record',
    report: 'Report',
    history: 'History',
    edit: 'Edit',
    new: 'New Expense',
    whatFor: 'What for?',
    amount: 'Amount (¥)',
    save: 'Save',
    categories: {
      [Category.Transport]: 'Transport',
      [Category.Food]: 'Food',
      [Category.Activity]: 'Activity',
      [Category.Lodging]: 'Lodging',
      [Category.Other]: 'Other'
    }
  }
};

// Avatar helper inside component
const UserAvatar = ({ name, avatar }: { name: string, avatar?: string }) => {
    if (avatar) {
        return <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm" />;
    }
    return (
        <div className="w-8 h-8 rounded-full bg-ivory dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[10px] font-bold flex items-center justify-center border border-gray-200 dark:border-gray-600">
            {name.substring(0, 2).toUpperCase()}
        </div>
    );
};

export function Wallet({ expenses, members, onAddExpense, onUpdateExpense, onDeleteExpense, isReadOnly = false, language = 'ja' }: WalletProps) {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState(members[0]?.id || '');
  const [category, setCategory] = useState<Category>(Category.Food);

  const t = TEXT[language];

  const totalSpend = expenses.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = () => {
    if (!title || !amount) return;
    const expense = { title, amount: parseInt(amount), payerId, category, date: new Date().toLocaleDateString() };
    if (editingExpenseId) onUpdateExpense({ id: editingExpenseId, ...expense });
    else onAddExpense(expense);
    setIsInputModalOpen(false);
    resetForm();
  };

  const resetForm = () => { setTitle(''); setAmount(''); setEditingExpenseId(null); };

  const handleEdit = (exp: Expense) => {
      setEditingExpenseId(exp.id);
      setTitle(exp.title);
      setAmount(exp.amount.toString());
      setPayerId(exp.payerId);
      setCategory(exp.category);
      setIsInputModalOpen(true);
  };

  return (
    <div className="pb-8">
       {/* Minimalist Card */}
       <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
         <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{t.total}</p>
         <h2 className="text-5xl font-light text-gray-800 dark:text-white tracking-tight mb-8">¥{totalSpend.toLocaleString()}</h2>

         {!isReadOnly && (
             <div className="flex gap-4">
                <button onClick={() => setIsInputModalOpen(true)} className="flex-1 bg-mint-400 text-white py-4 rounded-full text-sm font-bold shadow-sm hover:bg-mint-500 transition-colors flex items-center justify-center gap-2">
                    <Plus size={18} /> {t.record}
                </button>
                <button onClick={() => setIsReportModalOpen(true)} className="flex-1 bg-ivory dark:bg-gray-700 text-gray-600 dark:text-gray-200 py-4 rounded-full text-sm font-bold border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    {t.report}
                </button>
             </div>
         )}
       </div>

       <div className="space-y-4">
         <div className="flex items-center gap-2 mb-2 px-1">
             <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
             <h3 className="font-medium text-sm text-gray-500 uppercase tracking-widest">{t.history}</h3>
         </div>
         {expenses.map(expense => {
             const member = members.find(m => m.id === expense.payerId);
             return (
             <div key={expense.id} className="bg-white dark:bg-gray-800 p-6 rounded-[24px] flex items-center justify-between border border-gray-200 dark:border-gray-700 hover:border-mint-200 dark:hover:border-mint-900 transition-all group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-ivory dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-600">
                        <Receipt size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-white text-sm">{expense.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <UserAvatar name={member?.name || '?'} avatar={member?.avatar} />
                            <span className="text-xs text-gray-400">{expense.date}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-bold text-gray-800 dark:text-white">¥{expense.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-600 inline-block">{t.categories[expense.category] || expense.category}</p>
                    </div>
                    {!isReadOnly && (
                        <div className="hidden group-hover:flex gap-2">
                             <button onClick={() => handleEdit(expense)} className="text-gray-400 hover:text-mint-400"><Pencil size={16}/></button>
                             <button onClick={() => onDeleteExpense(expense.id)} className="text-gray-400 hover:text-red-400"><Trash2 size={16}/></button>
                        </div>
                    )}
                </div>
             </div>
             );
         })}
       </div>

       {/* Input Modal */}
       {isInputModalOpen && (
           <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white">{editingExpenseId ? t.edit : t.new}</h3>
                        <button onClick={() => setIsInputModalOpen(false)} className="w-8 h-8 rounded-full bg-ivory dark:bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-600"><X size={18}/></button>
                    </div>
                    <div className="space-y-4">
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none border border-transparent focus:border-mint-200" placeholder={t.whatFor} />
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none border border-transparent focus:border-mint-200" placeholder={t.amount} />
                        <div className="grid grid-cols-2 gap-4">
                            <select value={payerId} onChange={e => setPayerId(e.target.value)} className="bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none text-sm border border-transparent focus:border-mint-200">
                                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <select value={category} onChange={e => setCategory(e.target.value as Category)} className="bg-ivory dark:bg-gray-700 dark:text-white rounded-2xl p-4 outline-none text-sm border border-transparent focus:border-mint-200">
                                {Object.values(Category).map(c => <option key={c} value={c}>{t.categories[c] || c}</option>)}
                            </select>
                        </div>
                        <button onClick={handleSubmit} className="w-full bg-mint-400 text-white py-4 rounded-full font-bold mt-2 shadow-sm hover:bg-mint-500 transition-colors">{t.save}</button>
                    </div>
                </div>
           </div>
       )}
    </div>
  );
}
