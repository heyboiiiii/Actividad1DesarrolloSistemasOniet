import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 4000;

// Permitir solicitudes desde tu frontend (ej: localhost:5173)
app.use(cors());
app.use(express.json());

// Configurar dónde y cómo se guardarán los archivos subidos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Los archivos se guardarán en una carpeta llamada 'uploads'
  },
  filename: (req, file, cb) => {
    // Mantener el nombre original del archivo con una marca de tiempo para evitar duplicados
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //cb(null, uniqueSuffix + path.extname(file.originalname));
    cb(null,'datos'+path.extname(file.originalname));
}
});

const upload = multer({ storage: storage });

// Asegúrate de crear la carpeta 'uploads' manualmente en la raíz de tu proyecto
// o añade lógica para que Node la cree automáticamente.

// Ruta POST para recibir el archivo (el campo en el formulario debe llamarse 'archivo')
app.post('/api/upload', upload.single('archivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo.' });
  }
  
  // Responder al frontend con éxito y datos del archivo
  res.status(200).json({
    mensaje: '¡Archivo subido con éxito!',
    archivo: req.file
  });

  // Leer el archivo JSON
  const archivo = fs.readFileSync('./uploads/datos.json', 'utf8');
  // Remove BOM if present
  const limpio = archivo.replace(/^\uFEFF/, '');
  const datos = JSON.parse(limpio);
  
  processData(datos);
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

function processData(datos){
  const companias = [...new Set(datos.map(d => d.CompaniaSeguro))];
  console.log(companias);
  generarInforme(datos);
  console.log('Informe generado:', informe);
}

function generarInforme(datos, rutaSalida = './informe.json') {
  // 1. Acumular totales por compañía
  const totales = new Map();

  for (const fila of datos) {
    const compania = fila.CompaniaSeguro;

    const valor = parseFloat(fila.ValorPorServicio) || 0;
    const cantidad = parseInt(fila.CantidadServicios, 10) || 0;
    const subtotal = valor * cantidad;

    totales.set(compania, (totales.get(compania) || 0) + subtotal);
  }

  // 2. Convertir a arreglo con la estructura pedida
  const informe = [...totales.entries()].map(([CompaniaSeguro, TotalFacturado]) => ({
    CompaniaSeguro,
    TotalFacturado: Number(TotalFacturado.toFixed(2)), // 2 decimales, como número
  }));

  // 3. Escribir el archivo
  fs.writeFileSync(rutaSalida, JSON.stringify(informe, null, 2), 'utf8');

  return informe;
}