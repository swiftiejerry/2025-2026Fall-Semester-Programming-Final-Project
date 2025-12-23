export const PROBLEMS = {
  twosum: {
    id: 'twosum',
    number: 1,
    title: '两数之和',
    difficulty: 'Easy',
    tags: ['数组', '哈希表'],
    description:
      '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。\n\n你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。\n\n你可以按任意顺序返回答案。',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: '因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] == 6',
      },
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10^4',
      '-10^9 ≤ nums[i] ≤ 10^9',
      '-10^9 ≤ target ≤ 10^9',
      '只会存在一个有效答案',
    ],
    solutions: [
      {
        name: '暴力双循环',
        complexity: 'O(n^2)',
        pyCode: `def two_sum(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
        cppCode: `vector<int> twoSum(vector<int>& nums, int target) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}`,
      },
      {
        name: '哈希表',
        complexity: 'O(n)',
        pyCode: `def two_sum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []`,
        cppCode: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> hashmap;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (hashmap.find(complement) != hashmap.end()) {
            return {hashmap[complement], i};
        }
        hashmap[nums[i]] = i;
    }
    return {};
}`,
      },
    ],
  },
  countPrimes: {
    id: 'countPrimes',
    number: 204,
    title: '计数质数',
    difficulty: 'Medium',
    tags: ['数组', '数学', '数论'],
    description: '给定整数 n ，返回所有小于 n 的质数的数量。',
    examples: [
      {
        input: 'n = 10',
        output: '4',
        explanation: '小于 10 的质数一共有 4 个, 它们是 2, 3, 5, 7 。',
      },
      { input: 'n = 0', output: '0' },
      { input: 'n = 1', output: '0' },
    ],
    constraints: ['0 ≤ n ≤ 5 * 10^6'],
    solutions: [
      {
        name: '暴力试除',
        complexity: 'O(n√n)',
        pyCode: `def count_primes(n):
    def is_prime(num):
        if num < 2: return False
        for i in range(2, int(num**0.5)+1):
            if num % i == 0: return False
        return True
    return sum(is_prime(i) for i in range(2, n))`,
        cppCode: `int countPrimes(int n) {
    int count = 0;
    for (int i = 2; i < n; i++) {
        if (isPrime(i)) count++;
    }
    return count;
}

bool isPrime(int num) {
    if (num < 2) return false;
    for (int i = 2; i*i <= num; i++)
        if (num % i == 0) return false;
    return true;
}`,
      },
      {
        name: '埃氏筛法',
        complexity: 'O(n log log n)',
        pyCode: `def count_primes(n):
    if n < 2: return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5)+1):
        if is_prime[i]:
            for j in range(i*i, n, i):
                is_prime[j] = False
    return sum(is_prime)`,
        cppCode: `int countPrimes(int n) {
    if (n < 2) return 0;
    vector<bool> isPrime(n, true);
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; i*i < n; i++) {
        if (isPrime[i]) {
            for (int j = i*i; j < n; j += i)
                isPrime[j] = false;
        }
    }
    return count(isPrime.begin(), isPrime.end(), true);
}`,
      },
    ],
  },
  maxProfit: {
    id: 'maxProfit',
    number: 121,
    title: '买卖股票的最佳时机',
    difficulty: 'Easy',
    tags: ['数组', '动态规划'],
    description:
      '给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。\n\n你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。\n\n返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation:
          '在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。',
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: '在这种情况下, 没有交易完成, 所以最大利润为 0。',
      },
    ],
    constraints: ['1 ≤ prices.length ≤ 10^5', '0 ≤ prices[i] ≤ 10^4'],
    solutions: [
      {
        name: '暴力法',
        complexity: 'O(n^2)',
        pyCode: `def max_profit(prices):
    max_p = 0
    for i in range(len(prices)):
        for j in range(i+1, len(prices)):
            max_p = max(max_p, prices[j] - prices[i])
    return max_p`,
        cppCode: `int maxProfit(vector<int>& prices) {
    int maxP = 0;
    for (int i = 0; i < prices.size(); i++) {
        for (int j = i+1; j < prices.size(); j++) {
            maxP = max(maxP, prices[j] - prices[i]);
        }
    }
    return maxP;
}`,
      },
      {
        name: '一次遍历',
        complexity: 'O(n)',
        pyCode: `def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit`,
        cppCode: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX, maxProfit = 0;
    for (int price : prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    return maxProfit;
}`,
      },
    ],
  },
  binarySearch: {
    id: 'binarySearch',
    number: 704,
    title: '二分查找',
    difficulty: 'Easy',
    tags: ['数组', '二分查找'],
    description:
      '给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。',
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 出现在 nums 中并且下标为 4',
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 不存在 nums 中因此返回 -1',
      },
    ],
    constraints: ['1 ≤ nums.length ≤ 10^4', 'nums 按升序排列，且互不相同'],
    solutions: [
      {
        name: '线性查找',
        complexity: 'O(n)',
        pyCode: `def search(nums, target):
    for i, num in enumerate(nums):
        if num == target: return i
    return -1`,
        cppCode: `int search(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] == target) return i;
    }
    return -1;
}`,
      },
      {
        name: '二分查找',
        complexity: 'O(log n)',
        pyCode: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: left = mid + 1
        else: right = mid - 1
    return -1`,
        cppCode: `int search(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      },
    ],
  },
  partitionEqualSubsetSum: {
    id: 'partitionEqualSubsetSum',
    number: 416,
    title: '分割等和子集',
    difficulty: 'Medium',
    tags: ['数组', '动态规划'],
    description:
      '给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。',
    constraints: ['1 <= nums.length <= 200', '1 <= nums[i] <= 100'],
    examples: [
      {
        input: 'nums = [1,5,11,5]',
        output: 'true',
        explanation: '数组可以分割成 [1, 5, 5] 和 [11]',
      },
      {
        input: 'nums = [1,2,3,5]',
        output: 'false',
        explanation: '数组不能分割成两个元素和相等的子集',
      },
    ],
    solutions: [
      {
        name: '暴力回溯',
        complexity: 'O(2^n)',
        pyCode: `def can_partition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    def backtrack(index, current):
        if current == target:
            return True
        if index >= len(nums) or current > target:
            return False
        
        return backtrack(index + 1, current + nums[index]) or \
               backtrack(index + 1, current)
    
    return backtrack(0, 0)`,
        cppCode: `class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int sum = accumulate(nums.begin(), nums.end(), 0);
        if (sum % 2 != 0) return false;
        int target = sum / 2;
        return backtrack(nums, 0, 0, target);
    }
    
    bool backtrack(vector<int>& nums, int index, int current, int target) {
        if (current == target) return true;
        if (index >= nums.size() || current > target) return false;
        return backtrack(nums, index + 1, current + nums[index], target) ||
               backtrack(nums, index + 1, current, target);
    }
};`,
      },
      {
        name: '动态规划',
        complexity: 'O(n·sum)',
        pyCode: `def can_partition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    
    return dp[target]`,
        cppCode: `class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int sum = accumulate(nums.begin(), nums.end(), 0);
        if (sum % 2 != 0) return false;
        
        int target = sum / 2;
        vector<bool> dp(target + 1, false);
        dp[0] = true;
        
        for (int num : nums) {
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j - num];
            }
        }
        
        return dp[target];
    }
};`,
      },
    ],
  },
  sorting: {
    id: 'sorting',
    number: 912,
    title: '排序数组',
    difficulty: 'Medium',
    tags: ['数组', '分治', '排序', '堆'],
    description: '给你一个整数数组 nums，请你将该数组升序排列。',
    constraints: ['1 <= nums.length <= 5 * 10^4'],
    examples: [
      { input: 'nums = [5,2,3,1]', output: '[1,2,3,5]' },
      { input: 'nums = [5,1,1,2,0,0]', output: '[0,0,1,1,2,5]' },
    ],
    solutions: [
      {
        name: '冒泡排序',
        complexity: 'O(n^2)',
        pyCode: `def bubble_sort(nums):
    for i in range(len(nums)):
        for j in range(len(nums)-i-1):
            if nums[j] > nums[j+1]:
                nums[j], nums[j+1] = nums[j+1], nums[j]
    return nums`,
        cppCode: `vector<int> bubbleSort(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (nums[j] > nums[j+1]) {
                swap(nums[j], nums[j+1]);
            }
        }
    }
    return nums;
}`,
      },
      {
        name: '快速排序',
        complexity: 'O(n log n)',
        pyCode: `def quick_sort(nums):
    nums.sort()
    return nums`,
        cppCode: `vector<int> quickSort(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    return nums;
}`,
      },
    ],
  },
  maxSubArray: {
    id: 'maxSubArray',
    number: 53,
    title: '最大子数组和',
    difficulty: 'Medium',
    tags: ['数组', '分治', '动态规划'],
    description:
      '给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。',
    constraints: ['1 <= nums.length <= 10^5'],
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
      { input: 'nums = [1]', output: '1' },
    ],
    solutions: [
      {
        name: '暴力枚举',
        complexity: 'O(n^2)',
        pyCode: `def max_sub_array(nums):
    max_sum = float('-inf')
    for i in range(len(nums)):
        current = 0
        for j in range(i, len(nums)):
            current += nums[j]
            max_sum = max(max_sum, current)
    return max_sum`,
        cppCode: `int maxSubArray(vector<int>& nums) {
    int maxSum = INT_MIN;
    for (int i = 0; i < nums.size(); i++) {
        int current = 0;
        for (int j = i; j < nums.size(); j++) {
            current += nums[j];
            maxSum = max(maxSum, current);
        }
    }
    return maxSum;
}`,
      },
      {
        name: 'Kadane算法',
        complexity: 'O(n)',
        pyCode: `def max_sub_array(nums):
    max_so_far = max_here = nums[0]
    for i in range(1, len(nums)):
        max_here = max(nums[i], max_here + nums[i])
        max_so_far = max(max_so_far, max_here)
    return max_so_far`,
        cppCode: `int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0], maxHere = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        maxHere = max(nums[i], maxHere + nums[i]);
        maxSoFar = max(maxSoFar, maxHere);
    }
    return maxSoFar;
}`,
      },
    ],
  },
  fibonacci: {
    id: 'fibonacci',
    number: 509,
    title: '斐波那契数',
    difficulty: 'Easy',
    tags: ['递归', '数学', '动态规划'],
    description:
      '斐波那契数 （通常用 F(n) 表示）形成的序列称为 斐波那契数列 。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。',
    constraints: ['0 <= n <= 30'],
    examples: [
      { input: 'n = 2', output: '1' },
      { input: 'n = 3', output: '2' },
    ],
    solutions: [
      {
        name: '朴素递归',
        complexity: 'O(2^n)',
        pyCode: `def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)`,
        cppCode: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}`,
      },
      {
        name: '动态规划',
        complexity: 'O(n)',
        pyCode: `def fib(n):
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n+1):
        a, b = b, a+b
    return b`,
        cppCode: `int fib(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}`,
      },
    ],
  },
  climbStairs: {
    id: 'climbStairs',
    number: 70,
    title: '爬楼梯',
    difficulty: 'Easy',
    tags: ['记忆化搜索', '动态规划'],
    description:
      '假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？',
    constraints: ['1 <= n <= 45'],
    examples: [
      { input: 'n = 2', output: '2' },
      { input: 'n = 3', output: '3' },
    ],
    solutions: [
      {
        name: '递归',
        complexity: 'O(2^n)',
        pyCode: `def climb_stairs(n):
    if n <= 2: return n
    return climb_stairs(n-1) + climb_stairs(n-2)`,
        cppCode: `int climbStairs(int n) {
    if (n <= 2) return n;
    return climbStairs(n-1) + climbStairs(n-2);
}`,
      },
      {
        name: '动态规划',
        complexity: 'O(n)',
        pyCode: `def climb_stairs(n):
    if n <= 2: return n
    p1, p2 = 1, 2
    for _ in range(3, n+1):
        p1, p2 = p2, p1+p2
    return p2`,
        cppCode: `int climbStairs(int n) {
    if (n <= 2) return n;
    int p1 = 1, p2 = 2;
    for (int i = 3; i <= n; i++) {
        int temp = p1 + p2;
        p1 = p2;
        p2 = temp;
    }
    return p2;
}`,
      },
    ],
  },
  strStr: {
    id: 'strStr',
    number: 28,
    title: '找出字符串中第一个匹配项的下标',
    difficulty: 'Easy',
    tags: ['双指针', '字符串'],
    description:
      '给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串的第一个匹配项的下标（下标从 0 开始）。',
    constraints: ['1 <= haystack.length, needle.length <= 10^4'],
    examples: [
      { input: 'haystack = "sadbutsad", needle = "sad"', output: '0' },
      { input: 'haystack = "leetcode", needle = "leeto"', output: '-1' },
    ],
    solutions: [
      {
        name: '暴力匹配',
        complexity: 'O(n·m)',
        pyCode: `def str_str(haystack, needle):
    n, m = len(haystack), len(needle)
    for i in range(n - m + 1):
        j = 0
        while j < m and haystack[i+j] == needle[j]:
            j += 1
        if j == m: return i
    return -1`,
        cppCode: `int strStr(string haystack, string needle) {
    int n = haystack.length(), m = needle.length();
    for (int i = 0; i <= n - m; i++) {
        int j = 0;
        while (j < m && haystack[i+j] == needle[j])
            j++;
        if (j == m) return i;
    }
    return -1;
}`,
      },
      {
        name: '内置函数',
        complexity: 'O(n)',
        pyCode: `def str_str(haystack, needle):
    return haystack.find(needle)`,
        cppCode: `int strStr(string haystack, string needle) {
    return haystack.find(needle);
}`,
      },
    ],
  },
  validParentheses: {
    id: 'validParentheses',
    number: 20,
    title: '有效的括号',
    difficulty: 'Easy',
    tags: ['栈', '字符串'],
    description: "给定一个只包括 '(', ')', '{', '}', '[', ']' 的字符串 s ，判断字符串是否有效。",
    constraints: ['1 <= s.length <= 10^4'],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
    ],
    solutions: [
      {
        name: '栈',
        complexity: 'O(n)',
        pyCode: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`,
        cppCode: `bool isValid(string s) {
    stack<char> stk;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            stk.push(c);
        } else {
            if (stk.empty()) return false;
            char top = stk.top();
            if ((c == ')' && top != '(') ||
                (c == '}' && top != '{') ||
                (c == ']' && top != '[')) return false;
            stk.pop();
        }
    }
    return stk.empty();
}`,
      },
      {
        name: '替换法（效率低）',
        complexity: 'O(n^2)',
        pyCode: `def isValid(s):
    while '()' in s or '{}' in s or '[]' in s:
        s = s.replace('()', '').replace('{}', '').replace('[]', '')
    return s == ''`,
        cppCode: `// C++ 不推荐此写法，仅演示思路
