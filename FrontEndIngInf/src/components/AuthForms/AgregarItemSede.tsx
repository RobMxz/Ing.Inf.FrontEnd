import { useEffect, useState } from "react";
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
  const [, setItemSeleccionado] = useState(""); // Estado para ítem seleccionado
  const [items, setItems] = useState<any[]>([]);
  const [sedes, setSedes] = useState<any[]>([]);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sede: "",
      item: "",
      cantidad: 1,
    },
  });

  useEffect(() => {
    // Efecto para cargar las sedes al iniciar el componente
    const fetchSedes = async () => {
      try {
        const response = await fetch(
          "https://gestion-83lw.onrender.com/api/sedes"
        );
        const data = await response.json();
        setSedes(data);
        console.log("sedes", sedes);
      } catch (error) {
        console.error("Error al obtener las sedes:", error);
      }
    };
    fetchSedes();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`https://gestion-83lw.onrender.com/items`);
        const data = await response.json();
        setItems(data);
        console.log("items", items);
      } catch (error) {
        console.error("Error al obtener los ítems:", error);
      }
    };
    fetchItems();
  }, []);

  //function onSubmit(data)
  // Modificamos el onSubmit
  function onSubmit(data: any) {
    console.log("aaa", sedes[0].sede, data.sede);
    // Buscar el ítem y la sede seleccionados en las listas originales
    const selectedItem = items.find((item) => item.nombre === data.item);
    const selectedSede = sedes.find((sede) => sede.sede === data.sede);

    console.log("selectedItem", selectedItem);
    console.log("selectedSede", selectedSede);

    // Estructurar el objeto para el envío
    const payload = {
      id: 0, // Este ID será generado por tu backend, por lo general no lo incluyes aquí
      item: {
        id: selectedItem.id,
        nombre: selectedItem.nombre,
        descripcion: selectedItem.descripcion, // O el campo que necesites
        imagenUrl: selectedItem.imagenUrl, // O el campo que necesites
      },
      sede: {
        id: selectedSede.id,
        sede: selectedSede.sede,
      },
      cantidad: data.cantidad,
    };
    console.log(payload);

    // Hacer el envío a tu backend
    fetch("https://gestion-83lw.onrender.com/api/items-sede", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Convertir el objeto en JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((result) => {
        toast({
          title: "Ítem agregado exitosamente",
          description: `Ítem ${selectedItem.nombre} agregado a la sede ${selectedSede.sede} con cantidad ${data.cantidad}.`,
        });
        console.log("Resultado:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Ocurrió un error al agregar el ítem.",
        });
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
                      {sedes.map((sede) => (
                        <SelectItem key={sede.id} value={sede.sede}>
                          {sede.sede}
                        </SelectItem>
                      ))}
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
                    onValueChange={(value) => {
                      setItemSeleccionado(value); // Actualizamos el estado local
                      field.onChange(value); // Informamos al formulario de React Hook Form
                    }}
                    value={field.value || ""} // Usamos field.value aquí para sincronizar con el formulario
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ítem" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.nombre}>
                          {item.nombre}
                        </SelectItem>
                      ))}
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
