import { connectDB } from '../../src/config/db';
import { Transaction } from '../../src/models/schema';
import { json, type LoaderFunction, type ActionFunction } from '@remix-run/node';

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

export const action: ActionFunction = async ({ request }) => {
    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
        await connectDB();
        const data = await request.json();
        
        const newTransaction = new Transaction({
            date: new Date(data.date),
            description: data.description,
            type: data.type,
            income_category_id: data.type === 'income' ? data.income_category_id : null,
            expense_category_id: data.type === 'expense' ? data.expense_category_id : null,
            payment_mode: data.payment_mode,
            amount: data.amount
        });

        await newTransaction.save();
        return json(newTransaction);
    } catch (error) {
        console.error('Error adding transaction:', error);
        return json(
            { error: 'Failed to add transaction' },
            { status: 500 }
        );
    }
};