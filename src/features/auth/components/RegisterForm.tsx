// src/features/auth/components/RegisterForm.tsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Importaciones corregidas con la ruta que usas (desingSystem)
import { 
  Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Checkbox 
} from "../../../desingSystem/primitives"; //

import { register as registerService } from "../services/authServices";
import { useToast } from "../../../hooks/useToast";
import styles from "./auth.module.css";

// ✅ CORRECCIÓN 1: Esquema Zod Estricto
const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre es demasiado largo" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "El nombre solo puede contener letras" }),
  email: z
    .string()
    .email({ message: "Correo inválido" })
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Mínimo 6 caracteres" })
    .max(100, { message: "La contraseña es demasiado larga" }),
  confirmPassword: z.string(),
  // 🔥 CAMBIO CLAVE: Eliminamos .default(false)
  // Como ya lo inicializamos en useForm, solo necesitamos validar que sea booleano.
  isTeacher: z.boolean(), 
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      name: "", 
      email: "", 
      password: "", 
      confirmPassword: "", 
      isTeacher: false // ✅ Aquí garantizamos el valor inicial
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      const response = await registerService(values);
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast({
        title: "Cuenta creada",
        description: "Tu registro ha sido exitoso",
      });

      const basePath = response.user.role === "docente" ? "/docente" : "/estudiante";
      navigate(basePath, { replace: true });
      
      window.dispatchEvent(new CustomEvent("auth-change", { 
        detail: { user: response.user } 
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error en registro",
        description: "No se pudo crear la cuenta. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.loginContainer}>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl><Input placeholder="Juan Pérez" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl><Input placeholder="usuario@pae.edu" type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar</FormLabel>
                <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isTeacher"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Soy Docente</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Se requerirá validación institucional.
                </p>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Crear Cuenta"}
        </Button>
      </form>
    </Form>
  );
}