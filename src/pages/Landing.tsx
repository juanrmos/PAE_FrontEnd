// src/pages/Landing.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Facebook,
  CheckCircle,
} from "lucide-react";
import { Button } from "../desingSystem/primitives";

const Landing = () => {
  const [currentService, setCurrentService] = useState(0);

  const services = [
    {
      icon: BookOpen,
      title: "Cursos preuniversitarios",
      description: "Material completo y actualizado para tu preparación académica",
    },
    {
      icon: GraduationCap,
      title: "Simulacros de examen",
      description: "Practica con exámenes reales de las principales universidades",
    },
    {
      icon: CheckCircle,
      title: "Banco de preguntas",
      description: "Miles de preguntas organizadas por tema y dificultad",
    },
  ];

  const benefits = [
    "Plataforma de repaso en línea disponible 24/7",
    "Simulacros de examen con resultados inmediatos",
    "Material educativo actualizado y de calidad",
    "Banco de preguntas con más de 5000 ejercicios",
    "Comunidad de estudio colaborativa",
  ];

  const handlePrevService = () => {
    setCurrentService((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const handleNextService = () => {
    setCurrentService((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const CurrentServiceIcon = services[currentService].icon;

  return (
    <div className="min-h-screen bg-white">
      {/* ========== HEADER / NAVIGATION ========== */}
      <header className="sticky top-0 z-50 bg-primary-contrast text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-brand-action flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold hidden sm:block">PAE</span>
            </Link>
            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-brand-action hover:bg-white/10"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-brand-action hover:bg-brand-action/90"
                >
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ========== HERO SECTION ========== */}
      <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop"
          alt="Estudiantes estudiando juntos"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-wider mb-4 drop-shadow-2xl">
              PLATAFORMA DE APOYO ESTUDIANTIL
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              Tu aliado en el camino hacia el éxito académico
            </p>
          </div>
        </div>
      </section>

      {/* ========== BIENVENIDOS SECTION ========== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-action">
                Bienvenidos a Nuestra Plataforma
              </h2>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-action/10 flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-brand-action" />
                    </div>
                    <p className="text-neutral-700 text-lg">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-brand-action hover:bg-brand-action/90 text-white px-8"
                  >
                    Comienza Ahora
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Graduation Cap Icon */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Decorative Circle */}
                <div className="absolute inset-0 bg-brand-action/10 rounded-full blur-3xl" />

                {/* Main Icon */}
                <div className="relative bg-white rounded-full p-12 shadow-2xl">
                  <GraduationCap className="h-40 w-40 md:h-48 md:w-48 text-primary-contrast" />
                  {/* Golden Tassel */}
                  <div className="absolute top-8 right-8 w-4 h-12 bg-yellow-500 rounded-full shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MOTIVATIONAL BANNER ========== */}
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop"
          alt="Estudiante exitoso frente a universidad"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-contrast/80 to-transparent" />

        {/* Banner Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Tu Futuro Comienza Aquí
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Únete a miles de estudiantes que ya alcanzaron sus metas
                académicas con nuestra plataforma
              </p>
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-brand-action hover:bg-brand-action/90 text-white px-8"
                >
                  Únete Ahora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SERVICES CAROUSEL ========== */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-brand-action text-center mb-12 italic">
            ¿Qué ofrecemos?
          </h2>

          {/* Carousel Card */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-primary-contrast rounded-2xl p-8 md:p-12 shadow-2xl">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-white/10 rounded-full">
                  <CurrentServiceIcon className="h-16 w-16 text-white" />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-8 mb-6">
                <button
                  onClick={handlePrevService}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Servicio anterior"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>

                <div className="text-center flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {services[currentService].title}
                  </h3>
                  <p className="text-white/80 text-lg">
                    {services[currentService].description}
                  </p>
                </div>

                <button
                  onClick={handleNextService}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Siguiente servicio"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2">
                {services.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentService(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentService
                        ? "w-8 bg-white"
                        : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Ir a servicio ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-8">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-brand-action hover:bg-brand-action/90 text-white px-12 rounded-full text-lg font-semibold shadow-lg"
                >
                  Ver Todos los Servicios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-brand-action py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {/* Logo & Mascot */}
            <div className="flex items-center justify-center md:justify-start">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-lg">
                <GraduationCap className="h-12 w-12 text-brand-action" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-bold text-lg mb-4">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-2">
                {["Recursos", "Cursos", "Blog", "FAQ", "Contáctanos"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-white/90 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Social Media */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-bold text-lg mb-4">Síguenos</h3>
              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  href="#"
                  className="p-3 bg-white rounded-lg hover:bg-white/90 transition-colors shadow-md"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6 text-brand-action" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-white rounded-lg hover:bg-white/90 transition-colors shadow-md"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6 text-brand-action" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/80 text-sm">
              © 2025 PAE - Plataforma de Apoyo Estudiantil. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;