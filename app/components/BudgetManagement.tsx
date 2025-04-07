import { useEffect, useState } from "react";

interface Budget {
  _id: string;
  expense_category_id: string;
  month: string;
  amount: { $numberDecimal: string };
  spent: { $numberDecimal: string };
}

const CATEGORY_ICONS: Record<string, { icon: JSX.Element; color: string }> = {
  groceries: {
    color: 'emerald',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  utilities: {
    color: 'blue',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  internet: {
    color: 'purple',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  }
};

export default function BudgetManagement() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch('/api/budget');
        if (!response.ok) throw new Error('Failed to fetch budgets');
        const data = await response.json();
        console.log("budget data", data); // Log the fetched data for debugging purposes
        setBudgets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch budgets');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const getBudgetStatus = (budgeted: number, spent: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'good';
  };

  if (loading) return <div className="text-center text-gray-400 py-4">Loading budgets...</div>;
  if (error) return <div className="text-center text-red-400 py-4">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Rest of your existing JSX code, but update the budgets.map section: */}
      <div className="grid gap-6">
        {budgets.map((budget) => {
          const categoryInfo = CATEGORY_ICONS[budget.expense_category_id] || {
            color: 'gray',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          };

          const budgetAmount = parseFloat(budget.amount.$numberDecimal);
          const spentAmount = parseFloat(budget.spent.$numberDecimal);
          const percentage = (spentAmount / budgetAmount) * 100;
          const status = getBudgetStatus(budgetAmount, spentAmount);

          return (
            <div key={budget._id} className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`bg-${categoryInfo.color}-500/10 text-${categoryInfo.color}-400 p-3 rounded-xl`}>
                    {categoryInfo.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white capitalize">
                      {budget.expense_category_id}
                    </h3>
                    <p className="text-sm text-gray-400">Monthly Budget</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-white">
                    ₹{budgetAmount.toLocaleString()}
                  </p>
                  <p className={`text-sm ${status === 'exceeded' ? 'text-rose-400' :
                    status === 'warning' ? 'text-amber-400' :
                      'text-green-400'
                    }`}>
                    ₹{spentAmount.toLocaleString()} spent
                  </p>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-gray-400">
                      {percentage.toFixed(0)}% Used
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-gray-400">
                      ₹{(budgetAmount - spentAmount).toLocaleString()} remaining
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-white/[0.05]">
                  <div
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${status === 'exceeded' ? 'bg-rose-500' :
                      status === 'warning' ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}