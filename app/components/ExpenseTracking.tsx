import { useState } from "react";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  notes?: string;
  isRecurring: boolean;
  recurringFrequency?: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: JSX.Element;
}

export default function ExpenseTracking() {
  const [categories] = useState<Category[]>([
    {
      id: '1',
      name: 'Groceries',
      color: 'emerald',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: '2',
      name: 'Rent',
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: '3',
      name: 'Utilities',
      color: 'yellow',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]);

  const [expenses] = useState<Expense[]>([
    {
      id: '1',
      category: 'Groceries',
      amount: 150,
      date: '2024-01-25',
      notes: 'Weekly groceries from Walmart',
      isRecurring: false
    },
    {
      id: '2',
      category: 'Rent',
      amount: 1200,
      date: '2024-01-01',
      isRecurring: true,
      recurringFrequency: 'Monthly'
    },
    {
      id: '3',
      category: 'Utilities',
      amount: 80,
      date: '2024-01-15',
      notes: 'Electricity bill',
      isRecurring: true,
      recurringFrequency: 'Monthly'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Expense Categories</h3>
          <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
            Add Category
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center space-x-3 p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${category.color}-500/10 text-${category.color}-400`}>
                {category.icon}
              </div>
              <div>
                <h4 className="text-white font-medium">{category.name}</h4>
                <p className="text-sm text-gray-400">3 expenses</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Expenses</h3>
          <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
            Add Expense
          </button>
        </div>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white/[0.05] to-transparent p-4 transition-all duration-300 hover:from-white/[0.1]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    {categories.find(c => c.name === expense.category)?.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{expense.category}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-400">{new Date(expense.date).toLocaleDateString()}</span>
                      {expense.isRecurring && (
                        <>
                          <span className="mx-2 text-gray-600">•</span>
                          <span className="text-xs text-blue-400">{expense.recurringFrequency}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">${expense.amount}</p>
                  {expense.notes && (
                    <span className="text-xs text-gray-400 truncate max-w-[200px] block">
                      {expense.notes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}