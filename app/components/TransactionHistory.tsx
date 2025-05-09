import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  income_category_id: string;
  expense_category_id: string;
  payment_mode: string;
  amount: { $numberDecimal: string };
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'expense',
    income_category_id: '',
    expense_category_id: '',
    payment_mode: '',
    amount: ''
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete transaction');

      setTransactions(prev => prev.filter(t => t._id !== id));
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        console.log(data);
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const [filters, setFilters] = useState({
    dateRange: 'all',
    type: 'all',
    category: 'all'
  });

  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(t =>
        t.income_category_id === filters.category ||
        t.expense_category_id === filters.category
      );
    }

    // Filter by date range
    const today = new Date();
    const transactionDate = new Date();

    switch (filters.dateRange) {
      case 'today':
        filtered = filtered.filter(t => {
          transactionDate.setTime(Date.parse(t.date));
          return transactionDate.toDateString() === today.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(t => {
          transactionDate.setTime(Date.parse(t.date));
          return transactionDate >= weekAgo;
        });
        break;
      case 'month':
        filtered = filtered.filter(t => {
          transactionDate.setTime(Date.parse(t.date));
          return (
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
          );
        });
        break;
    }

    // Sort by date (most recent first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTransaction,
          amount: parseFloat(newTransaction.amount),
        }),
      });

      if (!response.ok) throw new Error('Failed to add transaction');

      const data = await response.json();
      setTransactions(prev => [...prev, data]);
      setIsModalOpen(false);
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'expense',
        income_category_id: '',
        expense_category_id: '',
        payment_mode: '',
        amount: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-4 sm:p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Transaction History</h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">View and filter your transactions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-3">
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
            >
              New Transaction
            </button>
            <select
              className="w-full sm:w-auto bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white/70"
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option className="text-gray-400" value="all">All Time</option>
              <option className="text-gray-400" value="today">Today</option>
              <option className="text-gray-400" value="week">This Week</option>
              <option className="text-gray-400" value="month">This Month</option>
            </select>
            <select
              className="w-full sm:w-auto bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white/70"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option className="text-gray-400" value="all">All Types</option>
              <option className="text-gray-400" value="income">Income</option>
              <option className="text-gray-400" value="expense">Expense</option>
            </select>
            <select
              className="w-full sm:w-auto bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white/70"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option className="text-gray-400" value="all">All Categories</option>
              <option className="text-gray-400" value="salary">Salary</option>
              <option className="text-gray-400" value="freelance">Freelance</option>
              <option className="text-gray-400" value="groceries">Groceries</option>
              <option className="text-gray-400" value="utilities">Utilities</option>
              <option className="text-gray-400" value="internet">Internet</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            {loading ? (
              <p className="text-center text-gray-400 py-4">Loading transactions...</p>
            ) : error ? (
              <p className="text-center text-red-400 py-4">{error}</p>
            ) : (
              <table className="min-w-full">
                <thead className="hidden sm:table-header-group">
                  <tr className="border-b border-white/[0.05]">
                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Date</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Description</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Category</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Payment Method</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-gray-400">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {getFilteredTransactions().map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="group hover:bg-white/[0.02] transition-colors block sm:table-row"
                    >
                      <td className="py-3 sm:py-4 px-4 block sm:table-cell">
                        <div className="flex justify-between items-center sm:block">
                          <span className="text-gray-400 sm:hidden">Date:</span>
                          <div className="text-sm text-white">
                            {new Date(transaction.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-4 block sm:table-cell">
                        <div className="flex justify-between items-center sm:block">
                          <span className="text-gray-400 sm:hidden">Description:</span>
                          <div className="text-sm text-white">{transaction.description}</div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-4 block sm:table-cell">
                        <div className="flex justify-between items-center sm:block">
                          <span className="text-gray-400 sm:hidden">Category:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${transaction.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {transaction.income_category_id || transaction.expense_category_id || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-4 block sm:table-cell">
                        <div className="flex justify-between items-center sm:block">
                          <span className="text-gray-400 sm:hidden">Payment Method:</span>
                          <div className="text-sm text-gray-400">{transaction.payment_mode}</div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-4 block sm:table-cell">
                        <div className="flex justify-between items-center sm:justify-end">
                          <span className="text-gray-400 sm:hidden">Amount:</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium
                              ${transaction.type === 'income' ? 'text-green-400' : 'text-rose-400'}`}>
                              {transaction.type === 'income' ? '+' : '-'}₹
                              {parseFloat(transaction.amount.$numberDecimal).toLocaleString()}
                            </span>
                            <button
                              onClick={() => setDeleteId(transaction._id)}
                              className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    type: e.target.value as 'income' | 'expense',
                    income_category_id: '',
                    expense_category_id: ''
                  }))}
                  className="w-full bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-white"
                  required
                >
                  <option className="text-gray-400" value="expense">Expense</option>
                  <option className="text-gray-400" value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select
                  value={newTransaction.type === 'income' ? newTransaction.income_category_id : newTransaction.expense_category_id}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    income_category_id: prev.type === 'income' ? e.target.value : '',
                    expense_category_id: prev.type === 'expense' ? e.target.value : ''
                  }))}
                  className="w-full bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-white"
                  required
                >
                  <option value="">Select Category</option>
                  {newTransaction.type === 'income' ? (
                    <>
                      <option className="text-gray-400" value="salary">Salary</option>
                      <option className="text-gray-400" value="freelance">Freelance</option>
                    </>
                  ) : (
                    <>
                      <option className="text-gray-400" value="groceries">Groceries</option>
                      <option className="text-gray-400" value="utilities">Utilities</option>
                      <option className="text-gray-400" value="internet">Internet</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Payment Method</label>
                <input
                  type="text"
                  value={newTransaction.payment_mode}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, payment_mode: e.target.value }))}
                  className="w-full bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-2 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {
        deleteId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-xl font-semibold text-white mb-4">Delete Transaction</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}