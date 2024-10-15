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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
