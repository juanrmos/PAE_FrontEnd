// src/app/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '../components/ui/Toaster';
import { AuthProvider } from '../context/AuthContext';

// Layouts
import { TeacherLayout } from '../components/layout/TeacherLayout';
import { StudentLayout } from '../components/layout/StudentLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

// --- AUTH ---
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// --- TEACHER ---
import TeacherDashboard from '../pages/teacher/Dashboard';
import TeacherRepoList from '../pages/teacher/repositories/List';
import TeacherExplore from '../pages/teacher/repositories/Explore';
import TeacherFavorites from '../pages/teacher/repositories/Favorites';
import TeacherRepoCreate from '../pages/teacher/repositories/Create';
import TeacherGroupsList from '../pages/teacher/groups/List';
import TeacherGroupDetail from '../pages/teacher/groups/Detail';
import TeacherGroupsExplore from '../pages/teacher/groups/Explore';
import TeacherForums from '../pages/teacher/groups/Forums';
import TeacherMyForums from '../pages/teacher/groups/MyForums';

// --- STUDENT ---
// ✅ CORRECCIÓN: Importar el Dashboard de estudiantes
import StudentDashboard from '../pages/student/Dashboard';
import StudentExplore from '../pages/student/repositories/Explore'; 
import StudentFavorites from '../pages/student/repositories/Favorites'; 
import StudentGroupList from '../pages/student/groups/List';
import StudentGroupDetail from '../pages/student/groups/Detail';
import StudentGroupsExplore from '../pages/student/groups/Explore';
import StudentForums from '../pages/student/groups/Forums';
import StudentMyForums from '../pages/student/groups/MyForums';

// --- LEARNING (COMPARTIDO) ---
import Simulacros from '../pages/learning/Simulacros';
import ExamView from '../pages/learning/ExamView';
import ExamResults from '../pages/learning/ExamResults';
import Desafios from '../pages/learning/Desafios';
import Trivia from '../pages/learning/Trivia';

// --- PROFILE (COMPARTIDO) ---
import Profile from '../pages/Profile';

// --- PUBLIC ---
import NotFound from '../pages/NotFound';
import Landing from '../pages/Landing';

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
      <AuthProvider>
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ZONA DOCENTE */}
          <Route element={<ProtectedRoute allowedRoles={['docente']} />}>
            <Route element={<TeacherLayoutWrapper />}>
              <Route path="/docente" element={<TeacherDashboard />} />
              
              {/* Repositorios Docente */}
              <Route path="/docente/repositorios" element={<Navigate to="/docente/repositorios/explorar" replace />} />
              <Route path="/docente/repositorios/explorar" element={<TeacherExplore />} />
              <Route path="/docente/repositorios/mis-repos" element={<TeacherRepoList />} />
              <Route path="/docente/repositorios/favoritos" element={<TeacherFavorites />} />
              <Route path="/docente/crear-repositorio" element={<TeacherRepoCreate />} />

              {/* Grupos Docente */}
              <Route path="/docente/grupos" element={<Navigate to="/docente/grupos/mis-grupos" replace />} />
              <Route path="/docente/grupos/mis-grupos" element={<TeacherGroupsList />} />
              <Route path="/docente/grupos/:id" element={<TeacherGroupDetail />} />
              <Route path="/docente/grupos/explorar" element={<TeacherGroupsExplore />} />
              <Route path="/docente/grupos/foros" element={<TeacherForums />} />
              <Route path="/docente/grupos/mis-foros" element={<TeacherMyForums />} />
              
              {/* Aprendizaje Docente */}
              <Route path="/docente/aprendizaje/simulacros" element={<Simulacros />} />
              <Route path="/docente/aprendizaje/simulacros/examen" element={<ExamView />} />
              <Route path="/docente/aprendizaje/simulacros/resultados" element={<ExamResults />} />
              <Route path="/docente/aprendizaje/desafios" element={<Desafios />} />
              <Route path="/docente/aprendizaje/trivia" element={<Trivia />} />
              
              {/* Perfil Docente */}
              <Route path="/docente/perfil" element={<Profile />} />
              
              {/* Fallback Docente */}
              <Route path="/docente/*" element={<Navigate to="/docente" replace />} />
            </Route>
          </Route>

          {/* ZONA ESTUDIANTE */}
          <Route element={<ProtectedRoute allowedRoles={['estudiante']} />}>
            <Route element={<StudentLayoutWrapper />}>
              {/* ✅ CORRECCIÓN: Redirigir a Dashboard en lugar de Explorar */}
              <Route path="/estudiante" element={<StudentDashboard />} />
              
              {/* Repositorios Estudiante */}
              <Route path="/estudiante/explorar" element={<StudentExplore />} />
              <Route path="/estudiante/biblioteca" element={<StudentFavorites />} />
              
              {/* Grupos Estudiante */}
              <Route path="/estudiante/grupos" element={<Navigate to="/estudiante/grupos/mis-grupos" replace />} />
              <Route path="/estudiante/grupos/mis-grupos" element={<StudentGroupList />} />
              <Route path="/estudiante/grupos/:id" element={<StudentGroupDetail />} />
              <Route path="/estudiante/grupos/explorar" element={<StudentGroupsExplore />} />
              <Route path="/estudiante/grupos/foros" element={<StudentForums />} />
              <Route path="/estudiante/grupos/mis-foros" element={<StudentMyForums />} />
              
              {/* Aprendizaje Estudiante */}
              <Route path="/estudiante/aprendizaje/simulacros" element={<Simulacros />} />
              <Route path="/estudiante/aprendizaje/simulacros/examen" element={<ExamView />} />
              <Route path="/estudiante/aprendizaje/simulacros/resultados" element={<ExamResults />} />
              <Route path="/estudiante/aprendizaje/desafios" element={<Desafios />} />
              <Route path="/estudiante/aprendizaje/trivia" element={<Trivia />} />
              
              {/* Perfil Estudiante */}
              <Route path="/estudiante/perfil" element={<Profile />} />
              
              {/* Fallback Estudiante */}
              <Route path="/estudiante/*" element={<Navigate to="/estudiante" replace />} />
            </Route>
          </Route>

          {/* FALLBACK GLOBAL (404) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};