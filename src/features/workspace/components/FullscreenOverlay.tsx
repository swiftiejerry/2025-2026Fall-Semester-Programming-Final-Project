import React, { useEffect, useMemo } from 'react';
import { Minimize2 } from 'lucide-react';
import { useWorkspaceStore } from '../../../stores';
import { PanelRenderer } from './PanelRenderer';
import { motion, AnimatePresence } from 'framer-motion';

const KAPPA = 0.5522847498307936;

const makeBezierCirclePath = (cx: number, cy: number, r: number) => {
    const rr = Math.max(1, r);
    const ox = rr * KAPPA;
    const oy = rr * KAPPA;

    return [
        `M ${cx + rr} ${cy}`,
        `C ${cx + rr} ${cy + oy} ${cx + ox} ${cy + rr} ${cx} ${cy + rr}`,
        `C ${cx - ox} ${cy + rr} ${cx - rr} ${cy + oy} ${cx - rr} ${cy}`,
        `C ${cx - rr} ${cy - oy} ${cx - ox} ${cy - rr} ${cx} ${cy - rr}`,
        `C ${cx + ox} ${cy - rr} ${cx + rr} ${cy - oy} ${cx + rr} ${cy}`,
        'Z',
    ].join(' ');
};

const makeClipPath = (cx: number, cy: number, r: number) => `path('${makeBezierCirclePath(cx, cy, r)}')`;

export const FullscreenOverlay: React.FC = () => {
    const { fullscreenViewId, setFullscreenViewId, fullscreenOrigin, setFullscreenOrigin } = useWorkspaceStore();

    const { cx, cy, finalR } = useMemo(() => {
        const vw = window.innerWidth || 1;
        const vh = window.innerHeight || 1;
        const origin = fullscreenOrigin ?? { x: vw / 2, y: vh / 2 };
        const maxDx = Math.max(origin.x, vw - origin.x);
        const maxDy = Math.max(origin.y, vh - origin.y);
        const r = Math.ceil(Math.hypot(maxDx, maxDy));
        return { cx: origin.x, cy: origin.y, finalR: r };
    }, [fullscreenOrigin]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setFullscreenViewId(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [setFullscreenViewId]);

    return (
        <AnimatePresence onExitComplete={() => setFullscreenOrigin(null)}>
            {fullscreenViewId && (
                <motion.div
                    initial={{ opacity: 1, clipPath: makeClipPath(cx, cy, 1) }}
                    animate={{ opacity: 1, clipPath: makeClipPath(cx, cy, finalR) }}
                    exit={{ opacity: 1, clipPath: makeClipPath(cx, cy, 1) }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-between px-6 py-4 border-b border-[#333] bg-[#222]"
                    >
                        <div className="flex items-center gap-4">
                            <h2 className="text-base font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                Zen Mode
                            </h2>
                            <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400 font-mono capitalize border border-gray-700">
                                {fullscreenViewId}
                            </span>
                        </div>

                        <button
                            onClick={() => setFullscreenViewId(null)}
                            className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors bg-gray-800/50"
                            title="退出全屏 (Esc)"
                        >
                            <Minimize2 className="w-5 h-5" />
                        </button>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden relative p-0 bg-[#1e1e1e]">
                        <div className="absolute inset-0 w-full h-full">
                            <PanelRenderer viewId={fullscreenViewId} />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
