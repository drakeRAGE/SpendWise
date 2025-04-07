
# SpendWise - Personal Expense Tracker

Welcome to **SpendWise**, a personal expense tracking application designed for solo users to manage income, expenses, budgets, and transactions efficiently. Built with a focus on simplicity and extensibility, this project leverages a MongoDB backend with Mongoose and a Remix frontend to provide a seamless financial tracking experience.

## Overview

SpendWise allows you to:
- Track income and expenses with customizable categories (e.g., "freelance", "groceries").
- Monitor monthly budgets and compare them against actual spending.
- Visualize financial data across multiple pages: Dashboard, Income, Expenses, Budget, and Transactions.
- Store data securely in a MongoDB database with optimized indexing for performance.

This project is ideal for personal use, offering a lightweight solution without the overhead of multi-user support.

![image](https://github.com/user-attachments/assets/260b9346-bf18-418e-bb89-3092cda34ce6)

![image](https://github.com/user-attachments/assets/b6b9e77d-34e0-4464-a90a-d8459797b8fe)

![image](https://github.com/user-attachments/assets/588a073f-1c29-4799-a7e7-9a7a924322b3)

## Features
- **Dashboard**: Displays total income, total expenses, balance, and month-wise spending analysis.
- **Income Tracking**: Records income sources with categories like "salary" or "freelance".
- **Expense Tracking**: Logs expenses with categories like "internet" or "groceries".
- **Budget Management**: Sets and compares monthly budgets against actual expenses.
- **Transaction History**: Provides a detailed log of all financial activities.
- **Data Persistence**: Stores data in MongoDB with automatic timestamps.

## Getting Started

### Prerequisites
- Remix
- TypeScript
- MongoDB (local or Atlas cluster)
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/drakeRAGE/SpendWise.git
   cd spendwise
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add your MongoDB connection string:
     ```
     MONGO_URI=your uri string
     ```
4. Initialize the database:
   - Use the MongoDB shell to create and populate the `test` database (see [Database Setup](#database-setup) below).
5. Start the application:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Database Setup
The application uses a MongoDB database named `test` with two collections: `transactions` and `budgets`. To set up the database manually:

### MongoDB Shell Commands
1. Connect to MongoDB:
   ```bash
   mongo
   ```
2. Switch to the `test` database:
   ```javascript
   use test
   ```
3. Populate the `transactions` collection:
   ```javascript
   db.transactions.insertMany([
     { date: ISODate("2023-10-01"), description: "Freelance project payment", type: "income", income_category_id: "freelance", expense_category_id: null, payment_mode: "bank", amount: NumberDecimal("1200.00") },
     { date: ISODate("2023-10-03"), description: "Monthly internet bill", type: "expense", income_category_id: null, expense_category_id: "internet", payment_mode: "credit card", amount: NumberDecimal("60.00") },
     { date: ISODate("2023-10-05"), description: "Weekly groceries", type: "expense", income_category_id: null, expense_category_id: "groceries", payment_mode: "cash", amount: NumberDecimal("90.00") },
     { date: ISODate("2023-10-07"), description: "Salary deposit", type: "income", income_category_id: "salary", expense_category_id: null, payment_mode: "bank transfer", amount: NumberDecimal("3000.00") }
   ]);
   ```
4. Add indexes to `transactions`:
   ```javascript
   db.transactions.createIndex({ date: 1 });
   db.transactions.createIndex({ type: 1 });
   db.transactions.createIndex({ income_category_id: 1 });
   db.transactions.createIndex({ expense_category_id: 1 });
   ```
5. Populate the `budgets` collection:
   ```javascript
   db.budgets.insertMany([
     { expense_category_id: "internet", month: ISODate("2023-10-01"), amount: NumberDecimal("70.00") },
     { expense_category_id: "groceries", month: ISODate("2023-10-01"), amount: NumberDecimal("150.00") },
     { expense_category_id: "utilities", month: ISODate("2023-11-01"), amount: NumberDecimal("100.00") }
   ]);
   ```
6. Add a unique compound index to `budgets`:
   ```javascript
   db.budgets.createIndex({ expense_category_id: 1, month: 1 }, { unique: true });
   ```

Verify the setup with:
```javascript
db.transactions.find().pretty()
db.budgets.find().pretty()
```

## Usage
- Navigate to the Dashboard to view a summary of your finances.
- Use the Income and Expenses pages to add or view categorized transactions.
- Set budgets on the Budget page and track spending against them.
- Review all transactions on the Transactions page, sorted by date.

## Project Structure
- `src/config/db.js`: Handles MongoDB connection using Mongoose.
- `src/models/schema.ts`: Defines Mongoose schemas and models for `Transaction` and `Budget`.
- `src/routes/`: Contains Remix route files with loader functions (e.g., fetching transactions).
- `.env`: Stores environment variables like `MONGO_URI`.

## Technical Details
- The `transactions` collection uses a pre-save hook to enforce category consistency (e.g., nullifying `expense_category_id` for income transactions).
- Indexes on `date`, `type`, and category fields optimize query performance.
- Remix loaders (e.g., for the Transactions page) fetch data with `.sort({ date: -1 }).lean()` and return JSON responses.
- The connection string targets the `test` database, aligning with the manual setup.

## Contributing
This is a personal project, but contributions are welcome! Please fork the repository and submit pull requests for enhancements or bug fixes.

## Acknowledgments
- Inspired by the need for a simple personal finance tool.
- Built with guidance from MongoDB and Remix documentation.
