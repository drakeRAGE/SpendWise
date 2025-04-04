import { useState } from "react";
// Remove this line from imports
import IncomeTracking from "./IncomeTracking";

import { useFinance } from "~/context/FinanceContext";

export default function DashboardOverview() {
    const [selectedPeriod, setSelectedPeriod] = useState('1M');
    const {
        getTotalIncome,
        getTotalExpenses,
        getRemainingBalance,
        monthlySpending,
        upcomingBills
    } = useFinance();

    const getSpendingData = (period: string) => {
        const now = new Date();
        const periods = {
            '1W': 7,
            '1M': 30,
            '3M': 90,
            '1Y': 365
        };

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const colors = ['#22D3EE', '#2DD4BF', '#34D399', '#4ADE80', '#A3E635', '#FCD34D'];

        return monthNames.map((month, index) => ({
            month,
            amount: index < 2 ? 0 : Math.floor(Math.random() * 3000) + 1000, // Sample data
            color: colors[index]
        }));
    };

    const financialData = {
        totalIncome: getTotalIncome(),
        totalExpenses: getTotalExpenses(),
        remainingBalance: getRemainingBalance(),
        monthlySpending: getSpendingData(selectedPeriod),
        upcomingBills
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-semibold text-white">Financial Overview</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:space-x-4">
                    <select className="bg-white/[0.05] border border-white/[0.05] rounded-lg px-4 py-2 text-sm text-white/70">
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>This Year</option>
                    </select>
                    <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent backdrop-blur-xl border border-white/10">
                    <div className="absolute inset-0 bg-[radial-gradient(400px_circle_at_top_right,rgba(34,211,238,0.1),transparent)]"></div>
                    <div className="relative p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-cyan-300">Total Income</p>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                                <svg className="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-white">${financialData.totalIncome}</p>
                        <div className="mt-3 flex items-center text-sm text-cyan-300">
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" />
                            </svg>
                            <span>+12.5% from last month</span>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent backdrop-blur-xl border border-white/10">
                    <div className="absolute inset-0 bg-[radial-gradient(400px_circle_at_top_right,rgba(244,63,94,0.1),transparent)]"></div>
                    <div className="relative p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-rose-300">Total Expenses</p>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10">
                                <svg className="h-5 w-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                                </svg>
                            </span>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-white">${financialData.totalExpenses}</p>
                        <div className="mt-3 flex items-center text-sm text-rose-300">
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1V9a1 1 0 112 0v3.586l4.293-4.293a1 1 0 011.414 0L16 10.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0L13 10.414 9.414 14H12z" />
                            </svg>
                            <span>+8.2% from last month</span>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent backdrop-blur-xl border border-white/10">
                    <div className="absolute inset-0 bg-[radial-gradient(400px_circle_at_top_right,rgba(16,185,129,0.1),transparent)]"></div>
                    <div className="relative p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-emerald-300">Balance</p>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </span>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-white">${financialData.remainingBalance}</p>
                        <div className="mt-3 flex items-center text-sm text-emerald-300">
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                            </svg>
                            <span>Updated just now</span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Charts and Income Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <h3 className="text-lg font-semibold text-white">Spending Analytics</h3>
                        <div className="flex flex-wrap gap-2">
                            {['1W', '1M', '3M', '1Y'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                                        ${period === selectedPeriod
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : 'text-white/50 hover:text-white/80'}`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative h-[300px] mt-4">
                        <div className="absolute bottom-0 w-full flex items-end justify-between space-x-2">
                            {financialData.monthlySpending.map((month, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center group">
                                    <div className="relative w-full">
                                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-white text-sm">${month.amount}</span>
                                        </div>
                                        <div
                                            className="w-full rounded-t-lg transition-all duration-500 group-hover:translate-y-[-4px]"
                                            style={{
                                                height: `${(month.amount / 5000) * 250}px`,
                                                background: `linear-gradient(to top, ${month.color}40, ${month.color}20)`
                                            }}
                                        >
                                            <div
                                                className="h-1 w-full rounded-t-lg"
                                                style={{ backgroundColor: month.color }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className="mt-2 text-sm text-gray-400">{month.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Upcoming Bills</h3>
                        <button className="text-white/50 hover:text-white/80 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-4">
                        {financialData.upcomingBills.map((bill, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-xl bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-medium text-white">{bill.title}</h4>
                                        <div className="flex items-center mt-1">
                                            <span className="text-xs text-gray-400">{bill.category}</span>
                                            <span className="mx-2 text-gray-600">•</span>
                                            <span className="text-xs text-gray-400">Due {new Date(bill.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className="font-medium text-white bg-white/10 px-3 py-1 rounded-full">
                                        ${bill.amount}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}