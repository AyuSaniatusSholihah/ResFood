const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Nia/lomba/ResFood/frontend/src/pages';

['DashboardPage.jsx', 'CatalogPage.jsx'].forEach(file => {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Reduce grid gap for mobile
    content = content.replace(/grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg/g, 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-lg');
    content = content.replace(/grid-cols-2 md:grid-cols-3 gap-lg/g, 'grid-cols-2 md:grid-cols-3 gap-3 md:gap-lg');

    // Reduce padding inside cards
    content = content.replace(/className="p-md"/g, 'className="p-3 md:p-md"');
    content = content.replace(/className="p-lg"/g, 'className="p-4 md:p-lg"');
    
    // Reduce text sizes for mobile in cards
    content = content.replace(/font-headline-sm text-headline-sm/g, 'font-headline-sm text-[14px] md:text-headline-sm leading-tight');
    content = content.replace(/font-headline-md text-headline-md/g, 'font-headline-md text-[16px] md:text-headline-md');
    
    // Adjust height of images for mobile grid so they are not too tall
    content = content.replace(/h-48/g, 'h-32 md:h-48');
    content = content.replace(/h-56/g, 'h-32 md:h-56');
    content = content.replace(/h-40/g, 'h-28 md:h-40');
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
