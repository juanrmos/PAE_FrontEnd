import { Link } from "react-router-dom"; // ✅ Importar Link
import { LoginForm } from "../../features/auth/components/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../desingSystem/primitives";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md space-y-6">
        
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="h-12 w-12 rounded-xl bg-brand-action flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary-contrast">
            Bienvenido a PAE
          </h1>
          <p className="text-sm text-muted-foreground">
            Plataforma de Apoyo Estudiantil
          </p>
        </div>

        <Card className="shadow-lg border-neutral-200/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a tu panel.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <LoginForm />
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <div>
              ¿No tienes una cuenta?{" "}
              {/* ✅ Reemplazo de <a> por <Link> */}
              <Link 
                to="/register" 
                className="text-brand-action hover:underline font-medium"
              >
                Regístrate aquí
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="px-8 text-center text-xs text-muted-foreground">
          Al continuar, aceptas nuestros{" "}
          <a href="#" className="underline hover:text-brand-action">
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a href="#" className="underline hover:text-brand-action">
            Política de Privacidad
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Login;