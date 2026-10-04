const fs = require('fs');
let content = fs.readFileSync('client/src/pages/admin/AdminDashboard.jsx', 'utf8');

content = content.replace(/<h1(.*?)text-white(.*?)>/g, '<h1$1text-slate-900 dark:text-white$2>');
content = content.replace(/<h2(.*?)text-white(.*?)>/g, '<h2$1text-slate-900 dark:text-white$2>');
content = content.replace(/<h3(.*?)text-white(.*?)>/g, '<h3$1text-slate-900 dark:text-white$2>');
content = content.replace(/<span(.*?)font-bold text-white text-lg(.*?)>/g, '<span$1font-bold text-slate-900 dark:text-white text-lg$2>'); // mobile menu title
content = content.replace(/<p className="text-sm font-semibold text-white/g, '<p className="text-sm font-semibold text-slate-900 dark:text-white'); // user card
content = content.replace(/<p className="text-sm font-bold text-white/g, '<p className="text-sm font-bold text-slate-900 dark:text-white'); // recent users

fs.writeFileSync('client/src/pages/admin/AdminDashboard.jsx', content);
console.log('Fixed headings');
