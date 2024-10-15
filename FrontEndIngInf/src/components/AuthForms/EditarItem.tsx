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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "../../hooks/use-toast";

// Esquema de validación para la edición de un ítem
const EditItemSchema = z.object({
  id: z.string().nonempty({ message: "Debe seleccionar un ítem." }),
  nombre: z
    .string()
    .min(1, { message: "El nombre del ítem no puede estar vacío." }),
  cantidad: z.number().min(1, { message: "La cantidad debe ser al menos 1." }),
});

export function EditarItem() {
  const [itemSeleccionado, setItemSeleccionado] = useState(""); // Estado para el ítem seleccionado
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estado para controlar el modal de eliminación

  const form = useForm({
    resolver: zodResolver(EditItemSchema),
    defaultValues: {
      id: "",
      nombre: "",
      cantidad: 1,
    },
  });

  // Lógica de envío para editar el ítem
  function onSubmit(data) {
    // Simular lógica para editar el ítem en el backend
    const result = updateItemInBackend(data);
    if (result !== 0) {
      toast({
        title: "Error",
        description: `Hubo un error al editar el ítem ${data.nombre}.`,
      });
      return;
    }
    toast({
      title: "Ítem editado",
      description: `El ítem ${data.nombre} fue editado exitosamente.`,
    });
  }

  // Lógica para eliminar el ítem
  function eliminarItem() {
    const result = deleteItemFromBackend(itemSeleccionado);
    if (result !== 0) {
      toast({
        title: "Error",
        description: `Hubo un error al eliminar el ítem ${itemSeleccionado}.`,
      });
      return;
    }
    toast({
      title: "Ítem eliminado",
      description: `El ítem ${itemSeleccionado} fue eliminado.`,
    });
    setIsDeleteDialogOpen(false); // Cerrar el modal después de eliminar
  }

  return (
    <div className="space-y-6 grid place-items-center mt-4 px-6 pl-3 text-left font-normal ">
      {/* Formulario para editar el ítem */}
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
                      // Aquí podrías cargar los datos actuales del ítem seleccionado
                      form.setValue("nombre", "Nombre Actual"); // Valor actual del ítem
                      form.setValue("cantidad", 10); // Cantidad actual del ítem (puedes cargar este valor dinámicamente)
                    }}
                    value={itemSeleccionado}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ítem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="item-1">Ítem 1</SelectItem>
                      <SelectItem value="item-2">Ítem 2</SelectItem>
                      {/* Agregar más ítems dinámicamente */}
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
                <FormLabel>Nombre del Ítem</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nuevo nombre del ítem" />
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
                <FormLabel>Cantidad Actual</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Nueva cantidad"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row justify-between gap-6">
            {/* Botón para enviar la edición */}
            <Button type="submit">Guardar Cambios</Button>
            {/* Botón para eliminar el ítem */}
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Eliminar Ítem
            </Button>
          </div>
        </form>
      </Form>

      {/* Modal de confirmación para la eliminación */}
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

// Funciones simuladas para el backend (editar y eliminar ítems)
function updateItemInBackend(data) {
  // Aquí iría la lógica para actualizar el ítem en el backend
  // Devuelve 0 si tiene éxito, y otro valor si hay un error
  try {
    // Actualizar en el backend
    return 0; // Suceso
  } catch (error) {
    return 1; // Error
  }
}

function deleteItemFromBackend(itemId) {
  // Aquí iría la lógica para eliminar el ítem en el backend
  // Devuelve 0 si tiene éxito, y otro valor si hay un error
  try {
    // Eliminar en el backend
    return 0; // Suceso
  } catch (error) {
    return 1; // Error
  }
}
