import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

// Importamos desde tus primitivas (Design System)
import { Button, Input } from "../../../desingSystem/primitives";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../desingSystem/primitives/Form";

// Importamos el Hook de lógica
import { useAuth } from "../hooks/useAuth";

// 1. Definimos el esquema de validación con Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Introduce un correo electrónico válido.",
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida.",
  }),
});

export function LoginForm() {
  const { login, isLoading } = useAuth();

  // 2. Configuramos el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Manejador de envío
  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values); // Llama a la lógica del hook
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Campo Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input 
                  placeholder="nombre@ejemplo.com" 
                  type="email" 
                  disabled={isLoading} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Contraseña */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Contraseña</FormLabel>
                <a 
                  href="#" 
                  className="text-xs text-brand-action hover:underline font-medium"
                  onClick={(e) => e.preventDefault()} // Placeholder por ahora
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <FormControl>
                <Input 
                  placeholder="******" 
                  type="password" 
                  disabled={isLoading} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de Submit con Estado de Carga */}
        <Button 
          type="submit" 
          className="w-full bg-brand-action hover:bg-brand-action/90 text-white font-bold"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Ingresar a Pulse"
          )}
        </Button>
      </form>
    </Form>
  );
}