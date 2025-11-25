import { Link } from "react-router-dom";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "../../desingSystem/primitives";
import { RepositoryList } from "../../features/repository/components/RepositoryList";
import { useMyRepositories } from "../../features/repository/hooks/useMyRepositories";

const MyRepositories = () => {
  const { repos, isLoading } = useMyRepositories();

  return (
    <div className="space-y-8">
      {/* Header con Acción Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-contrast">Mis Repositorios</h1>
          <p className="text-muted-foreground">Gestiona y comparte tu contenido educativo.</p>
        </div>
        <Link to="/docente/crear-repositorio">
          <Button className="gap-2 bg-brand-action hover:bg-brand-action/90 w-full sm:w-auto">
            <Plus className="h-4 w-4" /> Nuevo Repositorio
          </Button>
        </Link>
      </div>

      {/* Lista de Contenido */}
      {/* Reutilizamos RepositoryList que ya maneja Skeletons */}
      {/* Si la lista está vacía, mostramos un Empty State específico para Docentes */}
      {!isLoading && repos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
          <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
            <FolderOpen className="h-8 w-8 text-brand-action" />
          </div>
          <h3 className="text-lg font-semibold text-primary-contrast">Tu biblioteca está vacía</h3>
          <p className="text-muted-foreground max-w-sm mt-2 mb-6">
            Comienza creando tu primer repositorio para compartir materiales con tus estudiantes.
          </p>
          <Link to="/docente/crear-repositorio">
            <Button variant="outline" className="border-brand-action text-brand-action hover:bg-brand-action/10">
              Crear ahora
            </Button>
          </Link>
        </div>
      ) : (
        <RepositoryList isLoading={isLoading} repositories={repos} />
      )}
    </div>
  );
};

export default MyRepositories;