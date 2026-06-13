'use client';

import React, { useState } from 'react';
import { Map, Grid, Sparkles, AlertTriangle, BarChart2 } from 'lucide-react';
import NodesComponent from '../components/dashboard/NodesComponent';
import AIComponent from '../components/dashboard/AIComponent';
import AlertsComponent from '../components/dashboard/AlertsComponent';
import ImpactComponent from '../components/dashboard/ImpactComponent';
import { callTrafficAPI, TrafficResponse } from '../lib/api';

export default function TrafficCommandCenter() {
  const [activeTab, setActiveTab] = useState('map');
  const [actionResults, setActionResults] = useState<Record<string, TrafficResponse | null>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const handleAction = async (nodeId: string, queueLength: number) => {
    console.log(`[page] handleAction clicked — node: ${nodeId}, queue: ${queueLength}`);
    setActionLoading(prev => ({ ...prev, [nodeId]: true }));
    try {
      const data = await callTrafficAPI('/api/predict', {
        node_id: nodeId,
        queue_length: queueLength,
        hour: new Date().getHours(),
      });
      console.log(`[page] handleAction result for ${nodeId}:`, data);
      setActionResults(prev => ({ ...prev, [nodeId]: data }));
    } catch (err) {
      console.error(`[page] handleAction failed for ${nodeId}:`, err);
    } finally {
      setActionLoading(prev => ({ ...prev, [nodeId]: false }));
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0d1117] text-white flex font-sans">

      {/* Left Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col p-6 flex-shrink-0">
        <div className="text-2xl font-bold mb-10 text-white">Ağyn</div>

        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'map'
                ? 'bg-cyan-950/30 border border-cyan-500/50 text-cyan-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Map size={20} />
            <span className="font-medium">Map</span>
          </button>

          <button
            onClick={() => setActiveTab('nodes')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'nodes'
                ? 'bg-cyan-950/30 border border-cyan-500/50 text-cyan-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Grid size={20} />
            <span className="font-medium">Nodes</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'ai'
                ? 'bg-cyan-950/30 border border-cyan-500/50 text-cyan-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Sparkles size={20} />
            <span className="font-medium">AI</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'alerts'
                ? 'bg-cyan-950/30 border border-cyan-500/50 text-cyan-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <AlertTriangle size={20} />
            <span className="font-medium">Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'impact'
                ? 'bg-cyan-950/30 border border-cyan-500/50 text-cyan-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <BarChart2 size={20} />
            <span className="font-medium">Impact</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'map' && (
          <>
            {/* Center Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
              {/* Top Stats */}
              <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
                <div>
                  <div className="text-xs text-cyan-400 mb-1 tracking-wider font-semibold uppercase">AVG DELAY</div>
                  <div className="text-sm text-cyan-400/80">+18% today</div>
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1 tracking-wider font-semibold uppercase">NODES ON AI</div>
                  <div className="text-sm text-yellow-500 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    26 manual
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1 tracking-wider font-semibold uppercase">ASTANA - LIVE NETWORK</div>
                  <div className="text-sm text-white">168 nodes · 142 on AI</div>
                </div>
              </div>

              {/* Map Container Placeholder */}
              <div className="flex-1 flex items-center justify-center p-20">
                <div className="w-full max-w-4xl aspect-[4/3] border border-cyan-500/30 rounded-lg overflow-hidden relative shadow-[0_0_30px_rgba(6,182,212,0.15)] bg-[#1a212b]">
                  {/* Placeholder Map Pattern/Graphic */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none"
                       style={{
                         backgroundImage: 'linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)',
                         backgroundSize: '40px 40px'
                       }}>
                  </div>

                  {/* Map Centered Label */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold text-gray-300 tracking-wide mb-2">Astana</h2>
                      <h3 className="text-2xl text-gray-400">Астана</h3>
                    </div>
                  </div>

                  {/* Decorative Nodes/Lines representing the network */}
                  <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] z-10"></div>
                  <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] z-10"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)] z-10"></div>
                  <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] z-10"></div>

                  {/* Connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0">
                     <line x1="33%" y1="25%" x2="25%" y2="50%" stroke="white" strokeWidth="1" />
                     <line x1="25%" y1="50%" x2="75%" y2="66%" stroke="white" strokeWidth="1" />
                     <line x1="75%" y1="66%" x2="66%" y2="33%" stroke="white" strokeWidth="1" />
                     <line x1="66%" y1="33%" x2="33%" y2="25%" stroke="white" strokeWidth="1" />
                     <line x1="25%" y1="50%" x2="66%" y2="33%" stroke="white" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-6 left-6 flex items-center space-x-6 text-xs text-gray-400 tracking-wider font-medium">
                <div className="flex items-center">
                   <div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_5px_rgba(34,197,94,0.6)]"></div>
                   OPTIMAL
                </div>
                <div className="flex items-center">
                   <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2 shadow-[0_0_5px_rgba(234,179,8,0.6)]"></div>
                   MODERATE
                </div>
                <div className="flex items-center">
                   <div className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-[0_0_5px_rgba(239,68,68,0.6)]"></div>
                   CONGESTED
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-[400px] border-l border-white/10 p-6 flex flex-col bg-[#0d1117] z-20 flex-shrink-0">
              <h2 className="text-lg font-semibold mb-6 flex justify-between items-center text-white">
                <span>AI Actions - now</span>
              </h2>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-10">

                {/* Card 1 - Turan — Kabanbai Batyr */}
                <div className="bg-white/5 backdrop-blur-md border border-[#06B6D4] rounded-2xl p-5 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-70"></div>

                  <h3 className="text-white text-lg font-medium mb-4 relative z-10">Turan — Kabanbai Batyr</h3>

                  <div className="flex justify-between items-end mb-6 relative z-10">
                    <div className="text-cyan-400 text-sm font-medium">
                      {actionResults['TK-04'] ? actionResults['TK-04'].action : '-31% queue'}
                    </div>
                    <div className="text-white text-3xl font-light">
                      {actionResults['TK-04']
                        ? `${(actionResults['TK-04'].confidence * 100).toFixed(0)}`
                        : '94'}
                      <span className="text-lg text-gray-400 ml-1">%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAction('TK-04', 240)}
                    disabled={actionLoading['TK-04']}
                    className="w-full bg-[#06B6D4] text-black font-bold rounded-xl py-3 px-4 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-[#08c5e6] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all relative z-10 disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading['TK-04'] ? 'Processing...' : 'Accept'}
                  </button>
                </div>

                {/* Card 2 - Mangilik El — Dostyk */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
                  <h3 className="text-white text-lg font-medium mb-2">Mangilik El — Dostyk</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {actionResults['ME-Dostyk']
                      ? `Action: ${actionResults['ME-Dostyk'].action}`
                      : 'Green corridor for bus №70'}
                  </p>

                  <div className="flex justify-between items-end mb-6">
                    <div className="text-green-400 text-sm font-medium">-22s wait</div>
                    <div className="text-white text-2xl font-light">
                      {actionResults['ME-Dostyk']
                        ? `${(actionResults['ME-Dostyk'].confidence * 100).toFixed(0)}`
                        : '87'}
                      <span className="text-sm text-gray-400 ml-1">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleAction('ME-Dostyk', 120)}
                      disabled={actionLoading['ME-Dostyk']}
                      className="bg-white/10 text-white font-medium rounded-xl py-2 px-6 hover:bg-white/20 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {actionLoading['ME-Dostyk'] ? 'Processing...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => console.log('[page] Details clicked — Mangilik El — Dostyk')}
                      className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>

                {/* Card 3 - Saryarka — Beibitshilik */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
                  <h3 className="text-white text-lg font-medium mb-2">Saryarka — Beibitshilik</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {actionResults['Saryarka']
                      ? `Action: ${actionResults['Saryarka'].action}`
                      : 'Congestion predicted in 12 min, rebalancing phases'}
                  </p>

                  <div className="flex justify-between items-end mb-6">
                    <div className="text-orange-400 text-sm font-medium">preventative</div>
                    <div className="text-white text-2xl font-light">
                      {actionResults['Saryarka']
                        ? `${(actionResults['Saryarka'].confidence * 100).toFixed(0)}`
                        : '78'}
                      <span className="text-sm text-gray-400 ml-1">%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleAction('Saryarka', 200)}
                      disabled={actionLoading['Saryarka']}
                      className="bg-white/10 text-white font-medium rounded-xl py-2 px-6 hover:bg-white/20 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {actionLoading['Saryarka'] ? 'Processing...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => console.log('[page] Details clicked — Saryarka — Beibitshilik')}
                      className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {activeTab === 'nodes' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <NodesComponent />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AIComponent />
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AlertsComponent />
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <ImpactComponent />
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
