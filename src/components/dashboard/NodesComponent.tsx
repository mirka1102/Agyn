'use client';

import React, { useState } from 'react';
import { callTrafficAPI, TrafficResponse } from '../../lib/api';

const NodesComponent = () => {
  const [prediction, setPrediction] = useState<TrafficResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');

  const handleAccept = async () => {
    console.log('[NodesComponent] handleAccept clicked');
    try {
      setLoading(true);
      setError(null);
      const data = await callTrafficAPI('/api/predict', {
        node_id: 'TK-04',
        queue_length: 240,
        hour: new Date().getHours()
      });
      setPrediction(data);
    } catch (err: any) {
      setError('Failed to reach AI backend (port 8000). Please check if it is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-[#0d1117] text-white font-sans rounded-xl min-h-screen">
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

      {/* Main Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Turan — Kabanbai Batyr</h1>
        <p className="text-xs text-gray-500 tracking-widest font-medium">NODE TK-04 · 6 LANES · RADAR-VIDEO</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Status) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Signal Phase & Timer */}
          <div className="flex items-center gap-8 bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/5">
            {/* Timer Circle */}
            <div className="relative w-36 h-36 rounded-full border-4 border-[#0d1117] bg-[#0d1117] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.15)]">
              {/* Outer Cyan Ring representing current phase progress */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="68" stroke="rgba(34,211,238,0.2)" strokeWidth="4" fill="transparent" />
                <circle cx="72" cy="72" r="68" stroke="#22d3ee" strokeWidth="4" fill="transparent" strokeDasharray="427" strokeDashoffset="300" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </svg>
              {/* Left semi-circle blue fill */}
              <div className="absolute left-1 top-1 bottom-1 w-[calc(50%-1px)] bg-cyan-500/20 rounded-l-full"></div>
              
              <span className="text-4xl font-bold text-white z-10 drop-shadow-md">00:18</span>
              <span className="text-[10px] text-cyan-400 font-bold tracking-widest z-10 mt-1">GREEN</span>
            </div>

            {/* Signal Phase Info */}
            <div>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-2">SIGNAL PHASE · LIVE</p>
              <h2 className="text-2xl font-semibold text-white mb-2">NW → SE green</h2>
              <p className="text-sm text-gray-400">Cycle 120s · phase 3 of 4</p>
            </div>
          </div>

          {/* TIMING - NOW VS AI */}
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/5">
            <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-6">TIMING — NOW VS AI</p>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-2">NOW</p>
                <p className="text-2xl font-semibold text-white mb-4">Cycle 120s</p>
                <p className="text-sm text-gray-400">Reason: NW queue 240 m, SE demand falling.</p>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-cyan-400/70 font-bold tracking-widest mb-2">AI SUGGESTS</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-2xl font-semibold text-cyan-400">
                    {prediction ? `Cycle ${120 + prediction.delay_pred}s` : 'Cycle 134s'}
                  </p>
                  <p className="text-sm font-medium text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                    {prediction ? prediction.action : 'NW +8s'}
                  </p>
                </div>
              </div>
            </div>

            <button onClick={handleAccept} disabled={loading} className="relative z-10 bg-cyan-400 hover:bg-cyan-300 text-[#0d1117] font-semibold py-2.5 px-6 rounded-full text-sm transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] disabled:opacity-50 cursor-pointer">
              {loading ? 'Processing...' : 'Apply recommendation'}
            </button>
          </div>

          {/* APPROACH QUEUES */}
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/5">
            <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-6">APPROACH QUEUES</p>
            
            <div className="space-y-5 max-w-md">
              {/* N */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500 w-4">N</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]" style={{ width: '80%' }}></div>
                </div>
                <span className="text-sm font-medium text-red-500 w-12 text-right">240 m</span>
              </div>
              {/* S */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500 w-4">S</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]" style={{ width: '30%' }}></div>
                </div>
                <span className="text-sm font-medium text-yellow-500 w-12 text-right">90 m</span>
              </div>
              {/* W */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500 w-4">W</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" style={{ width: '15%' }}></div>
                </div>
                <span className="text-sm font-medium text-green-500 w-12 text-right">40 m</span>
              </div>
              {/* E */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500 w-4">E</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]" style={{ width: '40%' }}></div>
                </div>
                <span className="text-sm font-medium text-yellow-500 w-12 text-right">120 m</span>
              </div>
            </div>
          </div>

          {/* PERCEPTION */}
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/5 relative overflow-hidden">
            <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-6">PERCEPTION · RADAR-VIDEO</p>
            <div className="flex gap-16">
              <div>
                <p className="text-2xl font-semibold text-white mb-1">98%</p>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest">DETECTION</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white mb-1">±30 cm</p>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest">TRACKING</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white mb-1">350 m</p>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest">RANGE</p>
              </div>
            </div>
            
            {/* Red accent box on the right */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-6 bg-red-500/20 rounded flex items-center justify-center">
              <div className="w-1.5 h-3 bg-red-500 rounded-sm"></div>
            </div>
          </div>

        </div>

        {/* Right Column (Control) */}
        <div className="flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-8">Control</h3>
            
            <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-3">MODE</p>
            <div className="flex bg-[#0d1117] rounded-full p-1 mb-10 border border-white/5">
              <button
                onClick={() => { console.log('[NodesComponent] mode → auto'); setMode('auto'); }}
                className={`flex-1 text-sm font-semibold py-2.5 px-4 rounded-full transition-colors cursor-pointer ${mode === 'auto' ? 'bg-cyan-400 text-[#0d1117] shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-gray-400 hover:text-white'}`}
              >
                Auto (AI)
              </button>
              <button
                onClick={() => { console.log('[NodesComponent] mode → manual'); setMode('manual'); }}
                className={`flex-1 text-sm font-medium py-2.5 px-4 rounded-full transition-colors cursor-pointer ${mode === 'manual' ? 'bg-cyan-400 text-[#0d1117] shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-gray-400 hover:text-white'}`}
              >
                Manual
              </button>
            </div>

            <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-3">RECOMMENDATION</p>
            
            {/* AI Recommendation Card */}
            <div className="bg-[#0a1922] border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-400/50 transition-all">
               {/* Top right glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
               {/* Left glowing edge */}
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
               
               <h4 className="text-lg font-semibold text-white mb-3 relative z-10 pr-6">
                 {prediction ? prediction.action : 'Extend NW green by +8s'}
               </h4>
               <p className="text-sm text-gray-400 mb-6 relative z-10 leading-relaxed">
                 SE demand falling - NW queue 240 m.
                 <br/>Predicted delay: {prediction ? prediction.delay_pred : '--'}s.
               </p>
               
               <div className="flex items-center justify-between mb-8 relative z-10">
                 <span className="text-xs text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full font-medium">AI Recommended</span>
                 <span className="text-xs text-cyan-400 font-bold">
                   {prediction ? `${(prediction.confidence * 100).toFixed(0)}%` : '94%'}
                 </span>
               </div>
               
               <div className="flex items-center justify-between relative z-10">
                 <button onClick={handleAccept} disabled={loading} className="relative z-10 cursor-pointer bg-cyan-400 hover:bg-cyan-300 text-[#0d1117] text-sm font-semibold py-2 px-8 rounded-full transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] disabled:opacity-50">
                   {loading ? 'Processing...' : 'Accept'}
                 </button>
                 <button
                   onClick={() => console.log('[NodesComponent] Details clicked — TK-04')}
                   className="text-sm text-gray-400 hover:text-white transition-colors font-medium cursor-pointer"
                 >
                   Details
                 </button>
               </div>
            </div>
            
            <div className="mt-6 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1 flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
              <p className="text-xs text-gray-500 leading-relaxed">
                AI cycle recommendation active since 01:50
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodesComponent;
