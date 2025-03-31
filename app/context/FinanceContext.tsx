import { createContext, useContext, useState } from "react";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
}

interface Budget {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
}

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  monthlySpending: {
    month: string;
    amount: number;
    color: string;
  }[];
  upcomingBills: {
    title: string;
    amount: number;
    dueDate: string;
    category: string;
  }[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getRemainingBalance: () => number;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([
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
      type: 'income',
      category: 'Freelance',
      amount: 1200,
      date: '2024-01-20',
      description: 'Website development project',
      paymentMethod: 'PayPal'
    },
    {
      id: '3',
      type: 'expense',
      category: 'Groceries',
      amount: 150,
      date: '2024-01-18',
      description: 'Weekly groceries',
      paymentMethod: 'Credit Card'
    },
    {
      id: '4',
      type: 'expense',
      category: 'Utilities',
      amount: 80,
      date: '2024-01-20',
      description: 'Electricity bill',
      paymentMethod: 'Direct Debit'
    },
    {
      id: '5',
      type: 'expense',
      category: 'Entertainment',
      amount: 50,
      date: '2024-01-22',
      description: 'Movie night',
      paymentMethod: 'Credit Card'
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      category: 'Groceries',
      budgeted: 500,
      spent: 450,
    },
    {
      id: '2',
      category: 'Entertainment',
      budgeted: 300,
      spent: 350,
    },
    {
      id: '3',
      category: 'Transportation',
      budgeted: 200,
      spent: 180,
    },
    {
      id: '4',
      category: 'Utilities',
      budgeted: 250,
      spent: 220,
    }
  ]);

  // Add monthly spending data for the dashboard
  const monthlySpending = [
    { month: 'Jan', amount: 3200, color: '#22D3EE' },
    { month: 'Feb', amount: 2800, color: '#2DD4BF' },
    { month: 'Mar', amount: 3500, color: '#34D399' },
    { month: 'Apr', amount: 2900, color: '#4ADE80' },
    { month: 'May', amount: 3100, color: '#A3E635' },
    { month: 'Jun', amount: 3300, color: '#FCD34D' },
  ];

  // Add upcoming bills data
  const upcomingBills = [
    { title: 'Rent', amount: 1200, dueDate: '2024-02-01', category: 'Housing' },
    { title: 'Utilities', amount: 150, dueDate: '2024-02-05', category: 'Bills' },
    { title: 'Internet', amount: 80, dueDate: '2024-02-08', category: 'Bills' },
  ];

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [...prev, newTransaction]);
    
    // Update budget spent amount when adding expense
    if (transaction.type === 'expense') {
      updateBudgetSpent(transaction.category, transaction.amount);
    }
  };

  const updateBudgetSpent = (category: string, amount: number) => {
    setBudgets(prev => prev.map(budget => 
      budget.category === category 
        ? { ...budget, spent: budget.spent + amount }
        : budget
    ));
  };

  const updateBudget = (budget: Budget) => {
    setBudgets(prev => prev.map(b => 
      b.id === budget.id ? budget : b
    ));
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getRemainingBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      budgets,
      monthlySpending,
      upcomingBills,
      addTransaction,
      updateBudget,
      getTotalIncome,
      getTotalExpenses,
      getRemainingBalance,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};