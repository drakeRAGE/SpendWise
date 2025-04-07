// Add useEffect and update imports
import { useState, useEffect } from "react";


// Update the DashboardData interface
interface DashboardData {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    monthlySpending: {
        month: string;
        amount: number;
        color: string;
    }[];
    trends: {
        income: number;
        expenses: number;
        balance: number;
    };
}

interface UpcomingBill {
    title: string;
    category: string;
    amount: number;
    dueDate: string;
}

export default function DashboardOverview() {
    const [selectedPeriod, setSelectedPeriod] = useState('1M');
    // Update the initial state
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        monthlySpending: [],
        trends: {
            income: 0,
            expenses: 0,
            balance: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sample upcoming bills - replace with real data when available
    const upcomingBills: UpcomingBill[] = [
        {
            title: "Internet Bill",
            category: "Utilities",
            amount: 420,
            dueDate: "2025-05-20"
        },
        {
            title: "Clothes",
            category: "Utilities",
            amount: 2500,
            dueDate: "2025-05-25"
        },
        {
            title: 'Food',
            category: 'Groceries',
            amount: 2000,
            dueDate: '2025-05-28'
        }
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard');
                if (!response.ok) throw new Error('Failed to fetch dashboard data');
                const data = await response.json();
                setDashboardData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center text-gray-400 py-4">Loading dashboard data...</div>;
    if (error) return <div className="text-center text-red-400 py-4">{error}</div>;

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    // Add this helper function before the return statement
    // Update the getTrendDisplay function
    const getTrendDisplay = (trend: number) => {
        const isPositive = trend > 0;
        const absValue = Math.abs(trend);
        return {
            text: `${isPositive ? '+' : '-'}${absValue.toFixed(1)}%`,
            className: isPositive ? 'text-emerald-400' : 'text-rose-400'
        };
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-semibold text-white">Financial Overview</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:space-x-4">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="bg-white/[0.05] border border-white/[0.05] rounded-lg px-4 py-2 text-sm text-white/70"
                    >
                        <option value="1M">Last 30 Days</option>
                        <option value="3M">Last 90 Days</option>
                        <option value="1Y">This Year</option>
                    </select>
                    <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: 'Total Income',
                        amount: dashboardData.totalIncome,
                        trend: getTrendDisplay(dashboardData.trends?.income || 0),
                        color: 'cyan',
                        icon: (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )
                    },
                    {
                        title: 'Total Expenses',
                        amount: dashboardData.totalExpenses,
                        trend: getTrendDisplay(dashboardData.trends?.expenses || 0), // Add trend
                        color: 'rose',
                        icon: (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                        )
                    },
                    {
                        title: 'Balance',
                        amount: dashboardData.balance,
                        trend: getTrendDisplay(dashboardData.trends?.balance || 0), // Add trend
                        color: 'emerald',
                        icon: (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        )
                    }
                ].map((stat, index) => (
                    <div key={index} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent backdrop-blur-xl border border-white/10">
                        <div className="absolute inset-0 bg-[radial-gradient(400px_circle_at_top_right,rgba(59,130,246,0.1),transparent)]"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-blue-300">{stat.title}</p>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {stat.icon}
                                    </svg>
                                </span>
                            </div>
                            <p className="mt-4 text-3xl font-bold text-white">{formatCurrency(stat.amount)}</p>
                            <div className="mt-3 flex items-center text-sm">
                                <svg className={`h-4 w-4 mr-1 ${stat.trend.className}`} fill="currentColor" viewBox="0 0 20 20">
                                    {stat.trend.text.startsWith('+') ? (
                                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" />
                                    ) : (
                                        <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1V9a1 1 0 112 0v3.586l4.293-4.293a1 1 0 011.414 0L16 10.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0L13 10.414 9.414 14H12z" />
                                    )}
                                </svg>
                                <span className={stat.trend.className}>{stat.trend.text} from last month</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts and Upcoming Bills */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Spending Analytics */}
                <div className="lg:col-span-2 bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <h3 className="text-lg font-semibold text-white">Spending Analytics</h3>
                        <div className="flex flex-wrap gap-2">
                            {['1W', '1M', '3M', '1Y'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${period === selectedPeriod
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'text-white/50 hover:text-white/80'
                                        }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative h-[300px] mt-4">
                        <div className="absolute bottom-0 w-full flex items-end justify-between space-x-2">
                            {dashboardData.monthlySpending.map((month, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center group">
                                    <div className="relative w-full">
                                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-white text-sm">{formatCurrency(month.amount)}</span>
                                        </div>
                                        <div
                                            className="w-full rounded-t-lg transition-all duration-500 group-hover:translate-y-[-4px]"
                                            style={{
                                                height: `${(month.amount / Math.max(...dashboardData.monthlySpending.map(m => m.amount))) * 250}px`,
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

                {/* Upcoming Bills */}
                <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Upcoming Bills</h3>
                    </div>
                    <div className="space-y-4">
                        {upcomingBills.map((bill, index) => (
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
                                        {formatCurrency(bill.amount)}
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