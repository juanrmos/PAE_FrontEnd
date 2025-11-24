// src/app/routes.ts
import Home from '../pages/Home';       // Asegúrate de que Home.tsx tenga "export default"
import Login from '../pages/Login';     // Asegúrate de que Login.tsx tenga "export default"
import Placeholder from '../pages/Placeholder';

// Definimos una interfaz para que TS sepa qué forma tiene una ruta
interface AppRoute {
  path: string;
  element: React.ComponentType; // El componente en sí
  exact?: boolean;
  requiresAuth: boolean;
}

export const routes: AppRoute[] = [
  {
    path: '/',
    element: Login,
    exact: true,
    requiresAuth: false,
  },
  {
    path: '/home',
    element: Home,
    exact: true,
    requiresAuth: true,
  },
  {
    path: '/cursos',
    element: Placeholder,
    exact: false,
    requiresAuth: true,
  },
];