import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { UploadCloud, ArrowLeft } from "lucide-react";

// 1. Primitivas del Design System
import { 
  Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "../../../desingSystem/primitives"; // Corregido 'designSystem'

// 2. Hook de Feature
import { useMyRepositories } from "../../../features/repository/hooks/useMyRepositories";

// 3. Estilos Modulares
import styles from "../../../features/repository/components/repository.module.css";

// Esquema de Validación
const repoSchema = z.object({
  title: z.string().min(5, "El título debe ser descriptivo (mínimo 5 letras)"),
  subject: z.string().min(2, "Indica la materia o tema principal"),
});

const TeacherRepoCreate = () => {
  const navigate = useNavigate();
  // Usamos el hook que conecta con el servicio (y maneja el loading)
  const { create, isLoading } = useMyRepositories();
  
  const form = useForm<z.infer<typeof repoSchema>>({
    resolver: zodResolver(repoSchema),
    defaultValues: { title: "", subject: "" },
  });

  const onSubmit = (data: z.infer<typeof repoSchema>) => {
    // Delegamos la lógica de creación al hook
    create(data);
  };

  return (
    <div className={styles.formContainer}>
      {/* Botón de regreso */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="pl-0 hover:bg-transparent hover:text-brand-action gap-2 text-neutral-500"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" /> Volver a mis repositorios
        </Button>
        <div className="mt-2">
          <h1 className="text-3xl font-bold text-primary-contrast">Crear Nuevo Repositorio</h1>
          <p className="text-muted-foreground">Sube materiales y guías para tus estudiantes.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Contenido</CardTitle>
          <CardDescription>Información básica para que los alumnos encuentren tu material.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del Repositorio</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Cálculo Diferencial - Semestre 2025-I" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materia / Tema</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Matemáticas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Zona de Carga Visual (Mock) */}
              <div className={styles.dropzone}>
                <UploadCloud className="h-10 w-10 mx-auto text-neutral-400 mb-3" />
                <p className="text-sm font-medium text-neutral-600">
                  Arrastra archivos PDF o DOC aquí (Opcional)
                </p>
                <p className="text-xs text-neutral-400 mt-1">Podrás agregar más recursos después</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-brand-action hover:bg-brand-action/90 text-white min-w-[140px]"
                  disabled={isLoading}
                >
                  {isLoading ? "Creando..." : "Publicar Repositorio"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherRepoCreate;