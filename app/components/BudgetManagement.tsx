import { useState } from "react";

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  icon: JSX.Element;
  color: string;
}

export default function BudgetManagement() {
  const [budgets] = useState<BudgetCategory[]>([
    {
      id: '1',
      name: 'Groceries',
      budgeted: 500,
      spent: 450,
      color: 'emerald',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: '2',
      name: 'Entertainment',
      budgeted: 300,
      spent: 350,
      color: 'purple',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      )
    },
    {
      id: '3',
      name: 'Transportation',
      budgeted: 200,
      spent: 180,
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    }
  ]);

  const getBudgetStatus = (budgeted: number, spent: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'good';
  };

  return (
    <div className="space-y-8">
      {/* Budget Overview */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-white">Budget Overview</h3>
            <p className="text-sm text-gray-400 mt-1">Track your spending limits</p>
          </div>
          <button className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Set New Budget
          </button>
        </div>

        <div className="grid gap-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.budgeted) * 100;
            const status = getBudgetStatus(budget.budgeted, budget.spent);
            
            return (
              <div
                key={budget.id}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-white/[0.05] to-transparent p-6 transition-all duration-300 hover:from-white/[0.1] border border-white/[0.05]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(400px_circle_at_top_right,rgba(56,189,248,0.1),transparent)]"></div>
                <div className="relative flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-${budget.color}-500/20 to-${budget.color}-500/10 text-${budget.color}-400 backdrop-blur-xl border border-${budget.color}-500/10`}>
                      {budget.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-lg">{budget.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-400">
                          ${budget.spent.toLocaleString()} of ${budget.budgeted.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium backdrop-blur-xl
                      ${status === 'exceeded' ? 'bg-red-500/10 text-red-400 border border-red-500/10' :
                        status === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/10' :
                        'bg-green-500/10 text-green-400 border border-green-500/10'
                      }`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 bg-gradient-to-r
                      ${status === 'exceeded' ? 'from-red-500 to-red-400' :
                        status === 'warning' ? 'from-yellow-500 to-yellow-400' :
                        'from-green-500 to-green-400'
                      }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                {status === 'exceeded' && (
                  <div className="mt-4 flex items-center text-red-400 text-sm bg-red-500/5 px-4 py-2 rounded-xl border border-red-500/10">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Budget exceeded by ${(budget.spent - budget.budgeted).toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-white">Budget vs. Actual</h3>
            <p className="text-sm text-gray-400 mt-1">Compare your spending with budget</p>
          </div>
          <select className="bg-gradient-to-r from-white/[0.05] to-transparent border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
          </select>
        </div>

        <div className="space-y-6">
          {budgets.map((budget) => (
            <div key={budget.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full bg-${budget.color}-400`}></div>
                  <span className="text-sm text-white">{budget.name}</span>
                </div>
                <div className="text-sm">
                  <span className="text-blue-400">${budget.spent.toLocaleString()}</span>
                  <span className="text-gray-400"> / </span>
                  <span className="text-white">${budget.budgeted.toLocaleString()}</span>
                </div>
              </div>
              <div className="relative h-4 bg-gray-800/50 rounded-lg overflow-hidden backdrop-blur-sm">
                <div 
                  className={`h-full bg-gradient-to-r from-${budget.color}-500 to-${budget.color}-400 transition-all duration-500`} 
                  style={{ width: `${Math.min((budget.spent / budget.budgeted) * 100, 100)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}