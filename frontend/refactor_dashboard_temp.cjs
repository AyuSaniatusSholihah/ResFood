const fs = require('fs');

const file = 'd:/Nia/lomba/ResFood/frontend/src/pages/DashboardPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
if (!content.includes('useState')) {
  content = content.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';");
}

// Add state and fetch logic
const componentStart = 'export default function DashboardPage() {';
const fetchLogic = `
  const [flashSale, setFlashSale] = useState([]);
  const [katalog, setKatalog] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/makanan/terbaru');
        const data = await res.json();
        setFlashSale(data);
        setKatalog(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
`;
content = content.replace(componentStart, componentStart + fetchLogic);

// Replace Flash Sale HTML with map
const flashSaleStart = '<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-lg">';
const flashSaleRegex = /<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-lg">([\s\S]*?)<\/section>/;

const newFlashSale = `${flashSaleStart}
                {flashSale.map((item, idx) => (
                  <div key={item.id || idx} className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-28 md:h-40">
                      <img alt={item.nama} className="w-full h-full object-cover" src={item.foto}/>
                      <div className="absolute top-sm left-sm bg-error text-on-error text-label-sm font-label-sm px-sm py-xs rounded-lg">-70%</div>
                    </div>
                    <div className="p-3 md:p-md">
                      <h4 className="font-headline-sm text-[14px] md:text-headline-sm leading-tight mb-xs">{item.nama}</h4>
                      <div className="flex items-center gap-xs text-on-surface-variant mb-md">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        <span className="text-label-sm font-label-sm">{item.penyedia?.nama || 'Solo'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-label-sm font-label-sm line-through text-on-surface-variant opacity-60">Rp {item.harga_asli}</span>
                          <p className="text-primary font-headline-md text-[16px] md:text-headline-md">Rp {item.harga_platform}</p>
                        </div>
                        <span className="text-label-sm font-label-sm bg-secondary-container text-on-secondary-container px-sm py-xs rounded">Sisa {item.stok}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>`;

content = content.replace(flashSaleRegex, newFlashSale);

// Wait, doing this by regex might break the rest of the file if the closing </section> matches something else.
// I will just use string manipulation instead.
fs.writeFileSync('d:/Nia/lomba/ResFood/frontend/refactor.cjs', 'console.log("Use script directly");');
