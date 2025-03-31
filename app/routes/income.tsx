import IncomeTracking from "~/components/IncomeTracking";

export default function IncomePage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Income Management</h1>
          <p className="mt-2 text-gray-400">Track and manage your income sources</p>
        </div>
        <IncomeTracking />
      </div>
    </div>
  );
}