import mongoose from 'mongoose';

// Transactions Schema
const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true // Index for date-based queries
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
    index: true // Index for filtering by type
  },
  income_category_id: {
    type: String, // e.g., "freelance"
    default: null
  },
  expense_category_id: {
    type: String, // e.g., "internet"
    default: null
  },
  payment_mode: {
    type: String,
    required: true
  },
  amount: {
    type: mongoose.Decimal128,
    required: true,
    min: [0, 'Amount cannot be negative'] // Optional: Ensures non-negative amounts
  }
}, { timestamps: true }); // Optional: Adds createdAt and updatedAt fields

// Pre-save hook to enforce category ID rules
transactionSchema.pre('save', function (next) {
  if (this.type === 'income') {
    if (!this.income_category_id) {
      next(new Error('Income category ID is required for income transactions'));
    } else {
      this.expense_category_id = null; // Ensure expense category is null
      next();
    }
  } else if (this.type === 'expense') {
    if (!this.expense_category_id) {
      next(new Error('Expense category ID is required for expense transactions'));
    } else {
      this.income_category_id = null; // Ensure income category is null
      next();
    }
  } else {
    next(new Error('Invalid transaction type'));
  }
});

// Indexes for category strings (optional, for performance)
transactionSchema.index({ income_category_id: 1 });
transactionSchema.index({ expense_category_id: 1 });

// Budgets Schema
const budgetSchema = new mongoose.Schema({
  expense_category_id: {
    type: String, // e.g., "internet"
    required: true
  },
  month: {
    type: Date,
    required: true
  },
  amount: {
    type: mongoose.Decimal128,
    required: true,
    min: [0, 'Amount cannot be negative'] // Optional: Ensures non-negative amounts
  }
}, { timestamps: true }); // Optional: Adds createdAt and updatedAt fields

// Compound index for uniqueness
budgetSchema.index({ expense_category_id: 1, month: 1 }, { unique: true });

// Create models
export const Transaction = mongoose.model('transactions', transactionSchema);
export const Budget = mongoose.model('budgets', budgetSchema);

export const IncomeCategory = {};
export const ExpenseCategory = {};