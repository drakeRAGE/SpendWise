import { useState } from "react";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
}

export default function TransactionHistory() {
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      category: 'Salary',
      amount: 5000,
      date: '2024-01-15',
      description: 'Monthly salary',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '2',
      type: 'expense',
      category: 'Groceries',
      amount: 150,
      date: '2024-01-18',
      description: 'Weekly groceries',
      paymentMethod: 'Credit Card'
    },
    {
      id: '3',
      type: 'expense',
      category: 'Utilities',
      amount: 80,
      date: '2024-01-20',
      description: 'Electricity bill',
      paymentMethod: 'Direct Debit'
    },
    {
      id: '4',
      type: 'income',
      category: 'Freelance',
      amount: 800,
      date: '2024-01-22',
      description: 'Website development project',
      paymentMethod: 'PayPal'
    }
  ]);

  const [filters, setFilters] = useState({
    dateRange: 'all',
    type: 'all',
    category: 'all'
  });

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-white">Transaction History</h3>
            <p className="text-sm text-gray-400 mt-1">View and filter your transactions</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              className="bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white/70"
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <select 
              className="bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white/70"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select 
              className="bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white/70"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="all">All Categories</option>
              <option value="salary">Salary</option>
              <option value="freelance">Freelance</option>
              <option value="groceries">Groceries</option>
              <option value="utilities">Utilities</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Description</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Payment Method</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-400">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {transactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="text-sm text-white">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-white">{transaction.description}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${transaction.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-400">{transaction.paymentMethod}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`text-sm font-medium
                      ${transaction.type === 'income' ? 'text-green-400' : 'text-rose-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}