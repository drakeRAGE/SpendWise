import { connectDB } from '../../src/config/db';
import { Transaction } from '../../src/models/schema';
import { json, type LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
    try {
        await connectDB();

        const [incomeResult, expenseResult] = await Promise.all([
            Transaction.aggregate([
                { $match: { type: 'income' } },
                { $group: { 
                    _id: null, 
                    total: { $sum: { $toDouble: '$amount' } }
                }}
            ]),
            Transaction.aggregate([
                { $match: { type: 'expense' } },
                { $group: { 
                    _id: null, 
                    total: { $sum: { $toDouble: '$amount' } }
                }}
            ])
        ]);

        const totalIncome = incomeResult[0]?.total || 0;
        const totalExpenses = expenseResult[0]?.total || 0;
        const balance = totalIncome - totalExpenses;

        return json({
            totalIncome,
            totalExpenses,
            balance
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
};