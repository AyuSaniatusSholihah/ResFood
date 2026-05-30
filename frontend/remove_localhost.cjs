const fs = require('fs');
const pages = [
  'd:/Nia/lomba/ResFood/frontend/src/pages/LoginPage.jsx',
  'd:/Nia/lomba/ResFood/frontend/src/pages/UploadPage.jsx',
  'd:/Nia/lomba/ResFood/frontend/src/pages/CatalogPage.jsx',
  'd:/Nia/lomba/ResFood/frontend/src/pages/DashboardPage.jsx'
];

for (const file of pages) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/http:\/\/localhost:3000\/api/g, '/api');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated ' + file);
}
