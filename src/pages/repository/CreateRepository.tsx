import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UploadCloud, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { 
  Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Textarea, 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "../../desingSystem/primitives";
import { useToast } from "../../hooks/useToast";
import styles from "../../features/repository/components/repository.module.css";

const repoSchema = z.object({
  title: z.string().min(5, "El título debe ser descriptivo"),
  description: z.string().optional(),
  subject: z.string().min(1, "Selecciona una materia"),
});

const CreateRepository = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof repoSchema>>({
    resolver: zodResolver(repoSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Creando repo:", data);
    toast({ title: "Repositorio Creado", description: "Tu contenido ya está disponible." });
    navigate("/docente/repositorios");
  };

  return (
    <div className={styles.formContainer}>
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-primary-contrast">Crear Repositorio</h1>
        <p className="text-muted-foreground">Sube materiales y guías para tus estudiantes.</p>
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
                    <FormControl><Input placeholder="Ej. Cálculo Diferencial 2025" {...field} /></FormControl>
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
                    <FormControl><Input placeholder="Ej. Matemáticas" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className={styles.dropzone}>
                <UploadCloud className="h-10 w-10 mx-auto text-neutral-400 mb-3" />
                <p className="text-sm font-medium text-neutral-600">
                  Arrastra archivos PDF o DOC aquí
                </p>
                <p className="text-xs text-neutral-400 mt-1">o haz clic para explorar</p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancelar</Button>
                <Button type="submit" className="bg-brand-action hover:bg-brand-action/90">Publicar Repositorio</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRepository;