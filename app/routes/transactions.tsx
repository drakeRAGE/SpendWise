import TransactionHistory from "~/components/TransactionHistory";

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <TransactionHistory />
      </div>
    </div>
  );
}