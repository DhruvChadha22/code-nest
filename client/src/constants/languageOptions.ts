export const languageOptions = [
    {
        value: "java",
        label: "Java",
        defaultCode: `// Java (OpenJDK)
import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your solution here
        System.out.println("Hello World");
    }
}`
    },
    {
        value: "cpp",
        label: "C++",
        defaultCode: `// C++ (GNU G++17)
#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution here
    cout << "Hello World" << endl;

    return 0;
}`
    },
    {
        value: "python",
        label: "Python",
        defaultCode: `# Python
def main():
    # Implement your solution here
    print("Hello World")

if __name__ == "__main__":
    main()`
    },
    {
        value: "javascript",
        label: "JavaScript",
        defaultCode: `// JavaScript (Node.js)
function solve() {
    // Write your solution here
    console.log("Hello World");
}

solve();`
    },
    {
        value: "typescript",
        label: "TypeScript",
        defaultCode: `// TypeScript
function solve(): void {
    // Write your solution here
    console.log("Hello World");
}

solve();`
    },
    {
        value: "c",
        label: "C",
        defaultCode: `// C (Clang)
#include <stdio.h>

int main() {
    // Write your solution here
    printf("Hello World");

    return 0;
}`
    },
];
