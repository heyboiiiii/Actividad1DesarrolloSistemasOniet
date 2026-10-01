import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { generarInformes } from './utils.js';

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

  try {
    // 1. Leer el archivo subido
    const archivo = fs.readFileSync('./uploads/datos.json', 'utf8');
    const limpio = archivo.replace(/^\uFEFF/, ''); // quitar BOM
    const datos = JSON.parse(limpio);

    if (!Array.isArray(datos)) {
      return res.status(400).json({ error: 'El JSON debe ser un arreglo.' });
    }

    // 2. Procesar y obtener el informe
    //const companias = [...new Set(datos.map(d => d.CompaniaSeguro))];
    const informe = generarInformes(datos);

    // 3. Responder con todo (última operación)
    return res.status(200).json({
      mensaje: '¡Archivo subido con éxito!',
      archivo: req.file,
      informe,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: 'No se pudo procesar el archivo.',
      detalle: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

