// tailwind.config.js

module.exports = {
  content: [
    // Asegura que Tailwind escanee todos tus archivos de código fuente
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Definición de la paleta de colores de PAE
      colors: {
        'brand-action': '#FF7A00', // Naranja (Botones Primarios, Acentos)
        'primary-contrast': '#1E3A8A', // Azul Oscuro (Headers, Sidebar, Texto)
        'neutral-black': '#000000',
        'neutral-white': '#FFFFFF',
        // Puedes agregar más colores aquí si es necesario
      },
    },
  },
  plugins: [],
}