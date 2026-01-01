import { Problem } from '../types';

export const PROBLEMS: Record<string, Problem> = {
    twosum: {
        id: 'twosum',
        number: 1,
        title: '两数之和',
        difficulty: 'Easy',
        tags: ['数组', '哈希表'],
        description: `给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。`,
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '只会存在一个有效答案'],
        examples: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: '因为 nums[0] + nums[1] == 9 ，返回 [0, 1]' },
            { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
        ],
        solutions: [
            {
                name: '解法一：暴力枚举',
                complexity: 'O(n²)',
                pyCode: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        n = len(nums)
        for i in range(n):
            for j in range(i + 1, n):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []`,
                cppCode: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int n = nums.size();
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                if (nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        return {};
    }
};`
            },
            {
                name: '解法二：哈希表',
                complexity: 'O(n)',
                pyCode: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hashtable = dict()
        for i, num in enumerate(nums):
            if target - num in hashtable:
                return [hashtable[target - num], i]
            hashtable[num] = i
        return []`,
                cppCode: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> hashtable;
        for (int i = 0; i < nums.size(); ++i) {
            auto it = hashtable.find(target - nums[i]);
            if (it != hashtable.end()) {
                return {it->second, i};
            }
            hashtable[nums[i]] = i;
        }
        return {};
    }
};`
            }
        ],
        starterCode: {
            python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        pass`,
            cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`
        },
        testCases: [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1], name: "Case 1" },
            { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2], name: "Case 2" },
            { input: { nums: [3, 3], target: 6 }, expected: [0, 1], name: "Case 3" }
        ],
        meta: {
            functionName: 'twoSum',
            args: [{ name: 'nums', type: 'vector<int>' }, { name: 'target', type: 'int' }],
            returnType: 'vector<int>'
        }
    },

    fibonacci: {
        id: 'fibonacci',
        number: 509,
        title: '斐波那契数',
        difficulty: 'Easy',
        tags: ['递归', '记忆化搜索', '动态规划'],
        description: `斐波那契数（通常用 F(n) 表示）形成的序列称为斐波那契数列。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。

F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1`,
        constraints: ['0 <= n <= 30'],
        examples: [
            { input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1' },
            { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3' },
        ],
        solutions: [
            {
                name: '解法一：暴力递归',
                complexity: 'O(2^n)',
                pyCode: `class Solution:
    def fib(self, n: int) -> int:
        if n < 2:
            return n
        return self.fib(n - 1) + self.fib(n - 2)`,
                cppCode: `class Solution {
public:
    int fib(int n) {
        if (n < 2) return n;
        return fib(n - 1) + fib(n - 2);
    }
};`
            },
            {
                name: '解法二：动态规划（滚动数组）',
                complexity: 'O(n)',
                pyCode: `class Solution:
    def fib(self, n: int) -> int:
        if n < 2:
            return n
        p, q, r = 0, 0, 1
        for i in range(2, n + 1):
            p, q = q, r
            r = p + q
        return r`,
                cppCode: `class Solution {
public:
    int fib(int n) {
        if (n < 2) return n;
        int p = 0, q = 0, r = 1;
        for (int i = 2; i <= n; ++i) {
            p = q; q = r; r = p + q;
        }
        return r;
    }
};`
            }
        ],
        starterCode: {
            python: `class Solution:
    def fib(self, n: int) -> int:
        pass`,
            cpp: `class Solution {
public:
    int fib(int n) {
        
    }
};`
        },
        testCases: [
            { input: { n: 2 }, expected: 1, name: "Case 1" },
            { input: { n: 4 }, expected: 3, name: "Case 2" },
            { input: { n: 10 }, expected: 55, name: "Case 3" }
        ],
        meta: {
            functionName: 'fib',
            args: [{ name: 'n', type: 'int' }],
            returnType: 'int'
        }
    },

    climbingstairs: {
        id: 'climbingstairs',
        number: 70,
        title: '爬楼梯',
        difficulty: 'Easy',
        tags: ['记忆化搜索', '动态规划'],
        description: `假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？`,
        constraints: ['1 <= n <= 45'],
        examples: [
            { input: 'n = 2', output: '2', explanation: '有两种方法：1阶+1阶 或 直接2阶' },
            { input: 'n = 3', output: '3', explanation: '有三种方法：1+1+1、1+2、2+1' },
        ],
        solutions: [
            {
                name: '解法一：记忆化递归',
                complexity: 'O(n)',
                pyCode: `class Solution:
    def climbStairs(self, n: int) -> int:
        memo = {}
        def climb(i):
            if i <= 2:
                return i
            if i not in memo:
                memo[i] = climb(i-1) + climb(i-2)
            return memo[i]
        return climb(n)`,
                cppCode: `class Solution {
    unordered_map<int, int> memo;
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        if (memo.find(n) == memo.end()) {
            memo[n] = climbStairs(n-1) + climbStairs(n-2);
        }
        return memo[n];
    }
};`
            },
            {
                name: '解法二：动态规划',
                complexity: 'O(n)',
                pyCode: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        dp = [0] * (n + 1)
        dp[1], dp[2] = 1, 2
        for i in range(3, n + 1):
            dp[i] = dp[i-1] + dp[i-2]
        return dp[n]`,
                cppCode: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int p = 1, q = 2;
        for (int i = 3; i <= n; ++i) {
            int tmp = p + q;
            p = q; q = tmp;
        }
        return q;
    }
};`
            }
        ],
        starterCode: {
            python: `class Solution:
    def climbStairs(self, n: int) -> int:
        pass`,
            cpp: `class Solution {
public:
    int climbStairs(int n) {
        
    }
};`
        },
        testCases: [
            { input: { n: 2 }, expected: 2, name: "Case 1" },
            { input: { n: 3 }, expected: 3, name: "Case 2" },
            { input: { n: 5 }, expected: 8, name: "Case 3" }
        ],
        meta: {
            functionName: 'climbStairs',
            args: [{ name: 'n', type: 'int' }],
            returnType: 'int'
        }
    },

    maxsubarray: {
        id: 'maxsubarray',
        number: 53,
        title: '最大子数组和',
        difficulty: 'Medium',
        tags: ['数组', '分治', '动态规划'],
        description: `给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。`,
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        examples: [
            { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '连续子数组 [4,-1,2,1] 的和最大，为 6' },
        ],
        solutions: [
            {
                name: '解法一：动态规划',
                complexity: 'O(n)',
                pyCode: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        pre, max_sum = 0, nums[0]
        for x in nums:
            pre = max(pre + x, x)
            max_sum = max(max_sum, pre)
        return max_sum`,
                cppCode: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int pre = 0, maxSum = nums[0];
        for (int x : nums) {
            pre = max(pre + x, x);
            maxSum = max(maxSum, pre);
        }
        return maxSum;
    }
};`
            },
            {
                name: '解法二：贪心算法',
                complexity: 'O(n)',
                pyCode: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        max_sum = float('-inf')
        current_sum = 0
        for num in nums:
            current_sum += num
            max_sum = max(max_sum, current_sum)
            if current_sum < 0:
                current_sum = 0
        return max_sum`,
                cppCode: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = INT_MIN, currentSum = 0;
        for (int num : nums) {
            currentSum += num;
            maxSum = max(maxSum, currentSum);
            if (currentSum < 0) currentSum = 0;
        }
        return maxSum;
    }
};`
            }
        ],
        starterCode: {
            python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        pass`,
            cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        
    }
};`
        },
        testCases: [
            { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6, name: "Case 1" },
            { input: { nums: [1] }, expected: 1, name: "Case 2" },
            { input: { nums: [5, 4, -1, 7, 8] }, expected: 23, name: "Case 3" }
        ],
        meta: {
            functionName: 'maxSubArray',
            args: [{ name: 'nums', type: 'vector<int>' }],
            returnType: 'int'
        }
    },

    mergesort: {
        id: 'mergesort',
        number: 912,
        title: '排序数组',
        difficulty: 'Medium',
        tags: ['数组', '分治', '排序'],
        description: `给你一个整数数组 nums，请你将该数组升序排列。

本题旨在让你实现不同的排序算法，比较它们的性能表现。`,
        constraints: ['1 <= nums.length <= 5 * 10^4', '-5 * 10^4 <= nums[i] <= 5 * 10^4'],
        examples: [
            { input: 'nums = [5,2,3,1]', output: '[1,2,3,5]' },
            { input: 'nums = [5,1,1,2,0,0]', output: '[0,0,1,1,2,5]' },
        ],
        solutions: [
            {
                name: '解法一：归并排序',
                complexity: 'O(n log n)',
                pyCode: `class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        def merge_sort(arr):
            if len(arr) <= 1:
                return arr
            mid = len(arr) // 2
            left = merge_sort(arr[:mid])
            right = merge_sort(arr[mid:])
            return merge(left, right)
        
        def merge(left, right):
            result = []
            i = j = 0
            while i < len(left) and j < len(right):
                if left[i] <= right[j]:
                    result.append(left[i])
                    i += 1
                else:
                    result.append(right[j])
                    j += 1
            result.extend(left[i:])
            result.extend(right[j:])
            return result
        
        return merge_sort(nums)`,
                cppCode: `class Solution {
public:
    vector<int> sortArray(vector<int>& nums) {
        mergeSort(nums, 0, nums.size() - 1);
        return nums;
    }
    
    void mergeSort(vector<int>& nums, int l, int r) {
        if (l >= r) return;
        int mid = l + (r - l) / 2;
        mergeSort(nums, l, mid);
        mergeSort(nums, mid + 1, r);
        merge(nums, l, mid, r);
    }
    
    void merge(vector<int>& nums, int l, int m, int r) {
        vector<int> tmp(r - l + 1);
        int i = l, j = m + 1, k = 0;
        while (i <= m && j <= r) {
            tmp[k++] = nums[i] <= nums[j] ? nums[i++] : nums[j++];
        }
        while (i <= m) tmp[k++] = nums[i++];
        while (j <= r) tmp[k++] = nums[j++];
        for (int p = 0; p < tmp.size(); ++p) nums[l + p] = tmp[p];
    }
};`
            },
            {
                name: '解法二：快速排序',
                complexity: 'O(n log n)',
                pyCode: `class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        import random
        def quicksort(arr, l, r):
            if l >= r:
                return
            pivot_idx = random.randint(l, r)
            arr[pivot_idx], arr[r] = arr[r], arr[pivot_idx]
            pivot = arr[r]
            i = l
            for j in range(l, r):
                if arr[j] < pivot:
                    arr[i], arr[j] = arr[j], arr[i]
                    i += 1
            arr[i], arr[r] = arr[r], arr[i]
            quicksort(arr, l, i - 1)
            quicksort(arr, i + 1, r)
        
        quicksort(nums, 0, len(nums) - 1)
        return nums`,
                cppCode: `class Solution {
public:
    vector<int> sortArray(vector<int>& nums) {
        quickSort(nums, 0, nums.size() - 1);
        return nums;
    }
    
    void quickSort(vector<int>& nums, int l, int r) {
        if (l >= r) return;
        int pivot = nums[l + rand() % (r - l + 1)];
        int i = l, j = r;
        while (i <= j) {
            while (nums[i] < pivot) i++;
            while (nums[j] > pivot) j--;
            if (i <= j) swap(nums[i++], nums[j--]);
        }
        quickSort(nums, l, j);
        quickSort(nums, i, r);
    }
};`
            }
        ],
        starterCode: {
            python: `class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        pass`,
            cpp: `class Solution {
public:
    vector<int> sortArray(vector<int>& nums) {
        
    }
};`
        },
        testCases: [
            { input: { nums: [5, 2, 3, 1] }, expected: [1, 2, 3, 5], name: "Case 1" },
            { input: { nums: [5, 1, 1, 2, 0, 0] }, expected: [0, 0, 1, 1, 2, 5], name: "Case 2" }
        ],
        meta: {
            functionName: 'sortArray',
            args: [{ name: 'nums', type: 'vector<int>' }],
            returnType: 'vector<int>'
        }
    },

    binarysearch: {
        id: 'binarysearch',
        number: 704,
        title: '二分查找',
        difficulty: 'Easy',
        tags: ['数组', '二分查找'],
        description: `给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。`,
        constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'nums 中的所有元素是不重复的', 'nums 按升序排列'],
        examples: [
            { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 出现在 nums 中并且下标为 4' },
            { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 不存在 nums 中因此返回 -1' },
        ],
        solutions: [
            {
                name: '解法一：左闭右闭区间',
                complexity: 'O(log n)',
                pyCode: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1`,
                cppCode: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
};`
            },
            {
                name: '解法二：左闭右开区间',
                complexity: 'O(log n)',
                pyCode: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums)
        while left < right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid
        return -1`,
                cppCode: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size();
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid;
        }
        return -1;
    }
};`
            }
        ],
        starterCode: {
            python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        pass`,
            cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        
    }
};`
        },
        testCases: [
            { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expected: 4, name: "Case 1" },
            { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expected: -1, name: "Case 2" }
        ],
        meta: {
            functionName: 'search',
            args: [{ name: 'nums', type: 'vector<int>' }, { name: 'target', type: 'int' }],
            returnType: 'int'
        }
    },

    validparentheses: {
        id: 'validparentheses',
        number: 20,
        title: '有效的括号',
        difficulty: 'Easy',
        tags: ['栈', '字符串'],
        description: `给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：
1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。`,
        constraints: ['1 <= s.length <= 10^4', 's 仅由括号 \'()[]{}\' 组成'],
        examples: [
            { input: 's = "()"', output: 'true' },
            { input: 's = "()[]{}"', output: 'true' },
            { input: 's = "(]"', output: 'false' },
        ],
        solutions: [
            {
                name: '解法一：栈匹配',
                complexity: 'O(n)',
                pyCode: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                if not stack or stack.pop() != mapping[char]:
                    return False
            else:
                stack.append(char)
        return len(stack) == 0`,
                cppCode: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> mapping = {
            {')', '('}, {'}', '{'}, {']', '['}
        };
        for (char c : s) {
            if (mapping.count(c)) {
                if (st.empty() || st.top() != mapping[c]) return false;
                st.pop();
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};`
            },
            {
                name: '解法二：替换消除法',
                complexity: 'O(n²)',
                pyCode: `class Solution:
    def isValid(self, s: str) -> bool:
        while '()' in s or '{}' in s or '[]' in s:
            s = s.replace('()', '').replace('{}', '').replace('[]', '')
        return s == ''`,
                cppCode: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                if (c == ')' && st.top() != '(') return false;
                if (c == '}' && st.top() != '{') return false;
                if (c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`
            }
        ],
        starterCode: {
            python: `class Solution:
    def isValid(self, s: str) -> bool:
        pass`,
            cpp: `class Solution {
public:
    bool isValid(string s) {
        
    }
};`
        },
        testCases: [
            { input: { s: "()" }, expected: true, name: "Case 1" },
            { input: { s: "()[]{}" }, expected: true, name: "Case 2" },
            { input: { s: "(]" }, expected: false, name: "Case 3" }
        ],
        meta: {
            functionName: 'isValid',
            args: [{ name: 's', type: 'string' }],
            returnType: 'bool'
        }
    },

    reverselinkedlist: {
        id: 'reverselinkedlist',
        number: 206,
        title: '反转链表',
        difficulty: 'Easy',
        tags: ['递归', '链表'],
        description: `给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。`,
        constraints: ['链表中节点的数目范围是 [0, 5000]', '-5000 <= Node.val <= 5000'],
        examples: [
            { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
            { input: 'head = [1,2]', output: '[2,1]' },
        ],
        solutions: [
            {
                name: '解法一：迭代法',
                complexity: 'O(n)',
                pyCode: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        return prev`,
                cppCode: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};`
            },
            {
                name: '解法二：递归法',
                complexity: 'O(n)',
                pyCode: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return head
        new_head = self.reverseList(head.next)
        head.next.next = head
        head.next = None
        return new_head`,
                cppCode: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if (!head || !head->next) return head;
        ListNode* newHead = reverseList(head->next);
        head->next->next = head;
        head->next = nullptr;
        return newHead;
    }
};`
            }
        ],
        starterCode: {
            python: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        pass`,
            cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        
    }
};`
        },
        testCases: [
            { input: { head: [1, 2, 3, 4, 5] }, expected: [5, 4, 3, 2, 1], name: "Case 1" },
            { input: { head: [1, 2] }, expected: [2, 1], name: "Case 2" },
            { input: { head: [] }, expected: [], name: "Case 3" }
        ],
        meta: {
            functionName: 'reverseList',
            args: [{ name: 'head', type: 'ListNode*' }],
            returnType: 'ListNode*'
        }
    },

    coinchange: {
        id: 'coinchange',
        number: 322,
        title: '零钱兑换',
        difficulty: 'Medium',
        tags: ['广度优先搜索', '动态规划'],
        description: `给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。

计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。

你可以认为每种硬币的数量是无限的。`,
        constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
        examples: [
            { input: 'coins = [1, 2, 5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
            { input: 'coins = [2], amount = 3', output: '-1' },
        ],
        solutions: [
            {
                name: '解法一：动态规划（自底向上）',
                complexity: 'O(n × amount)',
                pyCode: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for coin in coins:
                if coin <= i:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`,
                cppCode: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, INT_MAX);
        dp[0] = 0;
        for (int i = 1; i <= amount; ++i) {
            for (int coin : coins) {
                if (coin <= i && dp[i - coin] != INT_MAX) {
                    dp[i] = min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] == INT_MAX ? -1 : dp[amount];
    }
};`
            },
            {
                name: '解法二：BFS广度优先搜索',
                complexity: 'O(n × amount)',
                pyCode: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        if amount == 0:
            return 0
        from collections import deque
        visited = set([0])
        queue = deque([0])
        level = 0
        while queue:
            level += 1
            for _ in range(len(queue)):
                curr = queue.popleft()
                for coin in coins:
                    next_val = curr + coin
                    if next_val == amount:
                        return level
                    if next_val < amount and next_val not in visited:
                        visited.add(next_val)
                        queue.append(next_val)
        return -1`,
                cppCode: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        if (amount == 0) return 0;
        vector<bool> visited(amount + 1, false);
        queue<int> q;
        q.push(0);
        visited[0] = true;
        int level = 0;
        while (!q.empty()) {
            level++;
            int sz = q.size();
            for (int i = 0; i < sz; ++i) {
                int curr = q.front(); q.pop();
                for (int coin : coins) {
                    int next = curr + coin;
                    if (next == amount) return level;
                    if (next < amount && !visited[next]) {
                        visited[next] = true;
                        q.push(next);
                    }
                }
            }
        }
        return -1;
    }
};`
            }
        ],
        starterCode: {
            python: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        pass`,
            cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        
    }
};`
        },
        testCases: [
            { input: { coins: [1, 2, 5], amount: 11 }, expected: 3, name: "Case 1" },
            { input: { coins: [2], amount: 3 }, expected: -1, name: "Case 2" },
            { input: { coins: [1], amount: 0 }, expected: 0, name: "Case 3" }
        ],
        meta: {
            functionName: 'coinChange',
            args: [{ name: 'coins', type: 'vector<int>' }, { name: 'amount', type: 'int' }],
            returnType: 'int'
        }
    },

    mergeintervals: {
        id: 'mergeintervals',
        number: 56,
        title: '合并区间',
        difficulty: 'Medium',
        tags: ['数组', '排序'],
        description: `以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi]。请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。`,
        constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= starti <= endi <= 10^4'],
        examples: [
            { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6]' },
        ],
        solutions: [
            {
                name: '解法一：排序后合并',
                complexity: 'O(n log n)',
                pyCode: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort(key=lambda x: x[0])
        merged = []
        for interval in intervals:
            if not merged or merged[-1][1] < interval[0]:
                merged.append(interval)
            else:
                merged[-1][1] = max(merged[-1][1], interval[1])
        return merged`,
                cppCode: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> merged;
        for (auto& interval : intervals) {
            if (merged.empty() || merged.back()[1] < interval[0]) {
                merged.push_back(interval);
            } else {
                merged.back()[1] = max(merged.back()[1], interval[1]);
            }
        }
        return merged;
    }
};`
            },
            {
                name: '解法二：双指针法',
                complexity: 'O(n log n)',
                pyCode: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort()
        result = []
        start, end = intervals[0]
        for i in range(1, len(intervals)):
            if intervals[i][0] <= end:
                end = max(end, intervals[i][1])
            else:
                result.append([start, end])
                start, end = intervals[i]
        result.append([start, end])
        return result`,
                cppCode: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> result;
        int start = intervals[0][0], end = intervals[0][1];
        for (int i = 1; i < intervals.size(); ++i) {
            if (intervals[i][0] <= end) {
                end = max(end, intervals[i][1]);
            } else {
                result.push_back({start, end});
                start = intervals[i][0];
                end = intervals[i][1];
            }
        }
        result.push_back({start, end});
        return result;
    }
};`
            }
        ],
        starterCode: {
            python: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        pass`,
            cpp: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        
    }
};`
        },
        testCases: [
            { input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, expected: [[1, 6], [8, 10], [15, 18]], name: "Case 1" },
            { input: { intervals: [[1, 4], [4, 5]] }, expected: [[1, 5]], name: "Case 2" }
        ],
        meta: {
            functionName: 'merge',
            args: [{ name: 'intervals', type: 'vector<vector<int>>' }],
            returnType: 'vector<vector<int>>'
        }
    },
};
