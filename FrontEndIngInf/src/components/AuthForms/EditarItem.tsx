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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "../../hooks/use-toast";
import { Label } from "@radix-ui/react-label";

// Esquema de validación para la edición de un ítem
const EditItemSchema = z.object({
  id: z.string().nonempty({ message: "Debe seleccionar un ítem." }),
  nombre: z
    .string()
    .min(1, { message: "El nombre del ítem no puede estar vacío." }),
  imagenURL: z.string().url({ message: "Debe ser una URL válida." }),
  cantidad: z.number().min(1, { message: "La cantidad debe ser al menos 1." }),
});

export function EditarItem() {
  const [itemSeleccionado, setItemSeleccionado] = useState(""); // Estado para el ítem seleccionado
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estado para controlar el modal de eliminación
  const [sedeSeleccionada, setSedeSeleccionada] = useState(""); // Almacenamos el ID de la sede
  const [items, setItems] = useState<any[]>([]);
  const [sedes, setSedes] = useState<any[]>([]);

  const form = useForm({
    resolver: zodResolver(EditItemSchema),
    defaultValues: {
      id: "",
      nombre: "",
      imagenURL: "",
      cantidad: 1,
    },
  });

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await fetch(
          "https://gestion-83lw.onrender.com/api/sedes"
        );
        const data = await response.json();
        setSedes(data);
      } catch (error) {
        console.error("Error al obtener las sedes:", error);
      }
    };
    fetchSedes();
    console.log(sedes);
  }, []);

  useEffect(() => {
    if (sedeSeleccionada) {
      const fetchItems = async () => {
        try {
          const response = await fetch(
            `https://gestion-83lw.onrender.com/api/items-sede/sede/${sedeSeleccionada}`
          );
          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error("Error al obtener los ítems:", error);
        }
      };
      fetchItems();
    }
  }, [sedeSeleccionada]);

  // Lógica de envío para editar el ítem
  const onSubmit = (data: any) => {
    const selectedItem = items.find(
      (item) => item.item.id.toString() === data.id
    );
    const selectedSede = sedes.find(
      (sede) => sede.id.toString() === sedeSeleccionada
    );

    const payload = {
      id: selectedItem.id, // Usar el ID correcto para la edición
      item: {
        id: selectedItem.item.id,
        nombre: data.nombre,
        descripcion: selectedItem.item.descripcion,
        imagenUrl: data.imagenURL,
      },
      sede: {
        id: selectedSede.id,
        sede: selectedSede.sede,
      },
      cantidad: data.cantidad,
    };

    console.log(payload);
    console.log(selectedItem);
    console.log(payload.id);
    /*
    fetch(`https://gestion-83lw.onrender.com/api/items-sede/${payload.id}`, {
      method: "PUT",
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
          title: "Ítem editado",
          description: `El ítem ${data.nombre} fue editado exitosamente.`,
        });
        console.log("Resultado:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Ocurrió un error al agregar el ítem.",
        });
      });*/
  };

  const eliminarItem = async () => {
    setIsDeleteDialogOpen(false);
    if (!itemSeleccionado) {
      toast({
        title: "Error",
        description: "Debe seleccionar un ítem para eliminar.",
      });
      return;
    }

    const selectedItem = items.find(
      (item) => item.item.id.toString() === itemSeleccionado
    );
    if (!selectedItem) {
      toast({
        title: "Error",
        description: "El ítem seleccionado no existe.",
      });
      return;
    }

    console.log(selectedItem);

    try {
      const response = await fetch(
        `https://gestion-83lw.onrender.com/api/items-sede/${selectedItem.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el ítem");
      }

      // Si la eliminación es exitosa
      setItems(items.filter((item) => item.id !== selectedItem.id)); // Actualiza la lista de ítems eliminando el ítem borrado
      setIsDeleteDialogOpen(false); // Cierra el diálogo de confirmación
      toast({
        title: "Ítem eliminado",
        description: `El ítem ${selectedItem.item.nombre} fue eliminado exitosamente.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al eliminar el ítem. Inténtalo nuevamente.",
      });
      console.error("Error al eliminar el ítem:", error);
    }
  };

  return (
    <div className="space-y-6 grid place-items-center mt-4 px-6 pl-3 text-left font-normal ">
      {/* Formulario para editar el ítem */}
      <div className="w-1/3 space-y-6 mb-2">
        <Label>Seleccionar Sede</Label>
        {sedes.length > 0 ? (
          <Select value={sedeSeleccionada} onValueChange={setSedeSeleccionada}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar sede" />
            </SelectTrigger>
            <SelectContent>
              {sedes.map((sede) => (
                <SelectItem key={sede.id} value={sede.id.toString()}>
                  {sede.sede}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>Cargando sedes...</p>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Seleccionar el ítem a editar */}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seleccionar Ítem</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      setItemSeleccionado(value);
                      field.onChange(value);
                    }}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ítem" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem
                          key={item.item.id}
                          value={item.item.id.toString()}
                        >
                          {item.item.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de edición del nombre del ítem */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nuevo nombre del Ítem</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nuevo nombre del ítem" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de edición de la URL de la imagen del ítem */}
          <FormField
            control={form.control}
            name="imagenURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la imagen</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="URL de la imagen" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de edición de la cantidad del ítem */}
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
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    placeholder="Cantidad"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row justify-between gap-6">
            <Button type="submit">Guardar Cambios</Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Eliminar Ítem
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <h2>¿Estás seguro?</h2>
            <p>Esta acción no se puede deshacer.</p>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={eliminarItem}>
              Confirmar Eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
