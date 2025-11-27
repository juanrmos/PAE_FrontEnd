// src/features/profile/schemas.ts
import * as z from "zod";

// Esquema para edición de perfil
export const profileSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Correo inválido").readonly(),
  institution: z.string().min(1, "Selecciona una institución"),
  bio: z.string().max(500, "La biografía no puede exceder 500 caracteres").optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Esquema para cambio de contraseña
export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Ingresa tu contraseña actual"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirma tu nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type PasswordFormData = z.infer<typeof passwordSchema>;