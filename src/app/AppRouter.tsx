import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '../components/ui/Toaster';

// Layouts
import { TeacherLayout } from '../components/layout/TeacherLayout';
import { StudentLayout } from '../components/layout/StudentLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

// --- 1. PAGES: AUTH ---
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// --- 2. PAGES: TEACHER ---
import TeacherDashboard from '../pages/teacher/Dashboard';
import TeacherGroups from '../pages/teacher/Groups';

// Sub-módulo: Repositorios (Docente)
import TeacherRepoList from '../pages/teacher/repositories/List';     // Mis Repositorios
import TeacherExplore from '../pages/teacher/repositories/Explore';   // Repositorios Públicos
import TeacherFavorites from '../pages/teacher/repositories/Favorites'; // Favoritos Docente
import TeacherRepoCreate from '../pages/teacher/repositories/Create'; // Crear Repositorio

// --- 3. PAGES: STUDENT ---
import StudentExplore from '../pages/student/repositories/Explore'; 
import StudentFavorites from '../pages/student/repositories/Favorites'; 
import StudentGroupList from '../pages/student/groups/List';
import StudentGroupResources from '../pages/student/groups/Resources';

// --- 4. PAGES: PUBLIC/MISC ---
import NotFound from '../pages/NotFound';
import Placeholder from '../pages/Placeholder';

// Wrappers para Layouts
const TeacherLayoutWrapper = () => <TeacherLayout><Outlet /></TeacherLayout>;
const StudentLayoutWrapper = () => <StudentLayout><Outlet /></StudentLayout>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ------------------------------- */}
        {/* 1. RUTAS PÚBLICAS               */}
        {/* ------------------------------- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Placeholder />} />

        {/* ------------------------------- */}
        {/* 2. ZONA DOCENTE (TeacherLayout) */}
        {/* ------------------------------- */}
        <Route element={<ProtectedRoute allowedRoles={['docente']} />}>
          <Route element={<TeacherLayoutWrapper />}>
            {/* Dashboard */}
            <Route path="/docente" element={<TeacherDashboard />} />
            
            {/* Módulo Repositorios */}
            {/* A. Explorar (Públicos) */}
            <Route path="/docente/repositorios" element={<Navigate to="/docente/repositorios/explorar" replace />} />
            <Route path="/docente/repositorios/explorar" element={<TeacherExplore />} />
            
            {/* B. Mis Repositorios */}
            <Route path="/docente/repositorios/mis-repos" element={<TeacherRepoList />} />
            
            {/* C. Favoritos */}
            <Route path="/docente/repositorios/favoritos" element={<TeacherFavorites />} />
            
            {/* D. Crear */}
            <Route path="/docente/crear-repositorio" element={<TeacherRepoCreate />} />

            {/* Módulo Grupos */}
            <Route path="/docente/grupos" element={<TeacherGroups />} />
            
            {/* Fallback Docente */}
            <Route path="/docente/*" element={<Navigate to="/docente" replace />} />
          </Route>
        </Route>

        {/* --------------------------------- */}
        {/* 3. ZONA ESTUDIANTE (StudentLayout)*/}
        {/* --------------------------------- */}
        <Route element={<ProtectedRoute allowedRoles={['estudiante']} />}>
          <Route element={<StudentLayoutWrapper />}>
            {/* Redirección inicial */}
            <Route path="/estudiante" element={<Navigate to="/estudiante/explorar" replace />} />
            
            {/* Explorar (Home) */}
            <Route path="/estudiante/explorar" element={<StudentExplore />} />
            <Route path="/estudiante/repositorios" element={<Navigate to="/estudiante/explorar" replace />} />

            {/* Biblioteca / Favoritos */}
            <Route path="/estudiante/biblioteca" element={<StudentFavorites />} />
            
            {/* Módulo Grupos */}
            <Route path="/estudiante/grupos" element={<Navigate to="/estudiante/grupos/mis-grupos" replace />} />
            <Route path="/estudiante/grupos/mis-grupos" element={<StudentGroupList />} />
            <Route path="/estudiante/grupos/recursos" element={<StudentGroupResources />} />
            
            {/* Fallback Estudiante */}
            <Route path="/estudiante/*" element={<Navigate to="/estudiante/explorar" replace />} />
          </Route>
        </Route>

        {/* ------------------------------- */}
        {/* 4. FALLBACK GLOBAL (404)        */}
        {/* ------------------------------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
    </BrowserRouter>
  );
};