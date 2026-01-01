export type ComplexityType = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2^n)';

export interface AlgoImplementation {
  name: string;
  jsCode: string; // 用于 JS Worker 执行
  pyCode: string; // 用于 Pyodide 执行
  tags: string[];
  timeComplexity: ComplexityType;
  spaceComplexity: ComplexityType;
}

export interface ProblemBenchmarkDef {
  id: string;
  dataGenerator: {
    js: string; // (size: number) => any
    py: string; // generate_test_data(size) -> any
  };
  implementations: AlgoImplementation[];
}

export const BENCHMARK_ALGORITHMS: Record<string, ProblemBenchmarkDef> = {
  // ==========================================
  // 1. Two Sum (两数之和)
  // ==========================================
  twosum: {
    id: 'twosum',
    dataGenerator: {
      js: `
        (size) => {
          // 生成不重复的随机数，确保没有意外的提前匹配
          const nums = Array.from({length: size}, (_, i) => i * 2 + Math.floor(Math.random() * 100000) * size);
          // 强制把答案放在数组最后两个位置，确保必须遍历整个数组
          const idx1 = size - 2;
          const idx2 = size - 1;
          const target = nums[idx1] + nums[idx2];
          return [nums, target];
        }
      `,
      py: `
def generate_test_data(size):
    import random
    nums = [random.randint(0, 10000) for _ in range(size)]
    idx1 = random.randint(0, size - 1)
    idx2 = random.randint(0, size - 1)
    while idx1 == idx2:
        idx2 = random.randint(0, size - 1)
    target = nums[idx1] + nums[idx2]
    return [nums, target]
      `
    },
    implementations: [
      {
        name: 'Brute Force (O(n²))',
        tags: ['naive'],
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        jsCode: `
          function twoSum(nums, target) {
            for (let i = 0; i < nums.length; i++) {
              for (let j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] === target) return [i, j];
              }
            }
            return [];
          }
        `,
        pyCode: `
def two_sum(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
        `
      },
      {
        name: 'Hash Map (O(n))',
        tags: ['optimized'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        jsCode: `
          function twoSum(nums, target) {
            const map = new Map();
            for (let i = 0; i < nums.length; i++) {
              const complement = target - nums[i];
              if (map.has(complement)) return [map.get(complement), i];
              map.set(nums[i], i);
            }
            return [];
          }
        `,
        pyCode: `
def two_sum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []
        `
      }
    ]
  },

  // ==========================================
  // 2. Sorting (排序) - 对应 PROBLEMS 中的 mergesort
  // ==========================================
  mergesort: {
    id: 'mergesort',
    dataGenerator: {
      js: `(size) => Array.from({length: size}, () => Math.floor(Math.random() * 10000))`,
      py: `
def generate_test_data(size):
    import random
    return [random.randint(0, 10000) for _ in range(size)]
      `
    },
    implementations: [
      {
        name: 'Bubble Sort (O(n²))',
        tags: ['naive', 'slow'],
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        jsCode: `
          function bubbleSort(arr) {
            const nums = [...arr]; // 拷贝避免修改原数组影响后续测试
            const n = nums.length;
            for (let i = 0; i < n; i++) {
              for (let j = 0; j < n - i - 1; j++) {
                if (nums[j] > nums[j + 1]) {
                  [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
                }
              }
            }
            return nums;
          }
        `,
        pyCode: `
def bubble_sort(arr):
    nums = list(arr) # Copy
    n = len(nums)
    for i in range(n):
        for j in range(0, n - i - 1):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
    return nums
        `
      },
      {
        name: 'Quick Sort (O(n log n))',
        tags: ['optimized', 'recursive'],
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
        jsCode: `
          function quickSort(arr) {
             if (arr.length <= 1) return arr;
             const pivot = arr[Math.floor(arr.length / 2)];
             const left = [], right = [], equal = [];
             for (let num of arr) {
               if (num < pivot) left.push(num);
               else if (num > pivot) right.push(num);
               else equal.push(num);
             }
             return [...quickSort(left), ...equal, ...quickSort(right)];
          }
        `,
        pyCode: `
def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
        `
      },
      {
        name: 'System Sort (Timsort)',
        tags: ['optimized', 'native'],
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        jsCode: `
          function systemSort(arr) {
            // 这是为了对比原生性能
            return [...arr].sort((a, b) => a - b);
          }
        `,
        pyCode: `
def system_sort(arr):
    return sorted(arr)
        `
      }
    ]
  },

  // ==========================================
  // 3. Fibonacci (斐波那契)
  // ==========================================
  fibonacci: {
    id: 'fibonacci',
    // 注意：fibonacci 递归版本是 O(2^n)，size 不能太大！
    // 建议 sizes: [10, 15, 20, 25, 30]，超过 35 会非常慢
    dataGenerator: {
      js: `(size) => size`,
      py: `
def generate_test_data(size):
    return size
      `
    },
    implementations: [
      {
        name: 'Recursive (O(2^n))',
        tags: ['naive', 'danger'],
        timeComplexity: 'O(2^n)',
        spaceComplexity: 'O(n)',
        jsCode: `
          function fib(n) {
            if (n <= 1) return n;
            return fib(n - 1) + fib(n - 2);
          }
        `,
        pyCode: `
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)
        `
      },
      {
        name: 'Dynamic Programming (O(n))',
        tags: ['optimized'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        jsCode: `
          function fib(n) {
            if (n <= 1) return n;
            let a = 0, b = 1;
            for (let i = 2; i <= n; i++) {
              let temp = a + b;
              a = b;
              b = temp;
            }
            return b;
          }
        `,
        pyCode: `
def fib(n):
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
        `
      }
    ]
  },

  // ==========================================
  // 4. Climbing Stairs (爬楼梯)
  // ==========================================
  climbingstairs: {
    id: 'climbingstairs',
    dataGenerator: {
      js: `(size) => size`,
      py: `
def generate_test_data(size):
    return size
      `
    },
    implementations: [
      {
        name: 'Recursive (O(2^n))',
        tags: ['naive', 'danger'],
        timeComplexity: 'O(2^n)',
        spaceComplexity: 'O(n)',
        jsCode: `
          function climbStairs(n) {
            if (n <= 2) return n;
            return climbStairs(n - 1) + climbStairs(n - 2);
          }
        `,
        pyCode: `
def climb_stairs(n):
    if n <= 2: return n
    return climb_stairs(n-1) + climb_stairs(n-2)
        `
      },
      {
        name: 'Dynamic Programming (O(n))',
        tags: ['optimized'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        jsCode: `
          function climbStairs(n) {
            if (n <= 2) return n;
            let prev = 1, curr = 2;
            for (let i = 3; i <= n; i++) {
              let temp = prev + curr;
              prev = curr;
              curr = temp;
            }
            return curr;
          }
        `,
        pyCode: `
def climb_stairs(n):
    if n <= 2: return n
    prev, curr = 1, 2
    for _ in range(3, n + 1):
        prev, curr = curr, prev + curr
    return curr
        `
      }
    ]
  },

  // ==========================================
  // 5. Maximum Subarray (最大子数组和)
  // ==========================================
  maxsubarray: {
    id: 'maxsubarray',
    dataGenerator: {
      js: `(size) => Array.from({length: size}, () => Math.floor(Math.random() * 200) - 100)`,
      py: `
def generate_test_data(size):
    import random
    return [random.randint(-100, 100) for _ in range(size)]
      `
    },
    implementations: [
      {
        name: 'Brute Force (O(n²))',
        tags: ['naive'],
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(n)',
        jsCode: `
          function maxSubArray(nums) {
            let maxSum = nums[0];
            for (let i = 0; i < nums.length; i++) {
              let sum = 0;
              for (let j = i; j < nums.length; j++) {
                sum += nums[j];
                maxSum = Math.max(maxSum, sum);
              }
            }
            return maxSum;
          }
        `,
        pyCode: `
def max_sub_array(nums):
    max_sum = nums[0]
    for i in range(len(nums)):
        curr_sum = 0
        for j in range(i, len(nums)):
            curr_sum += nums[j]
            max_sum = max(max_sum, curr_sum)
    return max_sum
        `
      },
      {
        name: 'Kadane Algorithm (O(n))',
        tags: ['optimized'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        jsCode: `
          function maxSubArray(nums) {
            let maxSum = nums[0], currentSum = nums[0];
            for (let i = 1; i < nums.length; i++) {
              currentSum = Math.max(nums[i], currentSum + nums[i]);
              maxSum = Math.max(maxSum, currentSum);
            }
            return maxSum;
          }
        `,
        pyCode: `
def max_sub_array(nums):
    max_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum
        `
      }
    ]
  },

  // ==========================================
  // 6. Binary Search (二分查找)
  // ==========================================
  binarysearch: {
    id: 'binarysearch',
    dataGenerator: {
      js: `(size) => {
        const arr = Array.from({length: size}, (_, i) => i * 2);
        const target = arr[size - 1]; // 最坏情况：查找最后一个元素
        return [arr, target];
      }`,
      py: `
def generate_test_data(size):
    arr = [i * 2 for i in range(size)]
    target = arr[-1]
    return [arr, target]
      `
    },
    implementations: [
      {
        name: 'Linear Search (O(n))',
        tags: ['naive'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        jsCode: `
          function search(nums, target) {
            for (let i = 0; i < nums.length; i++) {
              if (nums[i] === target) return i;
            }
            return -1;
          }
        `,
        pyCode: `
def search(nums, target):
    for i, num in enumerate(nums):
        if num == target: return i
    return -1
        `
      },
      {
        name: 'Binary Search (O(log n))',
        tags: ['optimized'],
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        jsCode: `
          function search(nums, target) {
            let left = 0, right = nums.length - 1;
            while (left <= right) {
              const mid = Math.floor((left + right) / 2);
              if (nums[mid] === target) return mid;
              if (nums[mid] < target) left = mid + 1;
              else right = mid - 1;
            }
            return -1;
          }
        `,
        pyCode: `
def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target: return mid
        if nums[mid] < target: left = mid + 1
        else: right = mid - 1
    return -1
        `
      }
    ]
  },

  // ==========================================
  // 7. Valid Parentheses (有效的括号)
  // ==========================================
  validparentheses: {
    id: 'validparentheses',
    dataGenerator: {
      js: `(size) => {
        const brackets = ['(', ')', '[', ']', '{', '}'];
        let s = '';
        for (let i = 0; i < size; i++) {
          s += brackets[Math.floor(Math.random() * 6)];
        }
        return s;
      }`,
      py: `
def generate_test_data(size):
    import random
    brackets = ['(', ')', '[', ']', '{', '}']
    return ''.join(random.choice(brackets) for _ in range(size))
      `
    },
    implementations: [
      {
        name: 'Stack (O(n))',
        tags: ['standard'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        jsCode: `
          function isValid(s) {
            const stack = [];
            const map = {')': '(', ']': '[', '}': '{'};
            for (const c of s) {
              if (map[c]) {
                if (stack.pop() !== map[c]) return false;
              } else {
                stack.push(c);
              }
            }
            return stack.length === 0;
          }
        `,
        pyCode: `
def is_valid(s):
    stack = []
    mapping = {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c in mapping:
            if not stack or stack.pop() != mapping[c]:
                return False
        else:
            stack.append(c)
    return len(stack) == 0
        `
      },
      {
        name: 'Replace Method (O(n²))',
        tags: ['naive'],
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(n²)',
        jsCode: `
          function isValid(s) {
            let prev = '';
            while (s !== prev) {
              prev = s;
              s = s.replace('()', '').replace('[]', '').replace('{}', '');
            }
            return s === '';
          }
        `,
        pyCode: `
def is_valid(s):
    while True:
        new_s = s.replace('()', '').replace('[]', '').replace('{}', '')
        if new_s == s:
            break
        s = new_s
    return s == ''
        `
      }
    ]
  },

  // ==========================================
  // 8. Coin Change (零钱兑换)
  // ==========================================
  coinchange: {
    id: 'coinchange',
    dataGenerator: {
      js: `(size) => {
        const coins = [1, 5, 10, 25];
        const amount = size;
        return [coins, amount];
      }`,
      py: `
def generate_test_data(size):
    coins = [1, 5, 10, 25]
    return [coins, size]
      `
    },
    implementations: [
      {
        name: 'Recursive (Exponential)',
        tags: ['naive', 'danger'],
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(n²)',
        jsCode: `
          function coinChange(coins, amount) {
            if (amount === 0) return 0;
            if (amount < 0) return -1;
            let minCoins = Infinity;
            for (const coin of coins) {
              const res = coinChange(coins, amount - coin);
              if (res >= 0) minCoins = Math.min(minCoins, res + 1);
            }
            return minCoins === Infinity ? -1 : minCoins;
          }
        `,
        pyCode: `
def coin_change(coins, amount):
    if amount == 0: return 0
    if amount < 0: return -1
    min_coins = float('inf')
    for coin in coins:
        res = coin_change(coins, amount - coin)
        if res >= 0:
            min_coins = min(min_coins, res + 1)
    return -1 if min_coins == float('inf') else min_coins
        `
      },
      {
        name: 'Dynamic Programming (O(n*amount))',
        tags: ['optimized'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        jsCode: `
          function coinChange(coins, amount) {
            const dp = new Array(amount + 1).fill(Infinity);
            dp[0] = 0;
            for (let i = 1; i <= amount; i++) {
              for (const coin of coins) {
                if (coin <= i) {
                  dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
              }
            }
            return dp[amount] === Infinity ? -1 : dp[amount];
          }
        `,
        pyCode: `
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return -1 if dp[amount] == float('inf') else dp[amount]
        `
      }
    ]
  }
};
