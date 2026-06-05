import fs from 'fs';
import path from 'path';

const srcDir = '/Users/magister/.gemini/antigravity/scratch/astrum/src';

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);
let errors = 0;

allFiles.forEach(file => {
    if (file.endsWith('.jsx') || file.endsWith('.js')) {
        const content = fs.readFileSync(file, 'utf8');
        const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            if (importPath.startsWith('.')) {
                // Resolve path
                const resolvedDir = path.dirname(file);
                let resolvedPath = path.resolve(resolvedDir, importPath);
                
                // Add extensions if needed
                let finalPath = resolvedPath;
                if (!fs.existsSync(resolvedPath)) {
                    if (fs.existsSync(resolvedPath + '.jsx')) finalPath += '.jsx';
                    else if (fs.existsSync(resolvedPath + '.js')) finalPath += '.js';
                    else if (fs.existsSync(resolvedPath + '.css')) finalPath += '.css';
                }

                // Now check case sensitivity by reading the directory
                if (fs.existsSync(finalPath)) {
                    const dir = path.dirname(finalPath);
                    const base = path.basename(finalPath);
                    const actualFiles = fs.readdirSync(dir);
                    if (!actualFiles.includes(base)) {
                        console.error(`Case mismatch in ${file}: Imported '${importPath}', but actual file is '${actualFiles.find(f => f.toLowerCase() === base.toLowerCase())}'`);
                        errors++;
                    }
                } else {
                     console.error(`File not found in ${file}: Imported '${importPath}' resolved to ${finalPath}`);
                     errors++;
                }
            }
        }
    }
});

if (errors === 0) {
    console.log("No case sensitivity errors found.");
}
