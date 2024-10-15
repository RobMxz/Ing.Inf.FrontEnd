import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "../../hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Modificamos el esquema de validación para incluir username/email y contraseña
const FormSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(2, {
      message:
        "El nombre de usuario o correo debe tener al menos 2 caracteres.",
    })
    .email({ message: "Debe ser un correo válido." })
    .or(
      z.string().min(2, {
        message: "El nombre de usuario debe tener al menos 2 caracteres.",
      })
    ),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
});

export function LogIn() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Realiza la solicitud a la API para obtener los usuarios
      const response = await fetch(
        "https://gestion-83lw.onrender.com/api/usuarios",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios.");
      }

      // Convierte la respuesta a JSON
      const usuarios = await response.json();
      console.log(usuarios);
      // Busca un usuario que coincida con el email y la contraseña ingresados
      const usuarioValido = usuarios.find(
        (usuario: { correo: string; usuario: string; contrasenia: string }) =>
          (usuario.correo === data.usernameOrEmail ||
            usuario.usuario === data.usernameOrEmail) &&
          usuario.contrasenia === data.password
      );

      // Si se encuentra el usuario
      if (usuarioValido) {
        toast({
          title: "Inicio de Sesión",
          description: "Inicio de sesión exitoso.",
        });
      } else {
        // Si no se encuentra el usuario, muestra un mensaje de error
        toast({
          title: "Error",
          description: "Credenciales incorrectas.",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al intentar iniciar sesión.",
        status: "error",
      });
    }
  }

  return (
    <div className="grid place-items-center mt-4 px-6 pl-3 text-left font-normal ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-6"
        >
          {/* Campo para el nombre de usuario o correo */}
          <FormField
            control={form.control}
            name="usernameOrEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username o Correo Electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn o correo@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Introduzca su nombre de usuario o correo electrónico.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo para la contraseña */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormDescription>
                  Introduzca su contraseña segura.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Iniciar Sesión</Button>
        </form>
      </Form>
    </div>
  );
}
