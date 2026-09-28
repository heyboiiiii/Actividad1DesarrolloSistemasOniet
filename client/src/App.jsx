import { useState } from 'react'

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  // Capturar el archivo cuando el usuario lo selecciona
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Enviar el archivo al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus('Por favor, selecciona un archivo primero.');
      return;
    }

    // FormData es OBLIGATORIO para enviar archivos binarios
    const formData = new FormData();
    formData.append('archivo', file); // El nombre 'archivo' debe coincidir con upload.single('archivo') en el backend

    try {
      setStatus('Subiendo archivo...');
      
      const response = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData, // No agregues Headers de 'Content-Type', el navegador lo configurará automáticamente con FormData
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`¡Éxito! ${data.mensaje}`);
        console.log('Datos del servidor:', data.archivo);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setStatus('Error de red al intentar subir el archivo.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-slate-800">Subir Archivo al Servidor</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="file" 
            onChange={handleFileChange}
            className="w-full rounded-lg border border-slate-300 p-2 text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
          
          <button 
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 transition"
          >
            Enviar al Backend
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm font-medium text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

export default App
