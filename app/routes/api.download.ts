import { json, type LoaderFunction } from '@remix-run/node';
import { connectDB } from '../../src/config/db';
import { Transaction } from '../../src/models/schema';

export const loader: LoaderFunction = async ({ request }) => {
    try {
        await connectDB();
        const url = new URL(request.url);
        const period = url.searchParams.get('period') || '1M';

        const now = new Date();
        const start = new Date();

        switch (period) {
            case '1M':
                start.setMonth(now.getMonth() - 1);
                break;
            case '3M':
                start.setMonth(now.getMonth() - 3);
                break;
            case '1Y':
                start.setFullYear(now.getFullYear() - 1);
                break;
        }

        const transactions = await Transaction.find({
            date: {
                $gte: start,
                $lte: now
            }
        }).lean();

        // Format the transactions before sending
        const formattedTransactions = transactions.map(t => ({
            date: t.date,
            type: t.type,
            category: t.type === 'income' ? t.income_category_id : t.expense_category_id || 'Uncategorized',
            amount: Number(t.amount),
            description: t.description || ''
        }));

        return json({ transactions: formattedTransactions, period });
    } catch (error) {
        return json({ error: 'Failed to fetch transaction data' }, { status: 500 });
    }
};