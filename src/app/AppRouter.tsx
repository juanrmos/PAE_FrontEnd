import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '../components/ui/Toaster';

// Layouts
import { TeacherLayout } from '../components/layout/TeacherLayout';
import { StudentLayout } from '../components/layout/StudentLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

// --- 1. PAGES: AUTH (Carpeta: pages/auth/) ---
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// --- 2. PAGES: TEACHER (Carpeta: pages/teacher/) ---
import TeacherDashboard from '../pages/teacher/Dashboard';
import TeacherGroups from '../pages/teacher/Groups';
// Subcarpeta: pages/teacher/repositories/
import TeacherRepoList from '../pages/teacher/repositories/List';
import TeacherRepoCreate from '../pages/teacher/repositories/Create';

// --- 3. PAGES: STUDENT (Carpeta: pages/student/) ---
// Subcarpeta: pages/student/repository/
import StudentExplore from '../pages/student/repository/Explore';
// Subcarpeta: pages/student/groups/
import StudentGroupList from '../pages/student/groups/List';
// Archivo directo en student/
import StudentResources from '../pages/student/groups/Resources';

// --- 4. PAGES: PUBLIC/MISC (Raíz pages/) ---
import NotFound from '../pages/NotFound';
import Placeholder from '../pages/Placeholder'; // Para rutas sin archivo (ej. ForgotPassword)

// Wrappers para Layouts
const TeacherLayoutWrapper = () => <TeacherLayout><Outlet /></TeacherLayout>;
const StudentLayoutWrapper = () => <StudentLayout><Outlet /></StudentLayout>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Usamos Placeholder porque ForgotPassword no aparece en tu árbol actual */}
        <Route path="/forgot-password" element={<Placeholder />} />

        {/* RUTAS DE DOCENTE */}
        <Route element={<ProtectedRoute allowedRoles={['docente']} />}>
          <Route element={<TeacherLayoutWrapper />}>
            <Route path="/docente" element={<TeacherDashboard />} />
            <Route path="/docente/repositorios" element={<TeacherRepoList />} />
            <Route path="/docente/crear-repositorio" element={<TeacherRepoCreate />} />
            <Route path="/docente/grupos" element={<TeacherGroups />} />
            <Route path="/docente/*" element={<Navigate to="/docente" replace />} />
          </Route>
        </Route>

        {/* RUTAS DE ESTUDIANTE */}
        <Route element={<ProtectedRoute allowedRoles={['estudiante']} />}>
          <Route element={<StudentLayoutWrapper />}>
            {/* Redirección inicial */}
            <Route path="/estudiante" element={<Navigate to="/estudiante/explorar" replace />} />
            
            {/* Explorar (Repository) */}
            <Route path="/estudiante/explorar" element={<StudentExplore />} />
            
            {/* Mis Comunidades */}
            <Route path="/estudiante/grupos/mis-grupos" element={<StudentGroupList />} />
            
            {/* Recursos (Ubicado en pages/student/Resources.tsx) */}
            {/* Lo mapeamos a la ruta de biblioteca o recursos de grupo según tu preferencia */}
            <Route path="/estudiante/grupos/recursos" element={<StudentResources />} />
            <Route path="/estudiante/biblioteca" element={<StudentResources />} />
            
            <Route path="/estudiante/*" element={<Navigate to="/estudiante/explorar" replace />} />
          </Route>
        </Route>

        {/* 404 GLOBAL */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
    </BrowserRouter>
  );
};