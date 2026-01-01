import { Problem } from '../types';

export const generateCppTestRunner = (userCode: string, problem: Problem): string => {
    // 1. Basic Headers
    const headers = [
        '#include <iostream>',
        '#include <vector>',
        '#include <string>',
        '#include <algorithm>',
        '#include <map>',
        '#include <unordered_map>',
        '#include <set>',
        '#include <stack>',
        '#include <queue>',
        '#include <cmath>',
        '#include <climits>',
        '#include <sstream>',
        '#include <chrono>',
        'using namespace std;',
    ];

    // 2. Helper Structures (ListNode, etc)
    const helpers = `
// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

// JSON Output Helpers
void printJson(int v) { cout << v; }
void printJson(long v) { cout << v; }
void printJson(double v) { cout << v; }
void printJson(bool v) { cout << (v ? "true" : "false"); }
void printJson(const string& v) { cout << "\\"" << v << "\\""; }

template<typename T>
void printJson(const vector<T>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); ++i) {
        printJson(v[i]);
        if (i < v.size() - 1) cout << ",";
    }
    cout << "]";
}

void printJson(ListNode* head) {
    cout << "[";
    while (head) {
        cout << head->val;
        if (head->next) cout << ",";
        head = head->next;
    }
    cout << "]";
}

// LinkedList Helper
ListNode* createLinkedList(const vector<int>& vals) {
    if (vals.empty()) return nullptr;
    ListNode* head = new ListNode(vals[0]);
    ListNode* curr = head;
    for (size_t i = 1; i < vals.size(); ++i) {
        curr->next = new ListNode(vals[i]);
        curr = curr->next;
    }
    return head;
}
`;

    if (!problem.meta) {
        return headers.join('\n') + '\n' + helpers + '\n' + userCode + '\n' +
            'int main() { cout << "Error: Validation metadata missing." << endl; return 1; }';
    }

    // 3. Generate Test Logic
    const { functionName, args, returnType } = problem.meta;

    let mainBody = `
int main() {
    Solution sol;
    cout << "___JSON_RESULT_START___" << endl;
    cout << "[";
`;

    // Generate test cases
    if (problem.testCases) {
        problem.testCases.forEach((tc, index) => {
            const inputSetup: string[] = [];
            const callArgs: string[] = [];
            const inputParts: string[] = [];

            args.forEach(arg => {
                const val = tc.input[arg.name];
                let cppVal = '';

                if (arg.type.includes('vector')) {
                    cppVal = JSON.stringify(val).replace(/\[/g, '{').replace(/\]/g, '}');
                    inputParts.push(`cout << "\\"${arg.name}\\":"; printJson(${arg.name}_${index});`);
                } else if (arg.type === 'string') {
                    // Escape the string value for C++
                    const escapedVal = String(val).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                    cppVal = `"${escapedVal}"`;
                    inputParts.push(`cout << "\\"${arg.name}\\":\\"" << ${arg.name}_${index} << "\\"";`);
                } else if (arg.type === 'ListNode*') {
                    const vecVal = JSON.stringify(val).replace(/\[/g, '{').replace(/\]/g, '}');
                    cppVal = `createLinkedList(${vecVal})`;
                    inputParts.push(`cout << "\\"${arg.name}\\":"; printJson(${arg.name}_${index});`);
                } else {
                    cppVal = String(val);
                    inputParts.push(`cout << "\\"${arg.name}\\":" << ${arg.name}_${index};`);
                }

                inputSetup.push(`${arg.type} ${arg.name}_${index} = ${cppVal};`);
                callArgs.push(`${arg.name}_${index}`);
            });

            // Generate expected value
            const expectedVal = tc.expected;
            let cppExpected = '';
            if (returnType.includes('vector')) {
                cppExpected = JSON.stringify(expectedVal).replace(/\[/g, '{').replace(/\]/g, '}');
            } else if (returnType === 'string') {
                const escapedVal = String(expectedVal).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                cppExpected = `"${escapedVal}"`;
            } else if (returnType === 'ListNode*') {
                const vecVal = JSON.stringify(expectedVal).replace(/\[/g, '{').replace(/\]/g, '}');
                cppExpected = `createLinkedList(${vecVal})`;
            } else if (returnType === 'bool') {
                cppExpected = expectedVal ? 'true' : 'false';
            } else {
                cppExpected = String(expectedVal);
            }

            // Generate comparison logic
            let compareLogic = '';
            if (returnType === 'ListNode*') {
                compareLogic = `
        ListNode* p1 = result;
        ListNode* p2 = expected_${index};
        passed = true;
        while(p1 && p2) {
            if(p1->val != p2->val) { passed = false; break; }
            p1 = p1->next;
            p2 = p2->next;
        }
        if (p1 || p2) passed = false;`;
            } else {
                compareLogic = `passed = (result == expected_${index});`;
            }

            // Comma before element (except first)
            const commaPrefix = index > 0 ? '    cout << ",";\n' : '';

            // Build input printing code - print each arg with comma separation
            const inputPrintCode = inputParts.map((part, i) =>
                i > 0 ? `cout << ","; ${part}` : part
            ).join('\n        ');

            mainBody += `
${commaPrefix}    // TestCase ${index}
    {
        ${inputSetup.join('\n        ')}
        
        auto start = chrono::high_resolution_clock::now();
        auto result = sol.${functionName}(${callArgs.join(', ')});
        auto end = chrono::high_resolution_clock::now();
        double time_ms = chrono::duration<double, milli>(end - start).count();
        
        ${returnType} expected_${index} = ${cppExpected};
        
        bool passed = false;
        ${compareLogic}

        cout << "{";
        cout << "\\"id\\":" << ${index};
        cout << ",\\"passed\\":" << (passed ? "true" : "false");
        cout << ",\\"input\\":{";
        ${inputPrintCode}
        cout << "}";
        cout << ",\\"expected\\":";
        printJson(expected_${index});
        cout << ",\\"actual\\":";
        printJson(result);
        cout << ",\\"time\\":" << time_ms;
        cout << "}";
    }
`;
        });
    }

    mainBody += `
    cout << "]" << endl;
    cout << "___JSON_RESULT_END___" << endl;
    return 0;
}
`;

    return headers.join('\n') + '\n' + helpers + '\n' + userCode + '\n' + mainBody;
};
