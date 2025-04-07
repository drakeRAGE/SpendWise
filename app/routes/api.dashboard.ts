import { connectDB } from '../../src/config/db';
import { Transaction } from '../../src/models/schema';
import { json, type LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
    try {
        await connectDB();

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        // Get current month data
        const currentMonthData = await Transaction.aggregate([
            {
                $match: {
                    date: {
                        $gte: currentMonthStart,
                        $lt: now
                    }
                }
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: { $toDouble: '$amount' } }
                }
            }
        ]);

        // Get previous month data
        const previousMonthData = await Transaction.aggregate([
            {
                $match: {
                    date: {
                        $gte: previousMonthStart,
                        $lt: currentMonthStart
                    }
                }
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: { $toDouble: '$amount' } }
                }
            }
        ]);

        // Calculate current and previous values
        const currentIncome = currentMonthData.find(d => d._id === 'income')?.total || 0;
        const previousIncome = previousMonthData.find(d => d._id === 'income')?.total || 0;
        const currentExpenses = currentMonthData.find(d => d._id === 'expense')?.total || 0;
        const previousExpenses = previousMonthData.find(d => d._id === 'expense')?.total || 0;

        // Calculate trends
        const calculateTrend = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous) * 100;
        };

        const currentBalance = currentIncome - currentExpenses;
        const previousBalance = previousIncome - previousExpenses;

        // Add monthly spending calculation
        const monthlySpending = await Transaction.aggregate([
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
        ]);

        // Process monthly spending data with all 6 months
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return {
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                monthName: monthNames[d.getMonth()]
            };
        }).reverse();

        const spendingData = last6Months.map(month => {
            const monthData = monthlySpending.find(
                item => item._id.year === month.year && item._id.month === month.month
            );
            return {
                month: month.monthName,
                amount: monthData?.amount || 0,
                color: '#4ADE80'
            };
        });

        // Return the data with trends
        return json({
            totalIncome: currentIncome,
            totalExpenses: currentExpenses,
            balance: currentBalance,
            monthlySpending: spendingData,
            trends: {
                income: calculateTrend(currentIncome, previousIncome),
                expenses: calculateTrend(currentExpenses, previousExpenses),
                balance: calculateTrend(currentBalance, previousBalance)
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
};