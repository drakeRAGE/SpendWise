import { connectDB } from '../../src/config/db';
import { Transaction } from '../../src/models/schema';
import { json, type LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
    try {
        await connectDB();

        const transactions = await Transaction.find()
            .sort({ date: -1 })
            .lean();

        return json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
};