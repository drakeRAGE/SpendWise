import { useEffect, useState } from "react";

interface Expense {
  _id: string;
  expense_category_id: string;
  amount: { $numberDecimal: string };
  date: string;
  description: string;
  payment_mode: string;
}

interface CategoryCounts {
  [key: string]: number;
}

// First, define the category type
type CategoryType = {
  name: string;
  color: string;
  icon: JSX.Element;
};

type Categories = {
  [key: string]: CategoryType;
};

const CATEGORIES: Categories = {
  groceries: {
    name: 'Groceries',
    color: 'emerald',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  utilities: {
    name: 'Utilities',
    color: 'yellow',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  internet: {
    name: 'Internet',
    color: 'blue',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  }
};

export default function ExpenseTracking() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('/api/expense');
        if (!response.ok) throw new Error('Failed to fetch expenses');
        const data = await response.json();
        setExpenses(data.expenses);
        setCategoryCounts(data.categoryCounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-4">Loading expenses...</div>;
  if (error) return <div className="text-center text-red-400 py-4">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Expense Categories</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(CATEGORIES).map(([id, category]) => (
            <div
              key={id}
              className="flex items-center space-x-3 p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${category.color}-500/10 text-${category.color}-400`}>
                {category.icon}
              </div>
              <div>
                <h4 className="text-white font-medium">{category.name}</h4>
                <p className="text-sm text-gray-400">{categoryCounts[id] || 0} expenses</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Expenses</h3>
        </div>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white/[0.05] to-transparent p-4 transition-all duration-300 hover:from-white/[0.1]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${CATEGORIES[expense.expense_category_id]?.color || 'gray'}-500/10 text-${CATEGORIES[expense.expense_category_id]?.color || 'gray'}-400`}>
                    {CATEGORIES[expense.expense_category_id]?.icon || (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{CATEGORIES[expense.expense_category_id]?.name || expense.expense_category_id}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-400">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                      <span className="mx-2 text-gray-600">•</span>
                      <span className="text-xs text-gray-400">{expense.payment_mode}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">
                    ₹{parseFloat(expense.amount.$numberDecimal).toLocaleString()}
                  </p>
                  {expense.description && (
                    <span className="text-xs text-gray-400 truncate max-w-[200px] block">
                      {expense.description}
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