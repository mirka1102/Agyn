'use client';

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { callTrafficAPI, TrafficResponse } from '../../lib/api';
import astanaGeo from '../../data/astana.json';

interface NodeProps {
  node_id: string;
  name: string;
  queue_length: number;
}

// Split GeoJSON into road lines and intersection nodes
const allFeatures = (astanaGeo as any).features as any[];
const roadGeo = {
  type: 'FeatureCollection',
  features: allFeatures.filter((f) => f.geometry.type === 'LineString'),
};
const nodeFeatures = allFeatures.filter(
  (f) => f.geometry.type === 'Point'
) as Array<{ properties: NodeProps; geometry: { coordinates: [number, number] } }>;

// Projection centred on Astana's left bank, scale chosen so all nodes fit
const PROJ_CONFIG = { center: [71.44, 51.18] as [number, number], scale: 160000 };

const AIComponent = () => {
  const [nodePredictions, setNodePredictions] = useState<Record<string, TrafficResponse>>({});
  const [loadingNodes, setLoadingNodes]       = useState<Record<string, boolean>>({});
  const [selectedNode, setSelectedNode]       = useState<NodeProps | null>(null);
  const [simLoading, setSimLoading]           = useState(false);
  const [simError, setSimError]               = useState<string | null>(null);

  // Core fetch — always hits http://127.0.0.1:8000/api/predict
  const fetchPrediction = async (node_id: string, queue_length: number) => {
    setLoadingNodes((p) => ({ ...p, [node_id]: true }));
    try {
      const data = await callTrafficAPI('/api/predict', {
        node_id,
        queue_length,
        hour: new Date().getHours(),
      });
      setNodePredictions((p) => ({ ...p, [node_id]: data }));
    } catch {
      // marker stays cyan — error surfaced only in sidebar
    } finally {
      setLoadingNodes((p) => ({ ...p, [node_id]: false }));
    }
  };

  const handleMarkerClick = (node: NodeProps) => {
    setSelectedNode(node);
    // Only auto-fetch once; subsequent refreshes use the Refresh button
    if (!nodePredictions[node.node_id] && !loadingNodes[node.node_id]) {
      fetchPrediction(node.node_id, node.queue_length);
    }
  };

  const handleSimulate = async () => {
    if (!selectedNode) return;
    setSimLoading(true);
    setSimError(null);
    try {
      const data = await callTrafficAPI('/api/predict', {
        node_id: selectedNode.node_id,
        queue_length: selectedNode.queue_length,
        hour: new Date().getHours(),
      });
      setNodePredictions((p) => ({ ...p, [selectedNode.node_id]: data }));
    } catch {
      setSimError('Backend unreachable — is uvicorn running on port 8000?');
    } finally {
      setSimLoading(false);
    }
  };

  // Marker colour: cyan = unqueried, amber = loading, green = ok, red = congested
  const markerFill = (node_id: string): string => {
    if (loadingNodes[node_id]) return '#f59e0b';
    const p = nodePredictions[node_id];
    if (!p) return '#22d3ee';
    return p.congestion_score > 0.6 ? '#ef4444' : '#22c55e';
  };

  const selectedPred  = selectedNode ? nodePredictions[selectedNode.node_id] : null;
  const isCongested   = (selectedPred?.congestion_score ?? 0) > 0.6;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-[#0d1117] text-white font-sans min-h-screen">

      {/* ── Header stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-8 text-xs font-medium tracking-wide border-b border-white/10 pb-4">
        <div><p className="text-gray-500 mb-1">AVG DELAY</p><p className="text-cyan-400">↓ 15% today</p></div>
        <div><p className="text-gray-500 mb-1">NODES ON AI</p><p className="text-gray-400">142 / 168</p></div>
        <div>
          <p className="text-gray-500 mb-1">MANUAL</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-orange-400">26 nodes</span>
          </p>
        </div>
        <div><p className="text-gray-500 mb-1">THROUGHPUT</p><p className="text-cyan-400">↑ 16% today</p></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Main column (2/3) ────────────────────────────────────────── */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-semibold mb-1">AI forecast &amp; decisions</h1>
            <p className="text-xs text-gray-500">Click an intersection node on the map to get a live AI prediction</p>
          </div>

          {/* ── react-simple-maps interactive map ───────────────────── */}
          <div
            className="bg-[#0d1420] border border-white/10 rounded-2xl overflow-hidden relative"
            style={{ height: 420 }}
          >
            {/* subtle grid texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
            <p className="absolute top-3 left-4 text-[10px] text-gray-500 font-bold tracking-widest z-20 pointer-events-none">
              PREDICTIVE MAP · ASTANA
            </p>

            <ComposableMap
              projection="geoMercator"
              projectionConfig={PROJ_CONFIG}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Road network from GeoJSON LineStrings */}
              <Geographies geography={roadGeo}>
                {({ geographies }: { geographies: Array<Record<string, unknown> & { rsmKey: string }> }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: { stroke: '#1e3a4a', strokeWidth: 1.5, fill: 'none', outline: 'none' },
                        hover:   { stroke: '#1e3a4a', strokeWidth: 1.5, fill: 'none', outline: 'none' },
                        pressed: { stroke: '#1e3a4a', strokeWidth: 1.5, fill: 'none', outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Intersection markers — each click → POST /api/predict */}
              {nodeFeatures.map((feat) => {
                const p          = feat.properties;
                const isSelected = selectedNode?.node_id === p.node_id;
                const fill       = markerFill(p.node_id);

                return (
                  <Marker
                    key={p.node_id}
                    coordinates={feat.geometry.coordinates}
                    onClick={() => handleMarkerClick(p)}
                  >
                    {/* selection pulse ring */}
                    {isSelected && (
                      <circle r={16} fill="none" stroke={fill} strokeWidth={1} opacity={0.4}>
                        <animate attributeName="r"       from="10" to="22" dur="1.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0"  dur="1.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      r={isSelected ? 9 : 7}
                      fill={fill}
                      stroke={isSelected ? '#ffffff' : 'rgba(0,0,0,0.5)'}
                      strokeWidth={isSelected ? 2 : 1}
                      style={{ cursor: 'pointer', filter: `drop-shadow(0 0 5px ${fill})` }}
                    />
                    <text
                      textAnchor="middle"
                      y={-13}
                      style={{
                        fontSize: '8px',
                        fill: '#94a3b8',
                        fontFamily: 'system-ui, sans-serif',
                        pointerEvents: 'none',
                        fontWeight: 700,
                      }}
                    >
                      {p.node_id}
                    </text>
                  </Marker>
                );
              })}
            </ComposableMap>

            {/* Legend */}
            <div className="absolute bottom-3 left-4 flex items-center gap-4 text-[9px] font-bold tracking-widest text-gray-400 z-20 pointer-events-none">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" />UNSCANNED</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />OPTIMAL</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"   />CONGESTED</span>
            </div>
          </div>

          {/* ── Bottom row ───────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Congestion forecast timeline */}
            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] text-gray-500 font-bold tracking-widest">CONGESTION FORECAST · NEXT 20 MIN</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-[10px] text-red-500 font-bold tracking-widest">RISK +12 MIN</p>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-medium mb-2 px-1">
                <span>now</span><span>+5</span><span>+10</span><span>+15</span><span>+20 min</span>
              </div>
              <div className="flex h-6 gap-1 w-full mb-4">
                <div className="flex-1 bg-green-500/80 rounded-l-md" />
                <div className="flex-1 bg-yellow-500/80" />
                <div className="flex-1 bg-yellow-500/80" />
                <div className="flex-[1.5] bg-red-500/80 rounded-r-md shadow-[0_0_12px_rgba(239,68,68,0.4)]" />
              </div>
              <p className="text-[10px] text-gray-500">Forecast refreshes every 2s</p>
            </div>

            {/* AI rationale */}
            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6">
              <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-4">AI DECISION RATIONALE</p>
              <div className="bg-[#0a1922] border border-cyan-500/20 rounded-xl p-4">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm font-semibold text-white leading-snug">
                    {selectedNode ? selectedNode.name : 'Turan — Kabanbai Batyr'}
                    <span className="text-cyan-400 font-normal">
                      {' · '}{selectedPred ? selectedPred.action.replace(/_/g, ' ') : 'extend NW green +8s'}
                    </span>
                  </p>
                  <span className="text-xs text-cyan-400 font-bold ml-2 shrink-0">
                    {selectedPred ? `${(selectedPred.confidence * 100).toFixed(0)}%` : '94%'}
                  </span>
                </div>
                {[
                  { label: 'Queue length',     w: selectedNode ? Math.min(100, (selectedNode.queue_length / 300) * 100) : 85, score: 0.42 },
                  { label: 'Historical load',  w: 60, score: 0.26 },
                  { label: 'Transit density',  w: 45, score: 0.21 },
                  { label: 'Pedestrian demand', w: 25, score: 0.11 },
                ].map(({ label, w, score }) => (
                  <div key={label} className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-gray-400 w-32 shrink-0">{label}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,0.4)]"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 w-8 text-right">{score.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Right sidebar ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Node result card — visible after clicking a marker */}
          {selectedNode && (
            <div className={`border rounded-2xl p-5 transition-all duration-300 ${
              isCongested
                ? 'bg-red-950/20 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.08)]'
                : 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.06)]'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${isCongested ? 'bg-red-500 animate-pulse' : 'bg-cyan-400'}`} />
                <p className="text-[10px] font-bold tracking-widest text-gray-400">SELECTED NODE</p>
              </div>
              <h3 className="text-base font-semibold text-white mb-0.5">{selectedNode.name}</h3>
              <p className="text-[10px] text-gray-500 font-mono mb-4">
                {selectedNode.node_id} · queue {selectedNode.queue_length} m
              </p>

              {loadingNodes[selectedNode.node_id] ? (
                <div className="flex items-center gap-3 text-cyan-400 text-xs animate-pulse py-2">
                  <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  Querying AI model at :8000…
                </div>
              ) : selectedPred ? (
                <div className="space-y-3">
                  <div className="bg-[#0d1117]/80 rounded-xl p-3 border border-white/5">
                    <p className="text-[9px] text-gray-500 tracking-widest mb-1">ACTION</p>
                    <p className={`text-sm font-bold ${isCongested ? 'text-red-400' : 'text-cyan-400'}`}>
                      {selectedPred.action.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0d1117]/80 rounded-xl p-3 border border-white/5">
                      <p className="text-[9px] text-gray-500 tracking-widest mb-1">DELAY</p>
                      <p className="text-lg font-bold text-white">
                        {selectedPred.delay_pred}<span className="text-xs text-gray-400 ml-1">s</span>
                      </p>
                    </div>
                    <div className="bg-[#0d1117]/80 rounded-xl p-3 border border-white/5">
                      <p className="text-[9px] text-gray-500 tracking-widest mb-1">CONFIDENCE</p>
                      <p className="text-lg font-bold text-white">
                        {(selectedPred.confidence * 100).toFixed(0)}<span className="text-xs text-gray-400 ml-1">%</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#0d1117]/80 rounded-xl p-3 border border-white/5">
                    <p className="text-[9px] text-gray-500 tracking-widest mb-2">CONGESTION SCORE</p>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isCongested ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]' : 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]'}`}
                        style={{ width: `${selectedPred.congestion_score * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                      <span>0</span>
                      <span className={isCongested ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                        {selectedPred.congestion_score.toFixed(2)}
                      </span>
                      <span>1.0</span>
                    </div>
                  </div>
                  <button
                    onClick={() => fetchPrediction(selectedNode.node_id, selectedNode.queue_length)}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isCongested
                        ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                        : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                    }`}
                  >
                    Refresh Prediction
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-500 py-2">
                  Fetching prediction… if this persists, check that the backend is running.
                </p>
              )}
            </div>
          )}

          {/* What if… simulation panel */}
          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">What if...</h3>
            <p className="text-xs text-gray-400 mb-8 leading-relaxed">
              Simulate an operator action before it ships to live traffic.
            </p>

            <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-3">SCENARIO</p>
            <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 mb-8 flex justify-between items-center">
              <span className="text-sm text-gray-200 truncate">
                {selectedNode ? selectedNode.name : 'Select a node on the map'}
              </span>
              <span className="text-[10px] text-cyan-400 font-bold ml-2 shrink-0">
                {selectedNode?.node_id ?? '—'}
              </span>
            </div>

            <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-3">FORECAST · DISTRICT · 15 MIN</p>
            <div className="mb-8 relative min-h-[72px]">
              {simLoading && (
                <div className="absolute inset-0 bg-[#0d1117]/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl border border-cyan-500/30">
                  <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {simError && (
                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                  {simError}
                </div>
              )}
              {selectedPred ? (
                <>
                  <p className="text-3xl font-bold mb-2 text-cyan-400">
                    Delay: {selectedPred.delay_pred}s
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedPred.action.replace(/_/g, ' ')} · {(selectedPred.confidence * 100).toFixed(0)}% confidence
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold mb-2 text-red-500">+14% avg delay</p>
                  <p className="text-xs text-gray-400">
                    {selectedNode ? `Queue: ${selectedNode.queue_length} m` : 'Click a node on the map first'}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={handleSimulate}
              disabled={simLoading || !selectedNode}
              className="w-full bg-transparent border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer disabled:opacity-40"
            >
              {simLoading ? 'Simulating...' : selectedPred ? 'Re-run Simulation' : 'Simulate'}
            </button>

            <div className="mt-8 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-600 mt-0.5 shrink-0" />
              <p className="text-[10px] text-gray-600 leading-relaxed">
                Simulations run on a digital twin isolated from live nodes.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIComponent;
