

export interface TestCaseResult {
    id: number;
    input: Record<string, any>;
    expected: any;
    actual: any;
    passed: boolean;
    time: number; // ms
    error?: string;
    stdout?: string; // 该用例执行期间的标准输出
}

/**
 * 构造 Python 判题代码
 * 将用户代码包裹在测试逻辑中
 * 支持的类型: List, Optional, ListNode, TreeNode 等
 */
export function generatePythonTestScript(userCode: string, testCases: any[], meta?: { functionName: string; args: { name: string; type: string }[]; returnType: string }): string {
    // 将 JSON 转换为 Python 格式（true->True, false->False, null->None）
    const testCasesJson = JSON.stringify(testCases)
        .replace(/\btrue\b/g, 'True')
        .replace(/\bfalse\b/g, 'False')
        .replace(/\bnull\b/g, 'None');

    const metaJson = meta
        ? JSON.stringify(meta)
            .replace(/\btrue\b/g, 'True')
            .replace(/\bfalse\b/g, 'False')
            .replace(/\bnull\b/g, 'None')
        : 'None';

    return `
import json
import time
import sys
import io
import inspect
from typing import *

# ==================== 辅助数据结构定义 ====================

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    
    def __repr__(self):
        vals = []
        node = self
        while node:
            vals.append(node.val)
            node = node.next
        return str(vals)

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# ==================== 类型转换辅助函数 ====================

def list_to_listnode(arr):
    """将数组转换为链表"""
    if not arr:
        return None
    head = ListNode(arr[0])
    curr = head
    for val in arr[1:]:
        curr.next = ListNode(val)
        curr = curr.next
    return head

def listnode_to_list(head):
    """将链表转换为数组"""
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def list_to_treenode(arr):
    """将数组转换为二叉树 (层序遍历格式)"""
    if not arr:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

def treenode_to_list(root):
    """将二叉树转换为数组 (层序遍历格式)"""
    if not root:
        return []
    result = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    # 去除尾部的 None
    while result and result[-1] is None:
        result.pop()
    return result

def convert_input(val, type_str):
    """根据类型字符串转换输入值"""
    if 'ListNode' in type_str:
        return list_to_listnode(val)
    elif 'TreeNode' in type_str:
        return list_to_treenode(val)
    return val

def convert_output(val, type_str):
    """根据类型字符串转换输出值为可比较的格式"""
    if val is None:
        # 对于 ListNode 和 TreeNode，None 应该转换为 []
        if 'ListNode' in type_str or 'TreeNode' in type_str:
            return []
        return None
    if isinstance(val, ListNode):
        return listnode_to_list(val)
    if isinstance(val, TreeNode):
        return treenode_to_list(val)
    return val

# ==================== 用户代码 ====================
${userCode}
# ==================== 用户代码结束 ====================

def __run_tests():
    test_cases = ${testCasesJson}
    meta = ${metaJson}
    results = []
    
    try:
        # 实例化 Solution
        if 'Solution' not in globals():
            print(json.dumps({"error": "Class 'Solution' not found"}))
            return

        sol = Solution()
        
        # 确定目标方法
        if meta and isinstance(meta, dict) and 'functionName' in meta:
            target_method_name = meta['functionName']
            if not hasattr(sol, target_method_name):
                print(json.dumps({"error": f"Method '{target_method_name}' not found in Solution"}))
                return
            target_method = getattr(sol, target_method_name)
        else:
            # 自动查找目标方法 (排除 __ 开头的)
            methods = [m for m in dir(sol) if callable(getattr(sol, m)) and not m.startswith("__")]
            if not methods:
                print(json.dumps({"error": "No execution method found in Solution"}))
                return
            target_method_name = methods[0]
            target_method = getattr(sol, target_method_name)
        
        sig = inspect.signature(target_method)

        for i, case in enumerate(test_cases):
            # 准备参数
            args_input = case['input']
            args = []
            
            # 根据函数签名顺序匹配参数，并进行类型转换
            try:
                param_names = [p for p in sig.parameters if p != 'self']
                for j, param_name in enumerate(param_names):
                    if param_name in args_input:
                        val = args_input[param_name]
                        # 根据 meta 中的类型信息进行转换
                        if meta and isinstance(meta, dict) and 'args' in meta and j < len(meta['args']):
                            type_str = meta['args'][j].get('type', '')
                            val = convert_input(val, type_str)
                        args.append(val)
            except Exception as e:
                results.append({
                    "id": i,
                    "passed": False,
                    "error": f"Argument parsing error: {str(e)}",
                    "input": args_input,
                    "expected": case['expected'],
                    "actual": None,
                    "time": 0
                })
                continue

            # 捕获 stdout
            old_stdout = sys.stdout
            sys.stdout = mystdout = io.StringIO()
            
            start_time = time.perf_counter()
            error = None
            actual = None
            passed = False
            
            try:
                actual = target_method(*args)
                
                # 转换输出为可比较格式
                return_type = meta.get('returnType', '') if meta and isinstance(meta, dict) else ''
                actual_converted = convert_output(actual, return_type)
                expected = case['expected']
                
                # 结果比对
                passed = actual_converted == expected
                actual = actual_converted  # 使用转换后的值
                
            except Exception as e:
                error = str(e)
                passed = False
            
            end_time = time.perf_counter()
            
            # 恢复 stdout
            sys.stdout = old_stdout
            case_stdout = mystdout.getvalue()
            
            results.append({
                "id": i,
                "passed": passed,
                "input": args_input,
                "expected": case['expected'],
                "actual": actual,
                "error": error,
                "time": (end_time - start_time) * 1000,
                "stdout": case_stdout
            })

        print("___JSON_RESULT_START___")
        print(json.dumps(results))
        print("___JSON_RESULT_END___")

    except Exception as e:
        print(json.dumps({"error": f"Script execution error: {str(e)}"}))

__run_tests()
`;
}
