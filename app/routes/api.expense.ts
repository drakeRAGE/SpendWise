import { connectDB } from '../../src/config/db';
import { Transaction } from '../../src/models/schema';
import { json, type LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
    try {
        await connectDB();

        // Get all expense transactions
        const expenses = await Transaction.find({ type: 'expense' })
            .sort({ date: -1 })
            .lean();

        // Get expense counts by category
        const categoryCounts = await Transaction.aggregate([
            { $match: { type: 'expense' } },
            { $group: { _id: '$expense_category_id', count: { $sum: 1 } } }
        ]);

        return json({
            expenses,
            categoryCounts: Object.fromEntries(
                categoryCounts.map(({ _id, count }) => [_id, count])
            )
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }
};