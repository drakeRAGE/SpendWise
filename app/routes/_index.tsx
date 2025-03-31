import type { MetaFunction } from "@remix-run/node";
import DashboardOverview from "~/components/DashboardOverview";

export const meta: MetaFunction = () => {
  return [
    { title: "SpendWise - Personal Expense Tracker" },
    { name: "description", content: "Track your personal expenses with SpendWise" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DashboardOverview />
      </main>
    </div>
  );
}
