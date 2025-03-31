import { useState } from "react";

export default function IncomeTracking() {
  const [incomeSources] = useState([
    {
      source: 'Salary',
      amount: 3500,
      frequency: 'Monthly',
      lastReceived: '2024-01-15',
      trend: '+5%',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      source: 'Freelance',
      amount: 1200,
      frequency: 'Variable',
      lastReceived: '2024-01-20',
      trend: '+12%',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      source: 'Investments',
      amount: 300,
      frequency: 'Monthly',
      lastReceived: '2024-01-01',
      trend: '+2.5%',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ]);

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-xl backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Income Sources</h3>
        <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
          Add Source
        </button>
      </div>
      
      <div className="grid gap-4">
        {incomeSources.map((income, index) => (
          <div 
            key={index}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white/[0.05] to-transparent p-4 transition-all duration-300 hover:from-white/[0.1]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  {income.icon}
                </div>
                <div>
                  <h4 className="font-medium text-white">{income.source}</h4>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-400">{income.frequency}</span>
                    <span className="mx-2 text-gray-600">•</span>
                    <span className="text-xs text-gray-400">Last: {new Date(income.lastReceived).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-white">${income.amount}</p>
                <span className="text-xs text-emerald-400">{income.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}