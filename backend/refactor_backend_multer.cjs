const fs = require('fs');
const path = require('path');

const backendIndex = 'd:/Nia/lomba/ResFood/backend/index.js';
let content = fs.readFileSync(backendIndex, 'utf8');

if (!content.includes("require('multer')")) {
  content = content.replace(
    "const { PrismaClient } = require('@prisma/client');",
    "const { PrismaClient } = require('@prisma/client');\nconst multer = require('multer');\nconst path = require('path');\nconst fs = require('fs');"
  );
  
  content = content.replace(
    "// Middleware\napp.use(cors());\napp.use(express.json());",
    `// Middleware
app.use(cors());
app.use(express.json());

// Setup direktori uploads jika belum ada
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });`
  );

  // Update POST /api/makanan
  const oldPost = `app.post('/api/makanan', authenticate, async (req, res) => {
  try {
    const { nama, deskripsi, harga_asli, jalur, tgl_expired, stok, foto } = req.body;`;
    
  const newPost = `app.post('/api/makanan', authenticate, upload.single('foto'), async (req, res) => {
  try {
    const { nama, deskripsi, harga_asli, jalur, tgl_expired, stok } = req.body;
    let fotoUrl = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
    if (req.file) {
      fotoUrl = 'http://localhost:3000/uploads/' + req.file.filename;
    }`;

  content = content.replace(oldPost, newPost);
  
  // replace the foto: field in prisma.makanan.create
  content = content.replace(
    "foto: foto || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',",
    "foto: fotoUrl,"
  );

  fs.writeFileSync(backendIndex, content, 'utf8');
  console.log('Backend index.js updated with multer');
} else {
  console.log('Already updated');
}
