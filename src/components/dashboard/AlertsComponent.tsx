'use client';

import React, { useState, useEffect } from 'react';
import { callTrafficAPI, TrafficResponse } from '../../lib/api';

const AlertsComponent = () => {
  const [prediction, setPrediction] = useState<TrafficResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await callTrafficAPI('/api/predict', {
          node_id: 'Saryarka',
          queue_length: 150,
          hour: new Date().getHours()
        });
        setPrediction(data);
      } catch (err: any) {
        setError('Failed to reach AI backend.');
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

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-semibold">Incidents</h1>
        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Incidents Feed) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Top Active Banner */}
          <div className="bg-cyan-900/20 backdrop-blur-md border-2 border-cyan-500/50 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(34,211,238,0.1)]">
            {/* Background glow effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded border border-cyan-400/30 flex items-center justify-center bg-cyan-500/10 text-cyan-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Ambulance · Saryarka St → Republican Hospital</h3>
              </div>
              <span className="bg-cyan-400/20 text-cyan-400 text-[10px] font-bold px-3 py-1 rounded tracking-widest border border-cyan-400/30">
                ★ CORRIDOR ACTIVE
              </span>
            </div>

            <p className="text-sm text-cyan-100 mb-8 relative z-10 font-medium opacity-80">
              Green corridor active. 5 nodes held green ahead of the vehicle.
            </p>

            {/* Step Progress Bar */}
            <div className="relative z-10 mb-8 pl-2 pr-4">
              <div className="absolute left-6 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-cyan-900"></div>
              <div className="absolute left-6 w-[60%] top-1/2 -translate-y-1/2 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
              
              <div className="relative flex justify-between">
                {/* Node 1 */}
                <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] z-10 border-2 border-[#0d1117]"></div>
                {/* Node 2 */}
                <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] z-10 border-2 border-[#0d1117]"></div>
                {/* Node 3 */}
                <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] z-10 border-2 border-[#0d1117]"></div>
                {/* Node 4 */}
                <div className="w-4 h-4 rounded-full bg-[#0d1117] border-2 border-cyan-700 z-10"></div>
                {/* Node 5 */}
                <div className="w-4 h-4 rounded-full bg-[#0d1117] border-2 border-cyan-700 z-10"></div>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2">
              <span className="text-xs text-cyan-400/70 font-bold tracking-widest">ETA</span>
              <span className="text-lg text-cyan-400 font-medium">9:40 → 6:18</span>
              <span className="text-xs text-cyan-400/70 ml-2 border border-cyan-500/30 px-2 py-0.5 rounded">- 3:22</span>
            </div>
          </div>

          {/* Incident Feed List */}
          <div>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-4 pl-2">INCIDENT FEED</p>
            
            <div className="space-y-2">
              {/* Item 1 */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 hover:border-white/10 p-4 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Crash · Saryarka — Beibitshilik</h4>
                    <p className="text-xs text-gray-500">3 min ago</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-red-500 tracking-widest">AMBULANCE EN ROUTE</span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 hover:border-white/10 p-4 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Risk hot-zone · Respubliki</h4>
                    <p className="text-xs text-gray-500">now</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-orange-500 tracking-widest">WATCH</span>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 hover:border-white/10 p-4 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Signal fault · Kenesary</h4>
                    <p className="text-xs text-gray-500">12 min ago</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-orange-500 tracking-widest">BACKUP POWER</span>
              </div>

              {/* Item 4 */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 hover:border-white/10 p-4 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Congestion cleared · Dostyk</h4>
                    <p className="text-xs text-gray-500">20 min ago</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-green-500 tracking-widest">NORMAL</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Predictive hot-zones) */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Predictive hot-zones</h2>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Crash-risk points from hard-braking events and micro-congestion.
          </p>

          {/* Map/Abstract visual area */}
          <div className="bg-[#161b22] border border-white/5 rounded-2xl h-64 relative overflow-hidden mb-6 flex items-center justify-center">
             {/* Abstract Blurs representing hot zones */}
             <div className="absolute w-32 h-32 bg-red-500/60 rounded-full blur-[40px] transform -translate-x-4 -translate-y-4 mix-blend-screen"></div>
             <div className="absolute w-24 h-24 bg-orange-500/50 rounded-full blur-[30px] transform translate-x-12 translate-y-8 mix-blend-screen"></div>
             <div className="absolute w-12 h-12 bg-green-500/60 rounded-full blur-[20px] transform translate-x-4 translate-y-16 mix-blend-screen"></div>
             
             {/* Core dots */}
             <div className="absolute w-2 h-2 bg-red-400 rounded-full shadow-[0_0_10px_rgba(248,113,113,1)] transform -translate-x-6 -translate-y-6"></div>
             <div className="absolute w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_10px_rgba(251,146,60,1)] transform translate-x-12 translate-y-8"></div>
             <div className="absolute w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,1)] transform translate-x-2 translate-y-14"></div>
          </div>

          <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-4 pl-1">RANKED BY RISK</p>
          
          <div className="bg-white/5 border border-white/5 rounded-xl p-2">
            <ul className="space-y-1">
              <li className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div>
                  <span className="text-sm text-gray-200">Saryarka — Beibitshilik</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-red-500 tracking-widest">HIGH</span>
                  {prediction && <span className="text-[10px] text-gray-400">Delay: {prediction.delay_pred}s</span>}
                </div>
              </li>
              
              <li className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)]"></div>
                  <span className="text-sm text-gray-200">Respubliki — Turan</span>
                </div>
                <span className="text-[10px] font-bold text-orange-500 tracking-widest">MEDIUM</span>
              </li>

              <li className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                  <span className="text-sm text-gray-200">Kabanbai — Dostyk</span>
                </div>
                <span className="text-[10px] font-bold text-green-500 tracking-widest">LOW</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AlertsComponent;
