import { connectDB } from '../../src/config/db';
import { Transaction } from '../../src/models/schema';
import { json, type LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
    try {
        await connectDB();

        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const [incomeResult, expenseResult, monthlySpending] = await Promise.all([
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
            ]),
            Transaction.aggregate([
                {
                    $match: {
                        type: 'expense',
                        date: { $gte: sixMonthsAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$date' },
                            month: { $month: '$date' }
                        },
                        amount: { $sum: { $toDouble: '$amount' } }
                    }
                },
                {
                    $sort: { '_id.year': 1, '_id.month': 1 }
                }
            ])
        ]);

        // Generate data for all last 6 months
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const colors = ['#22D3EE', '#2DD4BF', '#34D399', '#4ADE80', '#A3E635', '#FCD34D'];
        const spendingMap = new Map(
            monthlySpending.map(item => [`${item._id.year}-${item._id.month}`, item.amount])
        );

        const spendingData = Array.from({ length: 6 }, (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            return {
                month: monthNames[date.getMonth()],
                amount: spendingMap.get(key) || 0,
                color: colors[5 - i]
            };
        }).reverse();

        const totalIncome = incomeResult[0]?.total || 0;
        const totalExpenses = expenseResult[0]?.total || 0;
        const balance = totalIncome - totalExpenses;

        return json({
            totalIncome,
            totalExpenses,
            balance,
            monthlySpending: spendingData
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
};