bool isValid(string s) {
    // 省略实现
    return false; 
}`,
      },
    ],
  },
  reverseList: {
    id: 'reverseList',
    number: 206,
    title: '反转链表',
    difficulty: 'Easy',
    tags: ['链表', '递归'],
    description: '给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。',
    constraints: ['0 <= n <= 5000'],
    examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }],
    solutions: [
      {
        name: '迭代',
        complexity: 'O(n)',
        pyCode: `def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`,
        cppCode: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
      },
      {
        name: '递归',
        complexity: 'O(n)',
        pyCode: `def reverseList(head):
    if not head or not head.next:
        return head
    p = reverseList(head.next)
    head.next.next = head
    head.next = None
    return p`,
        cppCode: `ListNode* reverseList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* p = reverseList(head->next);
    head->next->next = head;
    head->next = nullptr;
    return p;
}`,
      },
    ],
  },
  mergeTwoLists: {
    id: 'mergeTwoLists',
    number: 21,
    title: '合并两个有序链表',
    difficulty: 'Easy',
    tags: ['链表', '递归'],
    description: '将两个升序链表合并为一个新的 升序 链表并返回。',
    constraints: ['0 <= n, m <= 50'],
    examples: [{ input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]' }],
    solutions: [
      {
        name: '递归',
        complexity: 'O(n+m)',
        pyCode: `def mergeTwoLists(l1, l2):
    if not l1: return l2
    if not l2: return l1
    if l1.val < l2.val:
        l1.next = mergeTwoLists(l1.next, l2)
        return l1
    else:
        l2.next = mergeTwoLists(l1, l2.next)
        return l2`,
        cppCode: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    if (!l1) return l2;
    if (!l2) return l1;
    if (l1->val < l2->val) {
        l1->next = mergeTwoLists(l1->next, l2);
        return l1;
    } else {
        l2->next = mergeTwoLists(l1, l2->next);
        return l2;
    }
}`,
      },
      {
        name: '迭代',
        complexity: 'O(n+m)',
        pyCode: `def mergeTwoLists(l1, l2):
    prehead = ListNode(-1)
    prev = prehead
    while l1 and l2:
        if l1.val <= l2.val:
            prev.next = l1
            l1 = l1.next
        else:
            prev.next = l2
            l2 = l2.next
        prev = prev.next
    prev.next = l1 if l1 else l2
    return prehead.next`,
        cppCode: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode prehead(-1);
    ListNode* prev = &prehead;
    while (l1 && l2) {
        if (l1->val <= l2->val) {
            prev->next = l1;
            l1 = l1->next;
        } else {
            prev->next = l2;
            l2 = l2->next;
        }
        prev = prev->next;
    }
    prev->next = l1 ? l1 : l2;
    return prehead.next;
}`,
      },
    ],
  },
  maxDepth: {
    id: 'maxDepth',
    number: 104,
    title: '二叉树的最大深度',
    difficulty: 'Easy',
    tags: ['树', '深度优先搜索'],
    description: '给定一个二叉树，找出其最大深度。',
    constraints: ['0 <= n <= 10^4'],
    examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3' }],
    solutions: [
      {
        name: '递归DFS',
        complexity: 'O(n)',
        pyCode: `def maxDepth(root):
    if not root: return 0
    return max(maxDepth(root.left), maxDepth(root.right)) + 1`,
        cppCode: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return max(maxDepth(root->left), maxDepth(root->right)) + 1;
}`,
      },
      {
        name: 'BFS层序遍历',
        complexity: 'O(n)',
        pyCode: `def maxDepth(root):
    if not root: return 0
    queue = [root]
    depth = 0
    while queue:
        depth += 1
        for _ in range(len(queue)):
            node = queue.pop(0)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
    return depth`,
        cppCode: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    queue<TreeNode*> q;
    q.push(root);
    int depth = 0;
    while (!q.empty()) {
        int size = q.size();
        while (size--) {
            TreeNode* node = q.front(); q.pop();
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        depth++;
    }
    return depth;
}`,
      },
    ],
  },
  moveZeroes: {
    id: 'moveZeroes',
    number: 283,
    title: '移动零',
    difficulty: 'Easy',
    tags: ['数组', '双指针'],
    description:
      '给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。',
    constraints: ['1 <= nums.length <= 10^4'],
    examples: [{ input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' }],
    solutions: [
      {
        name: '双指针',
        complexity: 'O(n)',
        pyCode: `def moveZeroes(nums):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1`,
        cppCode: `void moveZeroes(vector<int>& nums) {
    int slow = 0;
    for (int fast = 0; fast < nums.size(); fast++) {
        if (nums[fast] != 0) {
            swap(nums[slow++], nums[fast]);
        }
    }
}`,
      },
      {
        name: '两次遍历',
        complexity: 'O(n)',
        pyCode: `def moveZeroes(nums):
    j = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[j] = nums[i]
            j += 1
    for i in range(j, len(nums)):
        nums[i] = 0`,
        cppCode: `void moveZeroes(vector<int>& nums) {
    int j = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] != 0) nums[j++] = nums[i];
    }
    for (; j < nums.size(); j++) nums[j] = 0;
}`,
      },
    ],
  },
  majorityElement: {
    id: 'majorityElement',
    number: 169,
    title: '多数元素',
    difficulty: 'Easy',
    tags: ['数组', '哈希表', '分治'],
    description:
      '给定一个大小为 n 的数组 nums ，返回其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。',
    constraints: ['1 <= n <= 5 * 10^4'],
    examples: [{ input: 'nums = [3,2,3]', output: '3' }],
    solutions: [
      {
        name: '摩尔投票法',
        complexity: 'O(n)',
        pyCode: `def majorityElement(nums):
    count = 0
    candidate = None
    for num in nums:
        if count == 0:
            candidate = num
        count += (1 if num == candidate else -1)
    return candidate`,
        cppCode: `int majorityElement(vector<int>& nums) {
    int count = 0;
    int candidate = 0;
    for (int num : nums) {
        if (count == 0) candidate = num;
        count += (num == candidate) ? 1 : -1;
    }
    return candidate;
}`,
      },
      {
        name: '哈希表',
        complexity: 'O(n)',
        pyCode: `def majorityElement(nums):
    counts = collections.Counter(nums)
    return max(counts.keys(), key=counts.get)`,
        cppCode: `int majorityElement(vector<int>& nums) {
    unordered_map<int, int> counts;
    for (int num : nums) {
        if (++counts[num] > nums.size() / 2) return num;
    }
    return 0;
}`,
      },
    ],
  },
  pathSum: {
    id: 'pathSum',
    number: 112,
    title: '路径总和',
    difficulty: 'Easy',
    tags: ['树', '深度优先搜索'],
    description:
      '给你二叉树的根节点 root 和一个表示目标和的整数 targetSum 。判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和 targetSum 。',
    constraints: ['0 <= n <= 5000'],
    examples: [
      { input: 'root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22', output: 'true' },
    ],
    solutions: [
      {
        name: '递归DFS',
        complexity: 'O(n)',
        pyCode: `def hasPathSum(root, targetSum):
    if not root: return False
    if not root.left and not root.right:
        return targetSum == root.val
    return hasPathSum(root.left, targetSum - root.val) or \
           hasPathSum(root.right, targetSum - root.val)`,
        cppCode: `bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) return false;
    if (!root->left && !root->right) return targetSum == root->val;
    return hasPathSum(root->left, targetSum - root->val) ||
           hasPathSum(root->right, targetSum - root->val);
}`,
      },
      {
        name: 'BFS层序',
        complexity: 'O(n)',
        pyCode: `def hasPathSum(root, targetSum):
    if not root: return False
    que = collections.deque([(root, root.val)])
    while que:
        node, curr = que.popleft()
        if not node.left and not node.right and curr == targetSum:
            return True
        if node.left:
            que.append((node.left, curr + node.left.val))
        if node.right:
            que.append((node.right, curr + node.right.val))
    return False`,
        cppCode: `bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) return false;
    queue<pair<TreeNode*, int>> q;
    q.push({root, root->val});
    while (!q.empty()) {
        auto [node, curr] = q.front(); q.pop();
        if (!node->left && !node->right && curr == targetSum) return true;
        if (node->left) q.push({node->left, curr + node->left->val});
        if (node->right) q.push({node->right, curr + node->right->val});
    }
    return false;
}`,
      },
    ],
  },
  invertTree: {
    id: 'invertTree',
    number: 226,
    title: '翻转二叉树',
    difficulty: 'Easy',
    tags: ['树', '深度优先搜索'],
    description: '给你一棵二叉树的根节点 root ，翻转这棵二叉树，并返回其根节点。',
    constraints: ['0 <= n <= 100'],
    examples: [{ input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' }],
    solutions: [
      {
        name: '递归',
        complexity: 'O(n)',
        pyCode: `def invertTree(root):
    if not root: return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
        cppCode: `TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    TreeNode* temp = root->left;
    root->left = invertTree(root->right);
    root->right = invertTree(temp);
    return root;
}`,
      },
      {
        name: '迭代',
        complexity: 'O(n)',
        pyCode: `def invertTree(root):
    if not root: return None
    queue = [root]
    while queue:
        node = queue.pop(0)
        node.left, node.right = node.right, node.left
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
    return root`,
        cppCode: `TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        swap(node->left, node->right);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    return root;
}`,
      },
    ],
  },
  hasCycle: {
    id: 'hasCycle',
    number: 141,
    title: '环形链表',
    difficulty: 'Easy',
    tags: ['链表', '双指针'],
    description: '给你一个链表的头节点 head ，判断链表中是否有环。',
    constraints: ['0 <= n <= 10^4'],
    examples: [{ input: 'head = [3,2,0,-4], pos = 1', output: 'true' }],
    solutions: [
      {
        name: '快慢指针',
        complexity: 'O(n)',
        pyCode: `def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
        cppCode: `bool hasCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
      },
      {
        name: '哈希表',
        complexity: 'O(n)',
        pyCode: `def hasCycle(head):
    seen = set()
    while head:
        if head in seen:
            return True
        seen.add(head)
        head = head.next
    return False`,
        cppCode: `bool hasCycle(ListNode *head) {
    unordered_set<ListNode*> seen;
    while (head) {
        if (seen.count(head)) return true;
        seen.insert(head);
        head = head->next;
    }
    return false;
}`,
      },
    ],
  },
  singleNumber: {
    id: 'singleNumber',
    number: 136,
    title: '只出现一次的数字',
    difficulty: 'Easy',
    tags: ['位运算', '数组'],
    description:
      '给你一个 非空 整数数组 nums ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。',
    constraints: ['1 <= n <= 3 * 10^4'],
    examples: [
      { input: 'nums = [2,2,1]', output: '1' },
      { input: 'nums = [4,1,2,1,2]', output: '4' },
    ],
    solutions: [
      {
        name: '异或位运算',
        complexity: 'O(n)',
        pyCode: `def singleNumber(nums):
    res = 0
    for num in nums:
        res ^= num
    return res`,
        cppCode: `int singleNumber(vector<int>& nums) {
    int res = 0;
    for (int num : nums) res ^= num;
    return res;
}`,
      },
      {
        name: '哈希表',
        complexity: 'O(n)',
        pyCode: `def singleNumber(nums):
    counts = collections.Counter(nums)
    for num, count in counts.items():
        if count == 1:
            return num`,
        cppCode: `int singleNumber(vector<int>& nums) {
    unordered_map<int, int> counts;
    for (int num : nums) counts[num]++;
    for (auto& p : counts)
        if (p.second == 1) return p.first;
    return 0;
}`,
      },
    ],
  },
};
