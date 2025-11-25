import { 
  Card, CardContent, CardHeader, CardTitle, Skeleton 
} from "../../desingSystem/primitives";
import { BarChart3, Users, FileText, TrendingUp } from "lucide-react";
import { useTeacherStats } from "../../features/dashboard/hooks/useTeacherStats";

const TeacherDashboard = () => {
  const { stats, isLoading } = useTeacherStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-contrast">Hola, Profesor</h1>
        <p className="text-muted-foreground">Aquí tienes el resumen de tu actividad reciente.</p>
      </div>
      
      {/* Grid de Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Tarjeta 1: Estudiantes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.activeStudents}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success-progress" />
                  <span className="text-success-progress">+{stats?.studentGrowth}%</span> vs mes anterior
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Tarjeta 2: Repositorios */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Repositorios</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.totalRepositories}</div>}
          </CardContent>
        </Card>

        {/* Tarjeta 3: Evaluaciones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Calificar</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.pendingEvaluations}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;