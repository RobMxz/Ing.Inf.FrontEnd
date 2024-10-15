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
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";

// Definimos el esquema de validación con Zod
const FormSchema = z.object({
  usuario: z.string().min(2, {
    message: "El nombre de usuario debe tener al menos 2 caracteres.",
  }),
  nombre: z.string().min(2, {
    message: "Los nombres deben tener al menos 2 caracteres.",
  }),
  apellido: z.string().min(2, {
    message: "Los apellidos deben tener al menos 2 caracteres.",
  }),
  dni: z.string().length(8, {
    message: "El DNI debe tener exactamente 8 dígitos.",
  }),
  fechaNacimiento: z.date({
    required_error: "Debe seleccionar una fecha de nacimiento.",
  }),
  correo: z.string().email({
    message: "Debe ser un correo válido.",
  }),
  telefono: z.string().min(9, {
    message: "El teléfono debe tener al menos 9 dígitos.",
  }),
  contrasenia: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
  id: z.number(),
});

export function SignUp() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: 0,
      usuario: "",
      nombre: "",
      apellido: "",
      dni: "",
      fechaNacimiento: undefined,
      correo: "",
      telefono: "",
      contrasenia: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // `data.fechaNacimiento` is already a Date object
    console.log(data);
    console.log(JSON.stringify(data));

    try {
      fetch("https://gestion-83lw.onrender.com/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          // Ensure fechaNacimiento is formatted correctly as a string for the API (ISO string format)
          fechaNacimiento: data.fechaNacimiento.toISOString().split("T")[0], // format as 'YYYY-MM-DD'
        }),
      });
    } catch (e) {
      console.log(e);
    }

    toast({
      title: "Registro",
      description: "Se ha registrado correctamente.",
    });
  }

  return (
    <div className="grid place-items-center mt-4 px-6 pl-3 text-left font-normal ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-6"
        >
          {/* Campo para el nombre de usuario */}
          <FormField
            control={form.control}
            name="usuario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de Usuario</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  Introduzca su nombre de usuario.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo para nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo para apellidos */}
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo para DNI */}
          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI</FormLabel>
                <FormControl>
                  <Input placeholder="12345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo para la fecha de nacimiento */}
          <FormField
            control={form.control}
            name="fechaNacimiento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo para el correo */}
          <FormField
            control={form.control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="correo@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo para el teléfono */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="987654321" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo para la contraseña */}
          <FormField
            control={form.control}
            name="contrasenia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormDescription>
                  Debe tener al menos 6 caracteres.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Registrarse</Button>
        </form>
      </Form>
    </div>
  );
}
