const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'Organizer');

let filesProcessed = 0;

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else if (dirPath.endsWith('.jsx') || dirPath.endsWith('.js')) {
      callback(path.join(dir, f));
    }
  });
}

walk(targetDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  if (!content.includes('<table')) return;

  // 1. Table Wrapper
  // Find divs that likely wrap the table. Look for shadow and overflow-hidden.
  content = content.replace(/className=["'][^"']*(?:shadow[^"']*|overflow-hidden|bg-white)[^"']*["'](?=>\s*<div[^>]*>\s*<table|>\s*<table)/g, (match) => {
    if (match.includes('overflow-hidden') || match.includes('shadow')) {
      return `className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"`;
    }
    return match;
  });
  
  // also specifically matching VenueList style:
  content = content.replace(/className="bg-white rounded-xl shadow-md border border-sky-100 overflow-hidden"/g, 'className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"');
  content = content.replace(/className="bg-white rounded-\[2rem\] shadow-sm border border-slate-100 overflow-hidden"/g, 'className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"');
  content = content.replace(/className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"/g, 'className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"');

  // 2. Table tag
  content = content.replace(/<table\s+className=["'][^"']*["']/g, '<table className="w-full"');
  
  // 3. Thead TR
  // Remove style tags on thead tr
  content = content.replace(/<thead[^>]*>[\s\n]*<tr[^>]*style=\{\{[^}]+\}\}[^>]*>/g, '<thead>\n            <tr className="bg-sky-600 text-white">');
  // Or with className
  content = content.replace(/<thead[^>]*>[\s\n]*<tr[^>]*className=["'][^"']*["'][^>]*>/g, '<thead>\n            <tr className="bg-sky-600 text-white">');

  // 4. TH classes
  // Replace anything that looks like padding/text-left/font-semibold/etc with the standard
  content = content.replace(/<th\s+className=["'][^"']*["']/g, '<th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider"');
  // For THs without className
  content = content.replace(/<th(?![\s\w]*className)/g, '<th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider"');

  // 5. Tbody
  content = content.replace(/<tbody\s+className=["'][^"']*["']/g, '<tbody className="divide-y divide-slate-50"');

  // 6. TR Hover
  content = content.replace(/<tr\s+key=\{([^}]+)\}\s+className=["'][^"']*hover:[^"']*["']/g, '<tr key={$1} className="hover:bg-sky-50/50 transition-colors duration-200 group"');
  content = content.replace(/<tr\s+className=["'][^"']*hover:[^"']*["']\s+key=\{([^}]+)\}/g, '<tr className="hover:bg-sky-50/50 transition-colors duration-200 group" key={$1}');
  // TR Hover without key
  content = content.replace(/<tr\s+className=["'][^"']*hover:[^"']*["'](?![\s\w]*key)/g, '<tr className="hover:bg-sky-50/50 transition-colors duration-200 group"');

  // 7. TD p-4 to px-6 py-4
  // careful not to break other classes
  content = content.replace(/className=["']([^"']*)p-4([^"']*)["']/g, 'className="$1px-6 py-4$2"');
  
  // Replace bg-blue-100 on code badges or similar, text-slate-700
  // In Sponsor, Venue etc, the code is often bg-slate-100, we can leave the inner span as is or tweak them.
  // The user mainly requested "table design" which means the overall borders, headers, paddings, hovers.

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesProcessed++;
    console.log("Updated: " + filePath);
  }
});

console.log(`Processed ${filesProcessed} files.`);
