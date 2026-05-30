const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Nia/lomba/ResFood/frontend/src/pages';
const files = [
  'HomePage.jsx', 'DashboardPage.jsx', 'CatalogPage.jsx', 'UploadPage.jsx',
  'EditProductPage.jsx', 'ItemDetailPage.jsx', 'PickupPage.jsx', 'PaymentPage.jsx',
  'ProfilePage.jsx', 'ImpactPage.jsx', 'AdminDashboardPage.jsx', 'CartPage.jsx', 'InvoicePage.jsx'
];

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Add import if not exists (and skip InvoicePage if we don't want nav there, but wait, usually we want it everywhere except invoice. Actually, the user asked for standard. We'll add it everywhere).
    if (!content.includes("import MobileNav from '../components/MobileNav';") && file !== 'InvoicePage.jsx') {
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLastImport = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLastImport + 1) + "import MobileNav from '../components/MobileNav';\n" + content.slice(endOfLastImport + 1);
      }
    }

    // Replace the old nav. It usually starts with <nav className="fixed bottom-0
    const navRegex = /<nav className="fixed bottom-0[\s\S]*?<\/nav>/g;
    
    if (file !== 'InvoicePage.jsx') {
      if (navRegex.test(content)) {
        content = content.replace(navRegex, '<MobileNav />');
      } else {
        // If it doesn't have the old nav, let's insert it before the last </div> if it's not InvoicePage
        // Actually, we only replace if it exists to be safe.
      }
    } else {
      // For InvoicePage, just remove the nav if it exists
      content = content.replace(navRegex, '');
    }

    // Also update grid-cols in DashboardPage and CatalogPage
    if (file === 'DashboardPage.jsx' || file === 'CatalogPage.jsx') {
      content = content.replace(/grid-cols-1 md:grid-cols-2 lg:grid-cols-3/g, 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4');
      content = content.replace(/grid-cols-1 md:grid-cols-2/g, 'grid-cols-2 md:grid-cols-3');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
