const fs = require('fs');
let content = fs.readFileSync('client/src/pages/admin/AdminDashboard.jsx', 'utf8');

const replacements = [
  ['text-slate-400', 'text-slate-500 dark:text-slate-400'],
  ['text-slate-300', 'text-slate-600 dark:text-slate-300'],
  ['bg-slate-800', 'bg-slate-100 dark:bg-slate-800']
];

for (const [oldClass, newClass] of replacements) {
  content = content.split(oldClass + ' ').join(newClass + ' ');
  content = content.split(oldClass + '"').join(newClass + '"');
}

fs.writeFileSync('client/src/pages/admin/AdminDashboard.jsx', content);
console.log('Done2');
