/**
 * C++ Compiler Service (via Judge0 Official/Public CE API)
 * 一个公开的 C++ 编译器服务接口
 * API: https://ce.judge0.com
 */

export interface CompileResult {
    success: boolean;
    output: string;
    error?: string;
}

export async function runCppCode(code: string): Promise<CompileResult> {
    try {
        // Prepare code with headers and main if needed
        let finalCode = code;

        // 1. Add common headers if not present
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
            'using namespace std;'
        ];

        // Simple check to avoid duplicating inclusions if user already added them (naive check)
        // We prepending implies they come first. 
        // We'll just prepend standard ones. Modern compilers handle duplicate includes with guards.
        finalCode = headers.join('\n') + '\n\n' + finalCode;

        // 2. Check for main function
        if (!finalCode.includes('int main')) {
            finalCode += '\n\nint main() {\n    cout << "Compilation successful! (No main function detected, so code was not executed against test cases)" << endl;\n    return 0;\n}';
        }

        // Encode input to Base64 to handle Unicode characters (like Chinese comments)
        const encodeBase64 = (str: string) => {
            try {
                return btoa(unescape(encodeURIComponent(str)));
            } catch (e) {
                return btoa(str); // Fallback
            }
        };

        const response = await fetch('https://ce.judge0.com/submissions/?base64_encoded=true&wait=true', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source_code: encodeBase64(finalCode),
                language_id: 54, // C++ (GCC 9.2.0)
                stdin: encodeBase64(""),
            })
        });


        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Judge0 API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();

        // Judge0 Logic (Output is Base64 encoded because request was base64_encoded=true? 
        // No, 'base64_encoded' query param affects BOTH input and output behavior usually, 
        // but Judge0 responses might be encoded if input was? 
        // Documentation: "If true, source_code, stdin, expected_output ... must be base64 encoded. 
        // stdout, stderr, compile_output, message, exit_code, exit_signal will be base64 encoded in the response."

        const decodeBase64 = (str: string | null) => {
            if (!str) return '';
            try {
                return decodeURIComponent(escape(atob(str)));
            } catch (e) {
                return atob(str);
            }
        };

        const isSuccess = data.status && data.status.id === 3;
        const stdout = decodeBase64(data.stdout);
        const stderr = decodeBase64(data.stderr);
        const compile_output = decodeBase64(data.compile_output);
        const message = decodeBase64(data.message); // Sometimes used

        const output = (compile_output || '') + (stdout || '') + (stderr || '') + (message || '');
        const error = isSuccess ? undefined : (compile_output || stderr || data.status.description);

        return {
            success: isSuccess,
            output: isSuccess ? output : '',
            error: isSuccess ? undefined : error
        };
    } catch (error: any) {
        return {
            success: false,
            output: '',
            error: error.message || 'Judge0 service unreachable'
        };
    }
}
