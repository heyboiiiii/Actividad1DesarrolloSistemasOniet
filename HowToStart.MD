# Client

npm create vite@latest client

npm install react react-dom tailwindcss

add 

`@import "tailwindcss";` in index.css and import in main.jsx

`vite.config.js`:

import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server:{
    proxy: {
      '/api/upload':{
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})

###########################################

# Server

node init

npm install express multer cors

