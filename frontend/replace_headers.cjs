const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Nia/lomba/ResFood/frontend/src/pages';
const files = [
  'HomePage.jsx', 'DashboardPage.jsx', 'CatalogPage.jsx', 'UploadPage.jsx',
  'EditProductPage.jsx', 'ItemDetailPage.jsx', 'PickupPage.jsx', 'PaymentPage.jsx',
  'ProfilePage.jsx', 'ImpactPage.jsx', 'AdminDashboardPage.jsx', 'CartPage.jsx'
];

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Add import if not exists
    if (!content.includes("import Header from '../components/Header';")) {
      // Find the last import statement
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLastImport = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLastImport + 1) + "import Header from '../components/Header';\n" + content.slice(endOfLastImport + 1);
      }
    }

    // Replace header blocks
    if (file === 'ItemDetailPage.jsx') {
      // ItemDetailPage uses <nav className={`sticky top-0 z-50...
      content = content.replace(/<nav className={`sticky top-0 z-50[\s\S]*?<\/nav>/, '<Header />');
    } else {
      content = content.replace(/<header[\s\S]*?<\/header>/, '<Header />');
    }
    
    // Some pages like DashboardPage might have unused useCart imports now since we moved it to Header
    // but that's fine, we can leave them for now or they might be used elsewhere.

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
