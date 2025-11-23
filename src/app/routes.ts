// src/app/routes.ts
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Placeholder } from '../pages/Placeholder'; // Componente temporal

export const routes = [
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
  // Aquí se añadirán más rutas de módulos (Comunidades, Repositorio)
];