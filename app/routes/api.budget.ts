import { connectDB } from '../../src/config/db';
import { Transaction, Budget } from '../../src/models/schema';
import { json, type LoaderFunction, type ActionFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
    try {
        await connectDB();

        // Get all budgets
        const budgets = await Budget.find().lean();

        // Get current month's start and end dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Calculate spent amount for each budget
        const budgetsWithSpending = await Promise.all(
            budgets.map(async (budget) => {
                const spent = await Transaction.aggregate([
                    {
                        $match: {
                            expense_category_id: budget.expense_category_id,
                            date: { $gte: startOfMonth, $lte: endOfMonth },
                            type: 'expense'
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$amount' }
                        }
                    }
                ]);

                return {
                    ...budget,
                    spent: spent[0]?.total || 0
                };
            })
        );

        return json(budgetsWithSpending);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        return json({ error: 'Failed to fetch budgets' }, { status: 500 });
    }
};

export const action: ActionFunction = async ({ request }) => {
    try {
        await connectDB();

        if (request.method === 'POST') {
            const data = await request.json();

            const newBudget = new Budget({
                expense_category_id: data.expense_category_id,
                month: new Date(data.month),
                amount: data.amount
            });

            await newBudget.save();
            return json(newBudget);
        }

        return json({ error: 'Method not allowed' }, { status: 405 });
    } catch (error) {
        console.error('Error:', error);
        return json({ error: 'Operation failed' }, { status: 500 });
    }
};