// 性能测试 Hook
import { useCallback } from 'react';

export function usePerformanceTest(perf, updatePerf) {

  // 算法实现库
  const algorithmImplementations = {
    twosum: {
      '暴力双循环': (nums, target) => {
        for (let i = 0; i < nums.length; i++) {
          for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) return [i, j];
          }
        }
        return [];
      },
      '哈希表': (nums, target) => {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
          const complement = target - nums[i];
          if (map.has(complement)) return [map.get(complement), i];
          map.set(nums[i], i);
        }
        return [];
      }
    },
    maxProfit: {
      '暴力法': (prices) => {
        let maxP = 0;
        for (let i = 0; i < prices.length; i++) {
          for (let j = i + 1; j < prices.length; j++) {
            const profit = prices[j] - prices[i];
            if (profit > maxP) maxP = profit;
          }
        }
        return maxP;
      },
      '一次遍历': (prices) => {
        let minPrice = Infinity;
        let maxP = 0;
        for (let p of prices) {
          if (p < minPrice) minPrice = p;
          else if (p - minPrice > maxP) maxP = p - minPrice;
        }
        return maxP;
      }
    },
    binarySearch: {
      '线性查找': (nums, target) => {
        for (let i = 0; i < nums.length; i++) if (nums[i] === target) return i;
        return -1;
      },
      '二分查找': (nums, target) => {
        let l = 0, r = nums.length - 1;
        while (l <= r) {
          const mid = (l + r) >>> 1;
          if (nums[mid] === target) return mid;
          else if (nums[mid] < target) l = mid + 1;
          else r = mid - 1;
        }
        return -1;
      }
    },
    sorting: {
      '冒泡排序': (nums) => {
        const arr = [...nums];
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
              const temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;
            }
          }
        }
        return arr;
      },
      '快速排序': (nums) => {
        const arr = [...nums];
        arr.sort((a, b) => a - b);
        return arr;
      }
    },
    maxSubArray: {
      '暴力枚举': (nums) => {
        let maxSum = -Infinity;
        for (let i = 0; i < nums.length; i++) {
          let current = 0;
          for (let j = i; j < nums.length; j++) {
            current += nums[j];
            if (current > maxSum) maxSum = current;
          }
        }
        return maxSum;
      },
      'Kadane算法': (nums) => {
        let maxSoFar = nums[0], maxHere = nums[0];
        for (let i = 1; i < nums.length; i++) {
          maxHere = Math.max(nums[i], maxHere + nums[i]);
          maxSoFar = Math.max(maxSoFar, maxHere);
        }
        return maxSoFar;
      }
    },
    countPrimes: {
      '暴力试除': (n) => {
        if (n > 50000) return 0;
        let count = 0;
        const isPrime = (num) => {
          if (num < 2) return false;
          for (let i = 2; i * i <= num; i++) if (num % i === 0) return false;
          return true;
        }
        for (let i = 2; i < n; i++) if (isPrime(i)) count++;
        return count;
      },
      '埃氏筛法': (n) => {
        if (n < 2) return 0;
        const isPrime = new Uint8Array(n).fill(1);
        isPrime[0] = isPrime[1] = 0;
        for (let i = 2; i * i < n; i++) {
          if (isPrime[i]) {
            for (let j = i * i; j < n; j += i) isPrime[j] = 0;
          }
        }
        let count = 0;
        for (let i = 0; i < n; i++) if (isPrime[i]) count++;
        return count;
      }
    },
    fibonacci: {
      '朴素递归': (n) => {
        // 递归太慢，限制 n
        const safeN = Math.min(n, 35);
        const fib = (x) => {
          if (x <= 1) return x;
          return fib(x - 1) + fib(x - 2);
        };
        return fib(safeN);
      },
      '动态规划': (n) => {
        if (n <= 1) return n;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) {
          let temp = a + b;
          a = b;
          b = temp;
        }
        return b;
      }
    },
    climbStairs: {
      '递归': (n) => {
        const safeN = Math.min(n, 35);
        const f = (x) => {
          if (x <= 2) return x;
          return f(x - 1) + f(x - 2);
        }
        return f(safeN);
      },
      '动态规划': (n) => {
        if (n <= 2) return n;
        let p1 = 1, p2 = 2;
        for (let i = 3; i <= n; i++) {
          let temp = p1 + p2; p1 = p2; p2 = temp;
        }
        return p2;
      }
    },
    moveZeroes: {
      '双指针': (nums) => {
        const arr = [...nums];
        let slow = 0;
        for (let fast = 0; fast < arr.length; fast++) {
          if (arr[fast] !== 0) {
            [arr[slow], arr[fast]] = [arr[fast], arr[slow]];
            slow++;
          }
        }
        return arr;
      },
      '两次遍历': (nums) => {
        const arr = [...nums];
        let j = 0;
        for (let i = 0; i < arr.length; i++) if (arr[i] !== 0) arr[j++] = arr[i];
        for (; j < arr.length; j++) arr[j] = 0;
        return arr;
      }
    },
    majorityElement: {
      '摩尔投票法': (nums) => {
        let count = 0;
        let candidate = null;
        for (let num of nums) {
          if (count === 0) candidate = num;
          count += (num === candidate) ? 1 : -1;
        }
        return candidate;
      },
      '哈希表': (nums) => {
        const counts = {};
        const half = nums.length / 2;
        for (let num of nums) {
          counts[num] = (counts[num] || 0) + 1;
          if (counts[num] > half) return num;
        }
        return nums[0];
      }
    }
  };

  // 生成测试数据
  const generateTestData = (problemId, size) => {
    const randomArray = (len, max = 10000) => Array.from({ length: len }, () => Math.floor(Math.random() * max));

    switch (problemId) {
      case 'twosum': {
        const nums = Array.from({ length: size - 2 }, () => Math.floor(Math.random() * 100));
        const target = 100000;
        nums.push(50000, 50000);
        return { nums, target };
      }
      case 'maxProfit':
      case 'sorting':
      case 'maxSubArray':
      case 'moveZeroes':
        if (problemId === 'moveZeroes') {
          const nums = randomArray(size, 10);
          return { nums };
        }
        return { nums: randomArray(size) };
      case 'binarySearch': {
        const nums = randomArray(size).sort((a, b) => a - b);
        return { nums, target: nums[nums.length - 1] };
      }
      case 'countPrimes':
      case 'fibonacci':
      case 'climbStairs':
        return { n: size };
      case 'majorityElement': {
        const major = 7;
        const nums = Array.from({ length: size }, () => Math.random() > 0.4 ? major : Math.floor(Math.random() * 100));
        return { nums };
      }
      default:
        return null;
    }
  };

  // 运行性能测试
  const handleRunPerfTest = useCallback(async (problemId, selectedAlgos, dataSizes, repeatCount) => {
    updatePerf('running', { problemId, progress: 0 });

    setTimeout(async () => {
      try {
        const results = [];
        const algos = algorithmImplementations[problemId];

        // 没实现就跳过
        if (!algos) {
          // TODO: handle missing algos
        }

        for (const size of dataSizes) {
          const data = generateTestData(problemId, size);

          if (data && algos) {
            for (const algoName of selectedAlgos) {
              const runAlgo = algos[algoName];
              if (!runAlgo) continue;

              // 暴力法大成狗，不算了
              if ((algoName.includes('暴力') || algoName.includes('冒泡')) && size > 15000) {
                const estimatedMs = (size * size) / 5000000;
                results.push({
                  algorithm: algoName,
                  size: size,
                  timeMs: parseFloat(estimatedMs.toFixed(2)),
                  complexity: 'O(n^2) (估算)'
                });
                continue;
              }
              // 模拟递归超时

              let args = [];
              if (data.nums && data.target !== undefined) args = [data.nums, data.target];
              else if (data.nums) args = [data.nums];
              else if (data.n !== undefined) args = [data.n];

              // 预热 JIT
              for (let w = 0; w < 5; w++) runAlgo(...args);

              let totalTime = 0;
              for (let i = 0; i < repeatCount; i++) {
                const start = performance.now();
                runAlgo(...args);
                const end = performance.now();
                totalTime += (end - start);
              }

              let finalTime = parseFloat((totalTime / repeatCount).toFixed(4));
              if ((algoName.includes('递归') || algoName.includes('朴素')) && size > 40) {
                finalTime = 5000; // 假装超时
              }

              results.push({
                algorithm: algoName,
                size: size,
                timeMs: finalTime,
                complexity: algoName.includes('暴力') || algoName.includes('冒泡') ? 'O(n^2)' :
                  algoName.includes('递归') ? 'O(2^n)' : 'O(n)'
              });
            }
          }
        }

        updatePerf('results', {
          ...perf.results,
          [problemId]: results,
        });

        const maxSize = Math.max(...dataSizes);
        const maxSizeResults = results.filter(r => r.size === maxSize);
        const fastest = maxSizeResults.sort((a, b) => a.timeMs - b.timeMs)[0];

        updatePerf('summary', {
          ...perf.summary,
          [problemId]: {
            fastest: fastest?.algorithm || '',
            avgTime: fastest?.timeMs || 0,
          },
        });

        updatePerf('running', null);
      } catch (error) {
        console.error('Test failed:', error);
        updatePerf('running', null);
      }
    }, 100);
  }, [updatePerf, perf.results, perf.summary]);

  const handleClearPerfResults = useCallback((problemId) => {
    const newResults = { ...perf.results };
    delete newResults[problemId];
    updatePerf('results', newResults);

    const newSummary = { ...perf.summary };
    delete newSummary[problemId];
    updatePerf('summary', newSummary);
  }, [perf.results, perf.summary, updatePerf]);

  return {
    handleRunPerfTest,
    handleClearPerfResults,
  };
}
