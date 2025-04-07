import * as XLSX from 'xlsx';

interface Transaction {
    date: Date;
    type: string;
    category: string;
    amount: number;
    description?: string;
}

export const generateExcelReport = (transactions: Transaction[], period: string) => {
    // Format data for Excel
    const formattedData = transactions.map(item => ({
        Date: new Date(item.date).toLocaleDateString('en-IN'),
        Type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
        Category: item.category || 'Uncategorized',
        Amount: Number(item.amount).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }),
        Description: item.description || '-'
    }));

    // Add summary section
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const summary = [
        { Summary: 'Total Income', Amount: income.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }) },
        { Summary: 'Total Expenses', Amount: expenses.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }) },
        { Summary: 'Net Balance', Amount: (income - expenses).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }) }
    ];

    // Create workbook and worksheets
    const wb = XLSX.utils.book_new();
    
    // Add transactions worksheet
    const ws_transactions = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(wb, ws_transactions, 'Transactions');

    // Add summary worksheet
    const ws_summary = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, ws_summary, 'Summary');

    // Generate filename with date range
    const today = new Date();
    const fileName = `SpendWise_Report_${period}_${today.toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
};