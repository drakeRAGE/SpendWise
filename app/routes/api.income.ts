import { connectDB } from '../../src/config/db';
import { Transaction } from '../../src/models/schema';
import { json, type LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
    try {
        await connectDB();

        // Get all income transactions
        const incomes = await Transaction.find({ type: 'income' })
            .sort({ date: -1 })
            .lean();

        // Group incomes by category and calculate totals
        const incomesByCategory = await Transaction.aggregate([
            { 
                $match: { type: 'income' }
            },
            {
                $group: {
                    _id: '$income_category_id',
                    total: { $sum: { $toDouble: '$amount' } },
                    lastReceived: { $max: '$date' },
                    count: { $sum: 1 }
                }
            }
        ]);

        return json({ incomes, incomesByCategory });
    } catch (error) {
        console.error('Error fetching incomes:', error);
        return json({ error: 'Failed to fetch incomes' }, { status: 500 });
    }
};