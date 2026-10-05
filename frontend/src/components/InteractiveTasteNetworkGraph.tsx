'use client';

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  Maximize2,
  RotateCcw,
  Layers,
  Info,
  CheckCircle2,
  Film,
  Building,
  Music,
  Utensils,
  BookOpen,
  Scissors,
} from 'lucide-react';
import { soundService } from '../services/soundService';
import type { CulturalTasteGraph, VIPProfile } from '../types';

interface InteractiveTasteNetworkGraphProps {
  tasteGraph: CulturalTasteGraph;
  vipProfile: VIPProfile;
}

interface GraphNode {
  id: string;
  name: string;
  domain: 'seed' | 'latent' | 'cinema' | 'architecture' | 'music' | 'dining' | 'craft' | 'literature';
  domainLabel: string;
  x: number;
  y: number;
  affinity: number;
  rationale: string;
  isCenter?: boolean;
  isLatent?: boolean;
}

interface GraphEdge {
  fromId: string;
  toId: string;
  weight: number;
  label?: string;
}

export const InteractiveTasteNetworkGraph: React.FC<InteractiveTasteNetworkGraphProps> = ({
  tasteGraph,
  vipProfile,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>('all');

  // Compute graph nodes and edges tailored to VIP or dynamically mapped
  const { nodes, edges, centerTitle, latentFactorTitle } = useMemo(() => {
    const fullName = vipProfile.fullName.toLowerCase();
    const isMarcus = fullName.includes('marcus');
    const isTariq = fullName.includes('tariq');
    const isElena = fullName.includes('elena');

    let centerTitle = vipProfile.explicitInterests[0] || 'Cultural Anchor';
    let latentFactorTitle = tasteGraph.crossDomainThemes[0] || 'Multi-Domain Concordance';

    let rawNodes: GraphNode[] = [];
    let rawEdges: GraphEdge[] = [];

    if (isMarcus) {
      centerTitle = 'Christopher Nolan & Scale';
      latentFactorTitle = 'Monumental Tension & Structural Rhythm';

      rawNodes = [
        {
          id: 'center',
          name: centerTitle,
          domain: 'seed',
          domainLabel: 'SEED CULTURAL ANCHOR',
          x: 400,
          y: 230,
          affinity: 100,
          rationale: 'Primary seed anchor declared by Principal: Obsession with scale, cinematic physics, and temporal tension.',
          isCenter: true,
        },
        {
          id: 'node_cinema',
          name: 'Interstellar & Oppenheimer Acoustic Mix',
          domain: 'cinema',
          domainLabel: 'CINEMA / SOUND DESIGN',
          x: 190,
          y: 100,
          affinity: 98,
          rationale: 'Direct Qloo vector correlation: Audiophile sound design where silence carries identical mass to dialogue.',
        },
        {
          id: 'node_arch',
          name: 'Tadao Ando & Barbican Brutalism',
          domain: 'architecture',
          domainLabel: 'MONUMENTAL ARCHITECTURE',
          x: 610,
          y: 100,
          affinity: 96,
          rationale: 'Qloo Latent Factor: 96% concordance between Nolan’s monumental framing and board-formed raw concrete surfaces.',
        },
        {
          id: 'node_music',
          name: 'Hans Zimmer Modular Synthesis',
          domain: 'music',
          domainLabel: 'ACOUSTIC MINIMALISM',
          x: 690,
          y: 250,
          affinity: 94,
          rationale: 'Sub-bass ambient frequency structures that create physical vibration rather than melodic distraction.',
        },
        {
          id: 'node_dining',
          name: 'The Monolith Subterranean Salon',
          domain: 'dining',
          domainLabel: 'HOSPITALITY SANCTUARY',
          x: 580,
          y: 380,
          affinity: 96,
          rationale: 'Acoustically isolated private dining salon with raw cast concrete walls and zero ambient small talk.',
        },
        {
          id: 'node_craft',
          name: 'Bizen Wood-Fired Ceramic Ware',
          domain: 'craft',
          domainLabel: 'BESPOKE MATERIAL CRAFT',
          x: 220,
          y: 380,
          affinity: 97,
          rationale: '14-day wood kiln ash deposits create an elemental tactile skin matching bush-hammered architectural aggregate.',
        },
        {
          id: 'node_lit',
          name: 'Peter Zumthor Therme Vals Folio',
          domain: 'literature',
          domainLabel: 'ARCHITECTURAL MONOGRAPH',
          x: 110,
          y: 250,
          affinity: 93,
          rationale: 'Limited slipcase edition analyzing quartzite stone layers and sensory tactile containment.',
        },
      ];
    } else if (isTariq) {
      centerTitle = 'Independent Horology';
      latentFactorTitle = 'Micro-Mechanical Rigor & Quiet Utility';

      rawNodes = [
        {
          id: 'center',
          name: centerTitle,
          domain: 'seed',
          domainLabel: 'SEED CULTURAL ANCHOR',
          x: 400,
          y: 230,
          affinity: 100,
          rationale: 'Primary seed anchor: Fascination with independent Swiss/Japanese watchmakers, hand-finishing, and micro-tolerances.',
          isCenter: true,
        },
        {
          id: 'node_arch',
          name: 'Dieter Rams 10 Principles',
          domain: 'architecture',
          domainLabel: 'INDUSTRIAL DESIGN',
          x: 610,
          y: 100,
          affinity: 97,
          rationale: 'Philosophical kinship: "Less, but better" manifests in uncluttered mechanical movements and matte finishes.',
        },
        {
          id: 'node_craft',
          name: 'Matte Titanium Atelier Loupe',
          domain: 'craft',
          domainLabel: 'BESPOKE HOROLOGY ATELIER',
          x: 220,
          y: 380,
          affinity: 98,
          rationale: 'Grade 5 aerospace titanium hand-turned in Kyoto with zero corporate branding. Respects religious taboos.',
        },
        {
          id: 'node_dining',
          name: 'The Al-Murabba Pavilion',
          domain: 'dining',
          domainLabel: 'CERTIFIED HALAL KAISEKI',
          x: 580,
          y: 380,
          affinity: 96,
          rationale: 'Private garden salon with dedicated zero-proof tea flights and strict 100% Halal kitchen integrity.',
        },
        {
          id: 'node_music',
          name: 'Mechanical Acoustic Cadence',
          domain: 'music',
          domainLabel: 'HOROLOGICAL FREQUENCY',
          x: 690,
          y: 250,
          affinity: 92,
          rationale: 'Subtle sound of a 21,600 vph balance wheel escapement in an acoustically damped room.',
        },
        {
          id: 'node_cinema',
          name: 'Philippe Dufour Simplicity Archives',
          domain: 'cinema',
          domainLabel: 'ATELIER MASTERPIECE',
          x: 190,
          y: 100,
          affinity: 96,
          rationale: 'Documentary analysis of handmade anglage and interior angles by Switzerland’s greatest living watchmaker.',
        },
        {
          id: 'node_lit',
          name: 'Rams "Less and More" Monograph',
          domain: 'literature',
          domainLabel: 'DESIGN LITERATURE',
          x: 110,
          y: 250,
          affinity: 94,
          rationale: 'Braunschweig Press archival slipcase edition celebrating understated German functionalism.',
        },
      ];
    } else if (isElena) {
      centerTitle = 'New Orleans Jazz Vinyl';
      latentFactorTitle = 'Sensory Deconstruction & Analog Warmth';

      rawNodes = [
        {
          id: 'center',
          name: centerTitle,
          domain: 'seed',
          domainLabel: 'SEED CULTURAL ANCHOR',
          x: 400,
          y: 230,
          affinity: 100,
          rationale: 'Primary seed anchor: Analog acoustic richness, direct-to-lacquer pressings, and authentic musical heritage.',
          isCenter: true,
        },
        {
          id: 'node_music',
          name: '1961 Preservation Hall Mono Master',
          domain: 'music',
          domainLabel: 'ANALOG VINYL ARTIFACT',
          x: 690,
          y: 250,
          affinity: 97,
          rationale: 'Rare direct lacquer disc presented in unbleached raw linen sleeve, capturing dynamic micro-room acoustics.',
        },
        {
          id: 'node_arch',
          name: 'Comme des Garçons Spatial Form',
          domain: 'architecture',
          domainLabel: 'AVANT-GARDE FASHION ARCHITECTURE',
          x: 610,
          y: 100,
          affinity: 95,
          rationale: 'Garments conceptualized as deconstructed geometric volumes rather than commercial trends.',
        },
        {
          id: 'node_craft',
          name: 'Aoyama Hand-Forged Silver Pin',
          domain: 'craft',
          domainLabel: 'SCULPTURAL JEWELRY',
          x: 220,
          y: 380,
          affinity: 94,
          rationale: 'Numbered 07/50 studio piece from Tokyo, avoiding corporate logos while respecting her aesthetic rigor.',
        },
        {
          id: 'node_dining',
          name: 'The Botanist’s Cellar Vault',
          domain: 'dining',
          domainLabel: 'NATURAL WINE & ZERO-SHELLFISH',
          x: 580,
          y: 380,
          affinity: 95,
          rationale: 'Low-intervention skin-contact orange wines paired with wild mountain roots; 100% shellfish-free audited.',
        },
        {
          id: 'node_cinema',
          name: 'French New Wave Cinematography',
          domain: 'cinema',
          domainLabel: 'CINEMATIC TEXTURE',
          x: 190,
          y: 100,
          affinity: 92,
          rationale: 'Analog grain, handheld framing, and improvisational rhythm shared with New Orleans modal jazz.',
        },
        {
          id: 'node_lit',
          name: 'Margiela Exhibition Catalogue 1989-2009',
          domain: 'literature',
          domainLabel: 'ARCHIVAL MONOGRAPH',
          x: 110,
          y: 250,
          affinity: 93,
          rationale: 'Exhaustive archival survey of white painted textiles and anonymous artisan collective techniques.',
        },
      ];
    } else {
      // Dynamic fallback for any custom created VIP
      centerTitle = vipProfile.explicitInterests[0] || 'Declared Taste Anchor';
      latentFactorTitle = tasteGraph.crossDomainThemes[0] || 'Multi-Domain Concordance';

      rawNodes = [
        {
          id: 'center',
          name: centerTitle,
          domain: 'seed',
          domainLabel: 'SEED CULTURAL ANCHOR',
          x: 400,
          y: 230,
          affinity: 100,
          rationale: `Primary cultural seed extracted from ${vipProfile.fullName}’s profile dossier.`,
          isCenter: true,
        },
        {
          id: 'node_1',
          name: tasteGraph.expandedEntities[0]?.name || 'Contemporary Spatial Design',
          domain: 'architecture',
          domainLabel: 'CROSS-DOMAIN ARCHITECTURE',
          x: 610,
          y: 100,
          affinity: 96,
          rationale: 'Qloo cross-domain correlation between primary taste vector and spatial design.',
        },
        {
          id: 'node_2',
          name: tasteGraph.expandedEntities[1]?.name || 'Acoustic Soundscapes',
          domain: 'music',
          domainLabel: 'SONIC PALETTE',
          x: 690,
          y: 250,
          affinity: 94,
          rationale: 'Harmonic alignment with declared interests and lifestyle pacing.',
        },
        {
          id: 'node_3',
          name: 'Curated Private Hospitality Salon',
          domain: 'dining',
          domainLabel: 'AUDITED GASTRONOMY',
          x: 580,
          y: 380,
          affinity: 95,
          rationale: 'Private dining venue satisfying all declared taboos and atmosphere anchors.',
        },
        {
          id: 'node_4',
          name: 'Bespoke Atelier Cultural Artifact',
          domain: 'craft',
          domainLabel: 'HANDCRAFTED PROVENANCE',
          x: 220,
          y: 380,
          affinity: 97,
          rationale: 'Handmade by an independent craft workshop with zero commercial branding.',
        },
        {
          id: 'node_5',
          name: 'Archival Press Monograph',
          domain: 'literature',
          domainLabel: 'SCHOLARLY LITERATURE',
          x: 110,
          y: 250,
          affinity: 92,
          rationale: 'Intellectual publication honoring the principal’s background and career.',
        },
        {
          id: 'node_6',
          name: 'Visual Art & Cinematic Scale',
          domain: 'cinema',
          domainLabel: 'VISUAL ARTS',
          x: 190,
          y: 100,
          affinity: 93,
          rationale: 'Cultural affinity across cinematic framing and visual arts.',
        },
      ];
    }

    // Connect center to all satellite nodes
    rawEdges = rawNodes
      .filter((n) => !n.isCenter)
      .map((n) => ({
        fromId: 'center',
        toId: n.id,
        weight: n.affinity / 100,
        label: `${n.affinity}%`,
      }));

    return { nodes: rawNodes, edges: rawEdges, centerTitle, latentFactorTitle };
  }, [vipProfile, tasteGraph]);

  const activeNode = useMemo(() => {
    const id = selectedNodeId || hoveredNodeId || 'node_arch';
    return nodes.find((n) => n.id === id) || nodes[1] || nodes[0];
  }, [nodes, selectedNodeId, hoveredNodeId]);

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'cinema':
        return <Film className="w-3.5 h-3.5" />;
      case 'architecture':
        return <Building className="w-3.5 h-3.5" />;
      case 'music':
        return <Music className="w-3.5 h-3.5" />;
      case 'dining':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'craft':
        return <Scissors className="w-3.5 h-3.5" />;
      case 'literature':
        return <BookOpen className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const handleNodeClick = (node: GraphNode) => {
    soundService.playMechanicalClick();
    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
  };

  const filteredNodes = useMemo(() => {
    if (activeDomainFilter === 'all') return nodes;
    return nodes.filter((n) => n.isCenter || n.domain === activeDomainFilter);
  }, [nodes, activeDomainFilter]);

  return (
    <div className="border border-[#183D33]/15 bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col space-y-5">
      {/* Graph Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE6DD]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#183D33]">
              Qloo Cultural Taste Graph
            </span>
            <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-[#EDF4F0] border border-[#C8DCD1] text-[#1D5A4A] uppercase">
              <Sparkles className="w-3 h-3 text-[#10B981]" />
              250M+ Node Latent Mapping
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#161A18] tracking-tight">
            Interactive Cross-Domain Taste Network
          </h3>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['all', 'architecture', 'cinema', 'music', 'dining', 'craft'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                soundService.playToggleClick();
                setActiveDomainFilter(filter);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium uppercase tracking-wider text-2xs transition-all ${
                activeDomainFilter === filter
                  ? 'bg-[#183D33] text-white shadow-2xs'
                  : 'bg-[#FAF8F5] text-[#6B736D] hover:bg-[#EBE6DD] border border-[#E5E0D6]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] min-h-[340px] max-h-[460px] bg-gradient-to-br from-[#FAF8F5] via-[#F4F1EA] to-[#ECE7DC] rounded-2xl border border-[#E2DDD2] overflow-hidden shadow-inner flex items-center justify-center">
        {/* Latent Factor Orbital Guides */}
        <svg
          viewBox="0 0 800 460"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#183D33" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="edgeActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#183D33" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Concentric Orbital Rings */}
          <circle cx="400" cy="230" r="170" fill="none" stroke="#DCD5C8" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="400" cy="230" r="270" fill="none" stroke="#E5E0D6" strokeWidth="1" strokeDasharray="6 6" />

          {/* Latent Factor Vector Pill in orbit */}
          <g transform="translate(400, 70)">
            <rect
              x="-140"
              y="-14"
              width="280"
              height="28"
              rx="14"
              fill="#FFFFFF"
              stroke="#2D7360"
              strokeWidth="1.5"
              filter="url(#shadow)"
            />
            <text
              textAnchor="middle"
              y="4"
              fill="#183D33"
              fontSize="10"
              fontFamily="sans-serif"
              fontWeight="600"
              letterSpacing="0.8"
            >
              LATENT VECTOR: {latentFactorTitle.toUpperCase()}
            </text>
          </g>

          {/* Connecting Edge Curves */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.fromId);
            const toNode = filteredNodes.find((n) => n.id === edge.toId);
            if (!fromNode || !toNode) return null;

            const isHighlighted =
              selectedNodeId === toNode.id ||
              hoveredNodeId === toNode.id ||
              selectedNodeId === 'center' ||
              hoveredNodeId === 'center';

            // Quadratic Bezier Curve with gentle bow
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2 - 15;
            const pathD = `M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY} ${toNode.x} ${toNode.y}`;

            return (
              <g key={`${edge.fromId}-${edge.toId}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={isHighlighted ? 'url(#edgeActiveGrad)' : '#C9C2B4'}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={isHighlighted ? 'none' : '3 3'}
                  className="transition-all duration-300"
                />
                {isHighlighted && (
                  <circle
                    r="3.5"
                    fill="#10B981"
                    className="animate-ping"
                  >
                    <animateMotion path={pathD} dur="2.4s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Center Glow */}
          <circle cx="400" cy="230" r="80" fill="url(#centerGlow)" />

          {/* Render Nodes */}
          {filteredNodes.map((node) => {
            const isCenter = node.isCenter;
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isHighlighted = isSelected || isHovered;

            if (isCenter) {
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => {
                    soundService.playMechanicalClick();
                    setHoveredNodeId(node.id);
                  }}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <circle
                    r="46"
                    fill="#183D33"
                    stroke="#10B981"
                    strokeWidth={isHighlighted ? 3.5 : 2}
                    filter="url(#shadow)"
                    className="transition-all duration-300"
                  />
                  <circle r="42" fill="none" stroke="#2D7360" strokeWidth="1" strokeDasharray="3 3" />
                  <text
                    textAnchor="middle"
                    y="-12"
                    fill="#A3E5D0"
                    fontSize="8"
                    fontWeight="700"
                    letterSpacing="1"
                    fontFamily="sans-serif"
                  >
                    SEED ANCHOR
                  </text>
                  <text
                    textAnchor="middle"
                    y="4"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="serif"
                  >
                    {node.name.length > 18 ? node.name.slice(0, 18) + '...' : node.name}
                  </text>
                  <text
                    textAnchor="middle"
                    y="18"
                    fill="#8BA89B"
                    fontSize="8"
                    fontFamily="sans-serif"
                  >
                    Qloo Root Vector
                  </text>
                </g>
              );
            }

            // Satellite Nodes
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => {
                  soundService.playMechanicalClick();
                  setHoveredNodeId(node.id);
                }}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Outer ring on hover/select */}
                {isHighlighted && (
                  <circle
                    r="32"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                )}

                {/* Node Body */}
                <circle
                  r="24"
                  fill={isHighlighted ? '#183D33' : '#FFFFFF'}
                  stroke={isHighlighted ? '#10B981' : '#2D7360'}
                  strokeWidth="2"
                  filter="url(#shadow)"
                  className="transition-all duration-200"
                />

                {/* Affinity Percentage Badge */}
                <text
                  textAnchor="middle"
                  y="4"
                  fill={isHighlighted ? '#FFFFFF' : '#183D33'}
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  {node.affinity}%
                </text>

                {/* Node Title Underneath */}
                <g transform="translate(0, 36)">
                  <rect
                    x="-75"
                    y="-10"
                    width="150"
                    height="20"
                    rx="5"
                    fill={isHighlighted ? '#183D33' : '#FFFFFF'}
                    stroke={isHighlighted ? '#183D33' : '#D5CEC2'}
                    strokeWidth="1"
                    filter="url(#shadow)"
                  />
                  <text
                    textAnchor="middle"
                    y="4"
                    fill={isHighlighted ? '#FFFFFF' : '#161A18'}
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {node.name.length > 20 ? node.name.slice(0, 20) + '...' : node.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Live Legend HUD */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-[#E5E0D6] rounded-xl px-3 py-2 text-2xs space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 font-semibold text-[#183D33]">
            <span className="w-2 h-2 rounded-full bg-[#183D33]" />
            <span>Seed Principal Anchor</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#4A524D]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Cross-Domain Satellite Node</span>
          </div>
        </div>

        {/* Reset/Interact Hint */}
        <div className="absolute bottom-3 right-3 text-3xs text-[#6B736D] bg-white/80 px-2.5 py-1 rounded-lg border border-[#E5E0D6]">
          Click or hover any node to inspect Qloo cross-domain rationale
        </div>
      </div>

      {/* Floating Node Inspector Drawer (Active Selection HUD) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6] space-y-2.5 shadow-2xs transition-all">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#183D33] text-white flex items-center justify-center">
              {getDomainIcon(activeNode.domain)}
            </div>
            <div>
              <span className="text-3xs font-bold uppercase tracking-wider text-[#183D33] block">
                {activeNode.domainLabel}
              </span>
              <h4 className="text-base font-semibold text-[#161A18] tracking-tight">
                {activeNode.name}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xs font-semibold uppercase text-[#6B736D]">
              Qloo Concordance:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183D33] text-white text-xs font-bold font-mono">
              {activeNode.affinity}%
            </span>
          </div>
        </div>

        <p className="text-xs text-[#323835] leading-relaxed font-sans bg-white p-3 rounded-xl border border-[#EBE6DD]">
          <span className="font-semibold text-[#183D33]">Cross-Domain Rationale: </span>
          {activeNode.rationale}
        </p>
      </div>
    </div>
  );
};
