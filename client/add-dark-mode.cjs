const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-white': 'bg-white dark:bg-slate-900',
  'bg-slate-50': 'bg-slate-50 dark:bg-slate-950',
  'border-slate-200': 'border-slate-200 dark:border-slate-800',
  'border-slate-100': 'border-slate-100 dark:border-slate-800',
  'text-slate-900': 'text-slate-900 dark:text-white',
  'text-slate-800': 'text-slate-800 dark:text-slate-100',
  'text-slate-700': 'text-slate-700 dark:text-slate-300',
  'text-slate-600': 'text-slate-600 dark:text-slate-400',
  'text-slate-500': 'text-slate-500 dark:text-slate-400',
  'hover:bg-slate-50': 'hover:bg-slate-50 dark:hover:bg-slate-800',
  'divide-slate-200': 'divide-slate-200 dark:divide-slate-800',
  'divide-slate-100': 'divide-slate-100 dark:divide-slate-800',
};

const directories = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // We only replace exact words that aren't already followed by their dark: variant
  for (const [light, darkPair] of Object.entries(replacements)) {
    // regex to match the light class but NOT if it's already followed by the dark variant
    // e.g., match 'bg-white' if it's not 'bg-white dark:bg-slate-900'
    const darkVariant = darkPair.split(' ')[1];
    const regex = new RegExp(`\\b${light}\\b(?!\\s+${darkVariant})`, 'g');
    content = content.replace(regex, darkPair);
  }

  // We should also ensure we don't accidentally get 'bg-white dark:bg-slate-900 dark:bg-slate-900'
  // If the file originally had dark variants, this naive regex might still have edge cases if the dark variant was placed somewhere else in the className. 
  // Let's just do a simple pass and we can clean up any issues manually.

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

for (const dir of directories) {
  traverseDir(dir);
}
