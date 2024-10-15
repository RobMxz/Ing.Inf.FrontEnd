import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Definir el esquema de validación con Zod
const FormSchema = z.object({
  sede: z.string().nonempty({ message: "Debe seleccionar una sede." }),
  item: z.string().nonempty({ message: "Debe seleccionar un ítem." }),
  cantidad: z.number().min(1, { message: "La cantidad debe ser al menos 1." }),
});

export function AgregarItemSede() {
  const [sedeSeleccionada, setSedeSeleccionada] = useState(""); // Estado para sede seleccionada
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sede: "",
      item: "",
      cantidad: 1,
    },
  });
  //function onSubmit(data)
  function onSubmit(data) {
    // Aquí agregarías la lógica para enviar los datos a tu backend
    console.log("xd");
    toast({
      title: "Ítem agregado exitosamente",
      description: `Ítem ${data.item} agregado a la sede ${data.sede} con cantidad ${data.cantidad}.`,
    });
  }

  return (
    <div className="grid place-items-center mt-4 px-6 pl-3 text-left font-normal ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Selección de la sede */}
          <FormField
            control={form.control}
            name="sede"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sede</FormLabel>
                <FormControl>
                  <Select
                    value={sedeSeleccionada} // Aquí establecemos el valor seleccionado
                    onValueChange={(value) => {
                      setSedeSeleccionada(value); // Actualizamos el estado local
                      field.onChange(value); // Informamos al formulario de React Hook Form
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Seleccionar sede" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sede 1">Sede 1</SelectItem>
                      <SelectItem value="Sede 2">Sede 2</SelectItem>
                      {/* Puedes agregar más sedes aquí */}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Selección del ítem */}
          <FormField
            control={form.control}
            name="item"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ítem</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value} // Mantener el valor seleccionado
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ítem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ítem 1">Ítem 1</SelectItem>
                      <SelectItem value="Ítem 2">Ítem 2</SelectItem>
                      {/* Puedes agregar más ítems aquí */}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de cantidad */}
          <FormField
            control={form.control}
            name="cantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value} // Este asegura que el valor sea el correcto
                    onChange={(e) => field.onChange(e.target.valueAsNumber)} // Usar valueAsNumber
                    placeholder="Cantidad"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Agregar Ítem</Button>
        </form>
      </Form>
    </div>
  );
}
