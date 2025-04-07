import { useEffect, useState } from "react";

interface Income {
  _id: string;
  income_category_id: string;
  amount: { $numberDecimal: string };
  date: string;
  description: string;
  payment_mode: string;
}

interface IncomeCategory {
  _id: string;
  total: number;
  lastReceived: string;
  count: number;
}

const INCOME_CATEGORIES = {
  salary: {
    name: 'Salary',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  freelance: {
    name: 'Freelance',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
} as const;

export default function IncomeTracking() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [incomesByCategory, setIncomesByCategory] = useState<IncomeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await fetch('/api/income');
        if (!response.ok) throw new Error('Failed to fetch incomes');
        const data = await response.json();
        setIncomes(data.incomes);
        setIncomesByCategory(data.incomesByCategory);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch incomes');
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-4">Loading incomes...</div>;
  if (error) return <div className="text-center text-red-400 py-4">{error}</div>;

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Income Sources</h3>
      </div>

      <div className="grid gap-4">
        {incomesByCategory.map((category) => {
          const categoryInfo = INCOME_CATEGORIES[category._id as keyof typeof INCOME_CATEGORIES];
          return (
            <div
              key={category._id}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white/[0.05] to-transparent p-4 transition-all duration-300 hover:from-white/[0.1]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    {categoryInfo?.icon || (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{categoryInfo?.name || category._id}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-400">{category.count} transactions</span>
                      <span className="mx-2 text-gray-600">•</span>
                      <span className="text-xs text-gray-400">
                        Last: {new Date(category.lastReceived).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">
                    ₹{category.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-xs text-emerald-400">Monthly Average</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}