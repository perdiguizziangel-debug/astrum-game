const fs = require('fs');

const content = fs.readFileSync('/Users/magister/.gemini/antigravity/scratch/astrum/src/components/DirectorDashboard.jsx', 'utf8');

// Strip out backtick string literals (which might contain template CSS/HTML) to avoid false matches
let cleanContent = content.replace(/`[\s\S]*?`/g, '""');

// Strip out standard block comments /* ... */ and line comments // ...
cleanContent = cleanContent.replace(/\/\*[\s\S]*?\*\//g, '');
// For line comments, be careful not to strip http:// URLs
cleanContent = cleanContent.replace(/^[ \t]*\/\/.*$/gm, '');

// Parse tags globally
let reg = /<\/?([a-zA-Z0-9]+)(?:\s+[^>]*?)?>/gs;
let match;
let openTags = [];

// Helper to find line number of an index
function getLineNumber(index) {
    return content.substring(0, index).split('\n').length;
}

while ((match = reg.exec(cleanContent)) !== null) {
    let tag = match[0];
    let tagName = match[1];
    let index = match.index;
    let line = getLineNumber(index);

    // Ignore self-closing tags
    if (tag.endsWith('/>')) continue;
    if (tagName === 'img' || tagName === 'input' || tagName === 'hr' || tagName === 'br' || tagName === 'link') continue;

    if (tag.startsWith('</')) {
        if (openTags.length === 0) {
            console.log(`Unmatched closing tag ${tag} at line ${line}`);
        } else {
            let last = openTags.pop();
            if (last.name !== tagName) {
                console.log(`Tag mismatch: opened ${last.name} at line ${last.line}, closed with ${tagName} at line ${line}`);
                // Push back to try to recover
                openTags.push(last);
            }
        }
    } else {
        openTags.push({ name: tagName, line: line });
    }
}

console.log("Remaining open tags:", openTags);
