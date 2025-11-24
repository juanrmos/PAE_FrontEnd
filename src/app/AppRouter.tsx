// src/app/AppRouter.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import { AppLayout } from '../components/layout/AppLayout'; // Tienes que crear este componente

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            // Envuelve todos los módulos con el layout principal
            element={<AppLayout>{<route.element />}</AppLayout>}
          />
        ))}
        {/* Aquí puedes añadir una ruta 404 (Not Found) */}
      </Routes>
    </BrowserRouter>
  );
};