import { useRef, useCallback } from 'react';
import { useBenchmarkStore } from '../stores';
import { BENCHMARK_ALGORITHMS } from '../data/benchmarkAlgorithms';

// Worker 实例不需要在组件重渲染时销毁，但需要懒加载
let benchmarkWorker: Worker | null = null;

export function useWorkerBenchmark() {
    const store = useBenchmarkStore();

    const initWorker = useCallback(() => {
        if (!benchmarkWorker) {
            console.log('[Benchmark] Creating new worker...');
            benchmarkWorker = new Worker(new URL('../workers/benchmarkWorker.ts', import.meta.url), {
                type: 'module',
            });

            benchmarkWorker.onerror = (e) => {
                console.error('[Benchmark] Worker error:', e);
                store.failBenchmark(`Worker error: ${e.message}`);
            };

            benchmarkWorker.onmessage = (e) => {
                const { type, payload } = e.data;
                console.log('[Benchmark] Received message:', type, payload);

                switch (type) {
                    case 'PROGRESS':
                        store.updateProgress(payload.progress, payload.algorithm, payload.size);
                        break;

                    case 'BENCHMARK_POINT':
                        console.log('[Benchmark] Adding result for problem:', payload.problemId, payload);
                        if (payload.problemId) {
                            store.addResult(payload.problemId, payload);
                        }
                        break;

                    case 'RESULT':
                        console.log('[Benchmark] Benchmark completed for:', payload.problemId);
                        if (payload.problemId) {
                            store.completeBenchmark(payload.problemId);
                        }
                        break;

                    case 'ERROR':
                        console.error('[Benchmark] Worker reported error:', payload.error);
                        store.failBenchmark(payload.error);
                        break;
                }
            };
            console.log('[Benchmark] Worker created successfully');
        }
    }, [store]);

    // Ref to track current problem ID for the worker callback
    const currentProblemIdRef = useRef('');

    const runBenchmark = useCallback((problemId: string) => {
        console.log('[Benchmark] runBenchmark called with problemId:', problemId);
        initWorker();

        const config = store.getConfig(problemId);
        if (!config || config.sizes.length === 0) {
            console.error('[Benchmark] No benchmark config found for', problemId);
            return;
        }

        const algoDef = BENCHMARK_ALGORITHMS[problemId];
        if (!algoDef) {
            console.error('[Benchmark] No benchmark definition found for', problemId);
            store.failBenchmark(`Algorithm definition for ${problemId} not found`);
            return;
        }

        console.log('[Benchmark] Found algoDef:', algoDef.id, 'with', algoDef.implementations.length, 'implementations');
        console.log('[Benchmark] Config sizes:', config.sizes);

        currentProblemIdRef.current = problemId;
        store.startBenchmark(problemId);

        // 准备发送给 Worker 的 Payload
        const algorithms: Record<string, string> = {};
        const complexities: Record<string, string> = {}; // 新增：传递复杂度信息

        algoDef.implementations.forEach(impl => {
            algorithms[impl.name] = impl.jsCode;
            complexities[impl.name] = impl.timeComplexity;
        });

        const messagePayload = {
            type: 'BENCHMARK',
            id: `bench-${Date.now()}`,
            payload: {
                problemId,
                algorithms,
                complexities, // 发送复杂度
                sizes: config.sizes,
                iterations: config.iterations,
                warmupRuns: config.warmupRuns,
                testDataGenerator: algoDef.dataGenerator.js,
            }
        };
        console.log('[Benchmark] Sending to worker:', messagePayload);
        benchmarkWorker?.postMessage(messagePayload);

    }, [initWorker, store]);

    const stopBenchmark = useCallback(() => {
        benchmarkWorker?.postMessage({
            type: 'CANCEL',
            id: 'cancel',
        });
        store.reset();
    }, [store]);

    return {
        runBenchmark,
        stopBenchmark,
        ...store
    };
}
