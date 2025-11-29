// src/pages/student/Dashboard.tsx
import { 
  Card, CardContent, CardHeader, CardTitle, Skeleton 
} from "../../desingSystem/primitives";
import { BookOpen, Users, Target, TrendingUp, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  // ✅ TODO: Crear hook useStudentStats() similar al de docentes
  const isLoading = false;

  const quickActions = [
    {
      title: "Explorar Repositorios",
      description: "Descubre material educativo",
      icon: BookOpen,
      to: "/estudiante/explorar",
      color: "bg-blue-500",
    },
    {
      title: "Mis Comunidades",
      description: "Grupos de estudio activos",
      icon: Users,
      to: "/estudiante/grupos/mis-grupos",
      color: "bg-green-500",
    },
    {
      title: "Simulacros",
      description: "Practica para tus exámenes",
      icon: Target,
      to: "/estudiante/aprendizaje/simulacros",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-contrast">¡Bienvenido, Estudiante!</h1>
        <p className="text-muted-foreground">Aquí tienes un resumen de tu progreso académico.</p>
      </div>
      
      {/* Grid de Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Tarjeta 1: Recursos Guardados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recursos Guardados</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success-progress" />
                  <span className="text-success-progress">+3</span> esta semana
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Tarjeta 2: Comunidades */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Comunidades</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">5</div>}
            <p className="text-xs text-muted-foreground mt-1">Grupos activos</p>
          </CardContent>
        </Card>

        {/* Tarjeta 3: Tiempo de Estudio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo de Estudio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">8.5h</div>}
            <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <div>
        <h2 className="text-xl font-bold text-primary-contrast mb-4">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-brand-action/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-contrast mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Actividad Reciente (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Completaste un simulacro de Matemáticas</p>
                <p className="text-xs text-muted-foreground">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Te uniste al grupo "Cálculo 2025-I"</p>
                <p className="text-xs text-muted-foreground">Hace 5 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Guardaste 3 nuevos recursos</p>
                <p className="text-xs text-muted-foreground">Ayer</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;