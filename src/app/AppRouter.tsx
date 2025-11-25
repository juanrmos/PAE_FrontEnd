import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '../components/ui/Toaster';

// Layouts
import { TeacherLayout } from '../components/layout/TeacherLayout';
import { StudentLayout } from '../components/layout/StudentLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

// Pages (Auth & Public)
import Login from '../pages/auth/Login';
import Register from '../pages/groups/student/Register';
import NotFound from '../pages/NotFound';

// Pages (Docente) - ¡AHORA SÍ EXISTEN!
import TeacherDashboard from '../pages/teacher/Dashboard';
import MyRepositories from '../pages/repository/MyRepositories';
import ManageRepository from '../pages/repository/CreateRepository';

// Pages (Estudiante)
import Popular from '../pages/repository/Popular';

// --- Wrappers de Layout (Solución al error de <Outlet>) ---
// Esto asegura que el Outlet se pase correctamente como children
const TeacherLayoutWrapper = () => (
  <TeacherLayout>
    <Outlet />
  </TeacherLayout>
);

const StudentLayoutWrapper = () => (
  <StudentLayout>
    <Outlet />
  </StudentLayout>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Rutas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. Rutas de Docente */}
        <Route element={<ProtectedRoute allowedRoles={['docente']} />}>
          {/* Usamos el Wrapper en lugar de escribir JSX anidado aquí */}
          <Route element={<TeacherLayoutWrapper />}>
            <Route path="/docente" element={<TeacherDashboard />} />
            <Route path="/docente/repositorios" element={<MyRepositories />} />
            <Route path="/docente/crear-repositorio" element={<ManageRepository />} />
            {/* Redirección por defecto */}
            <Route path="/docente/*" element={<Navigate to="/docente" replace />} />
          </Route>
        </Route>

        {/* 3. Rutas de Estudiante */}
        <Route element={<ProtectedRoute allowedRoles={['estudiante']} />}>
          <Route element={<StudentLayoutWrapper />}>
            <Route path="/estudiante" element={<Navigate to="/estudiante/explorar" replace />} />
            <Route path="/estudiante/explorar" element={<Popular />} />
            {/* Redirección por defecto */}
            <Route path="/estudiante/*" element={<Navigate to="/estudiante/explorar" replace />} />
          </Route>
        </Route>

        {/* 4. Fallback Global */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Notificaciones Globales */}
      <Toaster />
    </BrowserRouter>
  );
};