'use client';

import React, { useState, useEffect } from 'react';
import { callTrafficAPI, TrafficResponse } from '../../lib/api';

const ImpactComponent = () => {
  const [prediction, setPrediction] = useState<TrafficResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await callTrafficAPI('/api/predict', {
          node_id: 'Network-Avg',
          queue_length: 80,
          hour: 14
        });
        setPrediction(data);
      } catch (err: any) {
        setError('Failed to connect to backend.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-[#0d1117] text-white font-sans rounded-xl min-h-screen">
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 p-4 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 text-sm animate-pulse">
          Loading AI analysis...
        </div>
      )}
      {/* Top Header Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8 text-xs font-medium tracking-wide border-b border-white/10 pb-4">
        <div>
          <p className="text-gray-500 mb-1">AVG DELAY</p>
          <p className="text-cyan-400">↓ 15% today</p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">AVG DELAY</p>
          <p className="text-gray-400">vs baseline</p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">AVG DELAY</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-orange-400">26 manual</span>
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">AVG DELAY</p>
          <p className="text-cyan-400">↑ 16% today</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Agyn impact</h1>
        {/* Top right subtle logo/icon */}
        <div className="flex flex-col items-center gap-1 opacity-50">
          <div className="w-4 h-4 bg-cyan-500 blur-[2px] rounded-full"></div>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
            <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Glassmorphism Dashboard Container */}
      <div className="flex flex-col gap-6">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Block */}
          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors">
            <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-4">AVG DELAY · BEFORE → AFTER</p>
            <div className="flex items-center gap-4 mb-3">
              <h2 className="text-5xl font-light text-gray-400">2:31</h2>
              <span className="text-3xl text-gray-500">→</span>
              <h2 className="text-5xl font-semibold text-white">
                {prediction 
                  ? `${Math.floor(prediction.delay_pred / 60)}:${(prediction.delay_pred % 60).toString().padStart(2, '0')}` 
                  : '1:42'}
              </h2>
            </div>
            <div className="inline-block bg-cyan-400/10 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              -33%
            </div>
          </div>

          {/* Right Block */}
          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors relative overflow-hidden group">
            {/* Subtle glow */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors pointer-events-none"></div>
            
            <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-4 relative z-10">STOP-AND-GO TRAFFIC</p>
            <h2 className="text-5xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] relative z-10">-51%</h2>
            <p className="text-sm text-gray-400 font-medium relative z-10">Boston Intersection pattern (Project Green Light)</p>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-2">+23%</h3>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Throughput</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-2">71% → 89%</h3>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Bus Punctuality</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-2">-21%</h3>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Buses at Red</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-2">4.7 t</h3>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">CO2 Today</p>
          </div>
        </div>

        {/* Center Chart (AVG DELAY BY DAY) */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-8 relative">
          <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-10">AVG DELAY BY DAY · VS BASELINE</p>
          
          <div className="h-48 w-full flex items-end justify-between gap-4 px-2 relative z-10">
            {/* Horizontal baseline line */}
            <div className="absolute top-1/4 left-0 w-full h-[1px] border-t border-dashed border-gray-600/50 z-0"></div>

            {/* Bars */}
            <div className="w-full flex flex-col items-center gap-4 z-10 group cursor-pointer">
              <div className="w-full bg-amber-400 rounded-t-sm h-[80%] shadow-[0_0_15px_rgba(251,191,36,0.3)] group-hover:bg-amber-300 transition-colors"></div>
              <span className="text-xs text-gray-500 font-medium group-hover:text-white transition-colors">Mon</span>
            </div>
            <div className="w-full flex flex-col items-center gap-4 z-10 group cursor-pointer">
              <div className="w-full bg-amber-400 rounded-t-sm h-[75%] shadow-[0_0_15px_rgba(251,191,36,0.3)] group-hover:bg-amber-300 transition-colors"></div>
              <span className="text-xs text-gray-500 font-medium group-hover:text-white transition-colors">Tue</span>
            </div>
            <div className="w-full flex flex-col items-center gap-4 z-10 group cursor-pointer">
              <div className="w-full bg-amber-400 rounded-t-sm h-[85%] shadow-[0_0_15px_rgba(251,191,36,0.3)] group-hover:bg-amber-300 transition-colors"></div>
              <span className="text-xs text-gray-500 font-medium group-hover:text-white transition-colors">Wed</span>
            </div>
            <div className="w-full flex flex-col items-center gap-4 z-10 group cursor-pointer">
              <div className="w-full bg-amber-400 rounded-t-sm h-[70%] shadow-[0_0_15px_rgba(251,191,36,0.3)] group-hover:bg-amber-300 transition-colors"></div>
              <span className="text-xs text-gray-500 font-medium group-hover:text-white transition-colors">Thu</span>
            </div>
            {/* AI optimized days in cyan */}
            <div className="w-full flex flex-col items-center gap-4 z-10 group cursor-pointer">
              <div className="w-full bg-cyan-400 rounded-t-sm h-[40%] shadow-[0_0_20px_rgba(34,211,238,0.5)] group-hover:bg-cyan-300 transition-colors"></div>
              <span className="text-xs text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">Fri</span>
            </div>
            <div className="w-full flex flex-col items-center gap-4 z-10 group cursor-pointer">
              <div className="w-full bg-amber-400 rounded-t-sm h-[65%] shadow-[0_0_15px_rgba(251,191,36,0.3)] group-hover:bg-amber-300 transition-colors"></div>
              <span className="text-xs text-gray-500 font-medium group-hover:text-white transition-colors">Sat</span>
            </div>
            <div className="w-full flex flex-col items-center gap-4 z-10 group cursor-pointer">
              <div className="w-full bg-cyan-400 rounded-t-sm h-[35%] shadow-[0_0_20px_rgba(34,211,238,0.5)] group-hover:bg-cyan-300 transition-colors"></div>
              <span className="text-xs text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">Sun</span>
            </div>
          </div>
        </div>

        {/* Bottom (TOP NODES BY IMPROVEMENT) */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-8">
          <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-6">TOP NODES BY IMPROVEMENT</p>
          
          <div className="space-y-6">
            {/* Node 1 */}
            <div className="flex items-center gap-8">
              <span className="text-sm font-medium text-gray-300 w-48 truncate">Turan — Kabanbai Batyr</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]" style={{ width: '85%' }}></div>
              </div>
              <span className="text-sm font-bold text-cyan-400 w-12 text-right">-38%</span>
            </div>
            
            {/* Node 2 */}
            <div className="flex items-center gap-8">
              <span className="text-sm font-medium text-gray-300 w-48 truncate">Mangilik El — Dostyk</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400/80 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.4)]" style={{ width: '65%' }}></div>
              </div>
              <span className="text-sm font-bold text-cyan-400/80 w-12 text-right">-29%</span>
            </div>

            {/* Node 3 */}
            <div className="flex items-center gap-8">
              <span className="text-sm font-medium text-gray-300 w-48 truncate">Saryarka — Beibitshilik</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400/60 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.2)]" style={{ width: '50%' }}></div>
              </div>
              <span className="text-sm font-bold text-cyan-400/60 w-12 text-right">-24%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImpactComponent;
